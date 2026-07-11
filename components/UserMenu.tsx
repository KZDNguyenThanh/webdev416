"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { signOut as oauthSignOut } from "next-auth/react";
import { LayoutDashboard, LogOut, Receipt } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type UserMenuProps = {
  fullName?: string | null;
  role?: string | null;
  ordersCount?: number;
};

const UserMenu = ({ fullName, role, ordersCount = 0 }: UserMenuProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const label = fullName?.trim()?.charAt(0)?.toUpperCase() || "U";

  const handleLogout = async () => {
    setLoading(true);
    try {
      await Promise.allSettled([
        oauthSignOut({ redirect: false, callbackUrl: "/" }),
        fetch("/api/auth/logout", { method: "POST" }),
      ]);
      setOpen(false);
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const itemClass =
    "flex items-center justify-between gap-2 rounded-md px-2.5 py-2 text-sm hover:bg-brand-soft hoverEffect";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label="Tài khoản"
          className="h-8 w-8 rounded-full bg-signal text-ink text-xs font-bold flex items-center justify-center hover:bg-signal/80 hoverEffect"
        >
          {label}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-60 p-2">
        <div className="px-2.5 py-2 border-b mb-1">
          <p className="text-xs text-lightColor">Xin chào</p>
          <p className="text-sm font-semibold truncate">{fullName || "Bạn"}</p>
        </div>

        <Link href="/orders" onClick={() => setOpen(false)} className={itemClass}>
          <span className="flex items-center gap-2">
            <Receipt className="h-4 w-4" /> Đơn hàng của tôi
          </span>
          {ordersCount > 0 ? (
            <span className="rounded-full bg-brand px-1.5 text-[11px] font-semibold text-white">
              {ordersCount}
            </span>
          ) : null}
        </Link>

        {role === "ADMIN" ? (
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className={itemClass}
          >
            <span className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" /> Quản trị
            </span>
          </Link>
        ) : null}

        <button
          type="button"
          onClick={handleLogout}
          disabled={loading}
          className={`${itemClass} w-full text-left text-red-600 hover:bg-red-50 disabled:opacity-60`}
        >
          <span className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            {loading ? "Đang đăng xuất…" : "Đăng xuất"}
          </span>
        </button>
      </PopoverContent>
    </Popover>
  );
};

export default UserMenu;
