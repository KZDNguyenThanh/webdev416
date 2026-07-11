import AddToCartButton from "@/components/AddToCartButton";
import Container from "@/components/Container";
import FavoriteButton from "@/components/FavoriteButton";
import ImageView from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import ProductCharacteristics from "@/components/ProductCharacteristics";
import ProductReviews from "@/components/ProductReviews";
import { getProductBySlug } from "@/lib/data/queries";
import { StarIcon } from "lucide-react";
import { notFound } from "next/navigation";
import React from "react";

const SingleProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return notFound();
  }

  const reviewAverage = Number(product?.reviewAverage ?? 0);
  const reviewCount = Number(product?.reviewCount ?? 0);
  const filledStars = Math.max(0, Math.min(5, Math.round(reviewAverage)));

  return (
    <Container className="flex flex-col md:flex-row gap-10 py-10">
      {product?.images && (
        <ImageView images={product?.images} isStock={product?.stock} />
      )}
      <div className="w-full md:w-1/2 flex flex-col gap-5">
        <div className="space-y-1">
          <h2 className="display-title text-2xl text-brand-dark">
            {product?.name}
          </h2>
          <p className="text-[15px] leading-relaxed text-gray-600 tracking-wide sm:text-sm">
            {product?.description}
          </p>
          <div className="flex items-center gap-0.5 text-sm">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                size={12}
                className={
                  index < filledStars ? "text-yellow-400" : "text-gray-300"
                }
                fill={index < filledStars ? "#facc15" : "#d1d5db"}
              />
            ))}
            <p className="font-semibold">{`(${reviewCount})`}</p>
          </div>
        </div>
        <div className="space-y-2 border-t border-b border-gray-200 py-5">
          <PriceView
            price={product?.price}
            discount={product?.discount}
            className="text-lg font-bold"
          />
          <p
            className={`px-4 py-1.5 text-sm text-center inline-block font-semibold rounded-lg ${product?.stock === 0 ? "bg-red-100 text-red-600" : "text-green-600 bg-green-100"}`}
          >
            {product?.stock > 0 ? "Còn hàng" : "Hết hàng"}
          </p>
        </div>
        <div className="flex items-center gap-2.5 lg:gap-3">
          <AddToCartButton product={product} />
          <FavoriteButton showProduct={true} product={product} />
        </div>
        <ProductCharacteristics product={product} />
        <ProductReviews product={product} slug={slug} />
      </div>
    </Container>
  );
};

export default SingleProductPage;
