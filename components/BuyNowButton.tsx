"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProductDTO } from "@/lib/types";
import useStore from "@/store";
import { Zap } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  product: ProductDTO;
  className?: string;
}

const BuyNowButton = ({ product, className }: Props) => {
  const router = useRouter();
  const setBuyNowItem = useStore((state) => state.setBuyNowItem);
  const isOutOfStock = product?.stock === 0;

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    setBuyNowItem(product, 1);
    router.push("/checkout");
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
