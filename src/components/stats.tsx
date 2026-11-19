"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Delta, DeltaIcon, DeltaValue } from "@/components/delta";
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
        hint: "exclusive ownership",
        icon: <KeyRound className="size-5 text-emerald-400" />,
      },
      {
        label: "Lease & Rentals",
        value: `${forLeaseCount} Available`,
        delta: forLeaseCount > 0 ? 5.8 : 0,
        hint: "luxury rental yields",
        icon: <TrendingUp className="size-5 text-purple-400" />,
      },
    ];
  }, [properties]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <Card
          key={s.label}
          className="gap-2 border-neutral-800/80 bg-neutral-900/50 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-neutral-700/80 hover:bg-neutral-900/70"
        >
          <CardHeader className="flex flex-row items-center justify-between px-4">
            <CardTitle className="text-sm font-medium text-neutral-400">
              {s.label}
            </CardTitle>
            <div>{s.icon}</div>
          </CardHeader>
          <CardContent className="px-4 pb-0">
            <p className="text-lg font-bold tracking-tight text-neutral-100 tabular-nums md:text-xl">
              {s.value}
            </p>
            <div className="mt-0 flex items-center gap-1.5 text-xs">
              {s.delta !== 0 ? (
                <Delta value={s.delta} variant="default">
                  <DeltaIcon />
                  <DeltaValue />
                </Delta>
              ) : null}
              <span className="text-xs text-neutral-400">{s.hint}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default DashboardStats;
