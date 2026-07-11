"use client";
import type { ProductDTO } from "@/lib/types";
import useStore from "@/store";
import { Heart } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const FavoriteButton = ({
  showProduct = false,
  product,
}: {
  showProduct?: boolean;
  product?: ProductDTO | null | undefined;
}) => {
  const { favoriteProduct, addToFavorite } = useStore();
  const [existingProduct, setExistingProduct] = useState<ProductDTO | null>(
    null
  );
  useEffect(() => {
    const availableItem = favoriteProduct.find(
      (item) => item?.id === product?.id
    );
    setExistingProduct(availableItem || null);
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
    <>
      {!showProduct ? (
        <Link href={"/wishlist"} className="group relative">
          <Heart className="w-5 h-5 hover:text-signal hoverEffect" />
          <span className="absolute -top-1 -right-1 bg-signal text-ink h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
            {favoriteProduct?.length ? favoriteProduct?.length : 0}
          </span>
        </Link>
      ) : (
        <button
          onClick={handleFavorite}
          className="group relative hover:text-brand-dark hoverEffect border border-brand-muted hover:border-brand-dark p-1.5 rounded-sm"
        >
          {existingProduct ? (
            <Heart
              fill="#1f1f1f"
              className="text-brand-deep group-hover:text-brand-dark hoverEffect mt-.5 w-5 h-5"
            />
          ) : (
            <Heart className="text-brand-deep group-hover:text-brand-dark hoverEffect mt-.5 w-5 h-5" />
          )}
        </button>
      )}
    </>
  );
};

export default FavoriteButton;
