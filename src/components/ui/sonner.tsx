"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      closeButton
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white dark:group-[.toaster]:bg-neutral-900 group-[.toaster]:text-neutral-900 dark:group-[.toaster]:text-neutral-100 group-[.toaster]:border-neutral-200 dark:group-[.toaster]:border-neutral-800 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-xl font-sans",
          description:
            "group-[.toast]:text-neutral-500 dark:group-[.toast]:text-neutral-400 text-xs",
          actionButton:
            "group-[.toast]:bg-amber-500 group-[.toast]:text-white dark:group-[.toast]:bg-amber-400 dark:group-[.toast]:text-neutral-950 font-medium",
          cancelButton:
            "group-[.toast]:bg-neutral-100 group-[.toast]:text-neutral-700 dark:group-[.toast]:bg-neutral-800 dark:group-[.toast]:text-neutral-300",
          closeButton:
            "group-[.toast]:border-neutral-200 dark:group-[.toast]:border-neutral-800 group-[.toast]:bg-neutral-50 dark:group-[.toast]:bg-neutral-800 group-[.toast]:text-neutral-500 dark:group-[.toast]:text-neutral-400",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
