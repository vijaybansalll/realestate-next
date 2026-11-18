"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:border-amber-400 focus-visible:ring-2 focus-visible:ring-amber-400/50 data-[size=default]:h-[22px] data-[size=default]:w-[38px] data-[size=sm]:h-[16px] data-[size=sm]:w-[28px] data-checked:bg-amber-400 data-unchecked:bg-neutral-800 data-disabled:cursor-not-allowed data-disabled:opacity-50 cursor-pointer",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full bg-white ring-0 shadow-sm transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[18px] group-data-[size=sm]/switch:data-checked:translate-x-[13px] group-data-[size=default]/switch:data-unchecked:translate-x-1 group-data-[size=sm]/switch:data-unchecked:translate-x-0.5"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
