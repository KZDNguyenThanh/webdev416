import { prisma } from "@/lib/prisma";

export const HOME_BANNERS_KEY = "homeBanners";

export type BannerItem = {
  id: string;
  imageUrl: string;
  link: string;
  alt: string;
};

type RawItem = Partial<BannerItem> & { imageUrl?: unknown };

function normalize(raw: unknown): BannerItem[] {
  if (!raw || typeof raw !== "object") return [];
  const items = (raw as { items?: unknown }).items;
  if (!Array.isArray(items)) return [];
  return items
    .map((item: RawItem) => ({
      id: String(item?.id ?? ""),
      imageUrl: String(item?.imageUrl ?? ""),
      link: String(item?.link ?? ""),
      alt: String(item?.alt ?? ""),
    }))
    .filter((item) => item.id && item.imageUrl);
}

/** Read the homepage banner list from the `homeBanners` Setting (empty if unset). */
export async function getHomeBanners(): Promise<BannerItem[]> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: HOME_BANNERS_KEY },
    });
    return normalize(setting?.value);
  } catch (error) {
    console.error("Error reading home banners", error);
    return [];
  }
}
