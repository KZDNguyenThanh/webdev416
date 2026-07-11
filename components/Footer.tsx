import React from "react";
import Container from "./Container";
import FooterTop from "./FooterTop";
import Logo from "./Logo";
import SocialMedia from "./SocialMedia";
import { SubText, SubTitle } from "./ui/text";
import { categoriesData, quickLinksData } from "@/constants/data";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-white/10 bg-ink text-zinc-400">
      <Container>
        <FooterTop />
        <div className="grid grid-cols-1 gap-10 py-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          <div className="space-y-4">
            <Logo />
            <SubText className="max-w-sm leading-6 text-zinc-400">
              KEYNITY - Bàn phím cơ và phụ kiện chính hãng cho mọi tín đồ gõ
              phím.
            </SubText>
            <SocialMedia
              className="text-zinc-500"
              iconClassName="border-white/20 hover:border-signal hover:text-signal"
              tooltipClassName="bg-ink-soft text-white"
            />
          </div>

          <div>
            <SubTitle className="mb-4 text-white">Liên kết nhanh</SubTitle>
            <ul className="space-y-3">
              {quickLinksData?.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={item?.href}
                    className="text-sm font-medium text-zinc-400 transition-colors hover:text-signal"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SubTitle className="mb-4 text-white">Danh mục</SubTitle>
            <ul className="space-y-3">
              {categoriesData?.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={`/shop?category=${item?.href}`}
                    className="text-sm font-medium text-zinc-400 transition-colors hover:text-signal"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 py-5 text-center text-sm text-zinc-500">
          © {currentYear} KEYNITY. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
