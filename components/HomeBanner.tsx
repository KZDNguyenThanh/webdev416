import React from "react";
import Link from "next/link";
import Image from "next/image";
import { main_banner } from "@/images";
import { getHomeBanners } from "@/lib/banners";
import HomeBannerCarousel from "@/components/HomeBannerCarousel";

const HomeBanner = async () => {
  const banners = await getHomeBanners();

  if (banners.length > 0) {
    return <HomeBannerCarousel items={banners} />;
  }

  // Fallback to the bundled static banner so the homepage is never empty.
  return (
    <Link
      href={"/shop"}
      className="block rounded-lg overflow-hidden"
      aria-label="Khám phá bàn phím cơ KEYNITY"
    >
      <div className="relative w-full">
        <Image
          src={main_banner}
          alt="KEYNITY - Bàn phím cơ & phụ kiện"
          className="w-full h-auto object-cover transition-transform duration-500 hover:scale-[1.01]"
          priority
        />
      </div>
    </Link>
  );
};

export default HomeBanner;
