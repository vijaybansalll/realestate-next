"use client";

import Image from "next/image";
import { BeforeAfterSlider } from "./before-after-slider";

export function SpatialTransformation() {
  return (
    <section
      id="transformation"
      className="grid grid-cols-1 items-center gap-8"
    >
      <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
        <div className="w-full lg:w-1/2">
          <span className="text-xs font-semibold tracking-widest text-amber-400 uppercase">
            Transformation
          </span>
          <h3 className="mt-2 text-2xl font-medium text-neutral-100 sm:text-3xl">
            Restoration & Spatial Architecture
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400 sm:text-base">
            Every property undergoes a comprehensive visual and architectural
            assessment. Drag the slider to witness our bespoke spatial staging
            and atmospheric illumination.
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
              <div className="relative h-full w-full">
                <Image
                  src="/architect-blueprint-plan.png"
                  alt="Architectural property map blueprint"
                  fill
                  draggable={false}
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            }
            after={
              <div className="relative h-full w-full">
                <Image
                  src="/property-built-after.png"
                  alt="Completed architectural property built"
                  fill
                  draggable={false}
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
}

export default SpatialTransformation;
