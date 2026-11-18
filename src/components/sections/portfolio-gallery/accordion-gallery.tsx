"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import type { PortfolioGalleryItem } from "@/types";
import { PORTFOLIO_GALLERY_ITEMS } from "@/data";

import "./accordion-gallery.css";

export interface AccordionGalleryProps {
  items?: PortfolioGalleryItem[];
  defaultIndex?: number;
  accentColor?: string;
  overlayColor?: string;
  textColor?: string;
  height?: number;
  gap?: number;
  radius?: number;
  expandRatio?: number;
  orientation?: "horizontal" | "vertical";
  duration?: number;
  ease?: string;
  parallax?: number;
  tilt?: number;
  stagger?: number;
  trigger?: "hover" | "click";
  showLabels?: boolean;
  grayscale?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  pauseOnHover?: boolean;
  className?: string;
}

export function AccordionGallery({
  items = PORTFOLIO_GALLERY_ITEMS,
  defaultIndex = 0,
  accentColor = "#f5f5f5",
  overlayColor = "#0a0a0a",
  textColor = "#f5f5f5",
  height = 460,
  gap = 10,
  radius = 16,
  expandRatio = 0.52,
  orientation = "horizontal",
  duration = 0.6,
  ease = "power3.out",
  parallax = 0.5,
  tilt = 8,
  stagger = 0.06,
  trigger = "hover",
  showLabels = true,
  grayscale = true,
  autoPlay = true,
  autoPlayInterval = 2000,
  pauseOnHover = true,
  className = "",
}: AccordionGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const firstRunRef = useRef(true);
  const mediaSizeRef = useRef(320);

  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const vertical = orientation === "vertical" || isMobile;
  const count = items.length;
  const [active, setActive] = useState(
    Math.min(Math.max(defaultIndex, 0), count - 1)
  );

  const prefersReduced =
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const applyLayout = useCallback(
    (animate: boolean) => {
      const panels = panelRefs.current;
      if (!panels.length) return;

      const r = Math.min(Math.max(expandRatio, 0.2), 0.9);
      const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;
      const mediaSize = mediaSizeRef.current;

      tlRef.current?.kill();
      const dur = animate && !prefersReduced ? duration : 0;
      const tl = gsap.timeline();

      panels.forEach((panel, i) => {
        if (!panel) return;
        const isActive = i === active;
        const media = mediaRefs.current[i];
        const bar = barRefs.current[i];
        const text = textRefs.current[i];

        const rot = isActive ? 0 : i < active ? tilt : -tilt;
        const rotProp = vertical ? { rotateX: -rot } : { rotateY: rot };

        tl.to(
          panel,
          { flexGrow: isActive ? grow : 1, ...rotProp, duration: dur, ease },
          0
        );

        if (media) {
          const drift = Math.max(-1.5, Math.min(1.5, active - i));
          const shift = drift * parallax * mediaSize * 0.06;
          const gray = grayscale ? (isActive ? 0 : 1) : 0;
          tl.to(
            media,
            {
              xPercent: -50,
              yPercent: -50,
              x: vertical ? 0 : isActive ? 0 : shift,
              y: vertical ? (isActive ? 0 : shift) : 0,
              "--ag-gray": gray,
              "--ag-dim": isActive ? 0 : 0.35,
              duration: dur,
              ease,
            },
            0
          );
        }

        if (showLabels && bar && text) {
          if (isActive) {
            tl.to(
              [bar, text],
              {
                opacity: 1,
                x: 0,
                duration: dur,
                ease,
                stagger: prefersReduced ? 0 : stagger,
              },
              0
            );
          } else {
            tl.to(
              [bar, text],
              { opacity: 0, x: -14, duration: dur * 0.6, ease },
              0
            );
          }
        }
      });

      tlRef.current = tl;
    },
    [
      active,
      count,
      expandRatio,
      duration,
      ease,
      vertical,
      tilt,
      parallax,
      grayscale,
      showLabels,
      stagger,
      prefersReduced,
    ]
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const total = vertical ? rect.height : rect.width;
      const usable = Math.max(total - gap * (count - 1), 120);
      const size = Math.max(
        140,
        usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.22
      );
      mediaSizeRef.current = size;
      el.style.setProperty("--ag-media-size", `${size}px`);
      applyLayout(!firstRunRef.current);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [applyLayout, gap, count, expandRatio, vertical]);

  useEffect(() => {
    applyLayout(!firstRunRef.current);
    firstRunRef.current = false;
  }, [applyLayout]);

  useEffect(
    () => () => {
      tlRef.current?.kill();
    },
    []
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const handleVisibility = () => {
      setIsTabVisible(!document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    if (
      !autoPlay ||
      isHovered ||
      !isInView ||
      !isTabVisible ||
      count <= 1 ||
      prefersReduced
    ) {
      return;
    }

    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % count);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [
    autoPlay,
    isHovered,
    isInView,
    isTabVisible,
    count,
    prefersReduced,
    autoPlayInterval,
  ]);

  const handleEnter = (i: number) => {
    if (pauseOnHover) setIsHovered(true);
    if (trigger === "hover") setActive(i);
  };

  const handleClick = (i: number, e: React.MouseEvent) => {
    if (i !== active) {
      e.preventDefault();
      setActive(i);
    } else if (items[i]?.link === "#" || !items[i]?.link) {
      e.preventDefault();
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i + 1) % count);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i - 1 + count) % count);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`accordion-gallery${vertical ? "accordion-gallery--vertical" : ""}${className ? ` ${className}` : ""}`}
      style={{
        ["--ag-accent" as string]: accentColor,
        ["--ag-overlay" as string]: overlayColor,
        ["--ag-text" as string]: textColor,
        ["--ag-gap" as string]: `${gap}px`,
        ["--ag-radius" as string]: `${radius}px`,
        height: isMobile
          ? "480px"
          : vertical
            ? `${Math.round(height * 1.4)}px`
            : `${height}px`,
      }}
      role="list"
      aria-label="Image accordion gallery"
      onMouseEnter={() => {
        if (pauseOnHover) setIsHovered(true);
      }}
      onMouseLeave={() => {
        if (pauseOnHover) setIsHovered(false);
      }}
      onFocus={() => {
        if (pauseOnHover) setIsHovered(true);
      }}
      onBlur={(e) => {
        if (
          pauseOnHover &&
          !rootRef.current?.contains(e.relatedTarget as Node)
        ) {
          setIsHovered(false);
        }
      }}
    >
      {items.map((item, i) => {
        const isActive = i === active;
        const Tag = item.link ? "a" : "div";
        return (
          <Tag
            key={i}
            ref={(el: HTMLElement | null) => {
              panelRefs.current[i] = el;
            }}
            className={`ag-panel${isActive ? "ag-panel--active" : ""}`}
            style={{ borderRadius: `${radius}px` }}
            href={item.link || undefined}
            onClick={(e) => handleClick(i, e)}
            onMouseEnter={() => handleEnter(i)}
            onFocus={() => setActive(i)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            role="listitem"
            tabIndex={0}
            aria-current={isActive ? "true" : undefined}
            aria-label={item.label}
          >
            <span className="ag-panel__frame">
              <span
                className="ag-panel__media"
                ref={(el: HTMLSpanElement | null) => {
                  mediaRefs.current[i] = el;
                }}
              >
                <img
                  src={item.image}
                  alt={item.alt || item.label || ""}
                  draggable={false}
                />
              </span>
              <span className="ag-panel__overlay" aria-hidden="true" />
            </span>
            {showLabels && (
              <span className="ag-panel__label" aria-hidden="true">
                <span
                  className="ag-panel__bar"
                  ref={(el: HTMLSpanElement | null) => {
                    barRefs.current[i] = el;
                  }}
                />
                <span
                  className="ag-panel__text"
                  ref={(el: HTMLSpanElement | null) => {
                    textRefs.current[i] = el;
                  }}
                >
                  {item.label}
                </span>
              </span>
            )}
          </Tag>
        );
      })}
    </div>
  );
}

export default AccordionGallery;
