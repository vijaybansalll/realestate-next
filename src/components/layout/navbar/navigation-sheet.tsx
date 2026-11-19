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
import { ThemeToggle } from "@/components/theme-toggle";
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
            variant="secondary"
            aria-label="Open menu"
            className={cn(
              "rounded-full transition-colors",
              isScrolled
                ? "border-neutral-200 bg-white/80 text-neutral-900 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-100 dark:hover:bg-neutral-800"
                : "border-white/20 bg-black/40 text-white backdrop-blur-md hover:bg-black/60"
            )}
          />
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex h-full w-[85%] max-w-xs flex-col justify-between border-l border-neutral-200 bg-white/98 px-5 py-6 text-neutral-900 backdrop-blur-2xl dark:border-neutral-800 dark:bg-neutral-950/98 dark:text-neutral-100"
      >
        <div>
          <div className="flex items-center justify-between border-b border-neutral-200/80 pr-8 pb-5 dark:border-neutral-800/80">
            <Link href="/" onClick={() => setOpen(false)}>
              <Logo className="h-8 w-auto text-neutral-900 dark:text-neutral-100" />
            </Link>
            <ThemeToggle size="icon-sm" />
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
                className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-neutral-100"
              >
                <span>{item.title}</span>
                <ArrowUpRight className="size-4 text-neutral-400 dark:text-neutral-500" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-neutral-200/80 pt-6 dark:border-neutral-800/80">
          <Button
            variant="primary"
            size="lg"
            className="w-full rounded-full"
            render={<Link href="/#contact" onClick={() => setOpen(false)} />}
          >
            <span>Get in touch</span>
            <ArrowUpRight className="size-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
