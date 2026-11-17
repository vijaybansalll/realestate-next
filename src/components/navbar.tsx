"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { Logo } from "@/components/logo";
import { NavMenu } from "@/components/nav-menu";
import { NavigationSheet } from "@/components/navigation-sheet";
import { cn } from "@/lib/utils";

const Navbar = () => {
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
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled
          ? "h-16 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/25"
          : "h-20 bg-transparent border-b border-transparent shadow-none"
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="#"
            className="flex items-center gap-2 group transition-opacity hover:opacity-90"
            aria-label="Home"
          >
            <Logo className="text-white fill-current" />
          </Link>
        </div>

        {/* Desktop Navigation Menu */}
        <div className="hidden md:flex items-center justify-center">
          <NavMenu isScrolled={isScrolled} />
        </div>

        {/* Right CTA / Mobile Trigger */}
        <div className="flex items-center gap-3">
          {/* CTA Button */}
          <Link
            href="#contact"
            className={cn(
              "hidden sm:inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold tracking-wide transition-all duration-300 active:scale-95",
              isScrolled
                ? "bg-white text-slate-950 hover:bg-slate-200 shadow-md shadow-black/20"
                : "bg-white text-slate-950 hover:bg-slate-100 shadow-lg shadow-black/40 hover:shadow-white/10"
            )}
          >
            <span>Get in touch</span>
            <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          {/* Mobile Navigation Sheet */}
          <div className="md:hidden">
            <NavigationSheet isScrolled={isScrolled} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
