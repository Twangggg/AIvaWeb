"use client";

import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
  type Placement,
} from "@floating-ui/react";

/** Anchor overlays to their trigger and keep them inside the visible viewport. */
export function useFloatingSurface({
  open,
  onOpenChange,
  placement = "bottom-end",
  width,
  height,
  gap = 8,
  animationFrame = false,
  strategy = "fixed",
}: {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  width?: number;
  height?: number;
  gap?: number;
  animationFrame?: boolean;
  strategy?: "fixed" | "absolute";
}) {
  const floating = useFloating({
    open,
    onOpenChange,
    placement,
    strategy,
    whileElementsMounted: (reference, floating, update) =>
      autoUpdate(reference, floating, update, { animationFrame }),
    middleware: [
      offset(gap),
      flip({ padding: 12 }),
      shift({ padding: 12 }),
      size({
        padding: 12,
        apply({ availableWidth, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxWidth: `${Math.max(0, availableWidth)}px`,
            maxHeight: `${Math.max(0, availableHeight)}px`,
            ...(width !== undefined && {
              width: `${Math.max(0, Math.min(width, availableWidth))}px`,
            }),
            ...(height !== undefined && {
              height: `${Math.max(0, Math.min(height, availableHeight))}px`,
            }),
          });
        },
      }),
    ],
  });
  const {
    refs: { setReference, setFloating },
    ...positioning
  } = floating;
  return { ...positioning, setReference, setFloating };
}
