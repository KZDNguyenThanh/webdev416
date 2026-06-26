import type { OrderStatus, PaymentStatus, ProductStatus } from "@prisma/client";

export type { OrderStatus, PaymentStatus, ProductStatus };

export type ProductImageDTO = {
  id: string;
  url: string;
  alt: string | null;
  position: number;
};

export type CategoryRefDTO = {
  id: string;
  title: string;
  slug: string;
};

export type BrandRefDTO = {
  id: string;
  title: string;
  slug: string;
};

export type ReviewDTO = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  userName: string;
};

export type ProductDTO = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  discount: number;
  stock: number;
  status: ProductStatus | null;
  isFeatured: boolean;
  brand: BrandRefDTO | null;
  categories: CategoryRefDTO[];
  images: ProductImageDTO[];
  reviewCount: number;
  reviewAverage: number;
  reviews: ReviewDTO[];
};

export type CategoryDTO = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  rangeStart: number | null;
  featured: boolean;
  imageUrl: string | null;
  productCount: number;
};

export type BrandDTO = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
};

export type AddressDTO = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string;
  city: string;
  state: string | null;
  zip: string | null;
  default: boolean;
};

export type OrderInvoiceDTO = {
  id: string | null;
  number: string | null;
  hosted_invoice_url: string | null;
};

export type OrderLineDTO = {
  quantity: number;
  product: ProductDTO;
};

export type OrderDTO = {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  totalPrice: number;
  amountDiscount: number;
  currency: string;
  status: string;
  orderDate: string | null;
  invoice: OrderInvoiceDTO | null;
  products: OrderLineDTO[];
};
