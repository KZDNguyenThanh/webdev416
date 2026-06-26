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

export async function getLatestBlogs() {
  return withDatabase(
    () =>
      prisma.blog.findMany({
        where: { isLatest: true },
        orderBy: { publishedAt: "desc" },
        include: {
          categories: { include: { category: true } },
          author: true,
        },
      }),
    [],
  );
}

export async function getAllBlogs(quantity: number) {
  return withDatabase(
    () =>
      prisma.blog.findMany({
        take: quantity,
        orderBy: { publishedAt: "desc" },
        include: {
          categories: { include: { category: true } },
          author: true,
        },
      }),
    [],
  );
}

export async function getSingleBlog(slug: string) {
  return withDatabase(
    () =>
      prisma.blog.findUnique({
        where: { slug },
        include: {
          author: true,
          categories: { include: { category: true } },
        },
      }),
    null,
  );
}

export async function getOthersBlog(slug: string, quantity: number) {
  return withDatabase(
    () =>
      prisma.blog.findMany({
        where: {
          slug: { not: slug },
        },
        take: quantity,
        orderBy: { publishedAt: "desc" },
        include: {
          author: true,
          categories: { include: { category: true } },
        },
      }),
    [],
  );
}

export async function getBlogCategories() {
  return withDatabase(
    () =>
      prisma.blogCategory.findMany({
        orderBy: { title: "asc" },
        include: {
          _count: { select: { blogs: true } },
        },
      }),
    [],
  );
}
