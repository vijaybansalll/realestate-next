import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// SectionBadge (Eyebrow Tag)
// ---------------------------------------------------------------------------

const sectionBadgeVariants = cva(
  "inline-flex items-center gap-1.5 transition-colors",
  {
    variants: {
      variant: {
        default:
          "text-xs font-semibold tracking-[0.25em] text-amber-500 uppercase dark:text-amber-400",
        pill: "rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-400",
        outline:
          "rounded-full border border-neutral-200/80 px-2.5 py-0.5 text-xs font-medium text-neutral-600 dark:border-neutral-800/80 dark:text-neutral-400",
        glow: "text-sm font-semibold text-amber-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface SectionBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof sectionBadgeVariants> {
  icon?: React.ReactNode;
  pulse?: boolean;
}

export function SectionBadge({
  className,
  variant,
  icon,
  pulse = false,
  children,
  ...props
}: SectionBadgeProps) {
  return (
    <span
      className={cn(sectionBadgeVariants({ variant }), className)}
      {...props}
    >
      {pulse && (
        <span className="size-1.5 rounded-full bg-amber-500 animate-pulse dark:bg-amber-400" />
      )}
      {icon}
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// SectionHeading
// ---------------------------------------------------------------------------

const sectionHeadingVariants = cva(
  "font-medium tracking-tight text-neutral-900 transition-colors text-pretty dark:text-neutral-100",
  {
    variants: {
      size: {
        sm: "text-lg sm:text-xl md:text-2xl",
        default: "text-2xl sm:text-3xl",
        lg: "text-2xl sm:text-4xl md:text-5xl",
        xl: "text-3xl sm:text-5xl lg:text-6xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface SectionHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof sectionHeadingVariants> {
  as?: HeadingLevel;
}

export function SectionHeading({
  as: Component = "h2",
  size,
  className,
  children,
  ...props
}: SectionHeadingProps) {
  return (
    <Component
      className={cn(sectionHeadingVariants({ size }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}

// ---------------------------------------------------------------------------
// SectionDescription
// ---------------------------------------------------------------------------

const sectionDescriptionVariants = cva(
  "leading-relaxed text-pretty text-neutral-600 transition-colors dark:text-neutral-400",
  {
    variants: {
      size: {
        sm: "text-xs sm:text-sm",
        default: "text-xs sm:text-sm md:text-base",
        lg: "text-sm sm:text-base md:text-lg",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface SectionDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof sectionDescriptionVariants> {
  as?: "p" | "div";
}

export function SectionDescription({
  as: Component = "p",
  size,
  className,
  children,
  ...props
}: SectionDescriptionProps) {
  return (
    <Component
      className={cn(sectionDescriptionVariants({ size }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}

// ---------------------------------------------------------------------------
// SectionHeader Container
// ---------------------------------------------------------------------------

export interface SectionHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  align?: "left" | "center" | "between";
  badge?: React.ReactNode;
  badgeIcon?: React.ReactNode;
  badgeVariant?: VariantProps<typeof sectionBadgeVariants>["variant"];
  badgeExtra?: React.ReactNode;
  badgePulse?: boolean;
  title?: React.ReactNode;
  titleAs?: HeadingLevel;
  size?: VariantProps<typeof sectionHeadingVariants>["size"];
  description?: React.ReactNode;
  descriptionSize?: VariantProps<typeof sectionDescriptionVariants>["size"];
  action?: React.ReactNode;
}

export function SectionHeader({
  align = "left",
  badge,
  badgeIcon,
  badgeVariant = "default",
  badgeExtra,
  badgePulse,
  title,
  titleAs = "h2",
  size,
  description,
  descriptionSize,
  action,
  className,
  children,
  ...props
}: SectionHeaderProps) {
  // If children are supplied, render compositionally
  if (children) {
    return (
      <div
        className={cn(
          "flex flex-col gap-3",
          align === "center" && "items-center text-center",
          align === "between" &&
            "sm:flex-row sm:items-end sm:justify-between sm:gap-6",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  // Convenient prop-based rendering
  const isBetween = align === "between" || Boolean(action);

  const headerContent = (
    <div
      className={cn(
        "space-y-2",
        align === "center" && "mx-auto max-w-2xl text-center"
      )}
    >
      {(badge || badgeExtra) && (
        <div
          className={cn(
            "flex items-center gap-2",
            align === "center" && "justify-center"
          )}
        >
          {badge && (
            <SectionBadge
              variant={badgeVariant}
              icon={badgeIcon}
              pulse={badgePulse}
            >
              {badge}
            </SectionBadge>
          )}
          {badgeExtra}
        </div>
      )}

      {title && (
        <SectionHeading as={titleAs} size={size}>
          {title}
        </SectionHeading>
      )}

      {description && (
        <SectionDescription
          size={descriptionSize}
          className={cn(align === "center" && "mx-auto max-w-2xl")}
        >
          {description}
        </SectionDescription>
      )}
    </div>
  );

  if (isBetween && action) {
    return (
      <div
        className={cn(
          "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
          className
        )}
        {...props}
      >
        <div className="flex-1">{headerContent}</div>
        <div className="shrink-0">{action}</div>
      </div>
    );
  }

  return (
    <div className={className} {...props}>
      {headerContent}
    </div>
  );
}
