import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng",
  description:
    "Điều khoản và điều kiện sử dụng dịch vụ, mua hàng tại KEYNITY - bàn phím cơ và phụ kiện.",
};

const sections = [
  {
    title: "1. Giới thiệu",
    body: [
      "Chào mừng bạn đến với KEYNITY. Khi truy cập và mua sắm tại website của chúng tôi, bạn đồng ý tuân thủ các điều khoản và điều kiện dưới đây. Vui lòng đọc kỹ trước khi sử dụng dịch vụ.",
      "KEYNITY chuyên cung cấp bàn phím cơ, keycap, switch và các phụ kiện liên quan. Chúng tôi có quyền cập nhật điều khoản bất cứ lúc nào, và các thay đổi có hiệu lực ngay khi được đăng tải.",
    ],
  },
  {
    title: "2. Tài khoản khách hàng",
    body: [
      "Bạn có thể mua hàng với tư cách khách hoặc tạo tài khoản. Khi tạo tài khoản, bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động phát sinh dưới tài khoản của mình.",
      "Vui lòng cung cấp thông tin chính xác, đầy đủ để chúng tôi xử lý đơn hàng và liên hệ khi cần thiết.",
    ],
  },
  {
    title: "3. Đặt hàng & Giá cả",
    body: [
      "Mọi đơn hàng chỉ được xác nhận sau khi bạn hoàn tất bước thanh toán hoặc chọn thanh toán khi nhận hàng (COD). Giá sản phẩm được hiển thị bằng VND và đã bao gồm các khoản áp dụng theo quy định.",
      "Chúng tôi có quyền từ chối hoặc huỷ đơn trong trường hợp sản phẩm hết hàng, có sai sót về giá hoặc nghi ngờ giao dịch gian lận. Khi đó, khoản tiền đã thanh toán (nếu có) sẽ được hoàn lại đầy đủ.",
    ],
  },
  {
    title: "4. Thanh toán",
    body: [
      "KEYNITY hỗ trợ thanh toán qua chuyển khoản QR và thanh toán khi nhận hàng (COD). Với chuyển khoản, vui lòng ghi đúng nội dung được cung cấp để đơn hàng được đối soát nhanh chóng.",
    ],
  },
  {
    title: "5. Vận chuyển",
    body: [
      "Thời gian và phí vận chuyển được tính dựa trên địa chỉ nhận hàng và hiển thị rõ trước khi bạn xác nhận đặt đơn. KEYNITY không chịu trách nhiệm với các chậm trễ phát sinh từ đơn vị vận chuyển hoặc yếu tố bất khả kháng.",
    ],
  },
  {
    title: "6. Đổi trả & Bảo hành",
    body: [
      "Bạn được đổi trả trong vòng 7 ngày kể từ khi nhận hàng nếu sản phẩm còn nguyên tem, phụ kiện và chưa qua sử dụng. Sản phẩm điện tử được bảo hành theo chính sách của từng dòng sản phẩm.",
      "Với sản phẩm lỗi kỹ thuật do nhà sản xuất, vui lòng liên hệ để được hỗ trợ kiểm tra và xử lý.",
    ],
  },
  {
    title: "7. Quyền sở hữu trí tuệ",
    body: [
      "Toàn bộ nội dung trên website — bao gồm logo, hình ảnh, văn bản và thiết kế — thuộc quyền sở hữu của KEYNITY. Bạn không được sao chép, phân phối hoặc sử dụng cho mục đích thương mại khi chưa có sự đồng ý bằng văn bản.",
    ],
  },
  {
    title: "8. Giới hạn trách nhiệm",
    body: [
      "KEYNITY nỗ lực đảm bảo thông tin sản phẩm chính xác, tuy nhiên không cam kết website luôn hoạt động không gián đoạn hay không có sai sót. Chúng tôi không chịu trách nhiệm với thiệt hại gián tiếp phát sinh từ việc sử dụng website.",
    ],
  },
  {
    title: "9. Liên hệ",
    body: [
      "Mọi thắc mắc về điều khoản sử dụng, vui lòng liên hệ qua email keynity.shop@gmail.com hoặc trang liên hệ của chúng tôi.",
    ],
  },
];

const TermsPage = () => {
  return (
    <div className="bg-brand-bg">
      <PageHero
        eyebrow="Pháp lý"
        title="Điều khoản sử dụng"
        subtitle="Cập nhật lần cuối: tháng 7, 2026. Vui lòng đọc kỹ các điều khoản dưới đây khi sử dụng dịch vụ của KEYNITY."
      />

      <Container className="py-14">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-brand-muted bg-white p-7 shadow-sm sm:p-10">
            <div className="space-y-9">
              {sections.map(({ title, body }) => (
                <section key={title}>
                  <h2 className="text-lg font-bold tracking-tight text-brand-dark">
                    {title}
                  </h2>
                  <div className="mt-2.5 space-y-3">
                    {body.map((p, i) => (
                      <p
                        key={i}
                        className="text-sm leading-7 text-brand-accent"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-10 border-t border-brand-muted pt-6 text-sm text-brand-accent">
              Có câu hỏi về điều khoản?{" "}
              <Link
                href="/contact"
                className="font-semibold text-brand-dark underline underline-offset-4 hover:text-brand-deep"
              >
                Liên hệ với chúng tôi
              </Link>
              .
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TermsPage;
