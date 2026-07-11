import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { getProductsByFilters } from "@/lib/repositories/commerce.repository";
import { SearchX } from "lucide-react";
import Link from "next/link";
import React from "react";

const SearchPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) => {
  const { q } = await searchParams;
  const query = (q || "").trim();
  const products = query ? await getProductsByFilters({ query }) : [];

  return (
    <div>
      <PageHero
        eyebrow="Tìm kiếm"
        title={query ? `Kết quả cho “${query}”` : "Tìm sản phẩm"}
        subtitle={query ? `${products.length} sản phẩm phù hợp` : undefined}
      />
      <Container className="my-10">
      {query && products.length > 0 ? (
        <Reveal className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Reveal>
      ) : (
        <div className="mt-6 flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-xl border border-brand-muted bg-brand-soft px-4 text-center">
          <SearchX className="h-12 w-12 text-brand-accent" strokeWidth={1.5} />
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-brand-dark">
              {query ? "Không tìm thấy sản phẩm" : "Nhập từ khoá để tìm kiếm"}
            </h2>
            <p className="text-sm text-lightText">
              {query
                ? "Thử từ khoá khác hoặc khám phá toàn bộ cửa hàng."
                : "Tìm sản phẩm theo tên ở thanh tìm kiếm trên đầu trang."}
            </p>
          </div>
          <Button asChild>
            <Link href="/shop">Khám phá cửa hàng</Link>
          </Button>
        </div>
      )}
      </Container>
    </div>
  );
};

export default SearchPage;
