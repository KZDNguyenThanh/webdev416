import type { ProductDTO } from "@/lib/types";
import useStore from "@/store";
import React from "react";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface Props {
  product: ProductDTO;
  className?: string;
}
const QuantityButtons = ({ product, className }: Props) => {
  const { addItem, removeItem, getItemCount } = useStore();
  const itemCount = getItemCount(product?.id);
  const isOutOfStock = product?.stock === 0;

  const handleRemoveProduct = () => {
    removeItem(product?.id);
    if (itemCount > 1) {
      toast.success("Đã giảm số lượng!");
    } else {
      toast.success(`Đã xóa ${product?.name?.substring(0, 12)}!`);
    }
  };

  const handleAddToCart = () => {
    if (product?.stock > itemCount) {
      addItem(product);
      toast.success("Đã tăng số lượng!");
    } else {
      toast.error("Không thể thêm quá số lượng còn lại");
    }
  };

  return (
    <div className={cn("flex items-center gap-1.5 pb-1 text-base", className)}>
      <Button
        onClick={handleRemoveProduct}
        variant="outline"
        size="icon"
        disabled={itemCount === 0 || isOutOfStock}
        className="h-8 w-8 border-[1px] hover:bg-brand-soft hoverEffect sm:h-6 sm:w-6"
      >
        <Minus />
      </Button>
      <span className="w-8 text-center font-semibold text-base text-darkColor sm:w-6 sm:text-sm">
        {itemCount}
      </span>
      <Button
        onClick={handleAddToCart}
        variant="outline"
        size="icon"
        disabled={isOutOfStock}
        className="h-8 w-8 border-[1px] hover:bg-brand-soft hoverEffect sm:h-6 sm:w-6"
      >
        <Plus />
      </Button>
    </div>
  );
};

export default QuantityButtons;
