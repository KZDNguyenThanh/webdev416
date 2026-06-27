"use client";

import PriceFormatter from "@/components/PriceFormatter";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  orderNumber: string;
  amount: number;
  redirectUrl: string;
}

const BANK_NAME = "Vietcombank";
const ACCOUNT_NUMBER = "0888699289";
const ACCOUNT_HOLDER = "CONG TY KEYNITY";

const InfoRow = ({
  label,
  value,
  copyable,
}: {
  label: string;
  value: string;
  copyable?: boolean;
}) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Đã sao chép");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Không thể sao chép");
    }
  };
  return (
    <div className="flex items-center justify-between gap-2 border-b py-2 last:border-b-0">
      <span className="text-sm text-black/60">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-right">{value}</span>
        {copyable && (
          <button
            type="button"
            onClick={handleCopy}
            className="text-gray-400 hover:text-brand-dark"
            aria-label={`Sao chép ${label}`}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const PaymentDialog = ({ open, orderNumber, amount, redirectUrl }: Props) => {
  const transferContent = `KEYNITY ${orderNumber}`;

  return (
    <Dialog open={open}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thông tin thanh toán</DialogTitle>
          <DialogDescription>
            Vui lòng chuyển khoản theo thông tin bên dưới. Đơn hàng sẽ được xử
            lý sau khi chúng tôi nhận được thanh toán.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center">
          {/* QR code placeholder — drop the real image at public/payment-qr.png.
              Plain <img> so we can swap to a fallback box via onError if the file
              is missing (next/image can't gracefully recover from a 404). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/payment-qr.png"
            alt="QR chuyển khoản"
            className="h-48 w-48 rounded-md border object-contain"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = "none";
              target.nextElementSibling?.classList.remove("hidden");
            }}
          />
          <div className="hidden h-48 w-48 flex-col items-center justify-center rounded-md border border-dashed text-center text-xs text-black/50">
            <span>Ảnh QR</span>
            <span>(đang cập nhật)</span>
          </div>
        </div>

        <div className="rounded-md border px-3">
          <InfoRow label="Ngân hàng" value={BANK_NAME} />
          <InfoRow label="Số tài khoản" value={ACCOUNT_NUMBER} copyable />
          <InfoRow label="Chủ tài khoản" value={ACCOUNT_HOLDER} />
          <div className="flex items-center justify-between gap-2 border-b py-2">
            <span className="text-sm text-black/60">Số tiền</span>
            <PriceFormatter
              amount={amount}
              className="text-base font-bold text-brand-dark"
            />
          </div>
          <InfoRow label="Nội dung CK" value={transferContent} copyable />
        </div>

        <Button
          className="w-full rounded-full font-semibold"
          size="lg"
          onClick={() => {
            window.location.href = redirectUrl;
          }}
        >
          Kiểm tra thanh toán
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
