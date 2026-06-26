"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

function getFormValue(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

export async function submitProductReviewAction(formData: FormData) {
  const slug = getFormValue(formData, "slug");
  const ratingValue = getFormValue(formData, "rating");
  const comment = getFormValue(formData, "comment");

  if (!slug) {
    throw new Error("Invalid product slug");
  }

  const rating = Number.parseInt(ratingValue, 10);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating must be an integer between 1 and 5");
  }

  if (comment.length < 3) {
    throw new Error("Comment must be at least 3 characters");
  }

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?next=/product/${slug}`);
  }

  const product = await prisma.product.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  await prisma.product.update({
    where: { id: product.id },
    data: {
      reviews: {
        upsert: {
          where: {
            productId_userId: {
              productId: product.id,
              userId: user.id,
            },
          },
          update: {
            rating,
            comment,
          },
          create: {
            userId: user.id,
            rating,
            comment,
          },
        },
      },
    },
  });

  revalidatePath(`/product/${slug}`);
  revalidatePath("/shop");
  revalidatePath("/deal");
}
