import Logo from "@/components/Logo";
import Link from "next/link";
import React from "react";

const NotFoundPage = () => {
  return (
    <div className="cine-surface relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 py-16 text-center">
      {/* atmosphere */}
      <div className="hero-grid absolute inset-0" aria-hidden />
      <div className="scanlines cine-vignette absolute inset-0" aria-hidden />

      <div className="relative z-10 w-full max-w-md space-y-8">
        <Logo className="text-3xl" />

        <div className="space-y-3">
          <p className="hud-label text-signal">// Error 404</p>
          <h1 className="display-title text-5xl text-white sm:text-6xl">
            Lạc phím rồi!
          </h1>
          <p className="text-sm leading-6 text-zinc-400">
            Địa chỉ bạn truy cập không tồn tại hoặc đã được di chuyển. Hãy quay
            lại và tiếp tục khám phá KEYNITY.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-signal px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink transition-colors duration-300 hover:bg-signal/85"
          >
            Về trang chủ
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:border-signal hover:text-signal"
          >
            Khám phá cửa hàng
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
