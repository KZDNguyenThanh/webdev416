"use client";
import Link from "next/link";
import React from "react";
import { usePathname, useSearchParams } from "next/navigation";

const SignIn = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.toString();
  const currentPath = `${pathname}${currentSearch ? `?${currentSearch}` : ""}`;
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const loginHref = isAuthPage
    ? "/login"
    : `/login?next=${encodeURIComponent(currentPath)}`;

  return (
    <div className="text-sm flex items-center justify-end">
      <Link
        href={loginHref}
        className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 font-semibold hover:text-shop_light_green hover:border-shop_light_green hoverEffect"
      >
        Login
      </Link>
    </div>
  );
};

export default SignIn;
