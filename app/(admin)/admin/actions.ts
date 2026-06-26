"use server";

import {
  OrderStatus,
  PaymentStatus,
  Prisma,
  ProductStatus,
  UserRole,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function enumValue<T extends string>(
  value: string | null,
  values: readonly T[],
) {
  if (!value) return null;
  const normalized = value.toUpperCase() as T;
  return values.includes(normalized) ? normalized : null;
}

const ADMIN_ORDER_STATUS_OPTIONS = [
  OrderStatus.PENDING,
  OrderStatus.OUT_FOR_DELIVERY,
  OrderStatus.DELIVERED,
  OrderStatus.CANCELLED,
] as const;

const ADMIN_PAYMENT_STATUS_OPTIONS = [
  PaymentStatus.PENDING,
  PaymentStatus.PAID,
  PaymentStatus.CANCELLED,
  PaymentStatus.REFUNDED,
] as const;

function isRestockTriggerState(
  status: OrderStatus,
  paymentStatus: PaymentStatus,
) {
  return (
    status === OrderStatus.CANCELLED ||
    paymentStatus === PaymentStatus.CANCELLED ||
    paymentStatus === PaymentStatus.REFUNDED
  );
}

async function restoreOrderStockIfNeeded(
  transaction: Prisma.TransactionClient,
  order: {
    id: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    stockRestoredAt: Date | null;
    items: Array<{ productId: string; quantity: number }>;
  },
  nextStatus: OrderStatus,
  nextPaymentStatus: PaymentStatus,
) {
  if (order.stockRestoredAt) {
    return false;
  }

  if (!isRestockTriggerState(nextStatus, nextPaymentStatus)) {
    return false;
  }

  for (const item of order.items) {
    await transaction.product.update({
      where: { id: item.productId },
      data: {
        stock: {
          increment: item.quantity,
        },
      },
    });
  }

  await transaction.order.update({
    where: { id: order.id },
    data: {
      stockRestoredAt: new Date(),
    },
  });

  return true;
}

async function writeAuditLog(input: {
  actorUserId: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  data?: unknown;
}) {
  await prisma.auditLog.create({
    data: {
      actorUserId: input.actorUserId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId || null,
      data: (input.data as object) || null,
    },
  });
}

function parseSettingValue(rawValue: string) {
  const trimmed = rawValue.trim();
  if (!trimmed) return {};

  try {
    return JSON.parse(trimmed);
  } catch {
    return { value: trimmed };
  }
}

function getFormString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function isUploadFile(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0;
}

async function saveUploadedImage(file: File, folder: "products" | "brands") {
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });

  const extension = path.extname(file.name || "").toLowerCase() || ".png";
  const safeExtension =
    extension === ".jpg" ||
    extension === ".jpeg" ||
    extension === ".png" ||
    extension === ".webp" ||
    extension === ".gif"
      ? extension
      : ".png";

  const fileName = `${Date.now()}-${randomUUID()}${safeExtension}`;
  const filePath = path.join(uploadDir, fileName);
  const arrayBuffer = await file.arrayBuffer();
  await writeFile(filePath, Buffer.from(arrayBuffer));

  return `/uploads/${folder}/${fileName}`;
}

export async function createProductAction(formData: FormData) {
  const admin = await requireAdmin();

  const name = getFormString(formData, "name");
  const slugInput = getFormString(formData, "slug");
  const price = Number(formData.get("price") || 0);
  const discount = Number(formData.get("discount") || 0);
  const stock = Number(formData.get("stock") || 0);
  const description = getFormString(formData, "description") || null;
  const brandId = getFormString(formData, "brandId") || null;
  const categoryIds = formData
    .getAll("categoryIds")
    .map((item) => String(item || "").trim())
    .filter(Boolean);
  const imageFiles = formData
    .getAll("images")
    .filter((item): item is File => isUploadFile(item));

  const status = enumValue(
    String(formData.get("status") || ""),
    Object.values(ProductStatus),
  );
  const isFeatured = String(formData.get("isFeatured") || "") === "on";

  if (!name || Number.isNaN(price) || price < 0) {
    throw new Error("Invalid product data");
  }

  const slug = slugInput ? toSlug(slugInput) : toSlug(name);

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price,
      discount: Number.isNaN(discount) ? 0 : discount,
      stock: Number.isNaN(stock) ? 0 : stock,
      status,
      isFeatured,
      brandId,
    },
  });

  if (categoryIds.length > 0) {
    await prisma.productCategory.createMany({
      data: categoryIds.map((categoryId) => ({
        productId: product.id,
        categoryId,
      })),
      skipDuplicates: true,
    });
  }

  if (imageFiles.length > 0) {
    const imageUrls = await Promise.all(
      imageFiles.map((file) => saveUploadedImage(file, "products")),
    );

    await prisma.productImage.createMany({
      data: imageUrls.map((imageUrl, index) => ({
        productId: product.id,
        imageUrl,
        position: index,
      })),
    });
  }

  await writeAuditLog({
    actorUserId: admin.id,
    action: "PRODUCT_CREATE",
    entityType: "PRODUCT",
    entityId: product.id,
    data: { name: product.name, slug: product.slug },
  });

  revalidatePath("/admin/products");
  revalidatePath("/admin/dashboard");
}

export async function updateProductAction(formData: FormData) {
  const admin = await requireAdmin();

  const id = getFormString(formData, "id");
  const name = getFormString(formData, "name");
  const slugInput = getFormString(formData, "slug");
  const price = Number(formData.get("price") || 0);
  const discount = Number(formData.get("discount") || 0);
  const stock = Number(formData.get("stock") || 0);
  const description = getFormString(formData, "description") || null;
  const brandId = getFormString(formData, "brandId") || null;
  const status = enumValue(
    String(formData.get("status") || ""),
    Object.values(ProductStatus),
  );
  const isFeatured = String(formData.get("isFeatured") || "") === "on";
  const replaceImages = String(formData.get("replaceImages") || "") === "on";
  const categoryIds = formData
    .getAll("categoryIds")
    .map((item) => String(item || "").trim())
    .filter(Boolean);
  const imageFiles = formData
    .getAll("images")
    .filter((item): item is File => isUploadFile(item));

  if (!id || !name || Number.isNaN(price)) {
    throw new Error("Invalid update payload");
  }

  const slug = slugInput ? toSlug(slugInput) : toSlug(name);

  await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      description,
      price,
      discount: Number.isNaN(discount) ? 0 : discount,
      stock: Number.isNaN(stock) ? 0 : stock,
      status,
      isFeatured,
      brandId,
    },
  });

  await prisma.productCategory.deleteMany({ where: { productId: id } });
  if (categoryIds.length > 0) {
    await prisma.productCategory.createMany({
      data: categoryIds.map((categoryId) => ({
        productId: id,
        categoryId,
      })),
      skipDuplicates: true,
    });
  }

  if (replaceImages) {
    await prisma.productImage.deleteMany({ where: { productId: id } });
  }

  if (imageFiles.length > 0) {
    const existingCount = await prisma.productImage.count({
      where: { productId: id },
    });
    const imageUrls = await Promise.all(
      imageFiles.map((file) => saveUploadedImage(file, "products")),
    );

    await prisma.productImage.createMany({
      data: imageUrls.map((imageUrl, index) => ({
        productId: id,
        imageUrl,
        position: existingCount + index,
      })),
    });
  }

  await writeAuditLog({
    actorUserId: admin.id,
    action: "PRODUCT_UPDATE",
    entityType: "PRODUCT",
    entityId: id,
    data: { name, price, stock },
  });

  revalidatePath("/admin/products");
  revalidatePath("/admin/dashboard");
}

export async function deleteProductAction(formData: FormData) {
  const admin = await requireAdmin();

  const id = String(formData.get("id") || "").trim();
  if (!id) throw new Error("Product id is required");

  await prisma.orderItem.deleteMany({ where: { productId: id } });
  await prisma.productImage.deleteMany({ where: { productId: id } });
  await prisma.productCategory.deleteMany({ where: { productId: id } });
  await prisma.product.delete({ where: { id } });

  await writeAuditLog({
    actorUserId: admin.id,
    action: "PRODUCT_DELETE",
    entityType: "PRODUCT",
    entityId: id,
  });

  revalidatePath("/admin/products");
  revalidatePath("/admin/dashboard");
}

export async function createBrandAction(formData: FormData) {
  const admin = await requireAdmin();

  const title = getFormString(formData, "title");
  const slugInput = getFormString(formData, "slug");
  const description = getFormString(formData, "description") || null;
  const imageFile = formData.get("image");

  if (!title) {
    throw new Error("Brand title is required");
  }

  const slug = slugInput ? toSlug(slugInput) : toSlug(title);
  const imageUrl = isUploadFile(imageFile)
    ? await saveUploadedImage(imageFile, "brands")
    : null;

  const brand = await prisma.brand.create({
    data: {
      title,
      slug,
      description,
      imageUrl,
    },
  });

  await writeAuditLog({
    actorUserId: admin.id,
    action: "BRAND_CREATE",
    entityType: "BRAND",
    entityId: brand.id,
    data: { title: brand.title, slug: brand.slug },
  });

  revalidatePath("/admin/brands");
  revalidatePath("/");
}

export async function updateBrandAction(formData: FormData) {
  const admin = await requireAdmin();

  const id = getFormString(formData, "id");
  const title = getFormString(formData, "title");
  const slugInput = getFormString(formData, "slug");
  const description = getFormString(formData, "description") || null;
  const imageFile = formData.get("image");

  if (!id || !title) {
    throw new Error("Invalid brand payload");
  }

  const slug = slugInput ? toSlug(slugInput) : toSlug(title);
  const nextImageUrl = isUploadFile(imageFile)
    ? await saveUploadedImage(imageFile, "brands")
    : undefined;

  await prisma.brand.update({
    where: { id },
    data: {
      title,
      slug,
      description,
      ...(nextImageUrl ? { imageUrl: nextImageUrl } : {}),
    },
  });

  await writeAuditLog({
    actorUserId: admin.id,
    action: "BRAND_UPDATE",
    entityType: "BRAND",
    entityId: id,
    data: { title, slug },
  });

  revalidatePath("/admin/brands");
  revalidatePath("/");
}

export async function deleteBrandAction(formData: FormData) {
  const admin = await requireAdmin();

  const id = getFormString(formData, "id");
  if (!id) throw new Error("Brand id is required");

  await prisma.product.updateMany({
    where: { brandId: id },
    data: { brandId: null },
  });

  await prisma.brand.delete({ where: { id } });

  await writeAuditLog({
    actorUserId: admin.id,
    action: "BRAND_DELETE",
    entityType: "BRAND",
    entityId: id,
  });

  revalidatePath("/admin/brands");
  revalidatePath("/");
}

export async function createPageAction(formData: FormData) {
  const admin = await requireAdmin();

  const title = String(formData.get("title") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim() || null;
  const contentText = String(formData.get("content") || "").trim();
  const isPublished = String(formData.get("isPublished") || "") === "on";

  if (!title || !contentText) {
    throw new Error("Invalid page data");
  }

  const slug = slugInput ? toSlug(slugInput) : toSlug(title);

  const page = await prisma.page.create({
    data: {
      title,
      slug,
      excerpt,
      content: {
        type: "doc",
        text: contentText,
      },
      isPublished,
      publishedAt: isPublished ? new Date() : null,
    },
  });

  await writeAuditLog({
    actorUserId: admin.id,
    action: "PAGE_CREATE",
    entityType: "PAGE",
    entityId: page.id,
    data: { title: page.title, slug: page.slug },
  });

  revalidatePath("/admin/pages");
  revalidatePath("/admin/dashboard");
}

export async function updatePageAction(formData: FormData) {
  const admin = await requireAdmin();

  const id = String(formData.get("id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const isPublished = String(formData.get("isPublished") || "") === "on";

  if (!id || !title) {
    throw new Error("Invalid page update data");
  }

  await prisma.page.update({
    where: { id },
    data: {
      title,
      isPublished,
      publishedAt: isPublished ? new Date() : null,
    },
  });

  await writeAuditLog({
    actorUserId: admin.id,
    action: "PAGE_UPDATE",
    entityType: "PAGE",
    entityId: id,
    data: { title, isPublished },
  });

  revalidatePath("/admin/pages");
  revalidatePath("/admin/dashboard");
}

export async function deletePageAction(formData: FormData) {
  const admin = await requireAdmin();

  const id = String(formData.get("id") || "").trim();
  if (!id) throw new Error("Page id is required");

  await prisma.page.delete({ where: { id } });

  await writeAuditLog({
    actorUserId: admin.id,
    action: "PAGE_DELETE",
    entityType: "PAGE",
    entityId: id,
  });

  revalidatePath("/admin/pages");
  revalidatePath("/admin/dashboard");
}

export async function updateUserRoleAction(formData: FormData) {
  const admin = await requireAdmin();

  const id = String(formData.get("id") || "").trim();
  const roleInput = String(formData.get("role") || "").toUpperCase();
  const role = enumValue(roleInput, Object.values(UserRole));

  if (!id || !role) {
    throw new Error("Invalid user role payload");
  }

  await prisma.user.update({
    where: { id },
    data: { role },
  });

  await writeAuditLog({
    actorUserId: admin.id,
    action: "USER_ROLE_UPDATE",
    entityType: "USER",
    entityId: id,
    data: { role },
  });

  revalidatePath("/admin/users");
}

export async function toggleUserActiveAction(formData: FormData) {
  const admin = await requireAdmin();

  const id = String(formData.get("id") || "").trim();
  const nextValue = String(formData.get("isActive") || "").trim() === "true";

  if (!id) {
    throw new Error("User id is required");
  }

  await prisma.user.update({
    where: { id },
    data: { isActive: nextValue },
  });

  await writeAuditLog({
    actorUserId: admin.id,
    action: "USER_ACTIVE_TOGGLE",
    entityType: "USER",
    entityId: id,
    data: { isActive: nextValue },
  });

  revalidatePath("/admin/users");
}

export async function updateOrderStatusAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  const statusInput = String(formData.get("status") || "");
  const status = enumValue(statusInput, ADMIN_ORDER_STATUS_OPTIONS);

  if (!id || !status) {
    throw new Error("Invalid order status payload");
  }

  const updated = await prisma.$transaction(async (transaction) => {
    const order = await transaction.order.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        paymentStatus: true,
        stockRestoredAt: true,
        items: {
          select: {
            productId: true,
            quantity: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.paymentStatus !== PaymentStatus.PAID) {
      throw new Error(
        "Order status can only be changed when payment status is PAID",
      );
    }

    const nextOrder = await transaction.order.update({
      where: { id },
      data: { status },
    });

    const restoredStock = await restoreOrderStockIfNeeded(
      transaction,
      order,
      status,
      order.paymentStatus,
    );

    return { nextOrder, restoredStock };
  });

  await writeAuditLog({
    actorUserId: admin.id,
    action: "ORDER_STATUS_UPDATE",
    entityType: "ORDER",
    entityId: id,
    data: { status, restoredStock: updated.restoredStock },
  });

  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");
}

export async function updatePaymentStatusAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  const paymentStatusInput = String(formData.get("paymentStatus") || "");
  const paymentStatus = enumValue(
    paymentStatusInput,
    ADMIN_PAYMENT_STATUS_OPTIONS,
  );

  if (!id || !paymentStatus) {
    throw new Error("Invalid payment status payload");
  }

  const updated = await prisma.$transaction(async (transaction) => {
    const order = await transaction.order.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        paymentStatus: true,
        stockRestoredAt: true,
        items: {
          select: {
            productId: true,
            quantity: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    await transaction.order.update({
      where: { id },
      data: { paymentStatus },
    });

    await transaction.payment.updateMany({
      where: { orderId: id },
      data: {
        status: paymentStatus,
      },
    });

    const restoredStock = await restoreOrderStockIfNeeded(
      transaction,
      order,
      order.status,
      paymentStatus,
    );

    return { restoredStock };
  });

  await writeAuditLog({
    actorUserId: admin.id,
    action: "ORDER_PAYMENT_STATUS_UPDATE",
    entityType: "ORDER",
    entityId: id,
    data: { paymentStatus, restoredStock: updated.restoredStock },
  });

  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");
}

export async function upsertSettingAction(formData: FormData) {
  const admin = await requireAdmin();

  const key = String(formData.get("key") || "").trim();
  const valueText = String(formData.get("value") || "");

  if (!key) {
    throw new Error("Setting key is required");
  }

  const value = parseSettingValue(valueText);

  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });

  await writeAuditLog({
    actorUserId: admin.id,
    action: "SETTING_UPSERT",
    entityType: "SETTING",
    entityId: key,
  });

  revalidatePath("/admin/settings");
}

export async function removeSettingAction(formData: FormData) {
  const admin = await requireAdmin();

  const key = String(formData.get("key") || "").trim();

  if (!key) {
    throw new Error("Setting key is required");
  }

  await prisma.setting.delete({ where: { key } });

  await writeAuditLog({
    actorUserId: admin.id,
    action: "SETTING_DELETE",
    entityType: "SETTING",
    entityId: key,
  });

  revalidatePath("/admin/settings");
}

export async function signOutAdminArea() {
  await requireAdmin();
  redirect("/");
}
