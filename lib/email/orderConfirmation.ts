import { sendMail } from "@/lib/email/mailer";
import { buildVietQrUrl } from "@/lib/payment/vietqr";
import {
  ACCOUNT_HOLDER,
  ACCOUNT_NUMBER,
  BANK_NAME,
} from "@/lib/constants/payment";

export interface OrderConfirmationLine {
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderConfirmationInput {
  to: string;
  orderNumber: string;
  customerName: string;
  items: OrderConfirmationLine[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: "BANK" | "COD";
}

function formatVnd(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function buildHtml(input: OrderConfirmationInput): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const trackUrl = `${appUrl}/orders/track?orderNumber=${encodeURIComponent(input.orderNumber)}`;
  const isCod = input.paymentMethod === "COD";
  const transferContent = `KEYNITY ${input.orderNumber}`;
  const qrUrl = buildVietQrUrl({
    amount: input.totalAmount,
    addInfo: transferContent,
  });

  const intro = isCod
    ? "đã được ghi nhận và sẽ được giao và thu tiền khi nhận hàng."
    : "đã được ghi nhận và đang chờ thanh toán.";

  const paymentBlock = isCod
    ? `
    <div style="margin:24px 0;padding:16px;border:1px solid #eee;border-radius:8px">
      <h3 style="margin-top:0">Thanh toán khi nhận hàng (COD)</h3>
      <p style="margin:4px 0">
        Vui lòng chuẩn bị <strong>${formatVnd(input.totalAmount)}</strong> tiền mặt để thanh toán cho shipper khi nhận hàng.
      </p>
    </div>`
    : `
    <div style="margin:24px 0;padding:16px;border:1px solid #eee;border-radius:8px">
      <h3 style="margin-top:0">Thông tin thanh toán (chuyển khoản)</h3>
      <p style="margin:4px 0">Ngân hàng: <strong>${BANK_NAME}</strong></p>
      <p style="margin:4px 0">Số tài khoản: <strong>${ACCOUNT_NUMBER}</strong></p>
      <p style="margin:4px 0">Chủ tài khoản: <strong>${ACCOUNT_HOLDER}</strong></p>
      <p style="margin:4px 0">Số tiền: <strong>${formatVnd(input.totalAmount)}</strong></p>
      <p style="margin:4px 0">Nội dung CK: <strong>${transferContent}</strong></p>
      <div style="margin-top:12px">
        <img src="${qrUrl}" alt="QR chuyển khoản" width="180" height="180" style="border:1px solid #eee;border-radius:8px" />
      </div>
    </div>`;

  const rows = input.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${item.productName}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${formatVnd(item.unitPrice)}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${formatVnd(item.lineTotal)}</td>
        </tr>`,
    )
    .join("");

  const discountRow =
    input.discountAmount > 0
      ? `<tr><td style="padding:4px 8px">Giảm giá</td><td style="padding:4px 8px;text-align:right">- ${formatVnd(input.discountAmount)}</td></tr>`
      : "";

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#111">
    <h2 style="margin-bottom:4px">Cảm ơn bạn đã đặt hàng tại KEYNITY!</h2>
    <p style="color:#555;margin-top:0">
      Xin chào ${input.customerName}, đơn hàng <strong>${input.orderNumber}</strong> của bạn ${intro}
    </p>

    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      <thead>
        <tr style="background:#f5f5f5">
          <th style="padding:8px;text-align:left">Sản phẩm</th>
          <th style="padding:8px;text-align:center">SL</th>
          <th style="padding:8px;text-align:right">Đơn giá</th>
          <th style="padding:8px;text-align:right">Thành tiền</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <table style="width:100%;max-width:320px;margin-left:auto;border-collapse:collapse">
      <tr><td style="padding:4px 8px">Tạm tính</td><td style="padding:4px 8px;text-align:right">${formatVnd(input.subtotal)}</td></tr>
      ${discountRow}
      <tr><td style="padding:4px 8px">Phí vận chuyển</td><td style="padding:4px 8px;text-align:right">${formatVnd(input.shippingFee)}</td></tr>
      <tr style="font-weight:bold;border-top:2px solid #111">
        <td style="padding:8px">Tổng cộng</td>
        <td style="padding:8px;text-align:right">${formatVnd(input.totalAmount)}</td>
      </tr>
    </table>

    ${paymentBlock}

    <p>
      Bạn có thể tra cứu trạng thái đơn tại:
      <a href="${trackUrl}">${trackUrl}</a>
    </p>
    <p style="color:#888;font-size:12px">Email này được gửi tự động, vui lòng không trả lời.</p>
  </div>`;
}

export async function sendOrderConfirmationEmail(
  input: OrderConfirmationInput,
): Promise<void> {
  await sendMail({
    to: input.to,
    subject: `Xác nhận đơn hàng ${input.orderNumber} — KEYNITY`,
    html: buildHtml(input),
  });
}
