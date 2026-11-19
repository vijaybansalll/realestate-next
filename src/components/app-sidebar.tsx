"use client";

import { LogoIcon } from "@/components/logo";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { footerNavLinks, navGroups } from "@/components/app-shared";
import { PlusIcon, CompassIcon } from "lucide-react";
import Link from "next/link";

interface AppSidebarProps {
  pathname?: string;
  onAddProperty?: () => void;
}

export function AppSidebar({ pathname, onAddProperty }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="h-14 justify-center">
        <SidebarMenuButton render={<Link href="/admin" />}>
          <LogoIcon className="size-5 text-amber-400" />
          <span className="font-semibold tracking-tight text-neutral-100">
            Estate Admin
          </span>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenuItem className="flex items-center gap-2">
            {onAddProperty ? (
              <SidebarMenuButton
                onClick={onAddProperty}
                className="min-w-8 bg-neutral-100 text-neutral-950 duration-200 ease-linear hover:bg-neutral-200 active:bg-neutral-300 font-medium cursor-pointer"
                tooltip="Add Property"
              >
                <PlusIcon className="size-4" />
                <span>Add Property</span>
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton
                render={<Link href="/admin/properties/new" />}
                className="min-w-8 bg-neutral-100 text-neutral-950 duration-200 ease-linear hover:bg-neutral-200 active:bg-neutral-300 font-medium cursor-pointer"
                tooltip="Add Property"
              >
                <PlusIcon className="size-4" />
                <span>Add Property</span>
              </SidebarMenuButton>
            )}
            <Link
              href="/properties"
              aria-label="View Catalog"
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                "size-8 group-data-[collapsible=icon]:opacity-0 border-neutral-800"
              )}
              title="Public Catalog"
            >
              <CompassIcon className="size-4 text-neutral-400" />
              <span className="sr-only">View Catalog</span>
            </Link>
          </SidebarMenuItem>
        </SidebarGroup>

        {navGroups.map((group, index) => (
          <NavGroup
            key={`sidebar-group-${index}`}
            {...group}
            pathname={pathname}
          />
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu className="mt-2">
          {footerNavLinks.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                className="text-muted-foreground hover:text-neutral-100 transition-colors"
                isActive={item.path === pathname}
                size="sm"
                render={<Link href={item.path || "#"} />}
              >
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
