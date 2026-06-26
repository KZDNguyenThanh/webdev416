"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut as oauthSignOut } from "next-auth/react";

type AuthMenuProps = {
  fullName?: string | null;
};

const AuthMenu = ({ fullName }: AuthMenuProps) => {
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

      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-full bg-shop_btn_dark_green text-white text-xs font-bold flex items-center justify-center">
        {label}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        disabled={loading}
      >
        {loading ? "Signing out..." : "Logout"}
      </Button>
    </div>
  );
};

export default AuthMenu;
