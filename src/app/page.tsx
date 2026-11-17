"use client";

import HouseWalkthrough from "@/components/HouseWalkthrough";
import AccordionGallery from "@/components/AccordionGallery";
import { BeforeAfterSlider } from "@/components/motion/before-after-slider";
import Card14Demo from "@/components/PropertyCard";
import {
  ShieldCheck,
  Compass,
  KeyRound,
  Gem,
  Building2,
  Camera,
  Layers,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";
import CarouselDemo from "@/components/carousel";

export default function Home() {
  const items = [
    {
      image: "https://picsum.photos/id/1015/900/1200",
      label: "Canyon",
      link: "#",
    },
    {
      image: "https://picsum.photos/id/1018/900/1200",
      label: "Ridgeline",
      link: "#",
    },
    {
      image: "https://picsum.photos/id/1039/900/1200",
      label: "Falls",
      link: "#",
    },
  ];

  const PHOTO =
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80";

  return (
    <main className="relative min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      {/* Home / Hero Interactive Scroll Walkthrough Section */}
      <section id="walkthrough" className="relative">
        <HouseWalkthrough />
      </section>

      {/* Properties Section */}
      <section
        id="properties"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="mb-12 text-center">
          <span className="text-xs font-semibold tracking-[0.25em] text-amber-400 uppercase">
            Curated Portfolio
          </span>
          <h2 className="mt-3 text-3xl font-medium tracking-tight text-white sm:text-4xl md:text-5xl">
            Featured Architectural Estates
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-400 sm:text-base">
            Explore our handpicked collection of modern residences, prime
            coastal retreats, and architectural masterpieces.
          </p>
        </div>

        {/* Gallery */}
        <div className="mb-16">
          <AccordionGallery
            items={items}
            defaultIndex={2}
            expandRatio={0.52}
            trigger="hover"
            accentColor="#ffffff"
            overlayColor="#060010"
            textColor="#ffffff"
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

        {/* Featured Card & Transformation Showcase */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div className="flex justify-center">
            <Card14Demo />
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <span className="text-xs font-semibold tracking-widest text-amber-400 uppercase">
                Transformation
              </span>
              <h3 className="mt-2 text-2xl font-medium text-white sm:text-3xl">
                Restoration & Spatial Architecture
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Every property undergoes a comprehensive visual and
                architectural assessment. Drag the slider to witness our bespoke
                spatial staging and atmospheric illumination.
              </p>
            </div>

            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-800 shadow-2xl">
              <BeforeAfterSlider
                before={
                  <img
                    src={PHOTO}
                    alt="Lake house at dawn, unedited"
                    draggable={false}
                    className="h-full w-full object-cover brightness-90 contrast-75 grayscale"
                  />
                }
                after={
                  <img
                    src={PHOTO}
                    alt="Lake house at dawn, color graded"
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
    </main>
  );
}
