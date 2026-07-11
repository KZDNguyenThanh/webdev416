import React from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { priceRanges } from "@/constants/data";

interface Props {
  selectedPrice?: string | null;
  setSelectedPrice: React.Dispatch<React.SetStateAction<string | null>>;
}

const PriceList = ({ selectedPrice, setSelectedPrice }: Props) => {
  return (
    <div>
      <h3 className="filter-section-title">Giá</h3>
      <RadioGroup className="mt-3 space-y-1.5" value={selectedPrice || ""}>
        {priceRanges?.map((price) => (
          <div
            key={price.value}
            onClick={() => setSelectedPrice(price?.value)}
            className="flex items-center space-x-2 hover:cursor-pointer"
          >
            <RadioGroupItem
              value={price?.value}
              id={`price-${price?.value}`}
              className="rounded-sm"
            />
            <Label
              htmlFor={`price-${price.value}`}
              className={`text-sm ${
                selectedPrice === price?.value
                  ? "font-semibold text-brand-dark"
                  : "font-normal text-lightColor"
              }`}
            >
              {price?.title}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default PriceList;
