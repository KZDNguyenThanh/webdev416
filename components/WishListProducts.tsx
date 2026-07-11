"use client";

import useStore from "@/store";
import { useState } from "react";
import Container from "./Container";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import toast from "react-hot-toast";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";

const WishListProducts = () => {
  const [visibleProducts, setVisibleProducts] = useState(8);
  const { favoriteProduct, resetFavorite } = useStore();

  const loadMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 8, favoriteProduct.length));
  };

  const handleResetWishlist = () => {
    const confirmReset = window.confirm(
      "Bạn có chắc muốn xóa toàn bộ danh sách yêu thích?",
    );
    if (confirmReset) {
      resetFavorite();
      toast.success("Đã xóa danh sách yêu thích!");
    }
  };

  return (
    <Container className="my-10">
      {favoriteProduct?.length > 0 ? (
        <>
          <div className="flex items-end justify-between border-b border-brand-muted pb-4">
            <div>
              <p className="section-eyebrow">Yêu thích</p>
              <h1 className="display-title mt-1 text-3xl text-brand-dark">
                Sản phẩm yêu thích
              </h1>
            </div>
            <span className="inline-flex items-center rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-accent ring-1 ring-brand-muted">
              {favoriteProduct.length} sản phẩm
            </span>
          </div>

          <Reveal className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favoriteProduct.slice(0, visibleProducts).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Reveal>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {visibleProducts < favoriteProduct.length && (
              <Button variant="outline" onClick={loadMore}>
                Xem thêm
              </Button>
            )}
            <Button
              onClick={handleResetWishlist}
              variant="destructive"
              className="font-semibold"
            >
              Xóa tất cả yêu thích
            </Button>
          </div>
        </>
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center space-y-6 px-4 text-center">
          <div className="relative mb-4">
            <span className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-brand-accent/20" />
            <Heart className="h-12 w-12 text-brand-accent" strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-brand-dark">
              Danh sách yêu thích trống
            </h2>
            <p className="text-sm text-lightText">
              Sản phẩm bạn thêm vào yêu thích sẽ hiển thị ở đây
            </p>
          </div>
          <Button asChild>
            <Link href="/shop">Tiếp tục mua sắm</Link>
          </Button>
        </div>
      )}
    </Container>
  );
};

export default WishListProducts;
