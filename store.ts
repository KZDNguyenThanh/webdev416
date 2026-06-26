import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductDTO } from "@/lib/types";

export interface CartItem {
  product: ProductDTO;
  quantity: number;
}

interface StoreState {
  items: CartItem[];
  addItem: (product: ProductDTO) => void;
  removeItem: (productId: string) => void;
  deleteCartProduct: (productId: string) => void;
  resetCart: () => void;
  getTotalPrice: () => number;
  getSubTotalPrice: () => number;
  getItemCount: (productId: string) => number;
  getGroupedItems: () => CartItem[];
  // "Mua ngay" (Buy now): a transient single item used by the /checkout page.
  // Not persisted to localStorage — it only lives for the current navigation.
  buyNowItem: CartItem | null;
  setBuyNowItem: (product: ProductDTO, quantity?: number) => void;
  clearBuyNowItem: () => void;
  //   // favorite
  favoriteProduct: ProductDTO[];
  addToFavorite: (product: ProductDTO) => Promise<void>;
  removeFromFavorite: (productId: string) => void;
  resetFavorite: () => void;
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      items: [],
      favoriteProduct: [],
      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return { items: [...state.items, { product, quantity: 1 }] };
          }
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.reduce((acc, item) => {
            if (item.product.id === productId) {
              if (item.quantity > 1) {
                acc.push({ ...item, quantity: item.quantity - 1 });
              }
            } else {
              acc.push(item);
            }
            return acc;
          }, [] as CartItem[]),
        })),
      deleteCartProduct: (productId) =>
        set((state) => ({
          items: state.items.filter(
            ({ product }) => product?.id !== productId
          ),
        })),
      resetCart: () => set({ items: [] }),
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + (item.product.price ?? 0) * item.quantity,
          0
        );
      },
      // Subtotal = the pre-discount "original" total. `price` is what the customer
      // pays (see getTotalPrice); `discount` is a percentage used to surface a
      // higher struck-through original, so the original unit price is price * (1 + d/100).
      getSubTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.product.price ?? 0;
          const markup = ((item.product.discount ?? 0) * price) / 100;
          const originalPrice = price + markup;
          return total + originalPrice * item.quantity;
        }, 0);
      },
      getItemCount: (productId) => {
        const item = get().items.find((item) => item.product.id === productId);
        return item ? item.quantity : 0;
      },
      getGroupedItems: () => get().items,
      buyNowItem: null,
      setBuyNowItem: (product, quantity = 1) =>
        set({ buyNowItem: { product, quantity } }),
      clearBuyNowItem: () => set({ buyNowItem: null }),
      addToFavorite: (product: ProductDTO) => {
        return new Promise<void>((resolve) => {
          set((state: StoreState) => {
            const isFavorite = state.favoriteProduct.some(
              (item) => item.id === product.id
            );
            return {
              favoriteProduct: isFavorite
                ? state.favoriteProduct.filter(
                    (item) => item.id !== product.id
                  )
                : [...state.favoriteProduct, { ...product }],
            };
          });
          resolve();
        });
      },
      removeFromFavorite: (productId: string) => {
        set((state: StoreState) => ({
          favoriteProduct: state.favoriteProduct.filter(
            (item) => item?.id !== productId
          ),
        }));
      },
      resetFavorite: () => {
        set({ favoriteProduct: [] });
      },
    }),
    {
      name: "cart-store",
      version: 1,
      partialize: (state) => ({
        items: state.items,
        favoriteProduct: state.favoriteProduct,
      }),
      // Pre-refactor data used the Sanity shape (`_id`, `slug:{current}`,
      // `images:[{asset:{url}}]`). It's incompatible with ProductDTO, so drop
      // any persisted state from older versions instead of trying to map it.
      migrate: (persistedState, version) => {
        if (version < 1) {
          return { items: [], favoriteProduct: [] };
        }
        return persistedState as {
          items: CartItem[];
          favoriteProduct: ProductDTO[];
        };
      },
    }
  )
);

export default useStore;
