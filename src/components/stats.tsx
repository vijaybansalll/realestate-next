import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Delta, DeltaIcon, DeltaValue } from "@/components/delta";

type Stat = {
	label: string;
	value: string;
	delta: number;
	hint: string;
};

const stats: readonly Stat[] = [
	{
		label: "Portfolio Valuation",
		value: "$28,490,000",
		delta: 12.4,
		hint: "vs last quarter",
	},
	{
		label: "Active Listings",
		value: "24 Estates",
		delta: 8.5,
		hint: "+4 new this month",
	},
	{
		label: "VIP Buyer Inquiries",
		value: "184 Inquiries",
		delta: 18.2,
		hint: "vs prior 30 days",
	},
	{
		label: "Avg Days on Market",
		value: "34 Days",
		delta: -15.3,
		hint: "faster than avg",
	},
] as const;

export function DashboardStats() {
	return (
		<>
			{stats.map((s) => (
				<StatCard key={s.label} stat={s} />
			))}
		</>
	);
}

function StatCard({ stat }: { stat: Stat }) {
	const { label, value, delta, hint } = stat;
	return (
		<Card className="border-neutral-800 bg-neutral-900/60 shadow-xl">
			<CardHeader className="pb-2">
				<CardTitle className="font-medium text-neutral-400 text-xs">
					{label}
				</CardTitle>
			</CardHeader>
			<CardContent className="pb-3">
				<p className="text-balance font-bold text-2xl tabular-nums tracking-tight text-neutral-100">
					{value}
				</p>
			</CardContent>
			<CardFooter className="gap-1.5 text-xs pt-0">
				<Delta value={delta} variant="default">
					<DeltaIcon />
					<DeltaValue />
				</Delta>
				<span className="text-pretty text-neutral-500 text-[11px]">{hint}</span>
			</CardFooter>
		</Card>
	);
}
