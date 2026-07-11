"use client";

import { Search, Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { searchProducts } from "@/actions/catalog";
import { getImageUrl } from "@/lib/image";
import PriceFormatter from "./PriceFormatter";
import type { ProductDTO } from "@/lib/types";

const SearchBar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside the search area.
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Focus the input as soon as it opens.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Debounced live suggestions.
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        setResults(await searchProducts(q));
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const close = () => {
    setOpen(false);
    setQuery("");
    setResults([]);
  };

  const goToResults = () => {
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    close();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToResults();
  };

  return (
    <div ref={containerRef} className="relative flex items-center">
      <form onSubmit={handleSubmit} className="flex items-center gap-1">
        {open && (
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && close()}
            placeholder="Tìm sản phẩm..."
            className="search-input"
          />
        )}
        <button
          type={open ? "submit" : "button"}
          onClick={() => !open && setOpen(true)}
          aria-label="Tìm kiếm"
          className="p-1 text-zinc-300 hover:text-signal hoverEffect"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>

      {open && query.trim() && (
        <div className="search-panel">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-lightText">
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang tìm...
            </div>
          ) : results.length ? (
            <ul>
              {results.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={close}
                    className="search-suggestion"
                  >
                    {product.images?.[0] && (
                      <Image
                        src={getImageUrl(product.images[0])}
                        alt={product.name}
                        width={44}
                        height={44}
                        className="h-11 w-11 rounded-md border border-brand-muted bg-brand-soft object-contain"
                      />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-brand-dark">
                        {product.name}
                      </span>
                      <PriceFormatter
                        amount={product.price}
                        className="text-xs"
                      />
                    </span>
                  </Link>
                </li>
              ))}
              <li className="border-t border-brand-muted">
                <button
                  type="button"
                  onClick={goToResults}
                  className="search-suggestion w-full justify-center text-sm font-semibold text-brand-deep"
                >
                  Xem tất cả kết quả
                </button>
              </li>
            </ul>
          ) : (
            <div className="py-6 text-center text-sm text-lightText">
              Không tìm thấy sản phẩm
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
