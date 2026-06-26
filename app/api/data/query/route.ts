import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getProductsByCategorySlug,
  getProductsByFilters,
} from "@/lib/repositories/commerce.repository";
import { toAddressDTO } from "@/lib/mappers";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      query?: string;
      params?: Record<string, unknown>;
    };

    const query = body.query || "";
    const params = body.params || {};

    if (query.includes('_type=="address"')) {
      const addresses = await prisma.address.findMany({
        orderBy: { updatedAt: "desc" },
      });
      return NextResponse.json({
        data: addresses.map(toAddressDTO),
      });
    }

    if (typeof params.categorySlug === "string") {
      const products = await getProductsByCategorySlug(params.categorySlug);
      return NextResponse.json({ data: products });
    }

    if (
      Object.prototype.hasOwnProperty.call(params, "selectedCategory") ||
      Object.prototype.hasOwnProperty.call(params, "selectedBrand") ||
      Object.prototype.hasOwnProperty.call(params, "minPrice") ||
      Object.prototype.hasOwnProperty.call(params, "maxPrice")
    ) {
      const products = await getProductsByFilters({
        selectedCategory:
          typeof params.selectedCategory === "string"
            ? params.selectedCategory
            : null,
        selectedBrand:
          typeof params.selectedBrand === "string"
            ? params.selectedBrand
            : null,
        minPrice: Number(params.minPrice ?? 0),
        maxPrice: Number(params.maxPrice ?? 10_000_000_000),
      });
      return NextResponse.json({ data: products });
    }

    return NextResponse.json({ data: [] });
  } catch (error) {
    console.error("Legacy data query error:", error);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }
}
