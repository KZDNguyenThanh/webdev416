"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { BannerItem } from "@/lib/banners";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const ROTATE_MS = 5000;

const HomeBannerCarousel = ({ items }: { items: BannerItem[] }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || items.length <= 1) return;
    const timer = setInterval(() => api.scrollNext(), ROTATE_MS);
    return () => clearInterval(timer);
  }, [api, items.length]);

  if (items.length === 0) return null;

  return (
    <div className="relative group">
      <Carousel opts={{ loop: true }} setApi={setApi} className="w-full">
        <CarouselContent>
          {items.map((item) => (
            <CarouselItem key={item.id}>
              <Link
                href={item.link || "/shop"}
                className="block rounded-lg overflow-hidden"
                aria-label={item.alt || "Banner KEYNITY"}
              >
                <div className="relative w-full aspect-[16/6]">
                  <Image
                    src={item.imageUrl}
                    alt={item.alt || "Banner KEYNITY"}
                    fill
                    sizes="100vw"
                    priority
                    className="object-cover"
                  />
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {items.length > 1 ? (
        <>
          <button
            type="button"
            aria-label="Ảnh trước"
            onClick={() => api?.scrollPrev()}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition group-hover:opacity-100 hover:bg-black/60"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Ảnh sau"
            onClick={() => api?.scrollNext()}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition group-hover:opacity-100 hover:bg-black/60"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      ) : null}

      {items.length > 1 ? (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Tới banner ${index + 1}`}
              onClick={() => api?.scrollTo(index)}
              className={`h-2 rounded-full transition-all ${
                current === index ? "w-5 bg-white" : "w-2 bg-white/60"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default HomeBannerCarousel;
