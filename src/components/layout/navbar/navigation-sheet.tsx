"use client";

import { useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ArrowUpRight, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/layout/logo";
import { NAV_ITEMS } from "@/data";
import type { NavItem } from "@/types";
import { cn } from "@/lib/utils";

interface NavigationSheetProps {
  isScrolled?: boolean;
  items?: NavItem[];
}

export function NavigationSheet({
  isScrolled = false,
  items = NAV_ITEMS,
}: NavigationSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <VisuallyHidden>
        <SheetTitle>Navigation Menu</SheetTitle>
      </VisuallyHidden>

      <SheetTrigger
        render={
          <Button
            size="icon"
            variant="ghost"
            aria-label="Open menu"
            className={cn(
              "rounded-full transition-colors",
              isScrolled
                ? "text-neutral-200 hover:bg-neutral-800 hover:text-neutral-100"
                : "text-neutral-100 hover:bg-neutral-100/10"
            )}
          />
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex h-full w-[85%] max-w-xs flex-col justify-between border-l border-neutral-800 bg-neutral-950/98 px-5 py-6 text-neutral-100 backdrop-blur-2xl"
      >
        <div>
          <div className="flex items-center justify-between border-b border-neutral-800/80 pr-8 pb-5">
            <Link href="#" onClick={() => setOpen(false)}>
              <Logo className="fill-current text-neutral-100" />
            </Link>
          </div>

          <nav
            className="mt-8 flex flex-col gap-1.5"
            aria-label="Mobile Navigation"
          >
            {items.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-neutral-300 transition-colors hover:bg-neutral-900 hover:text-neutral-100"
              >
                <span>{item.title}</span>
                <ArrowUpRight className="size-4 text-neutral-500" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-neutral-800/80 pt-6">
          <Link
            href="#contact"
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-100 px-5 py-3 text-sm font-semibold text-neutral-950 shadow-lg shadow-neutral-100/5 transition-all hover:bg-neutral-200 active:scale-95"
          >
            <span>Get in touch</span>
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
