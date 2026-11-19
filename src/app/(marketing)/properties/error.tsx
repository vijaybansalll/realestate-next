"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PropertiesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service in production
    console.error("Properties route error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-neutral-50 px-4 py-24 text-center text-neutral-900 transition-colors duration-200 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="mx-auto max-w-md">
        <div className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400">
          <AlertTriangle className="size-7" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Unable to Load Estates
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm dark:text-neutral-400">
          An unexpected error occurred while fetching the properties catalog.
          Please try again or return to the main walkthrough.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Button variant="secondary" size="sm" render={<Link href="/" />}>
            <Home className="mr-1.5 size-3.5" />
            Home Walkthrough
          </Button>
          <Button variant="primary" size="sm" onClick={() => reset()}>
            <RotateCcw className="mr-1.5 size-3.5" />
            Try Again
          </Button>
        </div>
      </div>
    </main>
  );
}
