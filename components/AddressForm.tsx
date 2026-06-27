"use client";

import { createAddress, updateAddress } from "@/actions/catalog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AddressDTO } from "@/lib/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  onSaved: (address: AddressDTO) => void;
  editing?: AddressDTO | null;
  trigger?: React.ReactNode;
}

const buildForm = (editing?: AddressDTO | null) => ({
  name: editing?.name ?? "",
  phone: editing?.phone ?? "",
  address: editing?.address ?? "",
  city: editing?.city ?? "",
  isDefault: editing?.default ?? false,
});

const AddressForm = ({ onSaved, editing, trigger }: Props) => {
  const isEdit = Boolean(editing);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(() => buildForm(editing));

  const handleOpenChange = (next: boolean) => {
    if (next) setForm(buildForm(editing)); // refresh fields each time it opens
    setOpen(next);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.city) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    setLoading(true);
    try {
      const saved =
        isEdit && editing
          ? await updateAddress({ id: editing.id, ...form })
          : await createAddress(form);
      onSaved(saved);
      toast.success(isEdit ? "Đã cập nhật địa chỉ!" : "Đã lưu địa chỉ mới!");
      setOpen(false);
    } catch (error) {
      console.error("Save address error:", error);
      toast.error("Không thể lưu địa chỉ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" className="w-full mt-4">
            <Plus className="mr-1 h-4 w-4" /> Thêm địa chỉ mới
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}</DialogTitle>
          <DialogDescription>
            Nhập địa chỉ và thông tin liên lạc để giao hàng.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="addr-name">Họ và tên</Label>
            <Input
              id="addr-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="addr-phone">Số điện thoại</Label>
            <Input
              id="addr-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="0901234567"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="addr-line1">Địa chỉ cụ thể</Label>
            <Input
              id="addr-line1"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Số nhà, đường, phường/xã, quận/huyện"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="addr-city">Tỉnh/Thành phố</Label>
            <Input
              id="addr-city"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="Hồ Chí Minh"
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="addr-default"
              checked={form.isDefault}
              onCheckedChange={(checked) =>
                setForm({ ...form, isDefault: Boolean(checked) })
              }
            />
            <Label htmlFor="addr-default" className="cursor-pointer">
              Đặt làm địa chỉ mặc định
            </Label>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Đang lưu…" : isEdit ? "Cập nhật" : "Lưu địa chỉ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddressForm;
