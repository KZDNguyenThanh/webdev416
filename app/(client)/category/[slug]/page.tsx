import CategoryProducts from "@/components/CategoryProducts";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import { getCategories } from "@/lib/data/queries";
import React from "react";

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const categories = await getCategories();
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);

  return (
    <div>
      <PageHero
        eyebrow="Danh mục"
        title={category?.title ?? slug}
        subtitle="Khám phá các sản phẩm được tuyển chọn trong danh mục này."
      />
      <Container className="py-10">
        <CategoryProducts categories={categories} slug={slug} />
      </Container>
    </div>
  );
};

export default CategoryPage;
