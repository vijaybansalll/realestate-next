"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useLenis } from "lenis/react";
import { gsap } from "gsap";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Dynamically import HouseScene to guarantee client-only Three.js rendering
const HouseScene = dynamic(
  () => import("./house-scene").then((mod) => mod.HouseScene),
  {
    ssr: false,
    loading: () => null,
  }
);

export function HouseWalkthrough() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Directly update DOM transform/opacity on scroll without triggering React re-renders
  const updateProgress = useCallback(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const scrollableDistance =
      containerRef.current.offsetHeight - window.innerHeight;

    if (scrollableDistance <= 0) return;

    const currentScroll = -rect.top;
    const progress = Math.max(
      0,
      Math.min(1, currentScroll / scrollableDistance)
    );
    progressRef.current = progress;

    if (heroContentRef.current) {
      const opacity = Math.max(0, 1 - progress * 5);
      heroContentRef.current.style.opacity = String(opacity);
      heroContentRef.current.style.transform = `translateY(-${progress * 48}px)`;
      heroContentRef.current.style.pointerEvents =
        opacity <= 0.05 ? "none" : "auto";
    }
  }, []);

  // Hook directly into Lenis smooth-scroll ticks (0 React component re-renders)
  useLenis(() => {
    updateProgress();
  });

  // Native scroll fallback
  useEffect(() => {
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, [updateProgress]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      updateProgress();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateProgress]);

  // IntersectionObserver to pause 3D rendering when scrolled out of viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setIsVisible(entry.isIntersecting);
        }
      },
      { rootMargin: "200px 0px 200px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // GSAP entrance animation for initial hero content on mount
  useEffect(() => {
    if (!heroContentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(heroContentRef.current!.children, {
        y: 28,
        opacity: 0,
        duration: 1.1,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.1,
      });
    }, heroContentRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="walkthrough"
      ref={containerRef}
      className="relative min-h-[350vh] w-full bg-neutral-950 text-neutral-100 sm:min-h-[450vh]"
    >
      <div className="sticky top-0 h-dvh h-screen w-full overflow-hidden bg-neutral-950 select-none">
        {/* Instant First Paint Hero Poster (0ms LCP, zero layout shift) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/rooms/exterior.webp"
          alt="Villa Lumina Exterior"
          fetchPriority="high"
          decoding="async"
          className={cn(
            "will-change-opacity pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            isCanvasReady ? "opacity-0" : "opacity-90"
          )}
        />

        {/* 3D House Scene (fades in smoothly over poster once compiled and ready) */}
        <div
          className={cn(
            "absolute inset-0 h-full w-full transition-opacity duration-700",
            isCanvasReady ? "opacity-100" : "opacity-0"
          )}
        >
          <HouseScene
            progressRef={progressRef}
            onFirstFrame={() => setIsCanvasReady(true)}
            isVisible={isVisible}
          />
        </div>

        {/* Ambient radial vignette for cinematic contrast */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,10,10,0.2)_0%,rgba(10,10,10,0.15)_50%,rgba(10,10,10,0.65)_100%)]" />

        {/* Top vignette under navbar */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-neutral-950/90 to-transparent" />

        {/* Bottom edge vignette */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-neutral-950/80 to-transparent" />

        {/* Initial Hero Content: Just ONE Title and a Short Description */}
        <div
          ref={heroContentRef}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-6 text-center will-change-transform select-none"
        >
          <div className="mx-auto flex max-w-4xl flex-col items-center">
            <h1 className="px-2 font-sans text-4xl leading-[1.08] font-medium tracking-tight text-white drop-shadow-[0_12px_36px_rgba(0,0,0,0.9)] sm:text-6xl md:text-7xl lg:text-8xl">
              Crafting Luxury Living Experiences
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HouseWalkthrough;
