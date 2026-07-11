"use client";
import type { BrandDTO, CategoryDTO, ProductDTO } from "@/lib/types";
import React, { useCallback, useEffect, useState } from "react";
import Container from "./Container";
import FilterPanel from "./shop/FilterPanel";
import { useSearchParams } from "next/navigation";
import { getShopProducts } from "@/actions/catalog";
import { Loader2, SlidersHorizontal, X } from "lucide-react";
import NoProductAvailable from "./NoProductAvailable";
import ProductCard from "./ProductCard";
import { Button } from "./ui/button";
import { sortOptions } from "@/constants/data";

interface Props {
  categories: CategoryDTO[];
  brands: BrandDTO[];
}
const Shop = ({ categories, brands }: Props) => {
  const searchParams = useSearchParams();
  const brandParams = searchParams?.get("brand");
  const categoryParams = searchParams?.get("category");
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryParams || null,
  );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    brandParams || null,
  );
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<string>("newest");
  const [filterOpen, setFilterOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let minPrice = 0;
      let maxPrice = 10000000000;
      if (selectedPrice) {
        const [min, max] = selectedPrice.split("-").map(Number);
        minPrice = min;
        maxPrice = max;
      }
      const data = await getShopProducts({
        selectedCategory,
        selectedBrand,
        minPrice,
        maxPrice,
        sort: selectedSort,
      });
      setProducts(data);
    } catch (error) {
      console.log("Shop product fetching Error", error);
    } finally {
      setLoading(false);
    }
  }, [selectedBrand, selectedCategory, selectedPrice, selectedSort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Lock body scroll while the mobile filter drawer is open.
  useEffect(() => {
    document.body.style.overflow = filterOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [filterOpen]);

  const filterProps = {
    categories,
    brands,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    selectedPrice,
    setSelectedPrice,
  };

  return (
    <div className="border-t border-brand-muted">
      <Container className="my-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="hud-label text-brand-accent">
            {loading ? "Đang tải…" : `${products.length} sản phẩm`}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFilterOpen(true)}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-brand-muted px-4 text-sm font-medium text-brand-dark hover:border-brand-dark hoverEffect lg:hidden"
            >
              <SlidersHorizontal size={16} />
              Bộ lọc
            </button>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="shop-select"
              aria-label="Sắp xếp"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block lg:w-64 lg:shrink-0">
            <div className="rounded-xl border border-brand-muted bg-white p-5">
              <FilterPanel {...filterProps} />
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-24">
                <Loader2 className="h-8 w-8 animate-spin text-brand-dark" />
                <p className="text-sm font-medium text-lightColor">
                  Đang tải sản phẩm…
                </p>
              </div>
            ) : products?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {products?.map((product) => (
                  <ProductCard key={product?.id} product={product} />
                ))}
              </div>
            ) : (
              <NoProductAvailable className="mt-0 bg-white" />
            )}
          </div>
        </div>
      </Container>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <>
          <div
            className="filter-overlay"
            onClick={() => setFilterOpen(false)}
          />
          <div className="filter-drawer">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-brand-dark">Bộ lọc</h2>
              <button
                onClick={() => setFilterOpen(false)}
                aria-label="Đóng"
                className="text-lightColor hover:text-brand-dark hoverEffect"
              >
                <X size={20} />
              </button>
            </div>
            <FilterPanel {...filterProps} />
            <Button
              onClick={() => setFilterOpen(false)}
              className="mt-6 w-full"
              size="lg"
            >
              Xem kết quả
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Shop;
