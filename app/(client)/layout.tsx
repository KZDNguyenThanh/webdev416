import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    template: "%s - KEYNITY",
    default: "KEYNITY - Bàn phím cơ & phụ kiện",
  },
  description:
    "KEYNITY - Cửa hàng bàn phím cơ và phụ kiện chính hãng: keycap, switch, kê tay, dây cáp và nhiều hơn nữa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
