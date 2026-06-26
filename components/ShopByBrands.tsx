import React from "react";
import Title from "./Title";
import Link from "next/link";
import { getAllBrands } from "@/lib/data/queries";
import Image from "next/image";
import { getImageUrl } from "@/lib/image";
import { GitCompareArrows, Headset, ShieldCheck, Truck } from "lucide-react";

const extraData = [
  {
    title: "Miễn phí giao hàng",
    description: "Miễn phí vận chuyển cho đơn từ 300.000₫",
    icon: <Truck size={45} />,
  },
  {
    title: "Đổi trả miễn phí",
    description: "Đổi trả trong 7 ngày nếu sản phẩm lỗi hoặc sai",
    icon: <GitCompareArrows size={45} />,
  },
  {
    title: "Hỗ trợ khách hàng",
    description: "Dễ dàng liên hệ để sửa chữa hoặc thay thế",
    icon: <Headset size={45} />,
  },
  {
    title: "Hoàn tiền đảm bảo",
    description: "",
    icon: <ShieldCheck size={45} />,
  },
];

const ShopByBrands = async () => {
  const brands = await getAllBrands();
  return (
    <div className="mb-10 lg:mb-20 bg-shop_light_bg p-5 lg:p-7 rounded-md">
      <div className="flex items-center gap-5 justify-between mb-10">
        <Title>Mua theo thương hiệu</Title>
        <Link
          href={"/shop"}
          className="text-sm font-semibold tracking-wide hover:text-brand hoverEffect"
        >
          Xem tất cả
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {brands?.map((brand) => (
          <Link
            key={brand?.id}
            href={`/brand/${brand?.slug}`}
            className="bg-white w-34 h-24 flex items-center justify-center rounded-md overflow-hidden hover:shadow-lg shadow-shop_dark_green/20 hoverEffect"
          >
            {brand?.imageUrl && (
              <Image
                src={getImageUrl(brand?.imageUrl)}
                alt="brandImage"
                width={250}
                height={250}
                className="w-32 h-20 object-contain"
              />
            )}
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16 p-2 shadow-sm hover:shadow-shop_light_green/20 py-5">
        {extraData?.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 group text-lightColor hover:text-shop_light_green"
          >
            <span className="inline-flex scale-100 group-hover:scale-90 hoverEffect">
              {item?.icon}
            </span>
            <div className="text-sm">
              <p className="text-darkColor/80 font-bold capitalize">
                {item?.title}
              </p>
              <p className="text-lightColor">{item?.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopByBrands;
