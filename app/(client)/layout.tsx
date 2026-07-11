import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSync from "@/components/CartSync";
import { getCurrentUser } from "@/lib/auth/server";

export const metadata: Metadata = {
  title: {
    template: "%s - KEYNITY",
    default: "KEYNITY - Bàn phím cơ & phụ kiện",
  },
  description:
    "KEYNITY - Cửa hàng bàn phím cơ và phụ kiện chính hãng: keycap, switch, kê tay, dây cáp và nhiều hơn nữa.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  return (
    <div className="flex flex-col min-h-screen">
      <CartSync userId={user?.id ?? null} />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
