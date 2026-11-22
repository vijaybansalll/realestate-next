"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogoIcon } from "@/components/layout";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavGroup } from "./nav-group";
import { navGroups } from "./app-shared";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/(auth)/login/actions";

interface AppSidebarProps {
  pathname?: string;
}

export function AppSidebar({ pathname }: AppSidebarProps) {
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      if (isMobile) {
        setOpenMobile(false);
      }
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
        <SidebarMenuButton
          render={
            <Link
              href="/admin"
              onClick={handleLinkClick}
              className="flex items-center gap-2"
            />
          }
        >
          <LogoIcon className="size-6 text-amber-500" />
          <span className="font-semibold text-sm tracking-wide text-neutral-900 dark:text-neutral-100">
            Villa Lumina
          </span>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent className="gap-2">
        {navGroups.map((group) => (
          <NavGroup key={group.label} pathname={pathname} {...group} />
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-red-500 hover:bg-red-500/10 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-500/20"
            >
              <LogOut className="size-4" />
              <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
