import {
  HouseWalkthrough,
  AccordionGallery,
  SpatialTransformation,
  FeaturedProperties,
  StickyShowcase,
  Stats,
  CTA,
} from "@/components/sections";
import { SectionHeader } from "@/components/common";
import { PORTFOLIO_GALLERY_ITEMS } from "@/data";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-neutral-50 font-sans text-neutral-900 transition-colors duration-200 selection:bg-amber-500 selection:text-neutral-950 dark:bg-neutral-950 dark:text-neutral-100">
      <HouseWalkthrough />

      <div className="container mx-auto">
        <section
          id="properties"
          className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 sm:py-20 lg:px-8"
        >
          <SectionHeader
            align="center"
            badge="Curated Portfolio"
            title="Featured Architectural Estates"
            size="lg"
            description="Explore our handpicked collection of modern residences, prime coastal retreats, and architectural masterpieces."
            className="mb-8 sm:mb-12"
          />

          <AccordionGallery
            items={PORTFOLIO_GALLERY_ITEMS}
            defaultIndex={0}
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
            autoPlay={true}
            autoPlayInterval={2000}
            pauseOnHover={true}
          />
        </section>
        <Stats />
        <SpatialTransformation />

        <FeaturedProperties />

        <section id="showcase" className="relative w-full py-8 sm:py-12">
          <div className="mb-0 px-4 text-center">
            <span className="text-xs font-semibold tracking-[0.25em] text-amber-500 uppercase dark:text-amber-400">
              Interactive Showcase
            </span>
            <h2 className="mt-3 text-2xl font-medium tracking-tight text-neutral-900 sm:text-4xl md:text-5xl dark:text-neutral-100">
              Architectural Perspectives
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-xs text-neutral-600 sm:mt-4 sm:text-sm md:text-base dark:text-neutral-400">
              Scroll to explore our layered portfolio of bespoke residences and
              transformations.
            </p>
          </div>
          <StickyShowcase />
        </section>

        <CTA />
      </div>
    </main>
  );
}
