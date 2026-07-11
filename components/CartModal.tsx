"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import PriceFormatter from "@/components/PriceFormatter";
import QuantityButtons from "@/components/QuantityButtons";
import { getImageUrl } from "@/lib/image";
import useStore from "@/store";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const CartModal = () => {
  const router = useRouter();
  const open = useStore((state) => state.cartModalOpen);
  const closeCartModal = useStore((state) => state.closeCartModal);
  const groupedItems = useStore((state) => state.getGroupedItems());
  const getTotalPrice = useStore((state) => state.getTotalPrice);

  const goToCheckout = () => {
    closeCartModal();
    router.push("/cart");
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && closeCartModal()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-brand-dark" />
            Giỏ hàng
          </DialogTitle>
        </DialogHeader>

        {groupedItems.length ? (
          <>
            <div className="space-y-3">
              {groupedItems.map(({ product }) => (
                <div
                  key={product?.id}
                  className="flex items-center gap-3 border-b pb-3 last:border-b-0"
                >
                  {product?.images && (
                    <Image
                      src={getImageUrl(product.images[0])}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-md border object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-1 text-sm font-semibold">
                      {product?.name}
                    </h3>
                    <PriceFormatter
                      amount={product?.price}
                      className="text-sm text-brand-dark"
                    />
                  </div>
                  <QuantityButtons product={product} />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="font-semibold">Tổng cộng</span>
              <PriceFormatter
                amount={getTotalPrice()}
                className="text-lg font-bold text-black"
              />
            </div>

            <Separator />

            <DialogFooter className="gap-2 sm:gap-2">
              <Button variant="outline" onClick={closeCartModal}>
                Tiếp tục mua sắm
              </Button>
              <Button
                className="rounded-full font-semibold tracking-wide hoverEffect"
                onClick={goToCheckout}
              >
                Thanh toán
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-8 text-center text-sm text-black/60">
            Giỏ hàng của bạn đang trống.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CartModal;
