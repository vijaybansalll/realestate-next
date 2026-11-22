import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function CustomSidebarTrigger() {
  return (
    <Tooltip>
      <TooltipTrigger
        delay={1000}
        render={
          <SidebarTrigger className="size-9 sm:size-8 rounded-lg border border-neutral-200/80 bg-white text-neutral-700 shadow-xs hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white transition-colors" />
        }
      />
      <TooltipContent className="px-2 py-1" side="right">
        Toggle Sidebar{" "}
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>b</Kbd>
        </KbdGroup>
      </TooltipContent>
    </Tooltip>
  );
}
