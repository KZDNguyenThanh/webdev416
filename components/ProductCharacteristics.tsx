import type { ProductDTO } from "@/lib/types";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const ProductCharacteristics = async ({
  product,
}: {
  product: ProductDTO | null | undefined;
}) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>{product?.name}: Thông số</AccordionTrigger>
        <AccordionContent>
          <p className="flex items-center justify-between">
            Thương hiệu:{" "}
            {product?.brand && (
              <span className="font-semibold tracking-wide">
                {product.brand.title}
              </span>
            )}
          </p>
          <p className="flex items-center justify-between">
            Bộ sưu tập:{" "}
            <span className="font-semibold tracking-wide">2025</span>
          </p>
          <p className="flex items-center justify-between">Loại: Merch</p>
          <p className="flex items-center justify-between">
            Tồn kho:{" "}
            <span className="font-semibold tracking-wide">
              {product?.stock ? "Còn hàng" : "Hết hàng"}
            </span>
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ProductCharacteristics;
