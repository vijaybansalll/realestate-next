"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogoIcon } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavGroup } from "@/components/nav-group";
import { navGroups } from "@/components/app-shared";
import { PlusIcon, CompassIcon, LogOut } from "lucide-react";
import { logoutAction } from "@/app/(auth)/login/actions";

interface AppSidebarProps {
  pathname?: string;
  onAddProperty?: () => void;
}

export function AppSidebar({ pathname, onAddProperty }: AppSidebarProps) {
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
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="h-14 justify-center">
        <SidebarMenuButton render={<Link href="/admin" />}>
          <LogoIcon className="size-5 text-amber-500 dark:text-amber-400" />
          <span className="font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            Estate Admin
          </span>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group, index) => (
          <NavGroup
            key={`sidebar-group-${index}`}
            {...group}
            pathname={pathname}
          />
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-neutral-200/80 p-2 dark:border-neutral-800/60">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              disabled={isLoggingOut}
              tooltip="Log out"
              className="flex w-full cursor-pointer items-center gap-2 text-neutral-600 transition-colors hover:bg-red-500/10 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400"
            >
              <LogOut className="size-4 shrink-0 text-red-500/90 dark:text-red-400/90" />
              <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
