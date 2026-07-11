import { sendMail } from "@/lib/email/mailer";

export interface ContactMessageInput {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(input: ContactMessageInput): string {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:8px 12px;color:#71717a;white-space:nowrap;vertical-align:top">${label}</td>
      <td style="padding:8px 12px;color:#111;font-weight:500">${value}</td>
    </tr>`;

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#111">
    <h2 style="margin-bottom:4px">Tin nhắn liên hệ mới từ KEYNITY</h2>
    <p style="color:#555;margin-top:0">Một khách hàng vừa gửi tin nhắn qua trang liên hệ.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;border:1px solid #eee;border-radius:8px">
      ${row("Họ tên", escapeHtml(input.name))}
      ${row("Email", escapeHtml(input.email))}
      ${row("Điện thoại", escapeHtml(input.phone))}
      ${row("Chủ đề", escapeHtml(input.subject))}
    </table>
    <div style="padding:16px;border:1px solid #eee;border-radius:8px;white-space:pre-wrap;line-height:1.6">${escapeHtml(
      input.message,
    )}</div>
    <p style="color:#888;font-size:12px;margin-top:20px">
      Trả lời trực tiếp email này để phản hồi khách hàng (${escapeHtml(input.email)}).
    </p>
  </div>`;
}

// Gửi tin nhắn liên hệ tới hộp thư của shop. reply-to đặt bằng email khách để
// bấm "Trả lời" là gửi thẳng cho họ.
export async function sendContactMessageEmail(
  input: ContactMessageInput,
): Promise<void> {
  const inbox = process.env.MAIL_FROM || process.env.SMTP_USER;
  if (!inbox) return;

  await sendMail({
    to: inbox,
    subject: `[Liên hệ] ${input.subject} — ${input.name}`,
    html: buildHtml(input),
    replyTo: input.email,
  });
}
