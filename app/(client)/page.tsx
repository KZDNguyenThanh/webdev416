import Container from "@/components/Container";
import HeroCinematic from "@/components/HeroCinematic";
import FeaturedShowcase from "@/components/FeaturedShowcase";
import HomeCategories from "@/components/HomeCategories";
import ProductGrid from "@/components/ProductGrid";
import ShopByBrands from "@/components/ShopByBrands";
import Reveal from "@/components/Reveal";
import { getCategories, getDealProducts } from "@/lib/data/queries";

import React from "react";

const Home = async () => {
  const [categories, dealProducts] = await Promise.all([
    getCategories(6),
    getDealProducts(),
  ]);

  return (
    <>
      <HeroCinematic products={dealProducts} />
      <Container>
        <FeaturedShowcase products={dealProducts} />
        <Reveal>
          <ProductGrid />
        </Reveal>
        <Reveal>
          <HomeCategories categories={categories} />
        </Reveal>
        <Reveal>
          <ShopByBrands />
        </Reveal>
      </Container>
    </>
  );
};

export default Home;
