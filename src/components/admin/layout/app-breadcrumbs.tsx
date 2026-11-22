import type { ReactNode } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

/** Current page segment shown in the header — pass a nav item or `{ title, icon? }`. */
export type AppBreadcrumbPage = {
  title: string;
  icon?: ReactNode;
};

export function AppBreadcrumbs({ page }: { page?: AppBreadcrumbPage | null }) {
  if (!page?.title) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm [&>svg]:size-3.5 max-w-[130px] sm:max-w-xs md:max-w-md truncate">
            {page.icon}
            <span className="truncate">{page.title}</span>
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
