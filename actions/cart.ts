"use server";

import { getCurrentUser } from "@/lib/auth/server";
import {
  getUserCart,
  getUserFavorites,
  saveUserCart,
  saveUserFavorites,
  type CartLineDTO,
} from "@/lib/repositories/commerce.repository";
import type { ProductDTO } from "@/lib/types";

export async function getMyCart(): Promise<CartLineDTO[]> {
  const user = await getCurrentUser();
  if (!user) return [];
  return getUserCart(user.id);
}

export async function saveMyCart(
  items: { productId: string; quantity: number }[],
): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  await saveUserCart(user.id, items);
}

export async function getMyFavorites(): Promise<ProductDTO[]> {
  const user = await getCurrentUser();
  if (!user) return [];
  return getUserFavorites(user.id);
}

export async function saveMyFavorites(productIds: string[]): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  await saveUserFavorites(user.id, productIds);
}
