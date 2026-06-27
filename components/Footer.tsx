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
    <footer className="mt-16 border-t bg-white">
      <Container>
        <FooterTop />
        <div className="grid grid-cols-1 gap-10 py-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          <div className="space-y-4">
            <Logo />
            <SubText className="max-w-sm leading-6 text-darkColor/70">
              KEYNITY - Bàn phím cơ và phụ kiện chính hãng cho mọi tín đồ gõ
              phím.
            </SubText>
            <SocialMedia
              className="text-darkColor/60"
              iconClassName="border-darkColor/30 hover:border-shop_light_green hover:text-shop_light_green"
              tooltipClassName="bg-darkColor text-white"
            />
          </div>

          <div>
            <SubTitle className="mb-4">Liên kết nhanh</SubTitle>
            <ul className="space-y-3">
              {quickLinksData?.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={item?.href}
                    className="text-sm font-medium text-darkColor/80 transition-colors hover:text-shop_light_green"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SubTitle className="mb-4">Danh mục</SubTitle>
            <ul className="space-y-3">
              {categoriesData?.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={`/category/${item?.href}`}
                    className="text-sm font-medium text-darkColor/80 transition-colors hover:text-shop_light_green"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t py-5 text-center text-sm text-gray-600">
          © {currentYear} KEYNITY. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
