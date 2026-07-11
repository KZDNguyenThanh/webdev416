"use client";

import type { BrandDTO, CategoryDTO } from "@/lib/types";
import React from "react";
import { X } from "lucide-react";
import { priceRanges } from "@/constants/data";
import CategoryList from "./CategoryList";
import BrandList from "./BrandList";
import PriceList from "./PriceList";

interface Props {
  categories: CategoryDTO[];
  brands: BrandDTO[];
  selectedCategory: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
  selectedBrand: string | null;
  setSelectedBrand: React.Dispatch<React.SetStateAction<string | null>>;
  selectedPrice: string | null;
  setSelectedPrice: React.Dispatch<React.SetStateAction<string | null>>;
}

const FilterPanel = ({
  categories,
  brands,
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  selectedPrice,
  setSelectedPrice,
}: Props) => {
  const categoryLabel = categories.find(
    (c) => c.slug === selectedCategory,
  )?.title;
  const brandLabel = brands.find((b) => b.slug === selectedBrand)?.title;
  const priceLabel = priceRanges.find((p) => p.value === selectedPrice)?.title;

  const hasFilters = Boolean(selectedCategory || selectedBrand || selectedPrice);

  const clearAll = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSelectedPrice(null);
  };

  return (
    <div className="space-y-5">
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {categoryLabel && (
            <button
              className="filter-chip"
              onClick={() => setSelectedCategory(null)}
            >
              {categoryLabel}
              <X size={12} />
            </button>
          )}
          {brandLabel && (
            <button
              className="filter-chip"
              onClick={() => setSelectedBrand(null)}
            >
              {brandLabel}
              <X size={12} />
            </button>
          )}
          {priceLabel && (
            <button
              className="filter-chip"
              onClick={() => setSelectedPrice(null)}
            >
              {priceLabel}
              <X size={12} />
            </button>
          )}
          <button
            onClick={clearAll}
            className="text-xs font-semibold text-brand-accent underline underline-offset-2 hover:text-darkRed hoverEffect"
          >
            Xoá tất cả
          </button>
        </div>
      )}

      <CategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <div className="border-t border-brand-muted" />
      <BrandList
        brands={brands}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
      />
      <div className="border-t border-brand-muted" />
      <PriceList
        selectedPrice={selectedPrice}
        setSelectedPrice={setSelectedPrice}
      />
    </div>
  );
};

export default FilterPanel;
