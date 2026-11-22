"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardStats } from "./dashboard-stats";
import { QuickActions } from "./quick-actions";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  fetchProperties,
  getInitialProperties,
  subscribeToProperties,
} from "@/lib/supabase";
import type { Property } from "@/types";
import { cn } from "@/lib/utils";
import {
  Building2,
  Plus,
  ArrowRight,
  Layers,
  ExternalLink,
  MapPin,
} from "lucide-react";

export function AdminOverview() {
  const [allProperties, setAllProperties] = useState<Property[]>(() =>
    getInitialProperties()
  );

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const res = await fetchProperties();
        if (isMounted) {
          setAllProperties(res.data);
        }
      } catch (err) {
        console.error("Failed to load overview properties", err);
      }
    }
    loadData();

    // Reactive subscription to sync dashboard overview immediately
    const unsubscribe = subscribeToProperties((updatedList) => {
      if (isMounted) {
        setAllProperties(updatedList);
      }
    });

    const handleFocus = () => {
      fetchProperties().then((res) => {
        if (isMounted && res.data) {
          setAllProperties(res.data);
        }
      });
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      isMounted = false;
      unsubscribe();
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const recentProperties = allProperties.slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Executive Command Header */}
      <div className="relative">
        <div className="pointer-events-none absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-100">
              <Building2 className="size-6 shrink-0 text-amber-500 sm:size-7 dark:text-amber-400" />
              Dashboard
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Executive overview of portfolio metrics and active property
              listings.
            </p>
          </div>

          {/* Quick Route Shortcuts */}
          <div className="grid w-full grid-cols-2 items-center gap-2 sm:flex sm:w-auto sm:flex-wrap">
            <Link
              href="/admin/properties"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-1.5 border-neutral-200 bg-white text-xs text-neutral-800 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-200 dark:hover:bg-neutral-800/80 dark:hover:text-white"
              )}
            >
              <Layers className="size-3.5 text-amber-500 dark:text-amber-400" />
              Properties
            </Link>

            <Link
              href="/properties"
              target="_blank"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-1.5 border-neutral-200 bg-white text-xs text-neutral-800 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-300 dark:hover:bg-neutral-800/80 dark:hover:text-white"
              )}
            >
              Public Catalog
              <ExternalLink className="size-3 text-amber-500 dark:text-amber-400" />
            </Link>

            <Link
              href="/admin/properties/new"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "col-span-2 gap-1.5 bg-amber-500 text-xs font-semibold text-neutral-950 shadow-md shadow-amber-500/10 transition-all hover:bg-amber-400 sm:col-span-1 dark:bg-amber-400 dark:hover:bg-amber-300"
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
        <Card className="flex flex-col justify-between border-neutral-200 bg-white shadow-md lg:col-span-2 dark:border-neutral-800/80 dark:bg-neutral-900/50 dark:shadow-xl">
          <CardHeader className="flex flex-col gap-3 border-b border-neutral-200 pb-3.5 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800/60">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-neutral-900 dark:text-neutral-100">
                <Layers className="size-4 text-amber-500 dark:text-amber-400" />
                Recent Portfolio Additions
              </CardTitle>
              <CardDescription className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                Latest architectural listings in your private collection.
              </CardDescription>
            </div>
            <Link
              href="/admin/properties"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "gap-1 self-start text-xs text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 sm:self-auto dark:text-neutral-400 dark:hover:bg-neutral-800/40 dark:hover:text-amber-400"
              )}
            >
              View Directory ({allProperties.length})
              <ArrowRight className="size-3.5" />
            </Link>
          </CardHeader>

          <CardContent className="flex-1 p-0">
            {/* Desktop Table View (md and above) */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] font-semibold tracking-wider text-neutral-600 uppercase dark:border-neutral-800/60 dark:bg-neutral-950/60 dark:text-neutral-400">
                  <tr>
                    <th className="px-4 py-3">Estate</th>
                    <th className="px-3 py-3">Location</th>
                    <th className="px-3 py-3">Price</th>
                    <th className="px-3 py-3">Category</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-xs dark:divide-neutral-800/50">
                  {recentProperties.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-14 text-center">
                        <div className="mx-auto flex max-w-sm flex-col items-center justify-center gap-2">
                          <div className="flex size-12 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-amber-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-amber-400/80">
                            <Building2 className="size-6" />
                          </div>
                          <p className="mt-1 text-sm font-semibold text-neutral-900 dark:text-neutral-200">
                            Your Portfolio Is Currently Empty
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
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
                              "mt-3 gap-1.5 bg-amber-500 text-xs font-semibold text-neutral-950 hover:bg-amber-400 dark:bg-amber-400 dark:hover:bg-amber-300"
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
                        className="group transition-colors hover:bg-neutral-50/80 dark:hover:bg-neutral-800/30"
                      >
                        <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-200">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950">
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
                              <span className="max-w-[200px] truncate font-medium text-neutral-900 transition-colors group-hover:text-amber-600 dark:text-neutral-100 dark:group-hover:text-amber-300">
                                {prop.title}
                              </span>
                              <span className="truncate text-[11px] text-neutral-500 dark:text-neutral-400">
                                {prop.bhk ? `${prop.bhk} BHK • ` : ""}
                                {prop.size || "Luxury Estate"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="max-w-[150px] truncate px-3 py-3 text-neutral-600 dark:text-neutral-200">
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3 shrink-0 text-amber-400 dark:text-amber-500" />
                            <span className="truncate">{prop.location}</span>
                          </span>
                        </td>
                        <td className="px-3 py-3 font-semibold whitespace-nowrap text-amber-600 dark:text-amber-400">
                          {prop.formattedPrice ||
                            `$${Number(prop.price).toLocaleString()}`}
                        </td>
                        <td className="px-3 py-3">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] font-medium tracking-wider capitalize uppercase",
                              prop.purpose === "buy"
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400"
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
                                "border-neutral-200 text-xs text-neutral-700 hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:text-black"
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

            {/* Mobile Card List View (<md) */}
            <div className="block divide-y divide-neutral-200 md:hidden dark:divide-neutral-800/60">
              {recentProperties.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-amber-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-amber-400/80">
                    <Building2 className="size-6" />
                  </div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-200">
                    No Estates in Portfolio
                  </p>
                  <Link
                    href="/admin/properties/new"
                    className={cn(
                      buttonVariants({ variant: "default", size: "sm" }),
                      "mt-3 gap-1.5 bg-amber-500 text-xs font-semibold text-neutral-950 hover:bg-amber-400 dark:bg-amber-400"
                    )}
                  >
                    <Plus className="size-3.5" /> Add First Estate
                  </Link>
                </div>
              ) : (
                recentProperties.map((prop) => (
                  <div key={prop.id} className="space-y-3 p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            (Array.isArray(prop.images) && prop.images[0]) ||
                            prop.image ||
                            "/images/canadian-wooden-house.jpg"
                          }
                          alt={prop.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                            {prop.title}
                          </span>
                        </div>
                        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-neutral-500 dark:text-neutral-400">
                          <MapPin className="size-3 shrink-0" />
                          <span className="truncate">{prop.location}</span>
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              "px-1.5 py-0 text-[9px] font-semibold tracking-wider uppercase",
                              prop.purpose === "buy"
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            )}
                          >
                            {prop.purpose === "buy" ? "For Sale" : "For Lease"}
                          </Badge>
                          <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                            {prop.formattedPrice ||
                              `$${Number(prop.price).toLocaleString()}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-neutral-100 pt-1 dark:border-neutral-800/40">
                      <span className="text-[11px] text-neutral-500">
                        {prop.bhk ? `${prop.bhk} BHK • ` : ""}
                        {prop.size || "Luxury Estate"}
                      </span>
                      <Link
                        href={`/admin/properties/${prop.id}/edit`}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "xs" }),
                          "h-8 border-neutral-200 px-3 text-xs dark:border-neutral-800"
                        )}
                      >
                        Edit Listing
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>

          <div className="flex flex-col justify-between gap-2 border-t border-neutral-200 bg-neutral-50/60 p-3 text-xs text-neutral-600 sm:flex-row sm:items-center sm:p-3.5 dark:border-neutral-800/80 dark:bg-neutral-950/40 dark:text-neutral-400">
            <span>
              Showing {recentProperties.length} of {allProperties.length} total
              estates in portfolio
            </span>
            <Link
              href="/admin/properties"
              className="inline-flex items-center gap-1 font-medium text-amber-600 transition-colors hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
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
