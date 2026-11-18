import { ESTATE_STATS } from "@/data";
import type { StatItem } from "@/types";

interface StatsProps {
  stats?: StatItem[];
}

export function Stats({ stats = ESTATE_STATS }: StatsProps) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
      <h2 className="text-center text-2xl font-medium tracking-tight text-balance text-neutral-100 sm:text-3xl md:text-4xl">
        Proven Architectural Distinction
      </h2>
      <p className="mt-2 text-center text-sm text-muted-foreground sm:mt-3.5 sm:text-base md:text-xl">
        Curating visionary residences and benchmark luxury living spaces
      </p>

      <div className="mt-8 grid grid-cols-1 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/40 sm:mt-14 sm:grid-cols-2 md:grid-cols-3">
        {stats.map((item, index) => (
          <div
            key={item.label}
            className={`-m-px border-t border-l border-neutral-800 p-6 sm:p-8 md:p-10 ${
              index === 2 ? "sm:col-span-2 md:col-span-1" : ""
            }`}
          >
            <span className="text-3xl font-medium text-neutral-100 sm:text-4xl md:text-5xl">
              {item.value}
            </span>
            <p className="mt-2 text-sm text-neutral-400 sm:mt-4 sm:text-base md:text-lg">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Stats;
