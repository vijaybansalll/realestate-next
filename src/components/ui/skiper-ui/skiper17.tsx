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

const StickyCard002 = ({
  cards,
  className,
  containerClassName,
  imageClassName,
}: StickyCard002Props) => {
  const container = useRef<HTMLDivElement>(null);
  const stickyCardsRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Synchronize ScrollTrigger with Lenis smooth-scroll ticks
  useLenis(() => {
    ScrollTrigger.update();
  });

  // Refresh ScrollTrigger once DOM layout and images settle
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => clearTimeout(timer);
  }, [cards]);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const cardElements = cardRefs.current.filter(Boolean);
      const totalCards = cardElements.length;

      if (totalCards === 0 || !stickyCardsRef.current) return;

      // Set initial positions
      gsap.set(cardElements[0], { y: "0%", scale: 1, rotation: 0 });

      for (let i = 1; i < totalCards; i++) {
        gsap.set(cardElements[i], { y: "100%", scale: 1, rotation: 0 });
      }

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: stickyCardsRef.current,
          start: "top top",
          end: `+=${window.innerHeight * (totalCards - 1)}`,
          pin: true,
          scrub: 0.5,
          pinSpacing: true,
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
    },
    { scope: container, dependencies: [cards] }
  );

  return (
    <div className={cn("relative w-full", className)} ref={container}>
      <div
        ref={stickyCardsRef}
        className="sticky-cards relative flex h-screen w-full items-center justify-center overflow-hidden px-4 pt-16 pb-8 sm:px-6 lg:px-8"
      >
        <div
          className={cn(
            "relative h-[65vh] max-h-[640px] w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl sm:h-[70vh] sm:max-w-xl sm:rounded-3xl md:h-[75vh] md:max-w-2xl lg:max-w-3xl xl:max-w-4xl",
            containerClassName
          )}
        >
          {cards.map((card, i) => (
            <div
              key={card.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              style={{ zIndex: i + 1 }}
              className={cn(
                "absolute inset-0 h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/80 will-change-transform sm:rounded-3xl",
                imageClassName
              )}
            >
              <img
                src={card.image}
                alt={card.alt || card.title || `Property card ${i + 1}`}
                className="pointer-events-none h-full w-full object-cover select-none"
                draggable={false}
              />
              {(card.title || card.tag) && (
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent p-6 sm:p-8">
                  {card.tag && (
                    <span className="mb-2 inline-block w-fit rounded-full border border-amber-500/30 bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-300 backdrop-blur-md">
                      {card.tag}
                    </span>
                  )}
                  {card.title && (
                    <h4 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                      {card.title}
                    </h4>
                  )}
                  {card.subtitle && (
                    <p className="mt-1 text-sm text-slate-300">
                      {card.subtitle}
                    </p>
                  )}
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
  const defaultCards: CardData[] = [
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

  return (
    <div className="w-full">
      <StickyCard002 cards={defaultCards} />
    </div>
  );
};

export { Skiper17, StickyCard002 };
