import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Logo from "./Logo";
import { Button } from "./ui/button";
import Link from "next/link";

const NoAccess = ({
  details = "Đăng nhập để xem giỏ hàng và thanh toán. Đừng bỏ lỡ những sản phẩm bạn yêu thích!",
}: {
  details?: string;
}) => {
  return (
    <div className="flex items-center justify-center py-12 md:py-32 bg-brand-soft p-4">
      <Card className="w-full max-w-md p-5">
        <CardHeader className="flex items-center flex-col">
          <Logo />
          <CardTitle className="text-2xl font-bold text-center text-brand-dark">
            Chào mừng trở lại!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center font-medium text-darkColor/80">{details}</p>
          <Link href="/login">
            <Button className="w-full" size="lg">
              Đăng nhập
            </Button>
          </Link>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-lightText text-center">
            Chưa có tài khoản?
          </div>
          <Link href="/register" className="w-full">
            <Button variant="outline" className="w-full" size="lg">
              Tạo tài khoản
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NoAccess;
