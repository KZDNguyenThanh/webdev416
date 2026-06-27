import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import {
  createProductAction,
  deleteProductAction,
  updateProductAction,
} from "@/app/(admin)/admin/actions";
import Image from "next/image";
import PriceFormatter from "@/components/PriceFormatter";
import BulkProductForm from "@/components/admin/BulkProductForm";

export default async function AdminProductsPage() {
  const [products, brands, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        brand: true,
        categories: { include: { category: true } },
        images: { orderBy: { position: "asc" } },
      },
    }),
    prisma.brand.findMany({ orderBy: { title: "asc" } }),
    prisma.category.findMany({ orderBy: { title: "asc" } }),
  ]);

  const featuredCount = products.filter((product) => product.isFeatured).length;
  const outOfStockCount = products.filter(
    (product) => product.stock <= 0,
  ).length;
  const lowStockCount = products.filter(
    (product) => product.stock > 0 && product.stock <= 5,
  ).length;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-white p-5 md:p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-darkColor">Products</h1>
        <p className="mt-1 text-sm text-lightColor">
          Manage product catalog, inventory, price, images, and categories from
          one place.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-lg border border-darkBlue/10 bg-zinc-50/70 p-3">
            <p className="text-xs uppercase tracking-wide text-lightColor">
              Total
            </p>
            <p className="text-xl font-bold text-darkColor">
              {products.length}
            </p>
          </div>
          <div className="rounded-lg border border-darkBlue/10 bg-zinc-50/70 p-3">
            <p className="text-xs uppercase tracking-wide text-lightColor">
              Featured
            </p>
            <p className="text-xl font-bold text-darkColor">{featuredCount}</p>
          </div>
          <div className="rounded-lg border border-darkBlue/10 bg-zinc-50/70 p-3">
            <p className="text-xs uppercase tracking-wide text-lightColor">
              Low Stock
            </p>
            <p className="text-xl font-bold text-amber-600">{lowStockCount}</p>
          </div>
          <div className="rounded-lg border border-darkBlue/10 bg-zinc-50/70 p-3">
            <p className="text-xs uppercase tracking-wide text-lightColor">
              Out of Stock
            </p>
            <p className="text-xl font-bold text-rose-600">{outOfStockCount}</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Create Product</CardTitle>
          <CardDescription>
            Add a new item to storefront catalog.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={createProductAction}
            className="space-y-4 rounded-lg border p-4"
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Input name="name" placeholder="Name" required />
              <Input name="slug" placeholder="Slug (optional)" />
              <Input name="description" placeholder="Description" />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <Input
                name="price"
                type="number"
                step="1"
                min="0"
                placeholder="Price (VND)"
                required
              />
              <Input
                name="discount"
                type="number"
                step="1"
                min="0"
                placeholder="Discount (%)"
              />
              <Input name="stock" type="number" min="0" placeholder="Stock" />
              <select
                name="status"
                className="h-9 border rounded-lg px-2.5 text-sm"
                defaultValue=""
              >
                <option value="">Status (optional)</option>
                <option value="NEW">NEW</option>
                <option value="HOT">HOT</option>
                <option value="SALE">SALE</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <select
                name="brandId"
                className="h-9 border rounded-lg px-2.5 text-sm"
                defaultValue=""
              >
                <option value="">No brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.title}
                  </option>
                ))}
              </select>

              <label className="flex h-9 items-center gap-2 rounded-lg border px-3 text-sm">
                <input name="isFeatured" type="checkbox" /> Featured product
              </label>

              <Input
                type="file"
                name="images"
                multiple
                accept="image/*"
                className="h-9"
              />
            </div>

            <div className="rounded-lg border p-3 space-y-2">
              <p className="text-sm font-semibold">Categories</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="text-sm inline-flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      name="categoryIds"
                      value={category.id}
                    />
                    {category.title}
                  </label>
                ))}
              </div>
            </div>

            <Button type="submit" className="min-w-40">
              Create Product
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Thêm nhanh nhiều sản phẩm</CardTitle>
          <CardDescription>
            Nhập nhiều sản phẩm cùng lúc. Ảnh có thể dán link hoặc tải file cho
            từng dòng. Dòng để trống sẽ được bỏ qua.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BulkProductForm
            brands={brands.map((brand) => ({
              id: brand.id,
              title: brand.title,
            }))}
            categories={categories.map((category) => ({
              id: category.id,
              title: category.title,
            }))}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Product List</CardTitle>
          <CardDescription>
            Click on each product card to edit details, inventory, categories
            and images.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-lg border border-darkBlue/10 bg-white p-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-3">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0].imageUrl}
                      alt={product.name}
                      width={56}
                      height={56}
                      unoptimized
                      className="h-14 w-14 rounded-md border object-cover"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-md border bg-zinc-100" />
                  )}

                  <div>
                    <p className="font-semibold text-darkColor">
                      {product.name}
                    </p>
                    <p className="text-xs text-lightColor">/{product.slug}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-zinc-100 px-2 py-1 text-zinc-700">
                        {product.status || "NO STATUS"}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 ${product.stock > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
                      >
                        {product.stock > 0
                          ? `Stock: ${product.stock}`
                          : "Out of stock"}
                      </span>
                      {product.isFeatured ? (
                        <span className="rounded-full bg-indigo-100 px-2 py-1 text-indigo-700">
                          Featured
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="text-left md:text-right">
                  <PriceFormatter amount={Number(product.price)} />
                  {Number(product.discount) > 0 ? (
                    <p className="text-xs text-lightColor">
                      Discount: {Number(product.discount)}%
                    </p>
                  ) : null}
                  <p className="text-xs text-lightColor">
                    {product.brand?.title || "No brand"}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {product.categories.length > 0 ? (
                  product.categories.map((item) => (
                    <span
                      key={item.categoryId}
                      className="rounded-full bg-darkBlue/5 px-2 py-1 text-xs text-darkBlue"
                    >
                      {item.category.title}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-lightColor">
                    No category assigned
                  </span>
                )}
              </div>

              <details className="mt-4 rounded-lg border border-darkBlue/10 bg-zinc-50/50">
                <summary className="cursor-pointer list-none px-3 py-2 text-sm font-medium text-darkBlue hover:bg-zinc-100/80">
                  Edit product details
                </summary>

                <form action={updateProductAction} className="space-y-4 p-3">
                  <input type="hidden" name="id" value={product.id} />

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <Input name="name" defaultValue={product.name} required />
                    <Input name="slug" defaultValue={product.slug} />
                    <Input
                      name="description"
                      defaultValue={product.description || ""}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                    <Input
                      name="price"
                      type="number"
                      step="1"
                      min="0"
                      defaultValue={String(product.price)}
                      required
                    />
                    <Input
                      name="discount"
                      type="number"
                      step="1"
                      min="0"
                      defaultValue={String(product.discount)}
                    />
                    <Input
                      name="stock"
                      type="number"
                      min="0"
                      defaultValue={String(product.stock)}
                    />
                    <select
                      name="status"
                      defaultValue={product.status || ""}
                      className="h-9 border rounded-lg px-2.5 text-sm"
                    >
                      <option value="">No status</option>
                      <option value="NEW">NEW</option>
                      <option value="HOT">HOT</option>
                      <option value="SALE">SALE</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <select
                      name="brandId"
                      defaultValue={product.brandId || ""}
                      className="h-9 border rounded-lg px-2.5 text-sm"
                    >
                      <option value="">No brand</option>
                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.title}
                        </option>
                      ))}
                    </select>

                    <label className="flex h-9 items-center gap-2 rounded-lg border px-3 text-sm">
                      <input
                        name="isFeatured"
                        type="checkbox"
                        defaultChecked={product.isFeatured}
                      />
                      Featured
                    </label>

                    <Input
                      type="file"
                      name="images"
                      multiple
                      accept="image/*"
                      className="h-9"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="rounded-lg border p-3 space-y-2">
                      <p className="text-sm font-semibold">Categories</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {categories.map((category) => (
                          <label
                            key={`${product.id}-${category.id}`}
                            className="text-sm inline-flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              name="categoryIds"
                              value={category.id}
                              defaultChecked={product.categories.some(
                                (item) => item.categoryId === category.id,
                              )}
                            />
                            {category.title}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border p-3 space-y-2">
                      <p className="text-sm font-semibold">Images</p>
                      <label className="text-sm inline-flex items-center gap-2">
                        <input type="checkbox" name="replaceImages" /> Replace
                        all existing images
                      </label>

                      {product.images.length > 0 ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          {product.images.slice(0, 6).map((image) => (
                            <Image
                              key={image.id}
                              src={image.imageUrl}
                              alt={product.name}
                              width={44}
                              height={44}
                              unoptimized
                              className="w-11 h-11 rounded-md object-cover border"
                            />
                          ))}
                          {product.images.length > 6 ? (
                            <span className="text-xs text-lightColor">
                              +{product.images.length - 6} more
                            </span>
                          ) : null}
                        </div>
                      ) : (
                        <p className="text-xs text-lightColor">No images yet</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" variant="outline">
                      Update Product
                    </Button>
                    <button
                      formAction={deleteProductAction}
                      className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Delete Product
                    </button>
                  </div>
                </form>
              </details>
            </div>
          ))}

          {products.length === 0 ? (
            <p className="text-sm text-lightColor">No products found.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
