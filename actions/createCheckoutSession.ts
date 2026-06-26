"use server";

import { prisma } from "@/lib/prisma";
import type { AddressDTO } from "@/lib/types";
import { CartItem } from "@/store";

export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  userId?: string;
  address?: AddressDTO | null;
}

export interface GroupedCartItems {
  product: CartItem["product"];
  quantity: number;
}

export async function createCheckoutSession(
  items: GroupedCartItems[],
  metadata: Metadata,
) {
  try {
    if (!items?.length) {
      throw new Error("Cart is empty");
    }

    const normalizedEmail = metadata.customerEmail.trim().toLowerCase();

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

    await prisma.$transaction(async (transaction) => {
      let addressId: string | undefined;
      if (metadata.userId && metadata.address) {
        const savedAddress = await transaction.address.create({
          data: {
            userId: metadata.userId,
            name: metadata.address.name || "Shipping Address",
            email: metadata.address.email || normalizedEmail,
            line1: metadata.address.address || "",
            city: metadata.address.city || "",
            state: metadata.address.state || "",
            zip: metadata.address.zip || "",
            isDefault: Boolean(metadata.address.default),
          },
        });
        addressId = savedAddress.id;
      }

      const order = await transaction.order.create({
        data: {
          orderNumber: metadata.orderNumber,
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

    return `/success?orderNumber=${metadata.orderNumber}`;
  } catch (error) {
    console.error("Error creating internal order", error);
    throw error;
  }
}
