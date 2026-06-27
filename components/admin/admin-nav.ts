import {
  FileText,
  Images,
  LayoutDashboard,
  Package,
  Receipt,
  Settings,
  Shield,
  Tag,
  Users,
} from "lucide-react";

export type AdminNavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
};

export const adminNavItems: AdminNavItem[] = [
  {
    title: "Bảng điều khiển",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    description: "Tổng quan và thống kê nhanh",
  },
  {
    title: "Sản phẩm",
    href: "/admin/products",
    icon: Package,
    description: "Quản lý danh mục sản phẩm",
  },
  {
    title: "Thương hiệu",
    href: "/admin/brands",
    icon: Tag,
    description: "Tạo và quản lý thương hiệu",
  },
  {
    title: "Banner",
    href: "/admin/banners",
    icon: Images,
    description: "Ảnh quảng bá trang chủ",
  },
  {
    title: "Đơn hàng",
    href: "/admin/orders",
    icon: Receipt,
    description: "Theo dõi và cập nhật đơn hàng",
  },
  {
    title: "Người dùng",
    href: "/admin/users",
    icon: Users,
    description: "Quản lý tài khoản khách/admin",
  },
  {
    title: "Trang nội dung",
    href: "/admin/pages",
    icon: FileText,
    description: "Nội dung trang tĩnh",
  },
  {
    title: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
    description: "Cấu hình cửa hàng (JSON)",
  },
  {
    title: "Nhật ký hoạt động",
    href: "/admin/audit-logs",
    icon: Shield,
    description: "Lịch sử thao tác của admin",
  },
];
