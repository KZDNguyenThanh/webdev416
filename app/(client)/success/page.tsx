"use client";

import useStore from "@/store";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { motion } from "motion/react";
import { Check, Home, PackageSearch, ShoppingBag } from "lucide-react";
import Link from "next/link";

const SuccessPageContent = () => {
  const { resetCart } = useStore();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  useEffect(() => {
    if (orderNumber) {
      resetCart();
    }
  }, [orderNumber, resetCart]);
  return (
    <div className="cine-surface relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4 py-16">
      {/* atmosphere */}
      <div className="hero-grid absolute inset-0" aria-hidden />
      <div className="scanlines cine-vignette absolute inset-0" aria-hidden />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="tech-corner relative z-10 flex w-full max-w-xl flex-col gap-8 rounded-2xl border border-white/10 bg-ink-soft/80 p-8 text-center backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="signal-pulse mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-signal"
        >
          <Check className="h-10 w-10 text-ink" strokeWidth={3} />
        </motion.div>

        <div className="space-y-3">
          <p className="hud-label text-signal">// Order confirmed</p>
          <h1 className="display-title text-3xl text-white">
            Đặt hàng thành công!
          </h1>
        </div>

        <p className="text-sm leading-6 text-zinc-400">
          Cảm ơn bạn đã mua hàng. Chúng tôi đang xử lý đơn và sẽ giao sớm nhất
          có thể. Dùng mã đơn bên dưới để tra cứu trạng thái đơn hàng.
        </p>

        {orderNumber && (
          <div className="rounded-lg border border-white/10 bg-black/30 py-3">
            <p className="hud-label text-zinc-500">Mã đơn hàng</p>
            <p className="mt-1 font-mono text-lg font-bold tracking-widest text-signal">
              {orderNumber}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link
            href="/"
            className="flex items-center justify-center rounded-lg bg-signal px-4 py-3 text-sm font-bold uppercase tracking-wide text-ink transition-colors duration-300 hover:bg-signal/85"
          >
            <Home className="mr-2 h-5 w-5" />
            Trang chủ
          </Link>
          <Link
            href={`/orders/track${orderNumber ? `?orderNumber=${orderNumber}` : ""}`}
            className="flex items-center justify-center rounded-lg border border-white/20 px-4 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:border-signal hover:text-signal"
          >
            <PackageSearch className="mr-2 h-5 w-5" />
            Tra cứu đơn
          </Link>
          <Link
            href="/shop"
            className="flex items-center justify-center rounded-lg border border-white/20 px-4 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:border-signal hover:text-signal"
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            Mua sắm
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

const SuccessPage = () => {
  return (
    <Suspense fallback={<div>Đang tải…</div>}>
      <SuccessPageContent />
    </Suspense>
  );
};

export default SuccessPage;
