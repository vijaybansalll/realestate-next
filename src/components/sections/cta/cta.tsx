import Link from "next/link";
import {
  ArrowUpRight,
  Sparkles,
  Compass,
  Home,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section id="contact" className="px-4 py-12 sm:px-6 sm:py-16">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/90 p-6 shadow-2xl backdrop-blur-xl sm:p-10 md:p-14">
        {/* Aurora Silk Fade Gradient */}
        <div
          className="absolute inset-0 z-0 opacity-25"
          style={{
            background:
              "linear-gradient(150deg, #FFAB91 0%, #FFCDD2 20%, #FCE4EC 40%, #e2daf1 60%, #b39ddb 80%, #8b6ac8 100%)",
          }}
        />

        {/* Circuit Board / Architectural Grid Pattern */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-60"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
              repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(75, 85, 99, 0.08) 19px, rgba(75, 85, 99, 0.08) 20px, transparent 20px, transparent 39px, rgba(75, 85, 99, 0.08) 39px, rgba(75, 85, 99, 0.08) 40px),
              radial-gradient(circle at 20px 20px, rgba(55, 65, 81, 0.12) 2px, transparent 2px),
              radial-gradient(circle at 40px 40px, rgba(55, 65, 81, 0.12) 2px, transparent 2px)
            `,
            backgroundSize: "40px 40px, 40px 40px, 40px 40px, 40px 40px",
          }}
        />

        {/* Floating Architectural Icons */}
        <div className="absolute top-1/2 right-20 -translate-y-1/2">
          <div className="relative flex size-20 items-center justify-center border border-neutral-100/40 bg-neutral-100/10 max-md:hidden">
            <Sparkles className="size-12 fill-neutral-100/10 stroke-[1px] text-neutral-100/80" />
            <div className="absolute -inset-y-12 -left-px border-s border-dashed border-neutral-100/60 mask-y-from-75%" />
            <div className="absolute -inset-y-12 -right-px border-e border-dashed border-neutral-100/60 mask-y-from-75%" />
            <div className="absolute -inset-x-12 -top-px border-t border-dashed border-neutral-100/80 mask-x-from-75%" />
            <div className="absolute -inset-x-12 -bottom-px border-b border-dashed border-neutral-100/80 mask-x-from-75%" />
          </div>
          <div className="relative flex size-20 -translate-x-full items-center justify-center border border-neutral-100/40 bg-neutral-100/10 max-md:hidden">
            <Home className="size-12 fill-neutral-100/10 stroke-[1px] text-neutral-100/80" />
            <div className="absolute -inset-y-12 -left-px border-s border-dashed border-neutral-100/60 mask-y-from-75%" />
            <div className="absolute -inset-y-12 -right-px border-e border-dashed border-neutral-100/60 mask-y-from-75%" />
            <div className="absolute -inset-x-12 -top-px border-t border-dashed border-neutral-100/80 mask-x-from-75%" />
            <div className="absolute -inset-x-12 -bottom-px border-b border-dashed border-neutral-100/80 mask-x-from-75%" />
          </div>
          <div className="relative flex size-20 items-center justify-center border border-neutral-100/40 bg-neutral-100/10 max-md:hidden">
            <Compass className="size-12 fill-neutral-100/10 stroke-[1px] text-neutral-100/80" />
            <div className="absolute -inset-y-12 -left-px border-s border-dashed border-neutral-100/60 mask-y-from-75%" />
            <div className="absolute -inset-y-12 -right-px border-e border-dashed border-neutral-100/60 mask-y-from-75%" />
            <div className="absolute -inset-x-12 -top-px border-t border-dashed border-neutral-100/80 mask-x-from-75%" />
            <div className="absolute -inset-x-12 -bottom-px border-b border-dashed border-neutral-100/80 mask-x-from-75%" />
          </div>
        </div>

        <div className="absolute top-1/2 right-20 -translate-y-1/2">
          <div className="relative flex size-20 translate-x-full items-center justify-center border border-neutral-100/40 bg-neutral-100/10 mask-r-from-75% max-md:hidden">
            <ShieldCheck className="size-12 fill-neutral-100/10 stroke-[1px] text-neutral-100/80" />
            <div className="absolute -inset-y-12 -left-px border-s border-dashed border-neutral-100/60 mask-y-from-75%" />
            <div className="absolute -inset-y-12 -right-px border-e border-dashed border-neutral-100/60 mask-y-from-75%" />
            <div className="absolute -inset-x-12 -top-px border-t border-dashed border-neutral-100/80 mask-x-from-75%" />
            <div className="absolute -inset-x-12 -bottom-px border-b border-dashed border-neutral-100/80 mask-x-from-75%" />
          </div>
        </div>

        <div className="relative isolate">
          <h2 className="text-2xl font-medium tracking-tight text-balance text-neutral-100 sm:text-3xl md:text-4xl md:leading-tight lg:text-[2.75rem]">
            Turn your architectural vision into reality
          </h2>
          <p className="mt-3 text-sm/relaxed text-balance text-neutral-300 sm:mt-4 sm:text-base/relaxed md:text-xl/normal">
            Connect with our private client advisory team to schedule an
            exclusive viewing or commission a bespoke estate tailored to your
            lifestyle.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-9 sm:flex-row">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              render={<Link href="#contact" />}
            >
              <span>Schedule Private Tour</span>
              <ArrowUpRight className="ml-1 size-4" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
              render={<Link href="#properties" />}
            >
              Explore Portfolio
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
