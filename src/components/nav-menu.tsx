"use client";

import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, type NavItem } from "@/config/navbar";

interface NavMenuProps {
  className?: string;
  isScrolled?: boolean;
  items?: NavItem[];
}

export const NavMenu = ({
  className,
  isScrolled = false,
  items = NAV_ITEMS,
}: NavMenuProps) => {
  return (
    <nav className={cn("flex items-center", className)} aria-label="Main Navigation">
      <ul className="flex items-center gap-1 lg:gap-2 m-0 p-0 list-none">
        {items.map((item) => (
          <li key={item.title}>
            <Link
              href={item.href}
              className={cn(
                "inline-flex items-center justify-center rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 tracking-wide select-none",
                isScrolled
                  ? "text-slate-300 hover:text-white hover:bg-slate-800/80 active:bg-slate-800"
                  : "text-slate-200/90 hover:text-white hover:bg-white/10 active:bg-white/15 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
              )}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
