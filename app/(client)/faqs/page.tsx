import type { Metadata } from "next";
import Link from "next/link";
import { LifeBuoy } from "lucide-react";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Câu hỏi thường gặp",
  description:
    "Giải đáp các thắc mắc về sản phẩm, đặt hàng, thanh toán, vận chuyển và bảo hành tại KEYNITY.",
};

const faqGroups = [
  {
    group: "Sản phẩm",
    items: [
      {
        q: "Bàn phím KEYNITY có hỗ trợ hot-swap không?",
        a: "Phần lớn bàn phím trong danh mục đều dùng socket hot-swap, cho phép bạn thay switch mà không cần hàn. Thông tin chi tiết luôn được ghi rõ trong phần mô tả của từng sản phẩm.",
      },
      {
        q: "Keycap và switch có tương thích với bàn phím của tôi không?",
        a: "Keycap của chúng tôi theo chuẩn MX phổ biến, tương thích với hầu hết switch cơ. Với switch, hãy kiểm tra bàn phím của bạn có hỗ trợ 3-pin hoặc 5-pin. Nếu chưa chắc, cứ nhắn cho đội ngũ tư vấn.",
      },
      {
        q: "Sản phẩm có được test trước khi giao không?",
        a: "Mọi bàn phím đều được kiểm tra từng phím và vệ sinh trước khi đóng gói, đảm bảo đến tay bạn trong tình trạng hoàn hảo.",
      },
    ],
  },
  {
    group: "Đặt hàng & Thanh toán",
    items: [
      {
        q: "KEYNITY hỗ trợ những hình thức thanh toán nào?",
        a: "Bạn có thể thanh toán bằng chuyển khoản QR hoặc thanh toán khi nhận hàng (COD). Chọn phương thức phù hợp ngay ở bước thanh toán.",
      },
      {
        q: "Tôi có cần tạo tài khoản để mua hàng không?",
        a: "Không bắt buộc. Bạn có thể đặt hàng với tư cách khách, chỉ cần điền thông tin giao hàng. Tuy nhiên tạo tài khoản sẽ giúp bạn theo dõi đơn và lưu địa chỉ dễ dàng hơn.",
      },
      {
        q: "Làm sao để theo dõi đơn hàng của tôi?",
        a: "Vào trang Đơn hàng khi đã đăng nhập, hoặc dùng mục Tra cứu đơn để kiểm tra trạng thái đơn hàng bằng mã đơn.",
      },
    ],
  },
  {
    group: "Vận chuyển",
    items: [
      {
        q: "Thời gian giao hàng mất bao lâu?",
        a: "Nội thành TP.HCM thường nhận trong 1-2 ngày, các tỉnh thành khác từ 2-5 ngày làm việc tùy khu vực.",
      },
      {
        q: "Phí vận chuyển được tính như thế nào?",
        a: "Phí vận chuyển được hiển thị rõ ở bước thanh toán dựa trên địa chỉ nhận hàng, trước khi bạn xác nhận đặt đơn.",
      },
    ],
  },
  {
    group: "Đổi trả & Bảo hành",
    items: [
      {
        q: "Chính sách đổi trả của KEYNITY ra sao?",
        a: "Bạn được đổi trả trong vòng 7 ngày kể từ khi nhận hàng nếu sản phẩm còn nguyên tem, phụ kiện và chưa qua sử dụng.",
      },
      {
        q: "Sản phẩm có được bảo hành không?",
        a: "Bàn phím và phụ kiện điện tử được bảo hành theo chính sách từng dòng sản phẩm. Khi gặp lỗi kỹ thuật, hãy liên hệ để được hỗ trợ kiểm tra và xử lý.",
      },
    ],
  },
];

const FaqsPage = () => {
  return (
    <div className="bg-brand-bg">
      <PageHero
        eyebrow="Trung tâm trợ giúp"
        title="Câu hỏi thường gặp"
        subtitle="Những thắc mắc phổ biến nhất về sản phẩm, đặt hàng và dịch vụ tại KEYNITY. Không thấy câu trả lời? Chúng tôi luôn ở đây."
      />

      <Container className="py-14">
        <div className="mx-auto max-w-3xl space-y-10">
          {faqGroups.map(({ group, items }) => (
            <section key={group}>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold tracking-tight text-brand-dark">
                <span className="h-4 w-1 rounded-full bg-brand-dark" />
                {group}
              </h2>
              <Accordion
                type="single"
                collapsible
                className="rounded-2xl border border-brand-muted bg-white px-5 shadow-sm"
              >
                {items.map(({ q, a }) => (
                  <AccordionItem
                    key={q}
                    value={q}
                    className="border-brand-muted"
                  >
                    <AccordionTrigger className="text-base font-semibold text-brand-dark hover:no-underline">
                      {q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-6 text-brand-accent">
                      {a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}

          {/* CTA */}
          <div className="flex flex-col items-start gap-4 rounded-2xl border border-brand-muted bg-white p-7 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="rounded-lg bg-brand-soft p-2.5 text-brand-dark">
                <LifeBuoy className="h-5 w-5" />
              </span>
              <div>
                <p className="text-base font-semibold text-brand-dark">
                  Vẫn chưa tìm thấy câu trả lời?
                </p>
                <p className="mt-0.5 text-sm text-brand-accent">
                  Đội ngũ KEYNITY sẵn sàng hỗ trợ bạn trực tiếp.
                </p>
              </div>
            </div>
            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-brand-dark px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-deep"
            >
              Liên hệ ngay
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default FaqsPage;
