"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserIcon, ShieldIcon, LogOutIcon } from "lucide-react";
import { logoutAction } from "@/app/(auth)/login/actions";

const user = {
	name: "Estate Administrator",
	email: "admin@villalumina.com",
	avatar: "/images/canadian-wooden-house.jpg",
};

export function NavUser() {
	const router = useRouter();
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	const handleLogout = async () => {
		try {
			setIsLoggingOut(true);
			await logoutAction();
			router.push("/login");
			router.refresh();
		} catch (err) {
			console.error("Logout failed", err);
			setIsLoggingOut(false);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Avatar className="size-8 cursor-pointer border border-neutral-700 hover:border-neutral-500 transition-colors" />}>
				<AvatarImage src={user.avatar} alt="Admin" />
				<AvatarFallback className="bg-amber-400 text-neutral-950 font-bold">EA</AvatarFallback>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56 border-neutral-800 bg-neutral-900 text-neutral-100">
				<DropdownMenuGroup>
					<DropdownMenuLabel className="pointer-events-none flex items-center gap-2.5 p-2">
						<Avatar className="size-8 border border-neutral-700">
							<AvatarImage src={user.avatar} alt="Admin" />
							<AvatarFallback className="bg-amber-400 text-neutral-950 font-bold">EA</AvatarFallback>
						</Avatar>
						<div className="flex flex-col">
							<span className="font-semibold text-xs text-neutral-200">{user.name}</span>
							<span className="text-[11px] text-neutral-400 truncate">{user.email}</span>
						</div>
					</DropdownMenuLabel>
				</DropdownMenuGroup>
				<DropdownMenuSeparator className="bg-neutral-800" />
				<DropdownMenuGroup>
					<DropdownMenuItem className="text-xs text-neutral-300 hover:text-white cursor-pointer">
						<ShieldIcon className="size-4 mr-2 text-amber-400" />
						Admin Role: Superuser
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator className="bg-neutral-800" />
				<DropdownMenuGroup>
					<DropdownMenuItem
						variant="destructive"
						onClick={handleLogout}
						disabled={isLoggingOut}
						className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer flex items-center gap-2"
					>
						<LogOutIcon className="size-4" />
						<span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
