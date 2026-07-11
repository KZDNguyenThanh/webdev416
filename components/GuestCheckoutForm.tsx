"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface GuestInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
}

export type GuestErrors = Partial<Record<keyof GuestInfo, string>>;

export const emptyGuestInfo: GuestInfo = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
};

// VN mobile numbers: 10 digits starting with 0.
const PHONE_RE = /^0\d{9}$/;

export function validateGuestInfo(info: GuestInfo): GuestErrors {
  const errors: GuestErrors = {};
  if (!info.name.trim()) errors.name = "Vui lòng nhập họ tên người nhận.";
  if (!info.phone.trim()) {
    errors.phone = "Vui lòng nhập số điện thoại.";
  } else if (!PHONE_RE.test(info.phone.trim())) {
    errors.phone = "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0).";
  }
  if (!info.address.trim()) errors.address = "Vui lòng nhập địa chỉ cụ thể.";
  if (!info.city.trim()) errors.city = "Vui lòng nhập tỉnh/thành phố.";
  return errors;
}

interface Props {
  value: GuestInfo;
  onChange: (value: GuestInfo) => void;
  errors?: GuestErrors;
}

const Field = ({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="grid gap-1.5">
    <Label htmlFor={id}>
      {label}
      {hint ? (
        <span className="ml-1 text-xs font-normal text-black/50">{hint}</span>
      ) : null}
    </Label>
    {children}
    {error ? (
      <span className="text-[13px] sm:text-xs text-red-600">{error}</span>
    ) : null}
  </div>
);

const GuestCheckoutForm = ({ value, onChange, errors }: Props) => {
  const set = (key: keyof GuestInfo) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...value, [key]: e.target.value });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin giao hàng</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Field id="guest-name" label="Họ tên người nhận" error={errors?.name}>
          <Input
            id="guest-name"
            value={value.name}
            onChange={set("name")}
            placeholder="Nguyễn Văn A"
          />
        </Field>
        <Field id="guest-phone" label="Số điện thoại" error={errors?.phone}>
          <Input
            id="guest-phone"
            type="tel"
            value={value.phone}
            onChange={set("phone")}
            placeholder="0901234567"
          />
        </Field>
        <Field
          id="guest-email"
          label="Email"
          hint="(không bắt buộc — để nhận hóa đơn điện tử)"
          error={errors?.email}
        >
          <Input
            id="guest-email"
            type="email"
            value={value.email}
            onChange={set("email")}
            placeholder="email@example.com"
          />
        </Field>
        <Field id="guest-address" label="Địa chỉ cụ thể" error={errors?.address}>
          <Input
            id="guest-address"
            value={value.address}
            onChange={set("address")}
            placeholder="Số nhà, đường, phường/xã, quận/huyện"
          />
        </Field>
        <Field id="guest-city" label="Tỉnh/Thành phố" error={errors?.city}>
          <Input
            id="guest-city"
            value={value.city}
            onChange={set("city")}
            placeholder="Hồ Chí Minh"
          />
        </Field>
      </CardContent>
    </Card>
  );
};

export default GuestCheckoutForm;
