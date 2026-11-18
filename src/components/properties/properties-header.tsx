import Link from "next/link";
import { ArrowLeft, Home as HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PropertiesHeaderProps {
  totalCount: number;
}

export function PropertiesHeader({ totalCount }: PropertiesHeaderProps) {
  return (
    <>
      {/* Navigation Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-2 text-xs text-neutral-400"
      >
        <Link
          href="/"
          className="flex items-center gap-1 transition-colors hover:text-neutral-200"
        >
          <HomeIcon className="size-3.5" />
          <span>Home</span>
        </Link>
        <span aria-hidden="true">/</span>
        <span className="font-medium text-neutral-200">Estates Catalog</span>
      </nav>

      {/* Page Header */}
      <header className="mb-8 flex flex-col gap-4 border-b border-neutral-800/80 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wider text-amber-400 uppercase">
              Curated Portfolio
            </span>
            <span className="inline-flex items-center rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[11px] font-medium text-amber-300">
              {totalCount} Estates Available
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-medium tracking-tight text-neutral-100 sm:text-5xl">
            Architectural Estates & Residences
          </h1>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-neutral-400 sm:text-sm">
            Browse our premier portfolio of coastal retreats, hillside villas,
            and penthouses available for private acquisition and luxury lease.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="hidden sm:inline-flex"
          render={<Link href="/" />}
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Walkthrough</span>
        </Button>
      </header>
    </>
  );
}

export default PropertiesHeader;
