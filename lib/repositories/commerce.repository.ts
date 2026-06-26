import { ProductStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { toBrandDTO, toOrderDTO, toProductDTO } from "@/lib/mappers";
import type { BrandDTO, OrderDTO, ProductDTO } from "@/lib/types";

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

export async function getBrandByProductSlug(
  slug: string,
): Promise<BrandDTO | null> {
  return withDatabase(async () => {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { brand: true },
    });

    return product?.brand ? toBrandDTO(product.brand) : null;
  }, null);
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

export async function getProductsByFilters(params: {
  selectedCategory?: string | null;
  selectedBrand?: string | null;
  minPrice?: number;
  maxPrice?: number;
}): Promise<ProductDTO[]> {
  const {
    selectedCategory,
    selectedBrand,
    minPrice = 0,
    maxPrice = 10_000_000_000,
  } = params;

  const rows = await withDatabase(
    () =>
      prisma.product.findMany({
        where: {
          price: {
            gte: minPrice,
            lte: maxPrice,
          },
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
        orderBy: { name: "asc" },
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
