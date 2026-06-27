"use client";

import { deleteAddress } from "@/actions/catalog";
import AddressForm from "@/components/AddressForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { AddressDTO } from "@/lib/types";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  addresses: AddressDTO[];
  selected: AddressDTO | null;
  onSelect: (address: AddressDTO) => void;
  onCreated: (address: AddressDTO) => void;
  onUpdated: (address: AddressDTO) => void;
  onDeleted: (id: string) => void;
}

const AddressSelector = ({
  addresses,
  selected,
  onSelect,
  onCreated,
  onUpdated,
  onDeleted,
}: Props) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (address: AddressDTO) => {
    const confirmed = window.confirm(
      `Xóa địa chỉ "${address.name} - ${address.address}"?`,
    );
    if (!confirmed) return;
    setDeletingId(address.id);
    try {
      await deleteAddress(address.id);
      onDeleted(address.id);
      toast.success("Đã xóa địa chỉ!");
    } catch (error) {
      console.error("Delete address error:", error);
      toast.error("Không thể xóa địa chỉ. Vui lòng thử lại.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Địa chỉ giao hàng</CardTitle>
      </CardHeader>
      <CardContent>
        {addresses.length > 0 ? (
          <RadioGroup
            value={selected?.id}
            onValueChange={(value) => {
              const next = addresses.find((addr) => addr.id === value);
              if (next) onSelect(next);
            }}
          >
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`flex items-start gap-2 mb-3 border-b pb-3 last:border-b-0 ${
                  selected?.id === address.id ? "text-shop_dark_green" : ""
                }`}
              >
                <RadioGroupItem
                  value={address.id}
                  id={`address-${address.id}`}
                  className="mt-1"
                />
                <Label
                  htmlFor={`address-${address.id}`}
                  className="grid gap-1.5 flex-1 cursor-pointer"
                >
                  <span className="font-semibold">
                    {address.name}
                    {address.phone ? ` · ${address.phone}` : ""}
                    {address.default ? (
                      <span className="ml-2 rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-medium text-brand-dark">
                        Mặc định
                      </span>
                    ) : null}
                  </span>
                  <span className="text-sm text-black/60">
                    {address.address}
                    {address.city ? `, ${address.city}` : ""}
                  </span>
                </Label>
                <div className="flex items-center gap-1">
                  <AddressForm
                    editing={address}
                    onSaved={onUpdated}
                    trigger={
                      <button
                        type="button"
                        aria-label="Sửa địa chỉ"
                        className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-black"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    }
                  />
                  <button
                    type="button"
                    aria-label="Xóa địa chỉ"
                    disabled={deletingId === address.id}
                    onClick={() => handleDelete(address)}
                    className="rounded-md p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <p className="text-sm text-black/60">
            Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ giao hàng.
          </p>
        )}
        <AddressForm onSaved={onCreated} />
      </CardContent>
    </Card>
  );
};

export default AddressSelector;
