"use client";
import useStore from "@/store";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import React from "react";
import CartModal from "./CartModal";

const CartIcon = () => {
  const { items } = useStore();
  return (
    <>
      <Link href={"/cart"} className="group relative">
        <ShoppingBag className="w-5 h-5 hover:text-signal hoverEffect" />
        <span className="absolute -top-1 -right-1 bg-signal text-ink h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
          {items?.length ? items?.length : 0}
        </span>
      </Link>
      <CartModal />
    </>
  );
};

export default CartIcon;
