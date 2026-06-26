import type { ProductDTO } from "@/lib/types";
import { getImageUrl } from "@/lib/image";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import PriceView from "./PriceView";
import Title from "./Title";
import ProductSideMenu from "./ProductSideMenu";
import AddToCartButton from "./AddToCartButton";
import BuyNowButton from "./BuyNowButton";

const ProductCard = ({ product }: { product: ProductDTO }) => {
  const productStatus = (product?.status || "").toLowerCase();
  const reviewAverage = Number(product?.reviewAverage ?? 0);
  const reviewCount = Number(product?.reviewCount ?? 0);
  const filledStars = Math.max(0, Math.min(5, Math.round(reviewAverage)));

  const statusStyles: Record<string, { label: string; className: string }> = {
    sale: {
      label: "GIẢM GIÁ",
      className: "bg-brand-dark text-white border-brand-dark/30",
    },
    hot: {
      label: "HOT",
      className: "bg-brand text-white border-brand/30",
    },
    new: {
      label: "HÀNG MỚI",
      className: "bg-brand-soft text-brand-dark border-brand/30",
    },
  };

  const statusBadge = statusStyles[productStatus];

  return (
    <div className="text-sm border-[1px] rounded-md border-darkBlue/20 group bg-white">
      <div className="relative group overflow-hidden bg-shop_light_bg">
        {product?.images && (
          <Link href={`/product/${product?.slug}`}>
            <Image
              src={getImageUrl(product.images[0])}
              alt="productImage"
              width={500}
              height={500}
              priority
              className={`w-full h-64 object-contain overflow-hidden transition-transform bg-shop_light_bg duration-500 
              ${product?.stock !== 0 ? "group-hover:scale-105" : "opacity-50"}`}
            />
          </Link>
        )}
        <ProductSideMenu product={product} />
        {statusBadge ? (
          <span
            className={`absolute top-2 left-2 z-10 rounded-full border px-2.5 py-1 text-[11px] font-extrabold tracking-wide shadow-sm backdrop-blur-sm ${statusBadge.className}`}
          >
            {statusBadge.label}
          </span>
        ) : null}
      </div>
      <div className="p-3 flex flex-col gap-2">
        {product?.categories && (
          <p className="uppercase line-clamp-1 text-xs font-medium text-lightText">
            {product.categories.map((cat) => cat.title).join(", ")}
          </p>
        )}
        <Title className="text-sm line-clamp-1">{product?.name}</Title>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                size={14}
                className={
                  index < filledStars ? "text-yellow-400" : "text-gray-300"
                }
                fill={index < filledStars ? "#facc15" : "#d1d5db"}
              />
            ))}
          </div>
          <p className="text-lightText text-xs tracking-wide">
            {reviewCount === 0 ? "Chưa có đánh giá" : `${reviewCount} đánh giá`}
          </p>
        </div>

        {product?.stock > 0 ? (
          <div className="flex items-center gap-2.5">
            <p className="font-medium">Còn hàng</p>
            <p className="text-brand-dark/80 font-semibold">{product?.stock}</p>
          </div>
        ) : (
          <p className="font-medium text-red-600">Hết hàng</p>
        )}

        <PriceView
          price={product?.price}
          discount={product?.discount}
          className="text-sm"
        />
        <div className="flex flex-col gap-2">
          <AddToCartButton product={product} className="rounded-full" />
          <BuyNowButton product={product} className="rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
