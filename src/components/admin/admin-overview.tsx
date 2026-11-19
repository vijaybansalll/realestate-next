"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardStats } from "@/components/stats";
import { QuickActions } from "@/components/quick-actions";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchProperties, getInitialProperties } from "@/lib/supabase";
import type { Property } from "@/types";
import { cn } from "@/lib/utils";
import {
  Building2,
  Plus,
  ArrowRight,
  Layers,
  Images,
  ExternalLink,
  MapPin,
  Sparkles,
} from "lucide-react";

export function AdminOverview() {
  const [allProperties, setAllProperties] = useState<Property[]>(() =>
    getInitialProperties()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveSupabase, setIsLiveSupabase] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setIsLoading(true);
        const res = await fetchProperties();
        if (isMounted) {
          setAllProperties(res.data);
          setIsLiveSupabase(res.isLiveSupabase);
        }
      } catch (err) {
        console.error("Failed to load overview properties", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const recentProperties = allProperties.slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Executive Command Header */}
      <div className="relative">
        <div className="pointer-events-none absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-neutral-100 sm:text-3xl">
              <Building2 className="size-7 shrink-0 text-amber-400" />
              Dashboard
            </h1>
          </div>

          {/* Quick Route Shortcuts */}
          <div className="flex shrink-0 flex-wrap items-center gap-2.5">
            <Link
              href="/admin/properties"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-1.5 border-neutral-800 bg-neutral-900/60 text-xs text-neutral-200 transition-colors hover:bg-neutral-800/80 hover:text-white"
              )}
            >
              <Layers className="size-3.5 text-neutral-400" />
              Properties Directory
            </Link>

            <Link
              href="/properties"
              target="_blank"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-1.5 border-neutral-800 bg-neutral-900/60 text-xs text-neutral-300 transition-colors hover:bg-neutral-800/80 hover:text-white"
              )}
            >
              Public Catalog
              <ExternalLink className="size-3 text-neutral-400" />
            </Link>

            <Link
              href="/admin/properties/new"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "gap-1.5 bg-amber-400 text-xs font-semibold text-neutral-950 shadow-md shadow-amber-400/10 transition-all hover:bg-amber-300"
              )}
            >
              <Plus className="size-4" />
              Add New Estate
            </Link>
          </div>
        </div>
      </div>

      {/* Dynamic Key Performance Indicator Grid */}
      <DashboardStats properties={allProperties} />

      {/* Two-Column Activity & Control Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Recent Properties Preview Table (2 cols) */}
        <Card className="flex flex-col justify-between border-neutral-800/80 bg-neutral-900/50 shadow-xl backdrop-blur-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-800/60 pb-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-neutral-100">
                <Layers className="size-4 text-amber-400" />
                Recent Portfolio Additions
              </CardTitle>
              <CardDescription className="mt-0.5 text-xs text-neutral-400">
                Latest architectural listings in your private collection.
              </CardDescription>
            </div>
            <Link
              href="/admin/properties"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "gap-1 text-xs text-neutral-400 transition-colors hover:bg-neutral-800/40 hover:text-amber-400"
              )}
            >
              View Directory ({allProperties.length})
              <ArrowRight className="size-3.5" />
            </Link>
          </CardHeader>

          <CardContent className="flex-1 p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-neutral-800/60 bg-neutral-950/60 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                  <tr>
                    <th className="px-4 py-3">Estate</th>
                    <th className="px-3 py-3">Location</th>
                    <th className="px-3 py-3">Price</th>
                    <th className="px-3 py-3">Category</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/50 text-xs">
                  {recentProperties.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-14 text-center">
                        <div className="mx-auto flex max-w-sm flex-col items-center justify-center gap-2">
                          <div className="flex size-12 items-center justify-center rounded-full border border-neutral-800 bg-neutral-950 text-amber-400/80">
                            <Building2 className="size-6" />
                          </div>
                          <p className="mt-1 text-sm font-semibold text-neutral-200">
                            Your Portfolio Is Currently Empty
                          </p>
                          <p className="text-xs text-neutral-400">
                            Create your first property listing with multiple
                            photos and custom specs to see it appear here.
                          </p>
                          <Link
                            href="/admin/properties/new"
                            className={cn(
                              buttonVariants({
                                variant: "default",
                                size: "sm",
                              }),
                              "mt-3 gap-1.5 bg-amber-400 text-xs font-semibold text-neutral-950 hover:bg-amber-300"
                            )}
                          >
                            <Plus className="size-3.5" /> Add First Estate
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    recentProperties.map((prop) => (
                      <tr
                        key={prop.id}
                        className="group transition-colors hover:bg-neutral-800/30"
                      >
                        <td className="px-4 py-3 font-medium text-neutral-200">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md border border-neutral-800 bg-neutral-950">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={
                                  (Array.isArray(prop.images) &&
                                    prop.images[0]) ||
                                  prop.image ||
                                  "/images/canadian-wooden-house.jpg"
                                }
                                alt={prop.title}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                            <div className="flex min-w-0 flex-col">
                              <span className="max-w-[200px] truncate font-medium text-neutral-100 transition-colors group-hover:text-amber-300">
                                {prop.title}
                              </span>
                              <span className="truncate text-[11px] text-neutral-500">
                                {prop.bhk ? `${prop.bhk} BHK • ` : ""}
                                {prop.size || "Luxury Estate"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="max-w-[150px] truncate px-3 py-3 text-neutral-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3 shrink-0 text-neutral-500" />
                            <span className="truncate">{prop.location}</span>
                          </span>
                        </td>
                        <td className="px-3 py-3 font-semibold whitespace-nowrap text-amber-400">
                          {prop.formattedPrice ||
                            `$${Number(prop.price).toLocaleString()}`}
                        </td>
                        <td className="px-3 py-3">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] font-medium tracking-wider capitalize uppercase",
                              prop.purpose === "buy"
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                : "border-blue-500/30 bg-blue-500/10 text-blue-400"
                            )}
                          >
                            {prop.purpose === "buy" ? "For Sale" : "For Lease"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/admin/properties/${prop.id}/edit`}
                              className={cn(
                                buttonVariants({
                                  variant: "outline",
                                  size: "xs",
                                }),
                                "border-neutral-800 text-xs text-neutral-300 hover:border-neutral-700 hover:text-white"
                              )}
                            >
                              Edit
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>

          <div className="flex items-center justify-between border-t border-neutral-800/80 bg-neutral-950/40 p-3.5 text-xs text-neutral-400">
            <span>
              Showing {recentProperties.length} of {allProperties.length} total
              estates in portfolio
            </span>
            <Link
              href="/admin/properties"
              className="inline-flex items-center gap-1 font-medium text-amber-400 transition-colors hover:text-amber-300"
            >
              Full Estate Inventory →
            </Link>
          </div>
        </Card>

        {/* Right: Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;
