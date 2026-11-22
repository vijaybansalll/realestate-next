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
  useSidebar,
} from "@/components/ui/sidebar";
import type { SidebarNavGroup } from "./app-shared";
import { ChevronRightIcon } from "lucide-react";

export function NavGroup({
  label,
  items,
  pathname,
}: SidebarNavGroup & { pathname?: string }) {
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

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
            (item.path !== "/admin" &&
              item.path !== "/" &&
              Boolean(item.path) &&
              pathname?.startsWith(item.path || ""));

          const hasActiveSubItem = item.subItems?.some(
            (subItem) => subItem.path === pathname
          );

          if (!item.subItems?.length) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  isActive={isItemActive}
                  tooltip={item.title}
                  render={
                    <Link
                      href={item.path || "#"}
                      onClick={handleLinkClick}
                      className="gap-2.5"
                    />
                  }
                >
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible
              key={item.title}
              defaultOpen={isItemActive || hasActiveSubItem}
              className="group/collapsible"
              render={<SidebarMenuItem />}
            >
              <CollapsibleTrigger
                render={
                  <SidebarMenuButton tooltip={item.title} className="gap-2.5" />
                }
              >
                {item.icon}
                <span>{item.title}</span>
                <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.subItems.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          isActive={subItem.path === pathname}
                          render={
                            <Link
                              href={subItem.path || "#"}
                              onClick={handleLinkClick}
                              className="gap-2 text-xs"
                            />
                          }
                        >
                          {subItem.icon}
                          <span>{subItem.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
