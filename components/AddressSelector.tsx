"use client";

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

interface Props {
  addresses: AddressDTO[];
  selected: AddressDTO | null;
  onSelect: (address: AddressDTO) => void;
  onCreated: (address: AddressDTO) => void;
}

const AddressSelector = ({
  addresses,
  selected,
  onSelect,
  onCreated,
}: Props) => {
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
                className={`flex items-start space-x-2 mb-4 ${
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
                  </span>
                  <span className="text-sm text-black/60">
                    {address.address}
                    {address.city ? `, ${address.city}` : ""}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <p className="text-sm text-black/60">
            Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ giao hàng.
          </p>
        )}
        <AddressForm onCreated={onCreated} />
      </CardContent>
    </Card>
  );
};

export default AddressSelector;
