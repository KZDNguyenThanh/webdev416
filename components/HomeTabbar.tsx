"use client";
import { productType } from "@/constants/data";
import Link from "next/link";
interface Props {
  selectedTab: string;
  onTabSelect: (tabSlug: string) => void;
}

const HomeTabbar = ({ selectedTab, onTabSelect }: Props) => {
  return (
    <div className="flex items-center flex-wrap gap-5 justify-between">
      <div className="flex items-center gap-1.5 text-sm font-semibold">
        <div className="flex items-center gap-1.5 md:gap-3">
          {productType?.map((item) => (
            <button
              onClick={() => onTabSelect(item?.value)}
              key={item?.title}
              className={`border px-4 py-1.5 md:px-6 md:py-2 rounded-full hover:bg-brand-dark hover:border-brand-dark hover:text-white hoverEffect ${selectedTab === item?.value ? "bg-brand-dark text-white border-brand-dark" : "bg-brand-soft border-brand-muted text-brand-deep"}`}
            >
              {item?.title}
            </button>
          ))}
        </div>
      </div>
      <Link
        href={"/shop"}
        className="border border-brand-dark px-4 py-1 rounded-full hover:bg-brand-dark hover:text-white hover:border-brand-dark hoverEffect"
      >
        Xem tất cả
      </Link>
    </div>
  );
};

export default HomeTabbar;
