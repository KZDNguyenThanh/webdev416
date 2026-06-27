import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  createBrandAction,
  deleteBrandAction,
  updateBrandAction,
} from "@/app/(admin)/admin/actions";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export default async function AdminBrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { title: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Brands</h1>
        <p className="text-sm text-lightColor mt-1">
          Create brands and upload representative images for storefront display.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Brand</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={createBrandAction}
            className="grid grid-cols-1 md:grid-cols-6 gap-3 border p-4 rounded-md"
          >
            <Input name="title" placeholder="Brand title" required />
            <Input name="slug" placeholder="Slug (optional)" />
            <Input
              name="description"
              className="md:col-span-2"
              placeholder="Description"
            />
            <Input
              name="imageUrl"
              placeholder="Link ảnh (tùy chọn)"
              className="md:col-span-2"
            />
            <Input
              type="file"
              name="image"
              accept="image/*"
              className="h-auto py-2 md:col-span-2"
            />
            <Button type="submit" className="md:col-span-2">
              Create Brand
            </Button>
          </form>
          <p className="mt-2 text-xs text-lightColor">
            Có thể dán link ảnh hoặc tải file. Nếu chọn cả hai, file tải lên được
            ưu tiên.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Brand List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {brands.map((brand) => (
            <form
              key={brand.id}
              action={updateBrandAction}
              className="grid grid-cols-1 md:grid-cols-7 gap-2 border p-3 rounded-md"
            >
              <input type="hidden" name="id" value={brand.id} />
              <Input name="title" defaultValue={brand.title} required />
              <Input name="slug" defaultValue={brand.slug} />
              <Input
                name="description"
                defaultValue={brand.description || ""}
                className="md:col-span-2"
              />
              <Input
                name="imageUrl"
                defaultValue={brand.imageUrl || ""}
                placeholder="Link ảnh"
              />
              <Input
                type="file"
                name="image"
                accept="image/*"
                className="h-auto py-2"
              />
              <div className="flex items-center gap-2 text-sm text-lightColor">
                <span>{brand._count.products} product(s)</span>
                {brand.imageUrl ? (
                  <Image
                    src={brand.imageUrl}
                    alt={brand.title}
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-md object-cover border"
                  />
                ) : null}
              </div>
              <div className="flex gap-2 md:col-span-2">
                <Button type="submit" variant="outline">
                  Update
                </Button>
                <button
                  formAction={deleteBrandAction}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </form>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
