export const headerData = [
  { title: "Trang chủ", href: "/" },
  { title: "Cửa hàng", href: "/shop" },
  { title: "Khuyến mãi", href: "/deal" },
  { title: "Liên hệ", href: "/contact" },
];
export const quickLinksData = [
  { title: "Giới thiệu", href: "/about" },
  { title: "Liên hệ", href: "/contact" },
  { title: "Điều khoản", href: "/terms" },
  { title: "Câu hỏi thường gặp", href: "/faqs" },
  { title: "Trợ giúp", href: "/help" },
];
export const categoriesData = [
  { title: "Bàn phím cơ", href: "ban-phim-co" },
  { title: "Keycap", href: "keycap" },
  { title: "Switch", href: "switch" },
  { title: "Kê tay", href: "ke-tay" },
  { title: "Dây cáp", href: "day-cap" },
  { title: "Phụ kiện", href: "phu-kien" },
];
export const productType = [
  { title: "Bàn phím cơ", value: "ban-phim-co" },
  { title: "Keycap", value: "keycap" },
  { title: "Switch", value: "switch" },
  { title: "Kê tay", value: "ke-tay" },
  { title: "Dây cáp", value: "day-cap" },
  { title: "Phụ kiện", value: "phu-kien" },
];

// Price buckets shared by the shop filter list and the active-filter chips.
export const priceRanges = [
  { title: "0 - 300.000đ", value: "0-300000" },
  { title: "300.000đ - 1.000.000đ", value: "300001-1000000" },
  { title: "1.000.000đ - 2.000.000đ", value: "1000001-2000000" },
  { title: "Trên 2.000.000đ", value: "2000001-10000000000" },
];

// Sort options for the shop toolbar (value maps to repository orderBy).
export const sortOptions = [
  { title: "Mới nhất", value: "newest" },
  { title: "Giá: Thấp đến cao", value: "price-asc" },
  { title: "Giá: Cao đến thấp", value: "price-desc" },
  { title: "Tên: A → Z", value: "name-asc" },
];
