"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Delta, DeltaIcon, DeltaValue } from "./delta";
import type { Property } from "@/types";
import { DollarSign, Building2, KeyRound, TrendingUp } from "lucide-react";

interface DashboardStatsProps {
  properties?: Property[];
}

export function DashboardStats({ properties = [] }: DashboardStatsProps) {
  const stats = useMemo(() => {
    const count = properties.length;
    const totalValue = properties.reduce(
      (sum, p) => sum + (Number(p.price) || 0),
      0
    );
    const forSaleCount = properties.filter((p) => p.purpose === "buy").length;
    const forLeaseCount = properties.filter((p) => p.purpose === "rent").length;

    const formatCurrency = (val: number) => {
      if (val >= 1_000_000) {
        return `$${(val / 1_000_000).toFixed(1)}M`;
      }
      if (val >= 1_000) {
        return `$${(val / 1_000).toFixed(0)}K`;
      }
      return `$${val.toLocaleString()}`;
    };

    return [
      {
        label: "Portfolio Valuation",
        value: count > 0 ? formatCurrency(totalValue) : "$0.00",
        delta: count > 0 ? 14.2 : 0,
        hint: count > 0 ? "live inventory value" : "add estates to value",
        icon: <DollarSign className="size-5 text-amber-400" />,
      },
      {
        label: "Active Residences",
        value: `${count} Estates`,
        delta: count > 0 ? 8.5 : 0,
        hint: count > 0 ? "live in catalog" : "awaiting first listing",
        icon: <Building2 className="size-5 text-blue-400" />,
      },
      {
        label: "Acquisition (For Sale)",
        value: `${forSaleCount} Listed`,
        delta: forSaleCount > 0 ? 12.0 : 0,
        hint: `${forSaleCount} freehold estates`,
        icon: <TrendingUp className="size-5 text-emerald-400" />,
      },
      {
        label: "Exclusive Leases",
        value: `${forLeaseCount} Available`,
        delta: forLeaseCount > 0 ? 5.8 : 0,
        hint: `${forLeaseCount} luxury rentals`,
        icon: <KeyRound className="size-5 text-purple-400" />,
      },
    ];
  }, [properties]);

  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <Card
          key={s.label}
          className="border-neutral-200 bg-white shadow-xs transition-shadow hover:shadow-md dark:border-neutral-800/80 dark:bg-neutral-900/60"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              {s.label}
            </CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
              {s.icon}
            </div>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              {s.value}
            </div>
            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
              <span>{s.hint}</span>
              {s.delta !== 0 ? (
                <Delta value={s.delta} variant="default">
                  <DeltaIcon />
                  <DeltaValue />
                </Delta>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
