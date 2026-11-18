"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useLenis } from "lenis/react";

const TOTAL_FRAMES = 144;

export default function HouseWalkthrough() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // In-memory array of preloaded images
  const imagesRef = useRef<(HTMLImageElement | null)[]>(
    new Array(TOTAL_FRAMES).fill(null)
  );
  const currentRenderedFrameRef = useRef<number>(1);
  const targetFrameRef = useRef<number>(1);
  const isTickingRef = useRef<boolean>(false);

  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Helper to format frame path
  const getFramePath = useCallback((frameIndex: number) => {
    const padded = String(frameIndex).padStart(3, "0");
    return `/houseWalkthrough/${padded}.webp`;
  }, []);

  // Canvas drawing function with retina display & object-fit cover
  const renderFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Find requested frame or closest available loaded frame
    let img: HTMLImageElement | null = imagesRef.current[frameIdx - 1];
    let actualFrameIdx = frameIdx;

    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let delta = 1; delta < TOTAL_FRAMES; delta++) {
        const prevIdx = frameIdx - 1 - delta;
        if (prevIdx >= 0) {
          const prev = imagesRef.current[prevIdx];
          if (prev && prev.complete && prev.naturalWidth > 0) {
            img = prev;
            actualFrameIdx = prevIdx + 1;
            break;
          }
        }
        const nextIdx = frameIdx - 1 + delta;
        if (nextIdx < TOTAL_FRAMES) {
          const next = imagesRef.current[nextIdx];
          if (next && next.complete && next.naturalWidth > 0) {
            img = next;
            actualFrameIdx = nextIdx + 1;
            break;
          }
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr =
      typeof window !== "undefined"
        ? Math.min(window.devicePixelRatio || 1, 2)
        : 1;
    const displayWidth = canvas.clientWidth || window.innerWidth;
    const displayHeight = canvas.clientHeight || window.innerHeight;

    if (
      canvas.width !== Math.floor(displayWidth * dpr) ||
      canvas.height !== Math.floor(displayHeight * dpr)
    ) {
      canvas.width = Math.floor(displayWidth * dpr);
      canvas.height = Math.floor(displayHeight * dpr);
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Clear background
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    // Object-fit: cover calculation
    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    const scale = Math.max(displayWidth / naturalW, displayHeight / naturalH);
    const drawW = naturalW * scale;
    const drawH = naturalH * scale;
    const offsetX = (displayWidth - drawW) / 2;
    const offsetY = (displayHeight - drawH) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    ctx.restore();

    currentRenderedFrameRef.current = actualFrameIdx;
  }, []);

  // Update progress calculation
  const updateProgress = useCallback(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const scrollableDistance =
      containerRef.current.offsetHeight - window.innerHeight;

    if (scrollableDistance <= 0) return;

    // Progress from 0 to 1 as the container passes through the viewport
    const currentScroll = -rect.top;
    const progress = Math.max(
      0,
      Math.min(1, currentScroll / scrollableDistance)
    );

    const target = Math.min(
      TOTAL_FRAMES,
      Math.max(1, Math.round(progress * (TOTAL_FRAMES - 1)) + 1)
    );

    targetFrameRef.current = target;
    setScrollProgress(progress);

    if (!isTickingRef.current) {
      isTickingRef.current = true;
      requestAnimationFrame(() => {
        renderFrame(targetFrameRef.current);
        isTickingRef.current = false;
      });
    }
  }, [renderFrame]);

  // Hook directly into Lenis smooth-scroll ticks
  useLenis(() => {
    updateProgress();
  });

  // Preload all frames on mount
  useEffect(() => {
    let isCancelled = false;

    // Load first frame immediately for instant first paint
    const img1 = new Image();
    img1.src = getFramePath(1);
    const onFirstLoad = () => {
      if (isCancelled) return;
      imagesRef.current[0] = img1;
      renderFrame(1);
    };

    if (img1.complete && img1.naturalWidth > 0) {
      onFirstLoad();
    } else {
      img1.onload = onFirstLoad;
    }

    // Load remaining frames in parallel
    for (let i = 2; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        if (isCancelled) return;
        imagesRef.current[i - 1] = img;

        // If this frame is the target or closer than what is currently rendered, redraw!
        const currentDist = Math.abs(
          currentRenderedFrameRef.current - targetFrameRef.current
        );
        const thisDist = Math.abs(i - targetFrameRef.current);
        if (thisDist < currentDist || i === targetFrameRef.current) {
          renderFrame(targetFrameRef.current);
        }
      };
    }

    return () => {
      isCancelled = true;
    };
  }, [getFramePath, renderFrame]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      updateProgress();
      renderFrame(targetFrameRef.current);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderFrame, updateProgress]);

  // Fallback native scroll listener
  useEffect(() => {
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, [updateProgress]);

  return (
    <section
      id="walkthrough"
      ref={containerRef}
      className="relative min-h-[320vh] sm:min-h-[450vh] w-full bg-neutral-950"
    >
      <div className="sticky top-0 h-screen h-dvh w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block h-full w-full"
        />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,10,10,0.3)_0%,rgba(10,10,10,0.15)_50%,rgba(10,10,10,0.6)_100%)]" />

        <div
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 text-center transition-transform duration-75 select-none"
          style={{
            opacity: Math.max(0, 1 - scrollProgress * 4),
            transform: `translateY(-${scrollProgress * 40}px)`,
          }}
        >
          <div className="mx-auto flex max-w-5xl flex-col items-center">
            <h1 className="font-sans text-3xl leading-[1.12] font-medium tracking-tight text-neutral-100 drop-shadow-[0_12px_32px_rgba(0,0,0,0.9)] sm:text-6xl md:text-7xl lg:text-8xl px-2">
              Crafting Luxury Living Experiences
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
