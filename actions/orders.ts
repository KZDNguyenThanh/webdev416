"use server";

import { getGuestOrder } from "@/lib/repositories/commerce.repository";
import type { OrderDTO } from "@/lib/types";

// Public order lookup for guests: requires the order number plus a matching
// contact (email or phone) recorded on the order.
export async function lookupGuestOrder(
  orderNumber: string,
  contact: string,
): Promise<OrderDTO | null> {
  const code = orderNumber.trim();
  const id = contact.trim();
  if (!code || !id) return null;
  return getGuestOrder(code, id);
}
