"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "ghost" | "outline" | "default";
  size?: "default" | "sm" | "icon" | "icon-sm";
}

export function ThemeToggle({
  className,
  variant = "ghost",
  size = "icon",
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant={variant}
        size={size}
        className={cn(
          "relative size-9 rounded-full text-neutral-400 border border-neutral-200 dark:border-neutral-800",
          className
        )}
        aria-label="Toggle theme"
        disabled
      >
        <span className="size-4" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative size-9 rounded-full cursor-pointer transition-colors",
        "border border-neutral-200 bg-white/80 text-neutral-700 shadow-sm hover:bg-neutral-100 hover:text-neutral-900",
        "dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-amber-400",
        className
      )}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
    >
      <Sun
        className={cn(
          "size-4.5 transition-all duration-300",
          isDark
            ? "rotate-0 scale-100 text-amber-400"
            : "-rotate-90 scale-0 text-amber-500 absolute"
        )}
      />
      <Moon
        className={cn(
          "size-4.5 transition-all duration-300",
          isDark
            ? "rotate-90 scale-0 text-neutral-400 absolute"
            : "rotate-0 scale-100 text-neutral-700"
        )}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default ThemeToggle;
