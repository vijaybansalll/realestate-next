"use client";

import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/data";
import type { NavItem } from "@/types";

interface NavMenuProps {
  className?: string;
  isScrolled?: boolean;
  items?: NavItem[];
}

export function NavMenu({
  className,
  isScrolled = false,
  items = NAV_ITEMS,
}: NavMenuProps) {
  return (
    <nav
      className={cn("flex items-center", className)}
      aria-label="Main Navigation"
    >
      <ul className="m-0 flex list-none items-center gap-1 p-0 lg:gap-2">
        {items.map((item) => (
          <li key={item.title}>
            <Link
              href={item.href}
              className={cn(
                "inline-flex items-center justify-center rounded-full px-3.5 py-1.5 text-sm font-medium tracking-wide transition-all duration-200 select-none",
                isScrolled
                  ? "text-neutral-300 hover:bg-neutral-800/80 hover:text-neutral-100 active:bg-neutral-800"
                  : "text-neutral-200/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] hover:bg-neutral-100/10 hover:text-neutral-100 active:bg-neutral-100/15"
              )}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
