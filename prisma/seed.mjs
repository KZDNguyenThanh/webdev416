import { PrismaClient, ProductStatus, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedUsers() {
  const adminPasswordHash = await bcrypt.hash("Admin@12345", 10);
  const customerPasswordHash = await bcrypt.hash("Customer@12345", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@aemeathshop.com" },
    update: {
      fullName: "Aemeath Admin",
      role: UserRole.ADMIN,
      isActive: true,
      emailVerified: true,
      passwordHash: adminPasswordHash,
    },
    create: {
      email: "admin@aemeathshop.com",
      fullName: "Aemeath Admin",
      role: UserRole.ADMIN,
      isActive: true,
      emailVerified: true,
      passwordHash: adminPasswordHash,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@aemeathshop.com" },
    update: {
      fullName: "Demo Customer",
      role: UserRole.CUSTOMER,
      isActive: true,
      emailVerified: true,
      passwordHash: customerPasswordHash,
    },
    create: {
      email: "customer@aemeathshop.com",
      fullName: "Demo Customer",
      role: UserRole.CUSTOMER,
      isActive: true,
      emailVerified: true,
      passwordHash: customerPasswordHash,
    },
  });

  await prisma.address.upsert({
    where: { id: "demo-address-1" },
    update: {
      userId: customer.id,
      name: "Demo Customer",
      email: customer.email,
      phone: "0900000000",
      line1: "123 Main St",
      city: "Hồ Chí Minh",
      isDefault: true,
    },
    create: {
      id: "demo-address-1",
      userId: customer.id,
      name: "Demo Customer",
      email: customer.email,
      phone: "0900000000",
      line1: "123 Main St",
      city: "Hồ Chí Minh",
      isDefault: true,
    },
  });

  return { admin, customer };
}

async function seedCatalog() {
  await prisma.productCategory.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();

  const categories = [
    {
      title: "Bàn phím cơ",
      slug: "ban-phim-co",
      description: "Bàn phím cơ custom và prebuilt cho mọi nhu cầu gõ phím.",
      featured: true,
      imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200",
    },
    {
      title: "Keycap",
      slug: "keycap",
      description: "Bộ keycap PBT/ABS nhiều profile và màu sắc.",
      featured: true,
      imageUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=1200",
    },
    {
      title: "Switch",
      slug: "switch",
      description: "Switch linear, tactile, clicky từ nhiều hãng.",
      featured: true,
      imageUrl: "https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=1200",
    },
    {
      title: "Kê tay",
      slug: "ke-tay",
      description: "Kê tay gỗ, nhựa, foam giúp gõ phím thoải mái.",
      featured: true,
      imageUrl: "https://images.unsplash.com/photo-1605459672495-9ee7c1f74478?w=1200",
    },
    {
      title: "Dây cáp",
      slug: "day-cap",
      description: "Dây cáp custom coiled và aviator nhiều màu.",
      featured: false,
      imageUrl: "https://images.unsplash.com/photo-1563191911-e65f8655ebf9?w=1200",
    },
    {
      title: "Phụ kiện",
      slug: "phu-kien",
      description: "Lube, stabilizer, foam, tool và phụ kiện mod khác.",
      featured: false,
      imageUrl: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=1200",
    },
  ];

  const brands = [
    {
      title: "Arknights",
      slug: "arknights",
      description: "Official-inspired Arknights collectibles.",
      imageUrl: "https://images.unsplash.com/photo-1548092372-0d1bd40894a3?w=800",
    },
    {
      title: "PGR",
      slug: "pgr",
      description: "Punishing Gray Raven themed merch.",
      imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800",
    },
    {
      title: "Wuthering Waves",
      slug: "wuthering-waves",
      description: "Wuthering Waves fan-favorite items.",
      imageUrl: "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=800",
    },
    {
      title: "GI",
      slug: "gi",
      description: "Genshin Impact inspired merch lineup.",
      imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
    },
    {
      title: "Blue Archives",
      slug: "blue-archives",
      description: "Blue Archive themed collectibles.",
      imageUrl: "https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=800",
    },
    {
      title: "GFL",
      slug: "gfl",
      description: "Girls' Frontline merch selection.",
      imageUrl: "https://images.unsplash.com/photo-1538485399081-7c8970abdd64?w=800",
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: brand,
      create: brand,
    });
  }

  const brandBySlug = Object.fromEntries(
    (await prisma.brand.findMany()).map((brand) => [brand.slug, brand.id]),
  );
  const categoryBySlug = Object.fromEntries(
    (await prisma.category.findMany()).map((category) => [category.slug, category.id]),
  );

  const products = [
    {
      name: "Amiya Plushie 30cm",
      slug: "amiya-plushie-30cm",
      description: "Premium soft plushie with embroidered details.",
      price: 650000,
      discount: 0,
      stock: 40,
      status: ProductStatus.HOT,
      isFeatured: true,
      brandSlug: "arknights",
      categorySlugs: ["ban-phim-co", "keycap"],
      images: [
        "https://images.unsplash.com/photo-1615486363972-f79e4b0d5c15?w=1200",
        "https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?w=1200",
      ],
    },
    {
      name: "Lucia Acrylic Stand + Keychain Set",
      slug: "lucia-acrylic-stand-keychain-set",
      description: "Collector set includes acrylic stand, keychain and sticker.",
      price: 1290000,
      discount: 5,
      stock: 25,
      status: ProductStatus.NEW,
      isFeatured: false,
      brandSlug: "pgr",
      categorySlugs: ["switch", "ke-tay", "phu-kien"],
      images: [
        "https://images.unsplash.com/photo-1520353446706-8d98fc27fef1?w=1200",
        "https://images.unsplash.com/photo-1618331833071-ce81bd50d300?w=1200",
      ],
    },
  ];

  for (const product of products) {
    const upserted = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        discount: product.discount,
        stock: product.stock,
        status: product.status,
        isFeatured: product.isFeatured,
        brandId: brandBySlug[product.brandSlug] ?? null,
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        discount: product.discount,
        stock: product.stock,
        status: product.status,
        isFeatured: product.isFeatured,
        brandId: brandBySlug[product.brandSlug] ?? null,
      },
    });

    await prisma.productImage.deleteMany({ where: { productId: upserted.id } });
    await prisma.productCategory.deleteMany({ where: { productId: upserted.id } });

    await prisma.productImage.createMany({
      data: product.images.map((imageUrl, index) => ({
        productId: upserted.id,
        imageUrl,
        position: index,
      })),
    });

    const categoryRows = product.categorySlugs
      .map((slug) => categoryBySlug[slug])
      .filter(Boolean)
      .map((categoryId) => ({ productId: upserted.id, categoryId }));

    if (categoryRows.length > 0) {
      await prisma.productCategory.createMany({
        data: categoryRows,
        skipDuplicates: true,
      });
    }
  }
}

async function seedContent() {
  await prisma.page.upsert({
    where: { slug: "about" },
    update: {
      title: "About Aemeathshop",
      excerpt: "Learn more about our mission and values.",
      content: [
        {
          _type: "block",
          style: "normal",
          children: [{ _type: "span", text: "Aemeathshop delivers curated plushies and anime/game merch with trusted service." }],
        },
      ],
      isPublished: true,
      publishedAt: new Date(),
    },
    create: {
      title: "About Aemeathshop",
      slug: "about",
      excerpt: "Learn more about our mission and values.",
      content: [
        {
          _type: "block",
          style: "normal",
          children: [{ _type: "span", text: "Aemeathshop delivers curated plushies and anime/game merch with trusted service." }],
        },
      ],
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  await prisma.setting.upsert({
    where: { key: "storefront" },
    update: {
      value: {
        brandName: "Aemeathshop",
        supportEmail: "support@aemeathshop.com",
        currency: "VND",
      },
    },
    create: {
      key: "storefront",
      value: {
        brandName: "Aemeathshop",
        supportEmail: "support@aemeathshop.com",
        currency: "VND",
      },
    },
  });
}

async function main() {
  await seedUsers();
  await seedCatalog();
  await seedContent();

  const [users, products, categories] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.category.count(),
  ]);

  console.log("✅ Seed completed", { users, products, categories });
  console.log("Admin login: admin@aemeathshop.com / Admin@12345");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
