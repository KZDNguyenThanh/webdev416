import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone, MessageCircleQuestion } from "lucide-react";
import Container from "@/components/Container";
import ContactForm from "@/components/ContactForm";
import PageHero from "@/components/PageHero";
import SocialMedia from "@/components/SocialMedia";

export const metadata: Metadata = {
  title: "Liên hệ",
  description:
    "Liên hệ với KEYNITY - đội ngũ tư vấn bàn phím cơ, keycap, switch luôn sẵn sàng hỗ trợ bạn.",
};

const contactInfo = [
  {
    icon: MapPin,
    label: "Ghé thăm",
    value: "TP. Hồ Chí Minh, Việt Nam",
    href: "https://maps.google.com/?q=Ho+Chi+Minh+City",
  },
  {
    icon: Phone,
    label: "Gọi cho chúng tôi",
    value: "+84 914 618 305",
    href: "tel:+84914618305",
  },
  {
    icon: Mail,
    label: "Email",
    value: "keynity.shop@gmail.com",
    href: "mailto:keynity.shop@gmail.com",
  },
  {
    icon: Clock,
    label: "Giờ làm việc",
    value: "T2 - CN: 7:00 - 17:00",
    href: null,
  },
];

const ContactPage = () => {
  return (
    <div className="bg-brand-bg">
      <PageHero
        eyebrow="Kết nối với KEYNITY"
        title="Mọi cú gõ hoàn hảo bắt đầu từ một câu hỏi"
        subtitle="Cần tư vấn layout, switch hay tình trạng đơn hàng? Đội ngũ KEYNITY phản hồi trong vòng 24 giờ làm việc."
        size="lg"
      />

      <Container className="py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-12">
          {/* Info column */}
          <div className="space-y-4 lg:col-span-2">
            {contactInfo.map(({ icon: Icon, label, value, href }) => {
              const inner = (
                <div className="keycap-hover flex items-start gap-4 rounded-xl border border-brand-muted bg-white p-5">
                  <span className="mt-0.5 rounded-lg bg-brand-soft p-2.5 text-brand-dark">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
                      {label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-brand-dark">
                      {value}
                    </p>
                  </div>
                </div>
              );
              return href ? (
                <a key={label} href={href} className="block">
                  {inner}
                </a>
              ) : (
                <div key={label}>{inner}</div>
              );
            })}

            <div className="rounded-xl border border-brand-muted bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
                Theo dõi chúng tôi
              </p>
              <SocialMedia
                className="mt-3 text-brand-accent"
                iconClassName="border-brand-muted hover:border-brand-dark hover:text-brand-dark"
                tooltipClassName="bg-brand-dark text-white"
              />
            </div>

            <Link
              href="/faqs"
              className="keycap-hover flex items-center gap-4 rounded-xl border border-dashed border-brand-muted bg-brand-soft p-5"
            >
              <span className="rounded-lg bg-white p-2.5 text-brand-dark">
                <MessageCircleQuestion className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-brand-dark">
                  Câu hỏi thường gặp
                </p>
                <p className="mt-0.5 text-xs text-brand-accent">
                  Câu trả lời nhanh cho những thắc mắc phổ biến →
                </p>
              </div>
            </Link>
          </div>

          {/* Form column */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-brand-muted bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold tracking-tight text-brand-dark">
                Gửi tin nhắn cho chúng tôi
              </h2>
              <p className="mt-1.5 text-sm text-brand-accent">
                Điền thông tin bên dưới, chúng tôi sẽ liên hệ lại sớm nhất.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ContactPage;
