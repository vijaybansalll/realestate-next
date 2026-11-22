"use client";

import { useEffect, useState, Suspense } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { checkAuthStatus } from "@/app/(auth)/login/actions";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";
import { cn } from "@/lib/utils";

interface NavbarProps {
  initialAuthenticated?: boolean;
}

function NavbarContent({ initialAuthenticated = false }: NavbarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(initialAuthenticated);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

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

  // Re-verify authentication status on mount and when pathname changes
  useEffect(() => {
    let isMounted = true;
    checkAuthStatus().then((authed) => {
      if (isMounted) {
        setIsLoggedIn(authed);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [pathname]);

  const isHome = pathname === "/";
  const isTransparent = isHome && !isScrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-in-out",
        isTransparent
          ? "h-16 border-b border-transparent bg-transparent shadow-none sm:h-20"
          : "h-16 border-b border-neutral-200/80 bg-white/85 shadow-sm backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-950/90 dark:shadow-black/25"
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="group flex items-center gap-2 transition-opacity hover:opacity-90"
            aria-label="Home"
          >
            <Logo
              className={cn(
                "h-8 sm:h-9 w-auto transition-colors",
                isTransparent
                  ? "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
                  : "text-neutral-900 dark:text-neutral-100"
              )}
            />
          </Link>
        </div>

        {/* Desktop Navigation Menu */}
        <div className="hidden items-center justify-center md:flex">
          <NavMenu isScrolled={!isTransparent} isLoggedIn={isLoggedIn} />
        </div>

        {/* Right CTA / Mobile Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {/* CTA Button */}
          <Button
            variant="primary"
            className="hidden rounded-full px-5 sm:inline-flex"
            render={<Link href="/contact-us" />}
          >
            <span>Get in touch</span>
            <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>

          {/* Mobile Navigation Sheet */}
          <div className="md:hidden">
            <NavigationSheet
              isScrolled={!isTransparent}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export function Navbar({ initialAuthenticated = false }: NavbarProps) {
  return (
    <Suspense
      fallback={
        <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-neutral-200/80 bg-white/85 shadow-sm backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-950/90 dark:shadow-black/25 sm:h-20">
          <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="group flex items-center gap-2"
                aria-label="Home"
              >
                <Logo className="h-8 sm:h-9 w-auto text-neutral-900 dark:text-neutral-100" />
              </Link>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
            </div>
          </div>
        </header>
      }
    >
      <NavbarContent initialAuthenticated={initialAuthenticated} />
    </Suspense>
  );
}

export default Navbar;
