"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { ESTATE_STATS } from "@/data";
import type { StatItem } from "@/types";
import { SectionHeader } from "@/components/common";

interface StatsProps {
  stats?: StatItem[];
}

function parseStatValue(raw: string) {
  const match = raw.match(/^([^0-9.]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  if (!match) {
    return { prefix: "", target: 0, decimals: 0, suffix: raw };
  }

  const prefix = match[1] || "";
  const numStr = match[2] || "0";
  const suffix = match[3] || "";
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
  const target = parseFloat(numStr);

  return { prefix, target, decimals, suffix };
}

function AnimatedNumber({
  value,
  isVisible,
  index,
}: {
  value: string;
  isVisible: boolean;
  index: number;
}) {
  const { prefix, target, decimals, suffix } = useMemo(
    () => parseStatValue(value),
    [value]
  );

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [currentVal, setCurrentVal] = useState(() =>
    prefersReducedMotion ? target : 0
  );

  useEffect(() => {
    if (!isVisible || prefersReducedMotion) return;

    let startTime: number | null = null;
    let frameId: number;
    const duration = 1600;
    const delay = index * 120;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime - delay;

      if (elapsed < 0) {
        frameId = requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCurrentVal(target * eased);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setCurrentVal(target);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isVisible, target, index, prefersReducedMotion]);

  const display =
    decimals > 0 ? currentVal.toFixed(decimals) : Math.round(currentVal);

  return (
    <span className="tabular-nums">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export function Stats({ stats = ESTATE_STATS }: StatsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20"
    >
      <SectionHeader
        align="center"
        title="Proven Architectural Distinction"
        size="lg"
        description="Curating visionary residences and benchmark luxury living spaces"
        descriptionSize="lg"
      />

      <div className="mt-8 grid grid-cols-1 overflow-hidden rounded-2xl border border-neutral-200 bg-white/80 shadow-sm sm:mt-14 sm:grid-cols-2 md:grid-cols-3 dark:border-neutral-800 dark:bg-neutral-950/40">
        {stats.map((item, index) => (
          <div
            key={item.label}
            className={`-m-px border-t border-l border-neutral-200 p-6 sm:p-8 md:p-10 dark:border-neutral-800 ${
              index === 2 ? "sm:col-span-2 md:col-span-1" : ""
            }`}
          >
            <span className="text-3xl font-medium text-neutral-900 dark:text-neutral-100 sm:text-4xl md:text-5xl">
              <AnimatedNumber
                value={item.value}
                isVisible={isVisible}
                index={index}
              />
            </span>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 sm:mt-4 sm:text-base md:text-lg">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Stats;
