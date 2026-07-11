import {
  ACCOUNT_HOLDER,
  ACCOUNT_NUMBER,
  BANK_BIN,
} from "@/lib/constants/payment";

// Sinh URL ảnh QR động qua VietQR.io. Ảnh đã nhúng sẵn số tiền + nội dung
// chuyển khoản nên khách quét là ra đúng số tiền, không phải gõ tay.
// Tham khảo: https://www.vietqr.io/danh-sach-api/lay-ma-qr/
export function buildVietQrUrl({
  amount,
  addInfo,
}: {
  amount: number;
  addInfo: string;
}): string {
  const params = new URLSearchParams({
    amount: String(Math.round(amount)),
    addInfo,
    accountName: ACCOUNT_HOLDER,
  });
  return `https://img.vietqr.io/image/${BANK_BIN}-${ACCOUNT_NUMBER}-compact2.png?${params.toString()}`;
}
