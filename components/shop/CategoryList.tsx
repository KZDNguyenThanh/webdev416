import type { CategoryDTO } from "@/lib/types";
import React from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

interface Props {
  categories: CategoryDTO[];
  selectedCategory?: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
}

const CategoryList = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}: Props) => {
  return (
    <div>
      <h3 className="filter-section-title">Danh mục</h3>
      <RadioGroup value={selectedCategory || ""} className="mt-3 space-y-1.5">
        {categories?.map((category) => (
          <div
            onClick={() => setSelectedCategory(category?.slug)}
            key={category?.id}
            className="flex items-center space-x-2 hover:cursor-pointer"
          >
            <RadioGroupItem
              value={category?.slug}
              id={`cat-${category?.slug}`}
              className="rounded-sm"
            />
            <Label
              htmlFor={`cat-${category?.slug}`}
              className={`text-sm ${
                selectedCategory === category?.slug
                  ? "font-semibold text-brand-dark"
                  : "font-normal text-lightColor"
              }`}
            >
              {category?.title}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default CategoryList;
