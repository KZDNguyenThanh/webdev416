import type { BrandDTO } from "@/lib/types";
import React from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

interface Props {
  brands: BrandDTO[];
  selectedBrand?: string | null;
  setSelectedBrand: React.Dispatch<React.SetStateAction<string | null>>;
}

const BrandList = ({ brands, selectedBrand, setSelectedBrand }: Props) => {
  return (
    <div>
      <h3 className="filter-section-title">Thương hiệu</h3>
      <RadioGroup value={selectedBrand || ""} className="mt-3 space-y-1.5">
        {brands?.map((brand) => (
          <div
            key={brand?.id}
            onClick={() => setSelectedBrand(brand?.slug)}
            className="flex items-center space-x-2 hover:cursor-pointer"
          >
            <RadioGroupItem
              value={brand?.slug}
              id={`brand-${brand?.slug}`}
              className="rounded-sm"
            />
            <Label
              htmlFor={`brand-${brand?.slug}`}
              className={`text-sm ${
                selectedBrand === brand?.slug
                  ? "font-semibold text-brand-dark"
                  : "font-normal text-lightColor"
              }`}
            >
              {brand?.title}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default BrandList;
