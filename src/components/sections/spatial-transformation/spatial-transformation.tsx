"use client";

import Image from "next/image";
import { BeforeAfterSlider } from "./before-after-slider";
import { SectionHeader } from "@/components/common";

export function SpatialTransformation() {
  return (
    <section
      id="transformation"
      className="grid grid-cols-1 items-center gap-8"
    >
      <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
        <div className="w-full lg:w-1/2">
          <SectionHeader
            badge="Transformation"
            title="Restoration & Spatial Architecture"
            titleAs="h3"
            size="default"
            description="Every property undergoes a comprehensive visual and architectural assessment. Drag the slider to witness our bespoke spatial staging and atmospheric illumination."
          />
        </div>

        <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl lg:w-1/2">
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
