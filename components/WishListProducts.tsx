"use client";

import useStore from "@/store";
import { useState } from "react";
import Container from "./Container";
import { Heart, X } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import type { ProductDTO } from "@/lib/types";
import toast from "react-hot-toast";
import Image from "next/image";
import { getImageUrl } from "@/lib/image";
import PriceFormatter from "./PriceFormatter";
import AddToCartButton from "./AddToCartButton";

const WishListProducts = () => {
  const [visibleProducts, setVisibleProducts] = useState(7);
  const { favoriteProduct, removeFromFavorite, resetFavorite } = useStore();
  const loadMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 5, favoriteProduct.length));
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
    <Container>
      {favoriteProduct?.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="border-b">
                <tr className="bg-black/5">
                  <th className="p-2 text-left">Ảnh</th>
                  <th className="p-2 text-left hidden md:table-cell">
                    Danh mục
                  </th>
                  <th className="p-2 text-left hidden md:table-cell">Loại</th>
                  <th className="p-2 text-left hidden md:table-cell">
                    Trạng thái
                  </th>
                  <th className="p-2 text-left">Giá</th>
                  <th className="p-2 text-center md:text-left">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {favoriteProduct
                  ?.slice(0, visibleProducts)
                  ?.map((product: ProductDTO) => (
                    <tr key={product?.id} className="border-b">
                      <td className="px-2 py-4 flex items-center gap-2">
                        <X
                          onClick={() => {
                            removeFromFavorite(product?.id);
                            toast.success("Đã xóa khỏi yêu thích");
                          }}
                          size={18}
                          className="hover:text-red-600 hover:cursor-pointer hoverEffect"
                        />
                        {product?.images && (
                          <Link
                            href={`/product/${product?.slug}`}
                            className="border rounded-md group hidden md:inline-flex"
                          >
                            <Image
                              src={getImageUrl(product?.images[0])}
                              alt={"product image"}
                              width={80}
                              height={80}
                              className="rounded-md group-hover:scale-105 hoverEffect h-20 w-20 object-contain"
                            />
                          </Link>
                        )}
                        <p className="line-clamp-1">{product?.name}</p>
                      </td>
                      <td className="p-2 capitalize hidden md:table-cell">
                        {product?.categories && (
                          <p className="uppercase line-clamp-1 text-xs font-medium">
                            {product.categories
                              .map((cat) => cat.title)
                              .join(", ")}
                          </p>
                        )}
                      </td>
                      <td className="p-2 capitalize hidden md:table-cell">
                        {product?.categories?.length
                          ? product.categories.map((cat) => cat.title).join(", ")
                          : "Others"}
                      </td>
                      <td
                        className={`p-2 w-24 ${
                          product?.stock > 0
                            ? "text-green-600"
                            : "text-red-600"
                        } font-medium text-sm hidden md:table-cell`}
                      >
                        {product?.stock > 0 ? "Còn hàng" : "Hết hàng"}
                      </td>
                      <td className="p-2">
                        <PriceFormatter amount={product?.price} />
                      </td>
                      <td className="p-2">
                        <AddToCartButton product={product} className="w-full" />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-2">
            {visibleProducts < favoriteProduct?.length && (
              <div className="my-5">
                <Button variant="outline" onClick={loadMore}>
                  Xem thêm
                </Button>
              </div>
            )}
            {visibleProducts > 10 && (
              <div className="my-5">
                <Button
                  onClick={() => setVisibleProducts(10)}
                  variant="outline"
                >
                  Thu gọn
                </Button>
              </div>
            )}
          </div>
          {favoriteProduct?.length > 0 && (
            <Button
              onClick={handleResetWishlist}
              className="mb-5 font-semibold"
              variant="destructive"
              size="lg"
            >
              Xóa yêu thích
            </Button>
          )}
        </>
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center space-y-6 px-4 text-center">
          <div className="relative mb-4">
            <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-muted-foreground/20" />
            <Heart
              className="h-12 w-12 text-muted-foreground"
              strokeWidth={1.5}
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Danh sách yêu thích trống
            </h2>
            <p className="text-sm text-muted-foreground">
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
