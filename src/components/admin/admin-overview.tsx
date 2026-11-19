"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardStats } from "@/components/stats";
import { RevenueChart } from "@/components/revenue-chart";
import { CategoryRankChart } from "@/components/category-rank-chart";
import { QuickActions } from "@/components/quick-actions";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchProperties, getInitialProperties } from "@/lib/supabase";
import type { Property } from "@/types";
import { cn } from "@/lib/utils";
import {
  BuildingIcon,
  DatabaseIcon,
  PlusIcon,
  ArrowRightIcon,
  LayersIcon,
  ImagesIcon,
} from "lucide-react";

export function AdminOverview() {
  // Initialize immediately with existing data to avoid loading screen flash
  const [recentProperties, setRecentProperties] = useState<Property[]>(() =>
    getInitialProperties().slice(0, 4)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveSupabase, setIsLiveSupabase] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const res = await fetchProperties();
        if (isMounted) {
          setRecentProperties(res.data.slice(0, 4));
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

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-100 flex items-center gap-2">
              <BuildingIcon className="size-6 text-amber-400" />
              Villa Lumina Command Center
            </h1>
            <Badge
              variant="outline"
              className={
                isLiveSupabase
                  ? "border-emerald-500/30 text-emerald-400 text-xs"
                  : "border-amber-500/30 text-amber-400 text-xs"
              }
            >
              {isLiveSupabase ? "Supabase Live" : "Local Mock Store"}
            </Badge>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Real estate portfolio health, quick listings management, and active storage services.
          </p>
        </div>

        {/* Quick Route Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/properties"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "border-neutral-800 text-xs text-neutral-300 hover:text-white"
            )}
          >
            <LayersIcon className="size-3.5 mr-1.5" />
            Properties Directory
          </Link>

          <Link
            href="/admin/properties/new"
            className={cn(
              buttonVariants({ variant: "primary", size: "sm" }),
              "bg-amber-400 text-neutral-950 font-semibold hover:bg-amber-300 transition-colors text-xs"
            )}
          >
            <PlusIcon className="size-4 mr-1.5" />
            Add New Property
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <DashboardStats />

      {/* Primary Charts & Category Mix Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueChart />
        <CategoryRankChart />
      </div>

      {/* Two-Column Activity & Services Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Recent Properties Preview Table (2 cols) */}
        <Card className="lg:col-span-2 border-neutral-800 bg-neutral-900/60 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold text-neutral-100 flex items-center gap-2">
                <LayersIcon className="size-4 text-amber-400" />
                Recent Property Listings
              </CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Latest estates in your inventory with current asking prices.
              </CardDescription>
            </div>
            <Link
              href="/admin/properties"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-xs text-neutral-400 hover:text-neutral-100"
              )}
            >
              View All ({recentProperties.length}+)
              <ArrowRightIcon className="size-3.5 ml-1" />
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto rounded-lg border border-neutral-800/80">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-950/80 text-[11px] font-medium uppercase tracking-wider text-neutral-400">
                  <tr>
                    <th className="py-2.5 px-3">Property</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3">Price</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 text-xs">
                  {recentProperties.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-neutral-400">
                        <p className="font-medium text-neutral-300">No properties added yet.</p>
                        <p className="text-xs text-neutral-500 mt-1">Add your first estate listing to populate your portfolio.</p>
                        <Link
                          href="/admin/properties/new"
                          className={cn(
                            buttonVariants({ variant: "outline", size: "sm" }),
                            "mt-3 border-neutral-800 text-amber-400 hover:text-amber-300 text-xs inline-flex items-center"
                          )}
                        >
                          <PlusIcon className="size-3.5 mr-1" /> Add Property
                        </Link>
                      </td>
                    </tr>
                  ) : (
                    recentProperties.map((prop) => (
                      <tr
                        key={prop.id}
                        className="hover:bg-neutral-800/30 transition-colors"
                      >
                        <td className="py-2.5 px-3 font-medium text-neutral-200">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={prop.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=120&q=80"}
                              alt={prop.title}
                              className="h-8 w-11 rounded object-cover border border-neutral-800 shrink-0"
                            />
                            <span className="truncate max-w-[180px]">
                              {prop.title}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-neutral-400 truncate max-w-[140px]">
                          {prop.location}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-amber-400">
                          {prop.formattedPrice || `$${prop.price.toLocaleString()}`}
                        </td>
                        <td className="py-2.5 px-3 text-neutral-400 capitalize">
                          <Badge
                            variant="outline"
                            className="text-[10px] border-neutral-700 bg-neutral-950/60"
                          >
                            {prop.purpose === "buy" ? "For Sale" : "For Lease"}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <Link
                            href={`/admin/properties/${prop.id}/edit`}
                            className={cn(
                              buttonVariants({ variant: "ghost", size: "xs" }),
                              "text-amber-400 hover:text-amber-300 text-xs"
                            )}
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
          <div className="p-3 border-t border-neutral-800/80 bg-neutral-950/40 flex items-center justify-between">
            <span className="text-xs text-neutral-400">
              Showing top {recentProperties.length} estates
            </span>
            <Link
              href="/admin/properties"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-400/10"
              )}
            >
              Go to Dedicated Properties Page →
            </Link>
          </div>
        </Card>

        {/* Right: Quick Actions & Backend Services status */}
        <div className="space-y-6">
          <QuickActions />

          {/* Supabase & Services Status Widget */}
          <Card className="border-neutral-800 bg-neutral-900/60 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
                <DatabaseIcon className="size-4 text-emerald-400" />
                Backend Services
              </CardTitle>
              <CardDescription className="text-xs text-neutral-400">
                Storage buckets and database status.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950 p-2.5">
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${isLiveSupabase ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                  <span className="text-xs font-medium text-neutral-300">Supabase DB</span>
                </div>
                <Badge variant="outline" className={`text-[10px] ${isLiveSupabase ? "border-emerald-500/30 text-emerald-400" : "border-amber-500/30 text-amber-400"}`}>
                  {isLiveSupabase ? "Connected" : "Fallback Store"}
                </Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950 p-2.5">
                <div className="flex items-center gap-2">
                  <ImagesIcon className="size-3.5 text-neutral-400" />
                  <span className="text-xs font-medium text-neutral-300">Multi-Image Bucket</span>
                </div>
                <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">
                  realestate-bucket
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;
