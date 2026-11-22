import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SectionBadge,
  SectionHeading,
  SectionDescription,
} from "@/components/common";

export function CTA() {
  return (
    <section id="contact" className="px-4 py-12 sm:px-6 sm:py-20">
      <div className="group relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-neutral-200/80 shadow-2xl dark:border-neutral-800/80">
        {/* Background Image: Canadian Wooden House */}
        <Image
          src="/images/canadian-wooden-house.jpg"
          alt="Canadian architectural timber residence"
          fill
          priority={false}
          className="object-cover object-right transition-transform duration-1000 ease-out group-hover:scale-105 md:object-center"
          sizes="(max-width: 1280px) 100vw, 1280px"
        />

        {/* Black Gradient Overlay: Deep black on left, fading out to transparent on right */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/40 md:bg-gradient-to-r md:from-neutral-950 md:via-neutral-950/90 md:via-55% md:to-transparent" />

        {/* Left-Aligned Content Container */}
        <div className="relative z-10 max-w-2xl px-6 py-8 text-left sm:px-12 lg:px-16 lg:py-16">
          {/* Eyebrow */}
          <SectionBadge variant="glow">
            Private Architectural Advisory
          </SectionBadge>

          {/* Heading */}
          <SectionHeading size="lg" className="mt-4 text-white">
            Turn your architectural vision into reality
          </SectionHeading>

          {/* Subtitle */}
          <SectionDescription className="mt-4 max-w-lg text-neutral-300">
            Connect with our private client concierge to coordinate an exclusive
            showing or commission a bespoke timber retreat tailored to your
            lifestyle.
          </SectionDescription>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button
              variant="primary"
              size="lg"
              className="w-full rounded-full px-7 sm:w-auto"
              render={<Link href="/contact-us" />}
            >
              <span>Schedule Private Tour</span>
              <ArrowUpRight className="ml-1.5 size-4" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full rounded-full border border-white/20 bg-white/10 text-white shadow-xs backdrop-blur-md hover:bg-white/20 hover:text-white sm:w-auto"
              render={<Link href="/properties" />}
            >
              <span>Explore Portfolio</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
