"use client";

import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import type { SidebarNavGroup } from "@/components/app-shared";
import { ChevronRightIcon } from "lucide-react";

export function NavGroup({
  label,
  items,
  pathname,
}: SidebarNavGroup & { pathname?: string }) {
  return (
    <SidebarGroup>
      {label && (
        <SidebarGroupLabel className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarMenu>
        {items.map((item) => {
          const isItemActive =
            item.path === pathname ||
            (item.path !== "/admin" && pathname?.startsWith(item.path || ""));

          const hasActiveSubItem = item.subItems?.some(
            (subItem) => subItem.path === pathname
          );

          if (!item.subItems?.length) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  isActive={isItemActive}
                  render={
                    <Link
                      href={item.path || "#"}
                      className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
                    />
                  }
                >
                  {item.icon}
                  <span className="font-medium">{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible
              className="group/collapsible"
              defaultOpen={isItemActive || hasActiveSubItem}
              key={item.title}
              render={<SidebarMenuItem />}
            >
              <CollapsibleTrigger
                render={
                  <SidebarMenuButton
                    isActive={isItemActive}
                    className="cursor-pointer"
                  />
                }
              >
                {item.icon}
                <span className="font-medium">{item.title}</span>
                <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 size-4 text-neutral-400" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.subItems.map((subItem) => {
                    const isSubActive = subItem.path === pathname;
                    return (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          isActive={isSubActive}
                          render={
                            <Link
                              href={subItem.path || "#"}
                              className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
                            />
                          }
                        >
                          {subItem.icon}
                          <span>{subItem.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
