import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { getDealProducts } from "@/lib/data/queries";
import React from "react";

const DealPage = async () => {
  const products = await getDealProducts();
  return (
    <div className="bg-brand-bg-alt">
      <PageHero
        eyebrow="// Ưu đãi"
        title="Ưu đãi nổi bật trong tuần"
        subtitle="Những sản phẩm đang giảm giá mạnh nhất — số lượng có hạn."
      />
      <Container className="py-10">
        <Reveal className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {products?.map((product) => (
            <ProductCard key={product?.id} product={product} />
          ))}
        </Reveal>
      </Container>
    </div>
  );
};

export default DealPage;
