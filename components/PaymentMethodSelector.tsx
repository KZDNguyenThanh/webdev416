"use client";

import React from "react";
import { Banknote, QrCode } from "lucide-react";
import type { PaymentMethod } from "@/actions/createCheckoutSession";

interface Props {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

const OPTIONS: {
  value: PaymentMethod;
  label: string;
  hint: string;
  Icon: typeof QrCode;
}[] = [
  {
    value: "BANK",
    label: "Chuyển khoản QR",
    hint: "Quét mã VietQR để thanh toán ngay",
    Icon: QrCode,
  },
  {
    value: "COD",
    label: "Thanh toán khi nhận hàng",
    hint: "Trả tiền mặt cho shipper khi nhận hàng (COD)",
    Icon: Banknote,
  },
];

const PaymentMethodSelector = ({ value, onChange }: Props) => {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-brand-dark">
        Phương thức thanh toán
      </p>
      <div className="space-y-2">
        {OPTIONS.map(({ value: optionValue, label, hint, Icon }) => {
          const active = value === optionValue;
          return (
            <label
              key={optionValue}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 hoverEffect ${
                active
                  ? "border-signal bg-signal-soft ring-1 ring-signal"
                  : "border-brand-muted hover:border-brand-accent"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={optionValue}
                checked={active}
                onChange={() => onChange(optionValue)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 hoverEffect ${
                  active ? "border-signal" : "border-brand-muted"
                }`}
              >
                {active && <span className="h-2 w-2 rounded-full bg-signal" />}
              </span>
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-deep" />
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-brand-dark">
                  {label}
                </span>
                <span className="text-xs text-lightText">{hint}</span>
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
