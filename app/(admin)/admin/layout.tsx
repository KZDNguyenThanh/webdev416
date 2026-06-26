import AdminSidebar from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/auth/admin";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen md:flex">
      <AdminSidebar />

      <div className="flex-1">
        <header className="h-16 border-b bg-white flex items-center justify-between px-5">
          <div>
            <p className="text-xs uppercase tracking-wider text-lightColor">
              Admin Access
            </p>
            <p className="text-sm font-semibold">{user.email}</p>
          </div>
          <Link
            href="/"
            className="text-sm font-semibold hover:text-shop_btn_dark_green hoverEffect"
          >
            Back to Store
          </Link>
        </header>

        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
