// One-off, idempotent maintenance script to switch the storefront categories to
// a mechanical-keyboard theme WITHOUT wiping orders/products (unlike seed.mjs,
// which deletes everything). Run with: node prisma/update-categories.mjs
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  {
    title: "Bàn phím cơ",
    slug: "ban-phim-co",
    description: "Bàn phím cơ custom và prebuilt cho mọi nhu cầu gõ phím.",
    featured: true,
    imageUrl:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200",
  },
  {
    title: "Keycap",
    slug: "keycap",
    description: "Bộ keycap PBT/ABS nhiều profile và màu sắc.",
    featured: true,
    imageUrl:
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=1200",
  },
  {
    title: "Switch",
    slug: "switch",
    description: "Switch linear, tactile, clicky từ nhiều hãng.",
    featured: true,
    imageUrl:
      "https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=1200",
  },
  {
    title: "Kê tay",
    slug: "ke-tay",
    description: "Kê tay gỗ, nhựa, foam giúp gõ phím thoải mái.",
    featured: true,
    imageUrl:
      "https://images.unsplash.com/photo-1605459672495-9ee7c1f74478?w=1200",
  },
  {
    title: "Dây cáp",
    slug: "day-cap",
    description: "Dây cáp custom coiled và aviator nhiều màu.",
    featured: false,
    imageUrl:
      "https://images.unsplash.com/photo-1563191911-e65f8655ebf9?w=1200",
  },
  {
    title: "Phụ kiện",
    slug: "phu-kien",
    description: "Lube, stabilizer, foam, tool và phụ kiện mod khác.",
    featured: false,
    imageUrl:
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=1200",
  },
];

async function main() {
  const keepSlugs = categories.map((category) => category.slug);

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  // Remove leftover (anime/plushie) categories. Cascading delete on
  // ProductCategory drops their product links; orders are untouched.
  const removed = await prisma.category.deleteMany({
    where: { slug: { notIn: keepSlugs } },
  });

  const total = await prisma.category.count();
  console.log("✅ Categories updated", {
    upserted: categories.length,
    removed: removed.count,
    total,
  });
}

main()
  .catch((error) => {
    console.error("❌ Category update failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
