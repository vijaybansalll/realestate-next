"use client";

import {
  type KeyboardEvent,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useOnOpen } from "./use-on-open";
import { useRowCursor } from "./use-row-cursor";

export interface ListboxRow {
  id: string;
  label: string;
  disabled?: boolean;
}

const TYPEAHEAD_MS = 500;

export function useListbox({
  open,
  rows,
  selected,
  list,
}: {
  open: boolean;
  rows: readonly ListboxRow[];
  selected: string | undefined;
  list: RefObject<HTMLElement | null>;
}) {
  const enabled = useMemo(() => rows.filter((row) => !row.disabled), [rows]);
  const { activeIndex, moveTo, moveActive } = useRowCursor(enabled, "");
  useOnOpen(open, () =>
    moveTo(enabled.some((row) => row.id === selected) ? (selected ?? null) : null)
  );
  const activeId = enabled[activeIndex]?.id;
  const typed = useRef({ text: "", at: 0 });

  useEffect(() => {
    if (!open || !activeId) return;
    const option = list.current?.querySelector<HTMLElement>(
      `[data-listbox-id="${activeId}"]`
    );
    option?.focus();
  }, [open, activeId, list]);

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        moveActive(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        moveActive(-1);
        break;
      case "Home":
        e.preventDefault();
        moveTo(enabled[0]?.id ?? null);
        break;
      case "End":
        e.preventDefault();
        moveTo(enabled[enabled.length - 1]?.id ?? null);
        break;
      default: {
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const now = Date.now();
          const query =
            now - typed.current.at < TYPEAHEAD_MS
              ? typed.current.text + e.key.toLowerCase()
              : e.key.toLowerCase();
          typed.current = { text: query, at: now };

          const match = enabled.find((row) =>
            row.label.toLowerCase().startsWith(query)
          );
          if (match) moveTo(match.id);
        }
      }
    }
  };

  return { activeId, onKeyDown };
}
