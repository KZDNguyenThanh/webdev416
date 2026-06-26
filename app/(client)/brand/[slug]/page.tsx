import Container from "@/components/Container";
import NoProductAvailable from "@/components/NoProductAvailable";
import ProductCard from "@/components/ProductCard";
import Title from "@/components/Title";
import { getAllBrands, getProductsByBrandSlug } from "@/lib/data/queries";
import React from "react";

const BrandPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const [products, brands] = await Promise.all([
    getProductsByBrandSlug(slug),
    getAllBrands(),
  ]);
  const selectedBrand = brands.find((brand) => brand.slug === slug);

  return (
    <Container className="my-8 lg:my-10">
      <div className="mb-6 border-b pb-4">
        <Title className="text-xl lg:text-2xl">
          {selectedBrand?.title || "Brand"}
        </Title>
      </div>
      {products?.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {products.map((product) => (
            <ProductCard key={product?.id} product={product} />
          ))}
        </div>
      ) : (
        <NoProductAvailable selectedTab={selectedBrand?.title || slug} />
      )}
    </Container>
  );
};

export default BrandPage;
