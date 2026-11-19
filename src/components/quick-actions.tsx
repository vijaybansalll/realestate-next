import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item";
import {
	PlusCircleIcon,
	BuildingIcon,
	CompassIcon,
	HomeIcon,
	ChevronRightIcon,
} from "lucide-react";

const actions = [
	{
		title: "Add New Listing",
		description: "Upload photos & create property listing.",
		href: "/admin/properties/new",
		icon: <PlusCircleIcon aria-hidden="true" className="text-amber-400" />,
	},
	{
		title: "Properties Directory",
		description: "Full CRUD operations and inventory.",
		href: "/admin/properties",
		icon: <BuildingIcon aria-hidden="true" className="text-blue-400" />,
	},
	{
		title: "Public Properties Catalog",
		description: "Browse the consumer luxury properties page.",
		href: "/properties",
		icon: <CompassIcon aria-hidden="true" className="text-emerald-400" />,
	},
	{
		title: "Villa Lumina Website",
		description: "View the public homepage and hero experience.",
		href: "/",
		icon: <HomeIcon aria-hidden="true" className="text-purple-400" />,
	},
] as const;

export function QuickActions() {
	return (
		<Card className="border-neutral-800/80 bg-neutral-900/50 backdrop-blur-sm shadow-xl">
			<CardHeader className="pb-3 border-b border-neutral-800/60">
				<CardTitle className="text-sm font-semibold text-neutral-200">Admin Quick Actions</CardTitle>
				<CardDescription className="text-xs text-neutral-400">Direct navigation across available modules.</CardDescription>
			</CardHeader>
			<CardContent className="pt-2">
				<ItemGroup className="gap-0">
					{actions.map((a) => (
						<Item
							key={a.title}
							size="sm"
							render={<Link href={a.href} className="hover:bg-neutral-800/40 transition-colors rounded-lg" />}
						>
							<ItemMedia variant="icon">{a.icon}</ItemMedia>
							<ItemContent>
								<ItemTitle className="text-xs font-semibold text-neutral-200">{a.title}</ItemTitle>
								<ItemDescription className="line-clamp-1 text-xs text-neutral-400">
									{a.description}
								</ItemDescription>
							</ItemContent>
							<ItemActions>
								<ChevronRightIcon aria-hidden="true" className="size-4 shrink-0 text-neutral-500" />
							</ItemActions>
						</Item>
					))}
				</ItemGroup>
			</CardContent>
		</Card>
	);
}
