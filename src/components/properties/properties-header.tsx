import Link from "next/link";
import { ArrowLeft, Home as HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/common";

export interface PropertiesHeaderProps {
  totalCount: number;
}

export function PropertiesHeader({ totalCount }: PropertiesHeaderProps) {
  return (
    <>
      {/* Navigation Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400"
      >
        <Link
          href="/"
          className="flex items-center gap-1 transition-colors hover:text-neutral-900 dark:hover:text-neutral-200"
        >
          <HomeIcon className="size-3.5" />
          <span>Home</span>
        </Link>
        <span aria-hidden="true">/</span>
        <span className="font-medium text-neutral-900 dark:text-neutral-200">Estates Catalog</span>
      </nav>

      {/* Page Header */}
      <header className="mb-8 border-b border-neutral-200/80 pb-8 dark:border-neutral-800/80">
        <SectionHeader
          align="between"
          badge="Curated Portfolio"
          badgeExtra={
            <span className="inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300">
              {totalCount} Estates Available
            </span>
          }
          title="Architectural Estates & Residences"
          titleAs="h1"
          size="xl"
          description="Browse our premier portfolio of coastal retreats, hillside villas, and penthouses available for private acquisition and luxury lease."
          action={
            <Button
              variant="secondary"
              size="sm"
              className="hidden sm:inline-flex"
              render={<Link href="/" />}
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Walkthrough</span>
            </Button>
          }
        />
      </header>
    </>
  );
}

export default PropertiesHeader;
