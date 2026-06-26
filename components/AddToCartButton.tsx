"use client";
import type { ProductDTO } from "@/lib/types";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import useStore from "@/store";
import toast from "react-hot-toast";
import PriceFormatter from "./PriceFormatter";
import QuantityButtons from "./QuantityButtons";

interface Props {
  product: ProductDTO;
  className?: string;
}

const AddToCartButton = ({ product, className }: Props) => {
  const { addItem, getItemCount } = useStore();
  const itemCount = getItemCount(product?.id);
  const isOutOfStock = product?.stock === 0;

  const handleAddToCart = () => {
    if (product?.stock > itemCount) {
      addItem(product);
      toast.success(`Đã thêm ${product?.name?.substring(0, 12)}... vào giỏ!`);
    } else {
      toast.error("Không thể thêm quá số lượng còn lại");
    }
  };
  return (
    <div className="w-full h-12 flex items-center">
      {itemCount ? (
        <div className="text-sm w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs text-darkColor/80">Số lượng</span>
            <QuantityButtons product={product} />
          </div>
          <div className="flex items-center justify-between border-t pt-1">
            <span className="text-xs font-semibold">Tạm tính</span>
            <PriceFormatter
              amount={product?.price ? product?.price * itemCount : 0}
            />
          </div>
        </div>
      ) : (
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={cn(
            "w-full bg-brand text-white shadow-none border border-brand font-semibold tracking-wide hover:bg-brand-dark hover:border-brand-dark hoverEffect",
            className
          )}
        >
          <ShoppingBag /> {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;
