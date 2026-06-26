import React from "react";
import Link from "next/link";
import Image from "next/image";
import { main_banner } from "@/images";

const HomeBanner = () => {
  return (
    <Link
      href={{ pathname: "/shop", query: { brand: "blue-archives" } }}
      className="block rounded-lg overflow-hidden"
      aria-label="Shop Blue Archives collection"
    >
      <div className="relative w-full">
        <Image
          src={main_banner}
          alt="Blue Archives Lotte Cinema collaboration banner"
          className="w-full h-auto object-cover transition-transform duration-500 hover:scale-[1.01]"
          priority
        />
      </div>
    </Link>
  );
};

export default HomeBanner;
