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
import { Logo } from "@/components/logo";
import { NAV_ITEMS, type NavItem } from "@/config/navbar";
import { cn } from "@/lib/utils";

interface NavigationSheetProps {
  isScrolled?: boolean;
  items?: NavItem[];
}

export const NavigationSheet = ({
  isScrolled = false,
  items = NAV_ITEMS,
}: NavigationSheetProps) => {
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
                ? "text-slate-200 hover:bg-slate-800 hover:text-white"
                : "text-white hover:bg-white/10"
            )}
          />
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex h-full flex-col justify-between border-l border-slate-800 bg-slate-950/98 px-6 py-6 text-slate-100 backdrop-blur-2xl sm:max-w-xs"
      >
        <div>
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-5 pr-8">
            <Link href="#" onClick={() => setOpen(false)}>
              <Logo className="text-white fill-current" />
            </Link>
          </div>

          <nav className="mt-8 flex flex-col gap-1.5" aria-label="Mobile Navigation">
            {items.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-slate-300 transition-colors hover:bg-slate-900 hover:text-white"
              >
                <span>{item.title}</span>
                <ArrowUpRight className="size-4 text-slate-500" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-slate-800/80 pt-6">
          <Link
            href="#contact"
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-white/5 transition-all hover:bg-slate-200 active:scale-95"
          >
            <span>Get in touch</span>
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};
