"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavItems } from "@/components/admin/admin-nav";
import { cn } from "@/lib/utils";

const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-72 md:min-h-screen border-r bg-white">
      <div className="px-5 py-6 border-b">
        <p className="text-xs tracking-widest uppercase text-lightColor">
          KEYNITY
        </p>
        <h2 className="text-xl font-bold mt-1">Admin Panel</h2>
      </div>

      <nav className="p-3 space-y-1.5">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-start gap-3 rounded-lg px-3 py-3 transition-colors border",
                isActive
                  ? "bg-shop_btn_dark_green text-white border-shop_btn_dark_green"
                  : "bg-white border-transparent hover:border-shop_btn_dark_green/20 hover:bg-shop_light_bg",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 mt-0.5",
                  isActive ? "text-white" : "text-darkColor",
                )}
              />
              <span>
                <span className="block text-sm font-semibold leading-none">
                  {item.title}
                </span>
                <span
                  className={cn(
                    "block text-xs mt-1",
                    isActive ? "text-white/80" : "text-lightColor",
                  )}
                >
                  {item.description}
                </span>
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
