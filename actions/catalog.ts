"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/server";
import { toAddressDTO } from "@/lib/mappers";
import {
  getProductsByCategorySlug,
  getProductsByFilters,
} from "@/lib/repositories/commerce.repository";
import type { AddressDTO, ProductDTO } from "@/lib/types";

export async function getShopProducts(filters: {
  selectedCategory?: string | null;
  selectedBrand?: string | null;
  minPrice?: number;
  maxPrice?: number;
}): Promise<ProductDTO[]> {
  return getProductsByFilters(filters);
}

export async function getCategoryProducts(
  categorySlug: string,
): Promise<ProductDTO[]> {
  if (!categorySlug) return [];
  return getProductsByCategorySlug(categorySlug);
}

export async function getMyAddresses(): Promise<AddressDTO[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });
  return addresses.map(toAddressDTO);
}

export interface CreateAddressInput {
  name: string;
  phone: string;
  address: string;
  city: string;
  isDefault?: boolean;
}

export async function createAddress(
  input: CreateAddressInput,
): Promise<AddressDTO> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Bạn cần đăng nhập để lưu địa chỉ.");

  const name = input.name?.trim();
  const phone = input.phone?.trim();
  const line1 = input.address?.trim();
  const city = input.city?.trim();

  if (!name || !phone || !line1 || !city) {
    throw new Error("Vui lòng nhập đầy đủ thông tin địa chỉ.");
  }

  const isDefault = Boolean(input.isDefault);

  const created = await prisma.$transaction(async (tx) => {
    if (isDefault) {
      await tx.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }
    return tx.address.create({
      data: {
        userId: user.id,
        name,
        phone,
        email: user.email,
        line1,
        city,
        isDefault,
      },
    });
  });

  return toAddressDTO(created);
}

export async function setDefaultAddress(addressId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Bạn cần đăng nhập.");

  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== user.id) {
    throw new Error("Không tìm thấy địa chỉ.");
  }

  await prisma.$transaction([
    prisma.address.updateMany({
      where: { userId: user.id, isDefault: true },
      data: { isDefault: false },
    }),
    prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    }),
  ]);
}

export async function deleteAddress(addressId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Bạn cần đăng nhập.");

  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== user.id) {
    throw new Error("Không tìm thấy địa chỉ.");
  }

  await prisma.address.delete({ where: { id: addressId } });
}
