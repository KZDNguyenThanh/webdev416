"use client";
import { cn } from "@/lib/utils";
import type { ProductDTO } from "@/lib/types";
import useStore from "@/store";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ProductSideMenu = ({
  product,
  className,
}: {
  product: ProductDTO;
  className?: string;
}) => {
  const { favoriteProduct, addToFavorite } = useStore();
  const [existingProduct, setExistingProduct] = useState<ProductDTO | null>(
    null
  );
  useEffect(() => {
    const availableProduct = favoriteProduct?.find(
      (item) => item?.id === product?.id
    );
    setExistingProduct(availableProduct || null);
  }, [product, favoriteProduct]);
  const handleFavorite = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (product?.id) {
      addToFavorite(product).then(() => {
        toast.success(
          existingProduct
            ? "Đã xóa khỏi yêu thích!"
            : "Đã thêm vào yêu thích!"
        );
      });
    }
  };
  return (
    <div
      className={cn("absolute top-2 right-2 hover:cursor-pointer", className)}
    >
      <div
        onClick={handleFavorite}
        className={`p-2.5 rounded-full hover:bg-shop_dark_green/80 hover:text-white hoverEffect  ${existingProduct ? "bg-shop_dark_green/80 text-white" : "bg-lightColor/10"}`}
      >
        <Heart size={15} />
      </div>
    </div>
  );
};

export default ProductSideMenu;
