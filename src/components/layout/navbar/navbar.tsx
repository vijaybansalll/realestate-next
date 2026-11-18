"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Hook into Lenis for real-time 60fps scroll position detection
  useLenis((lenis) => {
    setIsScrolled(lenis.scroll > 20);
  });

  // Native scroll listener fallback and initial state check on mount
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled
          ? "h-16 border-b border-neutral-800/80 bg-neutral-950/90 shadow-lg shadow-black/25 backdrop-blur-md"
          : "h-16 border-b border-transparent bg-transparent shadow-none sm:h-20"
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="#"
            className="group flex items-center gap-2 transition-opacity hover:opacity-90"
            aria-label="Home"
          >
            <Logo className="fill-current text-neutral-100" />
          </Link>
        </div>

        {/* Desktop Navigation Menu */}
        <div className="hidden items-center justify-center md:flex">
          <NavMenu isScrolled={isScrolled} />
        </div>

        {/* Right CTA / Mobile Trigger */}
        <div className="flex items-center gap-3">
          {/* CTA Button */}
          <Button
            variant="primary"
            className="hidden rounded-full px-5 sm:inline-flex"
            render={<Link href="#contact" />}
          >
            <span>Get in touch</span>
            <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>

          {/* Mobile Navigation Sheet */}
          <div className="md:hidden">
            <NavigationSheet isScrolled={isScrolled} />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
