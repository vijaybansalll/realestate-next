"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

export interface CardData {
  id: number | string;
  image: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  tag?: string;
}

export interface StickyCard002Props {
  cards: CardData[];
  className?: string;
  containerClassName?: string;
  imageClassName?: string;
}

const DEFAULT_CARDS: CardData[] = [
  {
    id: 1,
    image: "/portfolio-luxury.jpg",
    tag: "Curated Estate",
    title: "Villa Lumina Overlook",
    subtitle:
      "Panoramic coastal residence with private terrace & infinity pool",
    alt: "Villa Lumina luxury modern estate",
  },
  {
    id: 2,
    image: "/portfolio-townhouse.jpg",
    tag: "Urban Living",
    title: "The Sky Penthouse",
    subtitle: "Multi-level townhouse with bespoke spatial staging",
    alt: "Modern townhouse architectural estate",
  },
  {
    id: 3,
    image: "/portfolio-custom-homes.jpg",
    tag: "Signature Architecture",
    title: "Nordic Haven Residence",
    subtitle: "Custom engineered timber-frame architectural retreat",
    alt: "Custom designed modern estate home",
  },
  {
    id: 4,
    image: "/architect-blueprint-plan.png",
    tag: "Design Phase",
    title: "Spatial Blueprint Matrix",
    subtitle: "Precision CAD architectural engineering and zoning layouts",
    alt: "Architectural blueprint and site plan",
  },
  {
    id: 5,
    image: "/property-built-after.png",
    tag: "Completed Realization",
    title: "Coastal Sanctuary",
    subtitle: "Turnkey luxury estate completed to exact specifications",
    alt: "Finished modern luxury property built",
  },
];

const StickyCard002 = ({
  cards = DEFAULT_CARDS,
  className,
  containerClassName,
  imageClassName,
}: StickyCard002Props) => {
  const container = useRef<HTMLDivElement>(null);
  const stickyCardsRef = useRef<HTMLDivElement>(null);

  // Synchronize ScrollTrigger with Lenis smooth-scroll ticks
  useLenis(() => {
    ScrollTrigger.update();
  });

  // Multi-stage refresh to ensure ScrollTrigger coordinates are 100% accurate
  // even as upstream images, fonts, and dynamic heights finish loading.
  useEffect(() => {
    const refresh = () => {
      ScrollTrigger.refresh();
    };

    // Staged refreshes as surrounding layout settles
    const timer1 = setTimeout(refresh, 100);
    const timer2 = setTimeout(refresh, 500);
    const timer3 = setTimeout(refresh, 1200);

    // Refresh when all window assets finish loading
    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);

    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(refresh).catch(() => {});
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
    };
  }, []);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      // Query DOM elements directly in container scope to prevent stale or empty refs
      const cardElements = gsap.utils.toArray<HTMLDivElement>(
        ".sticky-card-item",
        container.current
      );
      const totalCards = cardElements.length;

      if (totalCards === 0 || !stickyCardsRef.current) return;

      // Set guaranteed initial positions
      gsap.set(cardElements[0], { y: "0%", scale: 1, rotation: 0 });

      for (let i = 1; i < totalCards; i++) {
        gsap.set(cardElements[i], { y: "100%", scale: 1, rotation: 0 });
      }

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: stickyCardsRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * (totalCards - 1)}`,
          pin: true,
          scrub: 0.5,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      for (let i = 0; i < totalCards - 1; i++) {
        const currentCard = cardElements[i];
        const nextCard = cardElements[i + 1];
        const position = i;

        if (!currentCard || !nextCard) continue;

        scrollTimeline.to(
          currentCard,
          {
            scale: 0.85,
            rotation: i % 2 === 0 ? 3 : -3,
            duration: 1,
            ease: "none",
          },
          position
        );

        scrollTimeline.to(
          nextCard,
          {
            y: "0%",
            duration: 1,
            ease: "none",
          },
          position
        );
      }

      // Initial layout calculation
      ScrollTrigger.refresh();
    },
    { scope: container, dependencies: [cards] }
  );

  return (
    <div className={cn("relative w-full", className)} ref={container}>
      <div
        ref={stickyCardsRef}
        className="sticky-cards relative flex h-[100dvh] h-screen w-full items-center justify-center overflow-hidden px-4 pt-0 pb-6 sm:px-6 sm:pt-16 sm:pb-8 lg:px-8"
      >
        <div
          className={cn(
            "relative h-[80vh] max-h-[560px] w-full max-w-[92vw] overflow-hidden rounded-2xl shadow-2xl sm:h-[70vh] sm:max-h-[640px] sm:rounded-3xl md:h-[75vh]",
            containerClassName
          )}
        >
          {cards.map((card, i) => (
            <div
              key={card.id}
              style={{
                zIndex: i + 1,
                transform: i === 0 ? "none" : "translate3d(0, 100%, 0)",
              }}
              className={cn(
                "sticky-card-item absolute inset-0 h-full w-full overflow-hidden rounded-2xl border border-neutral-100/10 bg-neutral-900 shadow-2xl shadow-black/80 will-change-transform sm:rounded-3xl",
                imageClassName
              )}
            >
              <img
                src={card.image}
                alt={card.alt || card.title || `Property card ${i + 1}`}
                onLoad={() => ScrollTrigger.refresh()}
                className="pointer-events-none h-full w-full object-cover select-none"
                draggable={false}
              />
              {(card.title || card.subtitle) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950/30 p-6 text-center select-none sm:p-10">
                  <div className="mx-auto max-w-2xl px-4">
                    {card.title && (
                      <h4 className="text-2xl font-medium tracking-tight text-neutral-100 drop-shadow-[0_8px_24px_rgba(0,0,0,0.95)] text-shadow-2xs sm:text-4xl md:text-5xl">
                        {card.title}
                      </h4>
                    )}
                    {card.subtitle && (
                      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed font-normal text-neutral-200/90 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] text-shadow-2xs sm:mt-4 sm:text-base md:text-lg">
                        {card.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Example usage component with default architectural cards
const Skiper17 = () => {
  return (
    <div className="w-full">
      <StickyCard002 cards={DEFAULT_CARDS} />
    </div>
  );
};

export { Skiper17, StickyCard002 };
