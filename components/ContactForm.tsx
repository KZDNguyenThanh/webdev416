"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { sendContactMessage } from "@/actions/contact";

const subjects = [
  "Tư vấn sản phẩm",
  "Đơn hàng & vận chuyển",
  "Bảo hành / đổi trả",
  "Hợp tác / khác",
];

const ContactForm = () => {
  const [subject, setSubject] = useState(subjects[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setLoading(true);
    const res = await sendContactMessage({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      subject,
      message: String(data.get("message") ?? ""),
    });
    setLoading(false);
    if (res.ok) {
      form.reset();
      setSubject(subjects[0]);
      toast.success("Đã gửi! KEYNITY sẽ phản hồi trong vòng 24 giờ.");
    } else {
      toast.error(res.error ?? "Không gửi được tin nhắn, vui lòng thử lại.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
            Họ và tên
          </label>
          <input
            required
            name="name"
            placeholder="Nguyễn Văn A"
            className="w-full rounded-lg border border-brand-muted bg-brand-soft px-4 py-2.5 text-base sm:text-sm text-brand-dark outline-none transition-colors focus:border-brand-dark"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
            Số điện thoại
          </label>
          <input
            required
            name="phone"
            placeholder="09xx xxx xxx"
            className="w-full rounded-lg border border-brand-muted bg-brand-soft px-4 py-2.5 text-base sm:text-sm text-brand-dark outline-none transition-colors focus:border-brand-dark"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
          Email
        </label>
        <input
          required
          type="email"
          name="email"
          placeholder="ban@email.com"
          className="w-full rounded-lg border border-brand-muted bg-brand-soft px-4 py-2.5 text-base sm:text-sm text-brand-dark outline-none transition-colors focus:border-brand-dark"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
          Chủ đề
        </label>
        <div className="flex flex-wrap gap-2">
          {subjects.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSubject(s)}
              className={`rounded-full border px-3.5 py-2 text-[13px] sm:text-xs font-medium transition-all ${
                subject === s
                  ? "border-brand-dark bg-brand-dark text-white"
                  : "border-brand-muted bg-white text-brand-accent hover:border-brand-dark"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
          Nội dung
        </label>
        <textarea
          required
          name="message"
          rows={5}
          placeholder="Bạn cần KEYNITY hỗ trợ điều gì?"
          className="w-full resize-none rounded-lg border border-brand-muted bg-brand-soft px-4 py-2.5 text-base sm:text-sm text-brand-dark outline-none transition-colors focus:border-brand-dark"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-dark px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-deep disabled:opacity-60 sm:w-auto"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        )}
        {loading ? "Đang gửi..." : "Gửi tin nhắn"}
      </button>
    </form>
  );
};

export default ContactForm;
