import type { Prisma, ProductStatus } from "@prisma/client";
import type {
  AddressDTO,
  BrandDTO,
  CategoryDTO,
  OrderDTO,
  ProductDTO,
  ReviewDTO,
} from "@/lib/types";

type DecimalLike = Prisma.Decimal | number | string | null | undefined;

function toNumber(value: DecimalLike): number {
  if (value === null || value === undefined) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toIso(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : String(value);
}

type RawReview = {
  id?: string;
  rating: number;
  comment?: string;
  createdAt?: Date | string;
  user?: { fullName?: string | null; email?: string | null } | null;
};

type RawProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: DecimalLike;
  discount: DecimalLike;
  stock: number;
  status: ProductStatus | null;
  isFeatured: boolean;
  brand?: { id: string; title: string; slug: string } | null;
  categories?: { category: { id: string; title: string; slug: string } }[];
  images?: {
    id: string;
    imageUrl: string;
    altText: string | null;
    position: number;
  }[];
  reviews?: RawReview[];
};

export function toProductDTO(product: RawProduct): ProductDTO {
  const reviews = product.reviews ?? [];
  const ratings = reviews
    .map((review) => Number(review.rating))
    .filter((rating) => Number.isFinite(rating) && rating > 0);
  const reviewAverage =
    ratings.length > 0
      ? Number(
          (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1),
        )
      : 0;

  const detailedReviews: ReviewDTO[] = reviews
    .filter((review) => review.id !== undefined && review.comment !== undefined)
    .map((review) => ({
      id: String(review.id),
      rating: Number(review.rating ?? 0),
      comment: String(review.comment ?? ""),
      createdAt: toIso(review.createdAt) ?? new Date(0).toISOString(),
      userName: String(review.user?.fullName ?? review.user?.email ?? "Khách"),
    }));

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description ?? null,
    price: toNumber(product.price),
    discount: toNumber(product.discount),
    stock: Number(product.stock ?? 0),
    status: product.status ?? null,
    isFeatured: Boolean(product.isFeatured),
    brand: product.brand
      ? {
          id: product.brand.id,
          title: product.brand.title,
          slug: product.brand.slug,
        }
      : null,
    categories: (product.categories ?? []).map((link) => ({
      id: link.category.id,
      title: link.category.title,
      slug: link.category.slug,
    })),
    images: (product.images ?? []).map((image) => ({
      id: image.id,
      url: image.imageUrl,
      alt: image.altText ?? null,
      position: image.position,
    })),
    reviewCount: reviews.length,
    reviewAverage,
    reviews: detailedReviews,
  };
}

type RawCategory = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  rangeStart: number | null;
  featured: boolean;
  imageUrl: string | null;
  _count?: { products?: number };
  products?: { product: { images: { imageUrl: string }[] } }[];
};

export function toCategoryDTO(category: RawCategory): CategoryDTO {
  const productImages = (category.products ?? [])
    .map((link) => link.product?.images?.[0]?.imageUrl)
    .filter((url): url is string => Boolean(url));
  const previewImageUrl =
    productImages.length > 0
      ? productImages[Math.floor(Math.random() * productImages.length)]
      : null;

  return {
    id: category.id,
    title: category.title,
    slug: category.slug,
    description: category.description ?? null,
    rangeStart: category.rangeStart ?? null,
    featured: Boolean(category.featured),
    imageUrl: category.imageUrl ?? null,
    previewImageUrl,
    productCount: category._count?.products ?? 0,
  };
}

type RawBrand = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
};

export function toBrandDTO(brand: RawBrand): BrandDTO {
  return {
    id: brand.id,
    title: brand.title,
    slug: brand.slug,
    description: brand.description ?? null,
    imageUrl: brand.imageUrl ?? null,
  };
}

type RawAddress = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  line1: string;
  city: string;
  state: string | null;
  zip: string | null;
  isDefault: boolean;
};

export function toAddressDTO(address: RawAddress): AddressDTO {
  return {
    id: address.id,
    name: address.name,
    email: address.email ?? null,
    phone: address.phone ?? null,
    address: address.line1,
    city: address.city,
    state: address.state ?? null,
    zip: address.zip ?? null,
    default: address.isDefault,
  };
}

type RawOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: DecimalLike;
  discountAmount: DecimalLike;
  shippingFee: DecimalLike;
  currency: string;
  status: string;
  orderedAt: Date | string | null;
  invoiceId: string | null;
  invoiceNumber: string | null;
  invoiceUrl: string | null;
  items?: { quantity: number; product: RawProduct }[];
};

export function toOrderDTO(order: RawOrder): OrderDTO {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    email: order.customerEmail,
    totalPrice: toNumber(order.totalAmount),
    amountDiscount: toNumber(order.discountAmount),
    shippingFee: toNumber(order.shippingFee),
    currency: order.currency,
    status: String(order.status || "").toLowerCase(),
    orderDate: toIso(order.orderedAt),
    invoice:
      order.invoiceId || order.invoiceNumber || order.invoiceUrl
        ? {
            id: order.invoiceId,
            number: order.invoiceNumber,
            hosted_invoice_url: order.invoiceUrl,
          }
        : null,
    products: (order.items ?? []).map((item) => ({
      quantity: item.quantity,
      product: toProductDTO(item.product),
    })),
  };
}
