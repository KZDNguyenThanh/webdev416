"use server";

import { sendContactMessageEmail } from "@/lib/email/contactMessage";

export interface ContactResult {
  ok: boolean;
  error?: string;
}

// Nhận tin nhắn từ trang liên hệ và chuyển tới hộp thư của shop.
export async function sendContactMessage(formData: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}): Promise<ContactResult> {
  const name = formData.name?.trim();
  const email = formData.email?.trim();
  const phone = formData.phone?.trim();
  const subject = formData.subject?.trim();
  const message = formData.message?.trim();

  if (!name || !email || !message) {
    return { ok: false, error: "Vui lòng điền đầy đủ họ tên, email và nội dung." };
  }

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailValid) {
    return { ok: false, error: "Email không hợp lệ." };
  }

  try {
    await sendContactMessageEmail({
      name,
      email,
      phone: phone || "(không cung cấp)",
      subject: subject || "Liên hệ",
      message,
    });
    return { ok: true };
  } catch (err) {
    console.error("[contact] gửi email thất bại:", err);
    return { ok: false, error: "Không gửi được tin nhắn, vui lòng thử lại sau." };
  }
}
