"use client";

import { createProductsBulkAction } from "@/app/(admin)/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type BrandOption = { id: string; title: string };
type CategoryOption = { id: string; title: string };

type Row = {
  name: string;
  slug: string;
  description: string;
  price: string;
  discount: string;
  stock: string;
  status: string;
  brandId: string;
  isFeatured: boolean;
  categoryIds: string[];
  imageUrls: string;
  files: File[];
};

const emptyRow = (): Row => ({
  name: "",
  slug: "",
  description: "",
  price: "",
  discount: "",
  stock: "",
  status: "",
  brandId: "",
  isFeatured: false,
  categoryIds: [],
  imageUrls: "",
  files: [],
});

interface Props {
  brands: BrandOption[];
  categories: CategoryOption[];
}

const BulkProductForm = ({ brands, categories }: Props) => {
  const [rows, setRows] = useState<Row[]>([emptyRow(), emptyRow(), emptyRow()]);
  const [loading, setLoading] = useState(false);

  const updateRow = (index: number, patch: Partial<Row>) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  };

  const toggleCategory = (index: number, categoryId: string) => {
    setRows((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;
        const has = row.categoryIds.includes(categoryId);
        return {
          ...row,
          categoryIds: has
            ? row.categoryIds.filter((id) => id !== categoryId)
            : [...row.categoryIds, categoryId],
        };
      }),
    );
  };

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);
  const removeRow = (index: number) =>
    setRows((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== index) : prev,
    );

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("rowCount", String(rows.length));
      rows.forEach((row, i) => {
        fd.append(`name_${i}`, row.name);
        fd.append(`slug_${i}`, row.slug);
        fd.append(`description_${i}`, row.description);
        fd.append(`price_${i}`, row.price);
        fd.append(`discount_${i}`, row.discount);
        fd.append(`stock_${i}`, row.stock);
        fd.append(`status_${i}`, row.status);
        fd.append(`brandId_${i}`, row.brandId);
        if (row.isFeatured) fd.append(`isFeatured_${i}`, "on");
        row.categoryIds.forEach((id) => fd.append(`categoryIds_${i}`, id));
        fd.append(`imageUrls_${i}`, row.imageUrls);
        row.files.forEach((file) => fd.append(`images_${i}`, file));
      });

      const result = await createProductsBulkAction(fd);

      if (result.created > 0) {
        toast.success(`Đã tạo ${result.created} sản phẩm`);
      }
      if (result.failed > 0) {
        toast.error(
          `${result.failed} dòng lỗi: ${result.errors.slice(0, 3).join("; ")}`,
        );
      }
      if (result.created === 0 && result.failed === 0) {
        toast.error("Chưa nhập sản phẩm nào.");
      }
      if (result.created > 0) {
        setRows([emptyRow(), emptyRow(), emptyRow()]);
      }
    } catch (error) {
      console.error("Bulk create error:", error);
      toast.error("Không thể tạo sản phẩm. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {rows.map((row, i) => (
        <div
          key={i}
          className="rounded-lg border border-darkBlue/10 bg-zinc-50/40 p-3 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-darkColor">
              Sản phẩm #{i + 1}
            </span>
            <button
              type="button"
              onClick={() => removeRow(i)}
              className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 disabled:opacity-40"
              disabled={rows.length <= 1}
            >
              <Trash2 className="h-3.5 w-3.5" /> Xóa dòng
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <Input
              placeholder="Tên sản phẩm *"
              value={row.name}
              onChange={(e) => updateRow(i, { name: e.target.value })}
            />
            <Input
              placeholder="Slug (tùy chọn)"
              value={row.slug}
              onChange={(e) => updateRow(i, { slug: e.target.value })}
            />
            <Input
              placeholder="Mô tả"
              value={row.description}
              onChange={(e) => updateRow(i, { description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
            <Input
              type="number"
              min="0"
              step="1"
              placeholder="Giá (VND) *"
              value={row.price}
              onChange={(e) => updateRow(i, { price: e.target.value })}
            />
            <Input
              type="number"
              min="0"
              step="1"
              placeholder="Giảm (%)"
              value={row.discount}
              onChange={(e) => updateRow(i, { discount: e.target.value })}
            />
            <Input
              type="number"
              min="0"
              placeholder="Kho"
              value={row.stock}
              onChange={(e) => updateRow(i, { stock: e.target.value })}
            />
            <select
              className="h-9 border rounded-lg px-2.5 text-sm"
              value={row.status}
              onChange={(e) => updateRow(i, { status: e.target.value })}
            >
              <option value="">Trạng thái</option>
              <option value="NEW">NEW</option>
              <option value="HOT">HOT</option>
              <option value="SALE">SALE</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <select
              className="h-9 border rounded-lg px-2.5 text-sm"
              value={row.brandId}
              onChange={(e) => updateRow(i, { brandId: e.target.value })}
            >
              <option value="">Không thương hiệu</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.title}
                </option>
              ))}
            </select>
            <label className="flex h-9 items-center gap-2 rounded-lg border bg-white px-3 text-sm">
              <input
                type="checkbox"
                checked={row.isFeatured}
                onChange={(e) => updateRow(i, { isFeatured: e.target.checked })}
              />
              Nổi bật
            </label>
          </div>

          <div className="rounded-lg border bg-white p-2.5 space-y-1.5">
            <p className="text-xs font-semibold text-lightColor">Danh mục</p>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="inline-flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={row.categoryIds.includes(category.id)}
                    onChange={() => toggleCategory(i, category.id)}
                  />
                  {category.title}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <Input
              placeholder="Link ảnh (nhiều link cách nhau dấu phẩy)"
              value={row.imageUrls}
              onChange={(e) => updateRow(i, { imageUrls: e.target.value })}
            />
            <Input
              type="file"
              multiple
              accept="image/*"
              className="h-9"
              onChange={(e) =>
                updateRow(i, {
                  files: e.target.files ? Array.from(e.target.files) : [],
                })
              }
            />
          </div>
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" onClick={addRow}>
          <Plus className="h-4 w-4" /> Thêm dòng
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="min-w-40"
        >
          {loading ? "Đang tạo…" : "Tạo tất cả"}
        </Button>
      </div>
    </div>
  );
};

export default BulkProductForm;
