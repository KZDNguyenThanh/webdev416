import nodemailer, { type Transporter } from "nodemailer";

// Lazily-built SMTP transporter. Email is a best-effort side channel, so when
// credentials are missing we simply skip sending instead of crashing checkout.
let transporter: Transporter | null = null;
let warnedMissingConfig = false;

function getTransporter(): Transporter | null {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    if (!warnedMissingConfig) {
      console.warn(
        "[mailer] SMTP chưa được cấu hình (SMTP_HOST/SMTP_USER/SMTP_PASS) — bỏ qua gửi email.",
      );
      warnedMissingConfig = true;
    }
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // 465 = SSL, 587 = STARTTLS
      auth: { user, pass },
    });
  }
  return transporter;
}

export async function sendMail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<void> {
  const tx = getTransporter();
  if (!tx) return;

  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  await tx.sendMail({ from, to, subject, html, replyTo });
}
