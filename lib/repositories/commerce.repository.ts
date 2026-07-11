import { Prisma, ProductStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { toOrderDTO, toProductDTO } from "@/lib/mappers";
import type { OrderDTO, ProductDTO } from "@/lib/types";

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

async function withDatabase<T>(
  operation: () => Promise<T>,
  fallback: T,
): Promise<T> {
  if (!hasDatabaseUrl) {
    return fallback;
  }

  return operation();
}

const productListInclude = {
  categories: { include: { category: true } },
  brand: true,
  images: { orderBy: { position: "asc" } },
  reviews: { select: { rating: true } },
} as const;

export async function getDealProducts(): Promise<ProductDTO[]> {
  const rows = await withDatabase(
    () =>
      prisma.product.findMany({
        where: { status: ProductStatus.HOT },
        orderBy: { name: "asc" },
        include: productListInclude,
      }),
    [],
  );
  return rows.map(toProductDTO);
}

export async function getProductBySlug(slug: string): Promise<ProductDTO | null> {
  const row = await withDatabase(
    () =>
      prisma.product.findUnique({
        where: { slug },
        include: {
          categories: { include: { category: true } },
          brand: true,
          images: { orderBy: { position: "asc" } },
          reviews: {
            orderBy: { createdAt: "desc" },
            include: {
              user: {
                select: {
                  fullName: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
    null,
  );
  return row ? toProductDTO(row) : null;
}

export async function getMyOrders(userId: string): Promise<OrderDTO[]> {
  const rows = await withDatabase(
    () =>
      prisma.order.findMany({
        where: { userId },
        orderBy: { orderedAt: "desc" },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { orderBy: { position: "asc" } },
                  brand: true,
                  categories: { include: { category: true } },
                },
              },
            },
          },
          address: true,
          payments: true,
        },
      }),
    [],
  );
  return rows.map(toOrderDTO);
}

// Guest order lookup: match an order by its number AND a contact (email or
// phone) so the order number alone can't be used to enumerate other people's
// orders. `contact` is compared against the order's customerEmail and the
// shipping address phone.
export async function getGuestOrder(
  orderNumber: string,
  contact: string,
): Promise<OrderDTO | null> {
  const row = await withDatabase(
    () =>
      prisma.order.findFirst({
        where: {
          orderNumber,
          OR: [
            { customerEmail: { equals: contact, mode: "insensitive" } },
            { address: { phone: contact } },
          ],
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { orderBy: { position: "asc" } },
                  brand: true,
                  categories: { include: { category: true } },
                },
              },
            },
          },
          address: true,
          payments: true,
        },
      }),
    null,
  );
  return row ? toOrderDTO(row) : null;
}

export interface CartLineDTO {
  product: ProductDTO;
  quantity: number;
}

export async function getUserCart(userId: string): Promise<CartLineDTO[]> {
  const rows = await withDatabase(
    () =>
      prisma.cartItem.findMany({
        where: { userId },
        orderBy: { createdAt: "asc" },
        include: { product: { include: productListInclude } },
      }),
    [],
  );
  return rows.map((row) => ({
    product: toProductDTO(row.product),
    quantity: row.quantity,
  }));
}

// Replace the user's entire cart with the provided lines. Invalid productIds
// (non-positive quantity or product no longer exists) are dropped so a stale
// item in the client store can't abort the whole save with an FK error.
export async function saveUserCart(
  userId: string,
  items: { productId: string; quantity: number }[],
): Promise<void> {
  if (!hasDatabaseUrl) return;

  const wanted = items.filter((i) => i.productId && i.quantity > 0);
  const existingIds = await existingProductIds(wanted.map((i) => i.productId));
  const valid = wanted
    .filter((i) => existingIds.has(i.productId))
    .map((i) => ({ userId, productId: i.productId, quantity: i.quantity }));

  await prisma.$transaction(async (tx) => {
    await tx.cartItem.deleteMany({ where: { userId } });
    if (valid.length) {
      await tx.cartItem.createMany({ data: valid, skipDuplicates: true });
    }
  });
}

async function existingProductIds(ids: string[]): Promise<Set<string>> {
  const unique = Array.from(new Set(ids));
  if (!unique.length) return new Set();
  const rows = await prisma.product.findMany({
    where: { id: { in: unique } },
    select: { id: true },
  });
  return new Set(rows.map((r) => r.id));
}

export async function getUserFavorites(userId: string): Promise<ProductDTO[]> {
  const rows = await withDatabase(
    () =>
      prisma.favorite.findMany({
        where: { userId },
        orderBy: { createdAt: "asc" },
        include: { product: { include: productListInclude } },
      }),
    [],
  );
  return rows.map((row) => toProductDTO(row.product));
}

export async function saveUserFavorites(
  userId: string,
  productIds: string[],
): Promise<void> {
  if (!hasDatabaseUrl) return;

  const existingIds = await existingProductIds(productIds.filter(Boolean));
  const unique = Array.from(existingIds);
  await prisma.$transaction(async (tx) => {
    await tx.favorite.deleteMany({ where: { userId } });
    if (unique.length) {
      await tx.favorite.createMany({
        data: unique.map((productId) => ({ userId, productId })),
        skipDuplicates: true,
      });
    }
  });
}

type ProductSort = "newest" | "price-asc" | "price-desc" | "name-asc";

const productOrderBy: Record<
  ProductSort,
  Prisma.ProductOrderByWithRelationInput
> = {
  newest: { createdAt: "desc" },
  "price-asc": { price: "asc" },
  "price-desc": { price: "desc" },
  "name-asc": { name: "asc" },
};

export async function getProductsByFilters(params: {
  selectedCategory?: string | null;
  selectedBrand?: string | null;
  minPrice?: number;
  maxPrice?: number;
  query?: string | null;
  sort?: string | null;
}): Promise<ProductDTO[]> {
  const {
    selectedCategory,
    selectedBrand,
    minPrice = 0,
    maxPrice = 10_000_000_000,
    query,
    sort,
  } = params;

  const trimmedQuery = query?.trim();
  const orderBy =
    productOrderBy[sort as ProductSort] ?? productOrderBy["name-asc"];

  const rows = await withDatabase(
    () =>
      prisma.product.findMany({
        where: {
          price: {
            gte: minPrice,
            lte: maxPrice,
          },
          ...(trimmedQuery
            ? {
                name: {
                  contains: trimmedQuery,
                  mode: "insensitive" as const,
                },
              }
            : {}),
          ...(selectedCategory
            ? {
                categories: {
                  some: {
                    category: {
                      slug: selectedCategory,
                    },
                  },
                },
              }
            : {}),
          ...(selectedBrand
            ? {
                brand: {
                  slug: selectedBrand,
                },
              }
            : {}),
        },
        orderBy,
        include: productListInclude,
      }),
    [],
  );
  return rows.map(toProductDTO);
}

export async function getProductsByCategorySlug(
  categorySlug: string,
): Promise<ProductDTO[]> {
  const rows = await withDatabase(
    () =>
      prisma.product.findMany({
        where: {
          categories: {
            some: {
              category: {
                slug: categorySlug,
              },
            },
          },
        },
        orderBy: { name: "asc" },
        include: productListInclude,
      }),
    [],
  );
  return rows.map(toProductDTO);
}

export async function getProductsByBrandSlug(
  brandSlug: string,
): Promise<ProductDTO[]> {
  const rows = await withDatabase(
    () =>
      prisma.product.findMany({
        where: {
          brand: {
            slug: brandSlug,
          },
        },
        orderBy: { name: "asc" },
        include: productListInclude,
      }),
    [],
  );
  return rows.map(toProductDTO);
}
