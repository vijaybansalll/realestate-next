"use client";

import { Minus, Plus } from "lucide-react";
import {
  AnimatePresence,
  type HTMLMotionProps,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  createContext,
  type MouseEvent,
  type ReactNode,
  type Ref,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  EASE_OUT,
  SPRING_SWAP,
  SPRING_LAYOUT,
} from "@/lib/ease";
import { formatNumber, useLocale, useMessages } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** English defaults. Override per instance with `labels`, or app-wide with `LocaleProvider`. */
export const adaptiveStepperMessages = {
  label: "Quantity",
  summary: "{label}. Current value: {value}",
  decrease: "Decrease value",
  increase: "Increase value",
};

export type AdaptiveStepperMessages = typeof adaptiveStepperMessages;

type StepDirection = -1 | 0 | 1;

type AdaptiveStepperContextValue = {
  value: number;
  valueText: string;
  direction: StepDirection;
  atMin: boolean;
  atMax: boolean;
  disabled: boolean;
  reduce: boolean;
  size: "sm" | "default";
  t: (key: keyof AdaptiveStepperMessages & string) => string;
  decrement: (restoreFocus?: boolean) => void;
  increment: (restoreFocus?: boolean) => void;
  decrementRef: React.MutableRefObject<HTMLButtonElement | null>;
  incrementRef: React.MutableRefObject<HTMLButtonElement | null>;
};

const AdaptiveStepperContext = createContext<AdaptiveStepperContextValue | null>(
  null
);

function useAdaptiveStepperContext(component: string) {
  const context = useContext(AdaptiveStepperContext);
  if (!context) {
    throw new Error(`${component} must be used within <AdaptiveStepper>`);
  }
  return context;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function cleanNumber(value: number) {
  return Number(value.toFixed(10));
}

function nextStep(
  value: number,
  direction: -1 | 1,
  min: number,
  max: number,
  step: number
) {
  if (direction === 1) {
    const nextIndex = Math.floor((value - min) / step + 1e-10) + 1;
    return cleanNumber(Math.min(max, min + nextIndex * step));
  }

  const previousIndex = Math.ceil((value - min) / step - 1e-10) - 1;
  return cleanNumber(Math.max(min, min + previousIndex * step));
}

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref && typeof ref === "object") {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    }
  };
}

export interface AdaptiveStepperProps {
  children?: ReactNode;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  size?: "sm" | "default";
  name?: string;
  formatValueText?: (value: number) => string;
  className?: string;
  style?: React.CSSProperties;
  fill?: string;
  "aria-label"?: string;
  /** Override any built-in string. `{label}` and `{value}` fill `summary`. */
  labels?: Partial<AdaptiveStepperMessages>;
}

export function AdaptiveStepper({
  children,
  value: controlledValue,
  defaultValue = 0,
  onValueChange,
  min = 0,
  max = 10,
  step = 1,
  disabled = false,
  size = "default",
  name,
  formatValueText,
  className,
  style,
  "aria-label": ariaLabelProp,
  labels,
}: AdaptiveStepperProps) {
  const t = useMessages("adaptiveStepper", adaptiveStepperMessages, labels);
  const { locale } = useLocale();
  const ariaLabel = ariaLabelProp ?? t("label");
  const reduce = useReducedMotion() ?? false;
  const decrementRef = useRef<HTMLButtonElement>(null);
  const incrementRef = useRef<HTMLButtonElement>(null);

  const lower = Number.isFinite(min) ? min : 0;
  const suppliedMax = Number.isFinite(max) ? max : lower;
  const upper = suppliedMax > lower ? suppliedMax : lower;
  const stride = Number.isFinite(step) && step > 0 ? step : 1;

  const [internalValue, setInternalValue] = useState(() =>
    clamp(Number.isFinite(defaultValue) ? defaultValue : lower, lower, upper)
  );
  const controlled = controlledValue !== undefined;
  const suppliedValue = controlled ? controlledValue : internalValue;
  const currentValue = clamp(
    Number.isFinite(suppliedValue) ? suppliedValue : lower,
    lower,
    upper
  );

  const prevValueRef = useRef(currentValue);
  const [direction, setDirection] = useState<StepDirection>(0);

  useEffect(() => {
    if (currentValue !== prevValueRef.current) {
      setDirection(currentValue > prevValueRef.current ? 1 : -1);
      prevValueRef.current = currentValue;
    }
  }, [currentValue]);

  const currentValueRef = useRef(currentValue);
  useEffect(() => {
    currentValueRef.current = currentValue;
  }, [currentValue]);

  const commit = useCallback(
    (nextValue: number, restoreFocus: boolean) => {
      const next = clamp(cleanNumber(nextValue), lower, upper);
      if (next === currentValue) return;
      if (!controlled) setInternalValue(next);
      onValueChange?.(next);

      if (!restoreFocus) return;
      requestAnimationFrame(() => {
        if (next === upper && currentValueRef.current === upper) {
          decrementRef.current?.focus();
        } else if (next === lower && currentValueRef.current === lower) {
          incrementRef.current?.focus();
        }
      });
    },
    [controlled, currentValue, lower, onValueChange, upper]
  );

  const decrement = useCallback(
    (restoreFocus = true) => {
      if (disabled || currentValue <= lower) return;
      commit(nextStep(currentValue, -1, lower, upper, stride), restoreFocus);
    },
    [commit, currentValue, disabled, lower, stride, upper]
  );

  const increment = useCallback(
    (restoreFocus = true) => {
      if (disabled || currentValue >= upper) return;
      commit(nextStep(currentValue, 1, lower, upper, stride), restoreFocus);
    },
    [commit, currentValue, disabled, lower, stride, upper]
  );

  const valueText =
    formatValueText?.(currentValue) ?? formatNumber(currentValue, locale);

  const context = useMemo<AdaptiveStepperContextValue>(
    () => ({
      value: currentValue,
      valueText,
      direction,
      atMin: currentValue <= lower,
      atMax: currentValue >= upper,
      disabled,
      reduce,
      size,
      t,
      decrement,
      increment,
      decrementRef,
      incrementRef,
    }),
    [
      currentValue,
      decrement,
      direction,
      disabled,
      increment,
      lower,
      reduce,
      size,
      t,
      upper,
      valueText,
    ]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      decrement(false);
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      increment(false);
    } else if (e.key === "Home") {
      e.preventDefault();
      commit(lower, false);
    } else if (e.key === "End") {
      e.preventDefault();
      commit(upper, false);
    }
  };

  return (
    <AdaptiveStepperContext.Provider value={context}>
      <div
        role="group"
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
        style={style}
        className={cn(
          "relative inline-flex items-center justify-between rounded-full border transition-all duration-200 select-none",
          // Light Mode Track
          "border-neutral-200/90 bg-neutral-100/80 p-0.5 shadow-xs",
          // Dark Mode Track
          "dark:border-neutral-800 dark:bg-neutral-900/90 dark:shadow-none",
          size === "sm" ? "h-[34px] min-w-[136px]" : "h-11 min-w-[190px]",
          disabled && "pointer-events-none opacity-50",
          className
        )}
      >
        <span className="sr-only">
          {t("summary", { label: ariaLabel, value: valueText })}
        </span>

        {children ?? (
          <>
            <AdaptiveStepperDecrement />
            <AdaptiveStepperValue />
            <AdaptiveStepperIncrement />
          </>
        )}

        {name ? <input type="hidden" name={name} value={currentValue} /> : null}
      </div>
    </AdaptiveStepperContext.Provider>
  );
}

export interface AdaptiveStepperActionProps
  extends Omit<HTMLMotionProps<"button">, "children" | "onClick"> {
  children?: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  ref?: Ref<HTMLButtonElement>;
}

function StepperAction({
  direction,
  children,
  className,
  onClick,
  ref,
  style,
  tabIndex,
  "aria-label": ariaLabel,
  ...props
}: AdaptiveStepperActionProps & { direction: -1 | 1 }) {
  const context = useAdaptiveStepperContext("AdaptiveStepper action");
  const isSm = context.size === "sm";
  const btnSize = isSm ? 28 : 38;
  const hidden = direction === -1 ? context.atMin : context.atMax;
  const actionRef =
    direction === -1 ? context.decrementRef : context.incrementRef;
  const label =
    ariaLabel ?? context.t(direction === -1 ? "decrease" : "increase");
  const action = direction === -1 ? context.decrement : context.increment;

  return (
    <AnimatePresence initial={false} mode="wait">
      {!hidden ? (
        <motion.button
          type="button"
          ref={mergeRefs(ref, actionRef)}
          aria-label={label}
          tabIndex={tabIndex}
          disabled={context.disabled || hidden}
          initial={
            context.reduce
              ? { opacity: 0 }
              : { width: 0, opacity: 0, scale: 0.6 }
          }
          animate={
            context.reduce
              ? { opacity: 1 }
              : { width: btnSize, opacity: 1, scale: 1 }
          }
          exit={
            context.reduce
              ? { opacity: 0 }
              : { width: 0, opacity: 0, scale: 0.6 }
          }
          transition={SPRING_LAYOUT}
          whileTap={context.reduce ? undefined : { scale: 0.92 }}
          style={style}
          className={cn(
            "relative flex shrink-0 cursor-pointer items-center justify-center rounded-full border outline-hidden transition-colors",
            // Light Mode
            "border-neutral-200/90 bg-white text-neutral-700 shadow-xs hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 active:bg-neutral-100",
            // Dark Mode
            "dark:border-neutral-700/80 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:text-neutral-100 dark:active:bg-neutral-750",
            // Focus Visible
            "focus-visible:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/50",
            isSm ? "size-7" : "size-9.5",
            className
          )}
          onClick={(event) => {
            onClick?.(event);
            if (!event.defaultPrevented) action(event.detail === 0);
          }}
          {...props}
        >
          {children ??
            (direction === -1 ? (
              <Minus
                className={isSm ? "size-3.5" : "size-4.5"}
                strokeWidth={2.5}
              />
            ) : (
              <Plus
                className={isSm ? "size-3.5" : "size-4.5"}
                strokeWidth={2.5}
              />
            ))}
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}

export function AdaptiveStepperDecrement(props: AdaptiveStepperActionProps) {
  return <StepperAction {...props} direction={-1} />;
}

export interface AdaptiveStepperValueProps
  extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: ReactNode | ((value: number) => ReactNode);
}

export function AdaptiveStepperValue({
  children,
  className,
  style,
  ...props
}: AdaptiveStepperValueProps) {
  const context = useAdaptiveStepperContext("AdaptiveStepperValue");
  const isSm = context.size === "sm";

  const displayValue =
    typeof children === "function" ? children(context.value) : children;
  const renderedValue = displayValue ?? context.value;

  return (
    <motion.div
      layout
      transition={SPRING_LAYOUT}
      style={style}
      className={cn(
        "mx-0.5 flex min-w-0 flex-1 items-center justify-center rounded-full border transition-colors select-none",
        // Light Mode Capsule
        "border-neutral-200/70 bg-white text-neutral-900 shadow-xs",
        // Dark Mode Capsule
        "dark:border-neutral-700/70 dark:bg-neutral-800/90 dark:text-neutral-100",
        isSm ? "h-7 px-2.5 text-xs" : "h-9.5 px-4 text-sm",
        className
      )}
      {...props}
    >
      <output aria-live="polite" aria-atomic="true" className="contents">
        <span className="sr-only">{context.valueText}</span>
        <span
          aria-hidden="true"
          className="relative flex items-center justify-center overflow-hidden font-semibold tabular-nums leading-none tracking-tight text-neutral-900 dark:text-neutral-100"
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={context.value}
              initial={{
                opacity: context.reduce ? 1 : 0.2,
                y: context.reduce ? 0 : context.direction * 12,
                filter: context.reduce ? "none" : "blur(2px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "none",
              }}
              exit={{
                opacity: context.reduce ? 1 : 0,
                y: context.reduce ? 0 : -context.direction * 12,
                filter: context.reduce ? "none" : "blur(2px)",
                transition: { duration: 0.12, ease: EASE_OUT },
              }}
              transition={SPRING_SWAP}
              className="whitespace-nowrap"
            >
              {renderedValue}
            </motion.span>
          </AnimatePresence>
        </span>
      </output>
    </motion.div>
  );
}

export function AdaptiveStepperIncrement(props: AdaptiveStepperActionProps) {
  return <StepperAction {...props} direction={1} />;
}

export default AdaptiveStepper;