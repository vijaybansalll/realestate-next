"use client";

import { useId, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { formatChartAxisTick, formatChartTooltipDate } from "@/components/formater";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Delta, DeltaIcon, DeltaValue } from "@/components/delta";
import { revenueChartDemo } from "@/components/revenue-chart-data";

/** Matches `<Select>`; chart uses the last N days of `revenueChartDemo`. */
type PeriodDays = 7 | 14 | 30 | 60 | 90;

const xAxisIntervalByPeriod: Record<PeriodDays, number> = {
	7: 0,
	14: 1,
	30: 3,
	60: 4,
	90: 6,
};

type RevenueRow = {
	date: string;
	revenue: number;
};

const chartConfig = {
	revenue: {
		label: "Volume ($)",
		color: "var(--chart-1)",
	},
} satisfies ChartConfig;

export function RevenueChart() {
	const chartUid = useId().replace(/:/g, "");
	const idAreaGradient = `revenue-area-grad-${chartUid}`;
	const [periodDays, setPeriodDays] = useState<PeriodDays>(60);

	const chartRows = useMemo(
		() => revenueChartDemo.slice(-periodDays),
		[periodDays]
	);

	// Footer delta: first → last point in the active series
	const growthPct = useMemo(() => {
		const first = chartRows[0]?.revenue ?? 0;
		const last = chartRows.at(-1)?.revenue ?? first;
		if (!first) {
			return 0;
		}
		return ((last - first) / first) * 100;
	}, [chartRows]);

	let xAxisMinTickGap: number | undefined;
	if (periodDays <= 7) {
		xAxisMinTickGap = undefined;
	} else {
		xAxisMinTickGap = Math.max(8, Math.min(52, Math.floor(periodDays / 2)));
	}

	return (
		<Card className="border-neutral-800/80 bg-neutral-900/50 backdrop-blur-sm shadow-xl">
			<CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-2">
				<div>
					<CardTitle className="text-base font-semibold text-neutral-100">
						Portfolio Acquisition Trajectory
					</CardTitle>
					<CardDescription className="text-xs text-neutral-400">
						Estate inquiries and pipeline valuation volume.
					</CardDescription>
				</div>
				<Select
					onValueChange={(v) => {
						setPeriodDays(Number(v) as PeriodDays);
					}}
					value={String(periodDays)}
				>
					<SelectTrigger
						aria-label="Revenue time range"
						className="w-full min-w-36 sm:w-fit bg-neutral-950/60 border-neutral-800 text-xs text-neutral-200"
						size="sm"
					>
						<SelectValue placeholder="Range" />
					</SelectTrigger>
					<SelectContent align="end" className="bg-neutral-900 border-neutral-800 text-neutral-200">
						<SelectItem value="7">Last 7 days</SelectItem>
						<SelectItem value="14">Last 14 days</SelectItem>
						<SelectItem value="30">Last 30 days</SelectItem>
						<SelectItem value="60">Last 60 days</SelectItem>
						<SelectItem value="90">Last 90 days</SelectItem>
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent className="pt-2">
				<ChartContainer
					className="aspect-auto h-60 w-full p-0"
					config={chartConfig}
				>
					<AreaChart
						accessibilityLayer
						data={[...chartRows]}
						margin={{ left: 24, right: 8, top: 8, bottom: 0 }}
					>
						<defs>
							<linearGradient id={idAreaGradient} x1="0" x2="0" y1="0" y2="1">
								<stop
									offset="0%"
									stopColor="var(--color-revenue)"
									stopOpacity={0.25}
								/>
								<stop
									offset="100%"
									stopColor="var(--color-revenue)"
									stopOpacity={0}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid horizontal={false} strokeDasharray="2 2" stroke="#262626" />
						<XAxis
							axisLine={false}
							dataKey="date"
							interval={xAxisIntervalByPeriod[periodDays]}
							minTickGap={xAxisMinTickGap}
							tickFormatter={(value) =>
								formatChartAxisTick(String(value), periodDays)
							}
							tickLine={false}
							tickMargin={8}
							stroke="#737373"
							fontSize={11}
						/>
						<ChartTooltip
							content={
								<ChartTooltipContent
									className="min-w-36 bg-neutral-900 border-neutral-800 text-neutral-100"
									indicator="line"
									labelFormatter={(_, payload) => {
										const row = payload?.[0]?.payload as RevenueRow | undefined;
										if (!row?.date) {
											return "";
										}
										return formatChartTooltipDate(row.date, "short");
									}}
								/>
							}
						/>
						<Area
							dataKey="revenue"
							dot={false}
							fill={`url(#${idAreaGradient})`}
							stroke="var(--color-revenue)"
							strokeWidth={2}
							type="monotone"
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex items-center justify-between pt-2 border-t border-neutral-800/60">
				<div className="flex items-center gap-2 text-neutral-400 text-xs">
					<Delta value={growthPct}>
						<DeltaIcon />
						<DeltaValue />
					</Delta>
					<span className="text-[11px] text-neutral-500">
						trailing trend over selected {periodDays}-day window.
					</span>
				</div>
				<span className="text-[11px] text-neutral-500">
					Market Index: Stable
				</span>
			</CardFooter>
		</Card>
	);
}

export default RevenueChart;
