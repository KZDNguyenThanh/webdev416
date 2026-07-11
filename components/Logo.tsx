import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

const Logo = ({
  className,
  spanDesign,
}: {
  className?: string;
  spanDesign?: string;
}) => {
  return (
    <Link href={"/"} className="inline-flex">
      <h2
        className={cn(
          "font-archivo text-2xl font-black uppercase tracking-wider text-white hoverEffect group",
          className,
        )}
      >
        KEY
        <span
          className={cn(
            "text-signal group-hover:text-white hoverEffect",
            spanDesign,
          )}
        >
          NITY
        </span>
      </h2>
    </Link>
  );
};

export default Logo;
