"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProductDTO } from "@/lib/types";
import useStore from "@/store";
import { Zap } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  product: ProductDTO;
  className?: string;
}

const BuyNowButton = ({ product, className }: Props) => {
  const addItem = useStore((state) => state.addItem);
  const getItemCount = useStore((state) => state.getItemCount);
  const openCartModal = useStore((state) => state.openCartModal);
  const isOutOfStock = product?.stock === 0;

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    if (product.stock > getItemCount(product.id)) {
      addItem(product);
    } else {
      toast.error("Không thể thêm quá số lượng còn lại");
    }
    openCartModal();
  };

  return (
    <Button
      onClick={handleBuyNow}
      disabled={isOutOfStock}
      variant="outline"
      className={cn(
        "w-full border-brand text-brand-dark font-semibold tracking-wide hover:bg-brand-soft hoverEffect",
        className,
      )}
    >
      <Zap /> {isOutOfStock ? "Hết hàng" : "Mua ngay"}
    </Button>
  );
};

export default BuyNowButton;
