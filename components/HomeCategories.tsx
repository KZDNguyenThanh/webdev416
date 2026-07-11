import React from "react";
import type { CategoryDTO } from "@/lib/types";
import Image from "next/image";
import { getImageUrl } from "@/lib/image";
import Link from "next/link";

const HomeCategories = ({ categories }: { categories: CategoryDTO[] }) => {
  return (
    <div className="bg-white border border-brand-muted my-10 md:my-20 p-5 lg:p-8 rounded-xl">
      <div className="flex items-end justify-between border-b border-brand-muted pb-4">
        <div>
          <p className="section-eyebrow">Bộ sưu tập</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-brand-dark">
            Danh mục nổi bật
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden sm:inline-flex text-sm font-semibold tracking-wide text-brand-accent hover:text-brand-dark hoverEffect"
        >
          Xem tất cả
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories?.map((category) => {
          const previewUrl = category?.previewImageUrl ?? category?.imageUrl;
          return (
          <Link
            key={category?.id}
            href={`/category/${category?.slug}`}
            className="keycap-hover group flex items-center gap-4 rounded-xl border border-brand-muted bg-brand-soft p-4 shadow-sm"
          >
            {previewUrl && (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-brand-muted bg-white p-2">
                <Image
                  src={getImageUrl(previewUrl)}
                  alt={category?.title}
                  width={500}
                  height={500}
                  className="h-full w-full object-contain group-hover:scale-110 hoverEffect"
                />
              </div>
            )}
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-brand-dark">
                {category?.title}
              </h3>
              <span className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-brand-accent ring-1 ring-brand-muted">
                {category?.productCount} sản phẩm
              </span>
            </div>
          </Link>
          );
        })}
      </div>
    </div>
  );
};

export default HomeCategories;
