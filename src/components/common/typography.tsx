import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const headingVariants = cva("font-medium tracking-tight text-neutral-900 transition-colors dark:text-neutral-100", {
  variants: {
    size: {
      xs: "text-base sm:text-lg",
      sm: "text-lg sm:text-xl",
      md: "text-xl sm:text-2xl",
      lg: "text-2xl sm:text-3xl",
      xl: "text-3xl sm:text-4xl md:text-5xl",
      "2xl": "text-4xl sm:text-5xl lg:text-6xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    size: "lg",
    weight: "medium",
  },
});

export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: HeadingTag;
}

export function Heading({
  as: Component = "h2",
  size,
  weight,
  className,
  children,
  ...props
}: HeadingProps) {
  return (
    <Component
      className={cn(headingVariants({ size, weight }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}

const textVariants = cva("transition-colors leading-relaxed", {
  variants: {
    variant: {
      default: "text-neutral-800 dark:text-neutral-200",
      muted: "text-neutral-600 dark:text-neutral-400",
      subtle: "text-neutral-500 dark:text-neutral-500",
      lead: "text-lg md:text-xl text-neutral-700 dark:text-neutral-300",
      caption: "text-xs text-neutral-500 dark:text-neutral-400",
      accent: "text-amber-600 dark:text-amber-400 font-medium",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "base",
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  as?: "p" | "span" | "div" | "label";
}

export function Text({
  as: Component = "p",
  variant,
  size,
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Component
      className={cn(textVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}
