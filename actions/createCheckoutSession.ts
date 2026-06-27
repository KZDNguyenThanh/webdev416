"use server";

import { prisma } from "@/lib/prisma";
import { generateOrderCode } from "@/lib/orderCode";
import type { AddressDTO } from "@/lib/types";
import { CartItem } from "@/store";

export interface Metadata {
  customerName: string;
  customerEmail: string;
  userId?: string;
  addressId?: string;
  address?: AddressDTO | null;
}

export interface GroupedCartItems {
  product: CartItem["product"];
  quantity: number;
}

export interface CheckoutResult {
  orderNumber: string;
  totalAmount: number;
  redirectUrl: string;
}

export async function createCheckoutSession(
  items: GroupedCartItems[],
  metadata: Metadata,
): Promise<CheckoutResult> {
  try {
    if (!items?.length) {
      throw new Error("Cart is empty");
    }

    // Guest orders (no logged-in user) must still carry a recipient name and
    // phone so the order is reachable for delivery.
    if (!metadata.userId) {
      const guestName = metadata.address?.name?.trim();
      const guestPhone = metadata.address?.phone?.trim();
      if (!guestName || !guestPhone) {
        throw new Error("Vui lòng nhập họ tên và số điện thoại người nhận.");
      }
    }

    const normalizedEmail = (metadata.customerEmail ?? "").trim().toLowerCase();

    const resolvedItems = await Promise.all(
      items.map(async (item) => {
        const productSlug = item.product?.slug;
        const productName = item.product?.name || "Unknown Product";

        const product =
          (productSlug
            ? await prisma.product.findUnique({ where: { slug: productSlug } })
            : null) ||
          (productName
            ? await prisma.product.findFirst({
                where: { name: productName },
                orderBy: { createdAt: "desc" },
              })
            : null);

        if (!product) {
          throw new Error(`Product not found for item: ${productName}`);
        }

        const unitPrice = Number(product.price);
        const discountPercent = Number(product.discount) || 0;
        return {
          productId: product.id,
          productName: product.name,
          unitPrice,
          discountPercent,
          quantity: item.quantity,
          lineTotal: unitPrice * item.quantity,
        };
      }),
    );

    // Pricing model: `price` is what the customer actually pays; `discount` is a
    // percentage used only to surface a higher struck-through original price.
    // So the payable total is the sum of line totals, the subtotal is the implied
    // pre-discount original, and the discount amount is the difference. All values
    // are whole VND.
    const totalAmount = resolvedItems.reduce(
      (sum, item) => sum + item.lineTotal,
      0,
    );
    const subtotal = Math.round(
      resolvedItems.reduce(
        (sum, item) =>
          sum + item.unitPrice * (1 + item.discountPercent / 100) * item.quantity,
        0,
      ),
    );
    const discountAmount = Math.max(subtotal - totalAmount, 0);
    const orderNumber = generateOrderCode();

    await prisma.$transaction(async (transaction) => {
      let addressId: string | undefined;
      if (metadata.userId && metadata.addressId) {
        // Reuse an already-saved address (verify ownership) instead of
        // creating a duplicate row on every checkout.
        const existing = await transaction.address.findUnique({
          where: { id: metadata.addressId },
        });
        if (existing && existing.userId === metadata.userId) {
          addressId = existing.id;
        }
      }

      if (!addressId && metadata.address) {
        // Persist an address payload without a saved id. For a logged-in user
        // this links to their account; for a guest checkout userId stays null.
        const savedAddress = await transaction.address.create({
          data: {
            userId: metadata.userId ?? null,
            name: metadata.address.name || "Shipping Address",
            email: metadata.address.email || normalizedEmail,
            phone: metadata.address.phone || null,
            line1: metadata.address.address || "",
            city: metadata.address.city || "",
            state: metadata.address.state || null,
            zip: metadata.address.zip || null,
            isDefault: Boolean(metadata.address.default),
          },
        });
        addressId = savedAddress.id;
      }

      const order = await transaction.order.create({
        data: {
          orderNumber,
          userId: metadata.userId,
          addressId,
          customerName: metadata.customerName || "Unknown",
          customerEmail: normalizedEmail,
          subtotal,
          discountAmount,
          totalAmount,
          currency: "VND",
          status: "PENDING",
          paymentStatus: "PENDING",
          paymentProvider: "MOCK",
          items: {
            create: resolvedItems.map(
              ({ productId, productName, unitPrice, quantity, lineTotal }) => ({
                productId,
                productName,
                unitPrice,
                quantity,
                lineTotal,
              }),
            ),
          },
          payments: {
            create: {
              provider: "MOCK",
              status: "PENDING",
              amount: totalAmount,
              currency: "VND",
              metadata: {
                source: "internal-checkout",
                futurePaymentIntegrationReady: true,
              },
            },
          },
        },
      });

      for (const item of resolvedItems) {
        const updated = await transaction.product.updateMany({
          where: {
            id: item.productId,
            stock: {
              gte: item.quantity,
            },
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        if (updated.count === 0) {
          throw new Error(
            `Insufficient stock for ${item.productName}. Please refresh your cart.`,
          );
        }
      }

      return order;
    });

    return {
      orderNumber,
      totalAmount,
      redirectUrl: `/success?orderNumber=${orderNumber}`,
    };
  } catch (error) {
    console.error("Error creating internal order", error);
    throw error;
  }
}
