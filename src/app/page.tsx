"use client";

import HouseWalkthrough from "@/components/HouseWalkthrough";
import AccordionGallery from "@/components/AccordionGallery";
import { BeforeAfterSlider } from "@/components/motion/before-after-slider";
import CarouselDemo from "@/components/carousel";
import Stats from "@/components/stats";
import CTA from "@/components/cta";
import { Skiper17 } from "@/components/ui/skiper-ui/skiper17";

export default function Home() {
  const items = [
    {
      image: "/portfolio-luxury.jpg",
      label: "Luxury",
      link: "#",
    },
    {
      image: "/portfolio-townhouse.jpg",
      label: "Town House",
      link: "#",
    },
    {
      image: "/portfolio-custom-homes.jpg",
      label: "Custom Homes",
      link: "#",
    },
  ];

  return (
    <main className="relative min-h-screen bg-neutral-950 font-sans text-neutral-100 selection:bg-amber-500 selection:text-neutral-950">
      <section id="walkthrough" className="relative">
        <HouseWalkthrough />
      </section>
      <div className="container mx-auto">
        <section
          id="properties"
          className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 sm:py-20 lg:px-8"
        >
          <div className="mb-8 text-center sm:mb-12">
            <span className="text-xs font-semibold tracking-[0.25em] text-amber-400 uppercase">
              Curated Portfolio
            </span>
            <h2 className="mt-3 text-2xl font-medium tracking-tight text-neutral-100 sm:text-4xl md:text-5xl">
              Featured Architectural Estates
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-xs text-neutral-400 sm:mt-4 sm:text-base sm:text-sm">
              Explore our handpicked collection of modern residences, prime
              coastal retreats, and architectural masterpieces.
            </p>
          </div>

          <div className="mb-10 sm:mb-16">
            <AccordionGallery
              items={items}
              defaultIndex={2}
              expandRatio={0.52}
              trigger="hover"
              accentColor="#f5f5f5"
              overlayColor="#0a0a0a"
              textColor="#f5f5f5"
              grayscale
              showLabels
              duration={0.6}
              ease="power3.out"
              parallax={0.5}
              tilt={8}
              stagger={0.06}
              height={460}
              gap={10}
              radius={16}
              orientation="horizontal"
            />
          </div>

          <div className="grid grid-cols-1 items-center gap-8">
            <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
              <div className="w-full lg:w-1/2">
                <span className="text-xs font-semibold tracking-widest text-amber-400 uppercase">
                  Transformation
                </span>
                <h3 className="mt-2 text-2xl font-medium text-neutral-100 sm:text-3xl">
                  Restoration & Spatial Architecture
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-400 sm:text-base">
                  Every property undergoes a comprehensive visual and
                  architectural assessment. Drag the slider to witness our
                  bespoke spatial staging and atmospheric illumination.
                </p>
              </div>

              <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-neutral-800 shadow-2xl lg:w-1/2">
                <BeforeAfterSlider
                  showLabels
                  labels={{
                    before: "Architectural Blueprint",
                    after: "Property Built",
                  }}
                  before={
                    <img
                      src="/architect-blueprint-plan.png"
                      alt="Architectural property map blueprint"
                      draggable={false}
                      className="h-full w-full object-cover"
                    />
                  }
                  after={
                    <img
                      src="/property-built-after.png"
                      alt="Completed architectural property built"
                      draggable={false}
                      className="h-full w-full object-cover"
                    />
                  }
                />
              </div>
            </div>
          </div>
        </section>

        <CarouselDemo />

        <Stats />

        <section id="showcase" className="relative w-full py-8 sm:py-12">
          <div className="mb-4 px-4 text-center">
            <span className="text-xs font-semibold tracking-[0.25em] text-amber-400 uppercase">
              Interactive Showcase
            </span>
            <h2 className="mt-3 text-2xl font-medium tracking-tight text-neutral-100 sm:text-4xl md:text-5xl">
              Architectural Perspectives
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-xs text-neutral-400 sm:mt-4 sm:text-sm md:text-base">
              Scroll to explore our layered portfolio of bespoke residences and
              transformations.
            </p>
          </div>
          <Skiper17 />
        </section>

        <CTA />
      </div>
    </main>
  );
}
