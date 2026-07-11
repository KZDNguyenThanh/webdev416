"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion, type Variants } from "motion/react";
import { getImageUrl } from "@/lib/image";
import type { ProductDTO } from "@/lib/types";

const formatVND = (amount: number) =>
  new Number(amount || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

const card: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

/**
 * Animated "product introduction" band. Featured/deal products reveal in a
 * staggered sequence as the section scrolls into view, each tagged with a
 * technical index number and lifting on hover.
 */
const FeaturedShowcase = ({ products }: { products: ProductDTO[] }) => {
  const items = products.filter((p) => p?.images?.length).slice(0, 4);
  if (items.length === 0) return null;

  return (
    <section className="my-16 md:my-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10 flex items-end justify-between gap-6"
      >
        <div>
          <p className="section-eyebrow font-mono">// Tuyển chọn</p>
          <h2 className="mt-2 font-archivo text-3xl font-black uppercase tracking-tight text-brand-dark sm:text-4xl">
            Sản phẩm nổi bật
          </h2>
        </div>
        <Link
          href="/deal"
          className="group hidden shrink-0 items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-brand-accent hover:text-brand-dark hoverEffect sm:inline-flex"
        >
          Tất cả ưu đãi
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
        {items.map((product, i) => (
          <motion.div
            key={product.id}
            custom={i}
            variants={card}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
          >
            <Link
              href={`/product/${product.slug}`}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-brand-muted bg-white transition-all duration-500 hover:-translate-y-1.5 hover:border-brand-dark hover:shadow-xl hover:shadow-brand-dark/10"
            >
              <span className="absolute left-4 top-3 z-10 font-mono text-xs font-bold tracking-widest text-brand-muted transition-colors duration-300 group-hover:text-signal">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="relative aspect-square overflow-hidden bg-brand-bg">
                <Image
                  src={getImageUrl(product.images[0])}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-110"
                />
                {product.discount > 0 && (
                  <span className="absolute right-3 top-3 rounded-full bg-brand-dark px-2.5 py-1 font-mono text-[10px] font-bold text-white">
                    -{product.discount}%
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-2 border-t border-brand-muted p-4">
                {product.categories?.[0] && (
                  <p className="font-mono text-[10px] uppercase tracking-widest text-lightText">
                    {product.categories[0].title}
                  </p>
                )}
                <h3 className="line-clamp-2 text-[15px] sm:text-sm font-semibold text-brand-dark">
                  {product.name}
                </h3>
                <p className="mt-auto pt-1 text-base font-bold text-brand-dark">
                  {formatVND(product.price)}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedShowcase;
