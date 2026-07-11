"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/image";
import type { BrandDTO } from "@/lib/types";

const BrandLogo = ({ brand, index }: { brand: BrandDTO; index: number }) => (
  <Link
    key={`${brand?.id}-${index}`}
    href={`/brand/${brand?.slug}`}
    className="keycap-hover group/logo flex h-24 w-40 shrink-0 items-center justify-center rounded-lg border border-brand-muted bg-white"
  >
    {brand?.imageUrl && (
      <Image
        src={getImageUrl(brand?.imageUrl)}
        alt={brand?.title}
        width={250}
        height={250}
        className="h-16 w-32 object-contain opacity-70 grayscale group-hover/logo:opacity-100 group-hover/logo:grayscale-0 hoverEffect"
      />
    )}
  </Link>
);

const BrandMarquee = ({ brands }: { brands: BrandDTO[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const track = trackRef.current;
      if (!container || !track || brands.length === 0) return;
      // Khi đang chạy, track nhân đôi nên đo theo độ rộng một bộ.
      const sets = track.childElementCount / brands.length;
      const singleWidth = track.scrollWidth / Math.max(sets, 1);
      setOverflowing(singleWidth > container.clientWidth + 1);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [brands, overflowing]);

  const items = overflowing ? [...brands, ...brands] : brands;

  return (
    <div
      ref={containerRef}
      className="group marquee-mask relative overflow-hidden"
    >
      <div
        ref={trackRef}
        className={`flex gap-3 ${
          overflowing ? "w-max animate-marquee" : "w-full justify-center"
        }`}
      >
        {items?.map((brand, i) => (
          <BrandLogo key={`${brand?.id}-${i}`} brand={brand} index={i} />
        ))}
      </div>
    </div>
  );
};

export default BrandMarquee;
