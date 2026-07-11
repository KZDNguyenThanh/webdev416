import { prisma } from "@/lib/prisma";
import { toBrandDTO, toCategoryDTO } from "@/lib/mappers";
import type { BrandDTO, CategoryDTO } from "@/lib/types";

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

export async function getCategories(quantity?: number): Promise<CategoryDTO[]> {
  const rows = await withDatabase(
    () =>
      prisma.category.findMany({
        take: quantity,
        orderBy: { title: "asc" },
        include: {
          _count: { select: { products: true } },
          products: {
            select: {
              product: {
                select: {
                  images: {
                    orderBy: { position: "asc" },
                    take: 1,
                    select: { imageUrl: true },
                  },
                },
              },
            },
          },
        },
      }),
    [],
  );
  return rows.map(toCategoryDTO);
}

export async function getAllBrands(): Promise<BrandDTO[]> {
  const rows = await withDatabase(
    () =>
      prisma.brand.findMany({
        orderBy: { title: "asc" },
      }),
    [],
  );
  return rows.map(toBrandDTO);
}
