"use client";

import React from "react";
import { LabelList, Pie, PieChart } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
} from "@/components/ui/chart";
import type { Property } from "@/types";

export type CategoryMixDatum = {
	category: string;
	share: number;
};

const SLICE_PALETTE = [
	"var(--chart-1)",
	"var(--chart-2)",
	"var(--chart-3)",
	"var(--chart-4)",
	"var(--chart-5)",
] as const;

const defaultEstateMix: readonly CategoryMixDatum[] = [
	{ category: "Luxury Estates", share: 38 },
	{ category: "Hillside Villas", share: 28 },
	{ category: "Modern Penthouses", share: 20 },
	{ category: "Coastal Retreats", share: 14 },
];

function buildSlices(mixData: readonly CategoryMixDatum[]): {
	chartConfig: ChartConfig;
	pieData: Array<{ key: string; category: string; share: number; fill: string }>;
} {
	const chartConfig: ChartConfig = {
		share: {
			label: "Share",
		},
	};

	const pieData = mixData.map((row, i) => {
		const key = `s${i}`;
		const color = SLICE_PALETTE[i % SLICE_PALETTE.length];
		chartConfig[key] = {
			label: row.category,
			color,
		};
		return {
			key,
			category: row.category,
			share: row.share,
			fill: `var(--color-${key})`,
		};
	});

	return { chartConfig, pieData };
}

interface CategoryRankChartProps {
	properties?: Property[];
}

export function CategoryRankChart({ properties = [] }: CategoryRankChartProps) {
	const activeMix = React.useMemo(() => {
		if (!properties || properties.length === 0) {
			return defaultEstateMix;
		}

		// Calculate distribution from actual properties
		const counts: Record<string, number> = {};
		for (const p of properties) {
			const typeKey = (p.type || "estate").toLowerCase();
			const label =
				typeKey === "estate"
					? "Luxury Estates"
					: typeKey === "villa"
					? "Hillside Villas"
					: typeKey === "penthouse"
					? "Penthouses"
					: typeKey === "townhouse"
					? "Townhouses"
					: "Apartments";
			counts[label] = (counts[label] || 0) + 1;
		}

		const total = properties.length;
		const calculated = Object.entries(counts).map(([category, count]) => ({
			category,
			share: Math.round((count / total) * 100),
		}));

		return calculated.length > 0 ? calculated : defaultEstateMix;
	}, [properties]);

	const { chartConfig, pieData } = React.useMemo(
		() => buildSlices(activeMix),
		[activeMix]
	);

	return (
		<Card className="border-neutral-800/80 bg-neutral-900/50 backdrop-blur-sm shadow-xl flex flex-col justify-between">
			<CardHeader className="pb-2">
				<CardTitle className="text-base font-semibold text-neutral-100">
					Portfolio Asset Allocation
				</CardTitle>
				<CardDescription className="text-xs text-neutral-400">
					Estate distribution across architectural categories.
				</CardDescription>
			</CardHeader>
			<CardContent className="my-auto p-2 pb-4">
				<ChartContainer
					className="aspect-auto h-64 w-full"
					config={chartConfig}
				>
					<PieChart accessibilityLayer>
						<Pie
							cornerRadius={6}
							data={pieData}
							dataKey="share"
							innerRadius={55}
							nameKey="key"
							outerRadius="88%"
							stroke="var(--card)"
							strokeWidth={3}
						>
							<LabelList
								className="fill-background font-medium"
								dataKey="share"
								fill="currentColor"
								fontWeight={600}
								formatter={(label) => {
									const n = Number(label);
									return Number.isFinite(n) ? `${n}%` : String(label ?? "");
								}}
								position="inside"
								stroke="none"
							/>
						</Pie>
						<ChartLegend
							content={
								<ChartLegendContent
									className="flex flex-wrap gap-3 pt-3 justify-center text-xs text-neutral-300"
									nameKey="key"
								/>
							}
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

export default CategoryRankChart;
