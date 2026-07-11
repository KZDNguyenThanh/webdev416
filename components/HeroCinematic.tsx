"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Zap } from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import { getImageUrl } from "@/lib/image";
import type { ProductDTO } from "@/lib/types";

const formatVND = (amount: number) =>
  new Number(amount || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

/** Kinetic headline: each line rises + un-blurs in a staggered sequence. */
const lineVariants: Variants = {
  hidden: { opacity: 0, y: "0.5em" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.6 + i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

const HeroCinematic = ({ products }: { products: ProductDTO[] }) => {
  const showcase = products.filter((p) => p?.images?.length).slice(0, 3);
  const hero = showcase[0];

  // Pointer parallax for the featured panel.
  const panelRef = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [8, -8]), {
    stiffness: 120,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-10, 10]), {
    stiffness: 120,
    damping: 18,
  });
  const imgX = useSpring(useTransform(px, [-0.5, 0.5], [-18, 18]), {
    stiffness: 90,
    damping: 20,
  });
  const imgY = useSpring(useTransform(py, [-0.5, 0.5], [-14, 14]), {
    stiffness: 90,
    damping: 20,
  });

  const handlePointer = (e: React.PointerEvent) => {
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const resetPointer = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <section className="cine-surface relative overflow-hidden">
      {/* atmosphere layers */}
      <div className="hero-grid absolute inset-0" aria-hidden />
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 68% 32%, rgba(227,178,60,0.14), transparent 55%)",
        }}
      />
      <div className="scanlines cine-vignette absolute inset-0" aria-hidden />

      <div className="relative mx-auto grid min-h-[92vh] max-w-screen-xl grid-cols-1 items-center gap-10 px-4 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-0">
        {/* ---------- Left: copy ---------- */}
        <div className="relative z-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="mb-7 flex items-center gap-3 font-mono text-[11px] tracking-[0.35em] text-signal"
          >
            <span className="inline-flex items-center gap-2">
              <span className="signal-pulse inline-block h-1.5 w-1.5 rounded-full bg-signal" />
              KEYNITY // SYSTEM.ONLINE
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-signal/50 to-transparent" />
          </motion.div>

          <h1 className="font-archivo text-[13vw] font-black uppercase leading-[0.86] tracking-[-0.02em] sm:text-6xl lg:text-[5.4rem]">
            {["Kiến tạo", "trải nghiệm gõ"].map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  variants={lineVariants}
                  initial="hidden"
                  animate="show"
                  custom={i}
                >
                  {line}
                </motion.span>
              </span>
            ))}
            <span className="block overflow-hidden">
              <motion.span
                className="block text-signal"
                variants={lineVariants}
                initial="hidden"
                animate="show"
                custom={2}
                style={{ textShadow: "0 0 40px rgba(227,178,60,0.35)" }}
              >
                đỉnh cao.
              </motion.span>
            </span>
          </h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-7 max-w-md text-sm leading-relaxed text-zinc-400 sm:text-base"
          >
            Bàn phím cơ, keycap, switch và phụ kiện custom được tuyển chọn cho
            người chơi khó tính. Cảm giác gõ, âm thanh và thẩm mỹ — tất cả trong
            một hệ sinh thái.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 rounded-full bg-signal px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink transition-transform duration-300 hover:-translate-y-0.5"
            >
              Khám phá cửa hàng
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/deal"
              className="tech-corner group inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white/90 transition-colors duration-300 hover:text-signal"
            >
              <Zap className="h-4 w-4" />
              Ưu đãi hôm nay
            </Link>
          </motion.div>

          <motion.dl
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-12 flex flex-wrap gap-x-10 gap-y-4 font-mono text-[11px] uppercase tracking-widest text-zinc-500"
          >
            {[
              ["500+", "Sản phẩm"],
              ["40+", "Thương hiệu"],
              ["24/7", "Hỗ trợ"],
            ].map(([value, label]) => (
              <div key={label} className="flex flex-col gap-1">
                <dt className="text-2xl font-bold tracking-tight text-white">
                  {value}
                </dt>
                <dd>{label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* ---------- Right: featured showcase ---------- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 hidden lg:block"
          style={{ perspective: 1200 }}
        >
          <motion.div
            ref={panelRef}
            onPointerMove={handlePointer}
            onPointerLeave={resetPointer}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="tech-corner relative aspect-square rounded-2xl border border-white/10 bg-ink-soft/80 p-8 backdrop-blur-sm"
          >
            {/* panel HUD labels */}
            <div className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.3em] text-signal">
              [ Featured Unit ]
            </div>
            <div className="absolute right-5 top-5 font-mono text-[10px] tracking-[0.3em] text-zinc-500">
              01 / {String(showcase.length || 1).padStart(2, "0")}
            </div>

            {hero ? (
              <Link
                href={`/product/${hero.slug}`}
                className="group block h-full w-full"
              >
                <motion.div
                  style={{ x: imgX, y: imgY }}
                  className="float-slow flex h-full w-full items-center justify-center"
                >
                  <Image
                    src={getImageUrl(hero.images[0])}
                    alt={hero.name}
                    width={640}
                    height={640}
                    priority
                    className="h-[78%] w-[78%] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:scale-105"
                  />
                </motion.div>

                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate font-archivo text-lg font-bold uppercase tracking-tight text-white">
                      {hero.name}
                    </p>
                    <p className="mt-1 font-mono text-sm text-signal">
                      {formatVND(hero.price)}
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-signal/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-signal transition-colors group-hover:bg-signal group-hover:text-ink">
                    Xem <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ) : (
              <KeycapPlaceholder />
            )}
          </motion.div>

          {/* mini thumbnails of the other featured units */}
          {showcase.length > 1 && (
            <div className="mt-4 flex gap-3">
              {showcase.slice(1, 3).map((p, i) => (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  className="tech-corner group flex h-24 flex-1 items-center justify-center rounded-xl border border-white/10 bg-ink-soft/60 p-3 backdrop-blur-sm"
                >
                  <span className="absolute left-2 top-2 font-mono text-[9px] tracking-widest text-zinc-500">
                    0{i + 2}
                  </span>
                  <Image
                    src={getImageUrl(p.images[0])}
                    alt={p.name}
                    width={200}
                    height={200}
                    className="h-full w-auto object-contain opacity-80 transition duration-300 group-hover:scale-105 group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* bottom technical ticker */}
      <div className="relative z-10 border-t border-white/10 bg-black/40">
        <div className="marquee-mask group relative overflow-hidden py-3">
          <div className="flex w-max animate-marquee gap-8 font-mono text-[11px] uppercase tracking-[0.25em] text-signal-dim">
            {Array.from({ length: 2 }).map((_, set) => (
              <span key={set} className="flex gap-8">
                {[
                  "Hot-swap PCB",
                  "Gasket Mount",
                  "Doubleshot PBT",
                  "Lubed Switch",
                  "South-facing RGB",
                  "Foam Dampening",
                  "Free Ship 500K+",
                  "Bảo hành chính hãng",
                ].map((term) => (
                  <span key={term} className="flex items-center gap-8">
                    {term}
                    <span className="text-signal/50">/</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div className="pointer-events-none absolute bottom-24 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-500">
          Scroll
        </span>
        <span className="scroll-cue h-8 w-px bg-signal/70" />
      </div>
    </section>
  );
};

/** Fallback keycap grid when there is no featured product image to show. */
const KeycapPlaceholder = () => (
  <div className="grid h-full w-full grid-cols-3 gap-3">
    {Array.from({ length: 9 }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 + i * 0.06, duration: 0.5 }}
        className="rounded-lg border border-white/10 bg-gradient-to-b from-white/10 to-transparent"
      />
    ))}
  </div>
);

export default HeroCinematic;
