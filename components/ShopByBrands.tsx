import React from "react";
import Title from "./Title";
import Link from "next/link";
import { getAllBrands } from "@/lib/data/queries";
import BrandMarquee from "./BrandMarquee";

const ShopByBrands = async () => {
  const brands = (await getAllBrands()).filter((brand) => brand?.imageUrl);

  return (
    <div className="mb-10 lg:mb-20 bg-brand-bg p-5 lg:p-8 rounded-xl">
      <div className="flex items-end gap-5 justify-between mb-8">
        <div>
          <p className="section-eyebrow">Thương hiệu</p>
          <Title className="mt-1 tracking-tight text-brand-dark">
            Mua theo thương hiệu
          </Title>
        </div>
        <Link
          href={"/shop"}
          className="text-sm font-semibold tracking-wide text-brand-accent hover:text-brand-dark hoverEffect"
        >
          Xem tất cả
        </Link>
      </div>

      <BrandMarquee brands={brands} />
    </div>
  );
};

export default ShopByBrands;
