import PageHero from "@/components/PageHero";
import Shop from "@/components/Shop";
import { getAllBrands, getCategories } from "@/lib/data/queries";
import React from "react";

const ShopPage = async () => {
  const categories = await getCategories();
  const brands = await getAllBrands();
  return (
    <div className="bg-brand-soft">
      <PageHero
        eyebrow="Cửa hàng"
        title="Tất cả sản phẩm"
        subtitle="Bàn phím cơ, keycap, switch và phụ kiện — lọc theo danh mục, thương hiệu và mức giá."
      />
      <Shop categories={categories} brands={brands} />
    </div>
  );
};

export default ShopPage;
