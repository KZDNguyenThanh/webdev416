"use client";

import {
  getMyCart,
  getMyFavorites,
  saveMyCart,
  saveMyFavorites,
} from "@/actions/cart";
import type { ProductDTO } from "@/lib/types";
import useStore, { type CartItem } from "@/store";
import { useEffect, useRef } from "react";

const toCartPayload = (items: CartItem[]) =>
  items.map((i) => ({ productId: i.product.id, quantity: i.quantity }));

// Union by productId; quantities add up, clamped to available stock.
const mergeCarts = (server: CartItem[], local: CartItem[]): CartItem[] => {
  const map = new Map<string, CartItem>();
  for (const line of server) map.set(line.product.id, { ...line });
  for (const line of local) {
    const existing = map.get(line.product.id);
    if (existing) {
      const stock = existing.product.stock ?? line.product.stock ?? 0;
      const qty = existing.quantity + line.quantity;
      existing.quantity = stock > 0 ? Math.min(qty, stock) : qty;
    } else {
      map.set(line.product.id, { ...line });
    }
  }
  return Array.from(map.values());
};

const mergeFavorites = (
  server: ProductDTO[],
  local: ProductDTO[],
): ProductDTO[] => {
  const map = new Map<string, ProductDTO>();
  for (const p of server) map.set(p.id, p);
  for (const p of local) if (!map.has(p.id)) map.set(p.id, p);
  return Array.from(map.values());
};

interface Props {
  // Current account id from the server layout; null when not logged in.
  userId: string | null;
}

/**
 * Keeps the client cart/favorites store private per account:
 * - logout  → clears the local view (account data stays on the server)
 * - login   → merges the guest cart into the account, then persists
 * - reload  → loads the account's cart/favorites from the server
 * While logged in, store changes are debounced and saved back to the server.
 * Renders nothing.
 */
const CartSync = ({ userId }: Props) => {
  const suppressSaveRef = useRef(false);
  const lastUserRef = useRef<string | null | undefined>(undefined);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Autosave store changes to the server while logged in (debounced).
  useEffect(() => {
    const unsub = useStore.subscribe((state, prev) => {
      if (suppressSaveRef.current || !state.ownerId) return;
      if (
        state.items === prev.items &&
        state.favoriteProduct === prev.favoriteProduct
      ) {
        return;
      }
      const items = state.items;
      const favorites = state.favoriteProduct;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        saveMyCart(toCartPayload(items)).catch((e) =>
          console.error("saveMyCart failed", e),
        );
        saveMyFavorites(favorites.map((p) => p.id)).catch((e) =>
          console.error("saveMyFavorites failed", e),
        );
      }, 600);
    });
    return () => {
      unsub();
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  // Reconcile the store whenever the logged-in account changes.
  useEffect(() => {
    if (lastUserRef.current === userId) return;
    lastUserRef.current = userId;

    const store = useStore.getState();

    if (userId === null) {
      // Logout: hide everything locally; the account's rows remain on the server.
      if (store.ownerId !== null) {
        suppressSaveRef.current = true;
        store.replaceState({ items: [], favoriteProduct: [] });
        store.setOwner(null);
        suppressSaveRef.current = false;
      }
      return;
    }

    const sameAccount = store.ownerId === userId;
    void (async () => {
      try {
        const [serverCart, serverFav] = await Promise.all([
          getMyCart(),
          getMyFavorites(),
        ]);
        const cur = useStore.getState();
        suppressSaveRef.current = true;
        if (sameAccount) {
          // Reload / other tab: the server is the source of truth.
          cur.replaceState({ items: serverCart, favoriteProduct: serverFav });
          suppressSaveRef.current = false;
        } else {
          // Login / account switch: fold the guest cart into the account.
          const mergedCart = mergeCarts(serverCart, cur.items);
          const mergedFav = mergeFavorites(serverFav, cur.favoriteProduct);
          cur.replaceState({ items: mergedCart, favoriteProduct: mergedFav });
          cur.setOwner(userId);
          suppressSaveRef.current = false;
          await saveMyCart(toCartPayload(mergedCart));
          await saveMyFavorites(mergedFav.map((p) => p.id));
        }
      } catch (e) {
        console.error("Cart sync failed", e);
        suppressSaveRef.current = false;
      }
    })();
  }, [userId]);

  return null;
};

export default CartSync;
