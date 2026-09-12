"use client";

import type {} from "react/canary";
import { ViewTransition } from "react";
import type { ReactNode } from "react";

/**
 * Pushes route content on navigation. Rendered from each route group's
 * template.tsx (not its layout.tsx): per the Next.js view-transitions guide,
 * enter/exit only fire when this wrapper itself remounts on every
 * navigation, and layouts persist across navigations by design — a template
 * is the file convention that's guaranteed a fresh key per navigation
 * instead, which is what actually lets the transition activate (verified
 * empirically: zero view-transition animations ever fired while this lived
 * in a layout, even with a hand-rolled `key={pathname}` on the element
 * itself — the remount has to happen at the framework's own template
 * boundary, one level up, not deeper inside a persisting subtree).
 *
 * enter/exit are keyed by transition type (per that same guide's
 * "directional motion" pattern): untagged navigation — burger-menu links
 * included — falls through to the `default` entry and gets the forward
 * push. A link that's conceptually a "back" action (a breadcrumb, an in-app
 * back button) can reverse it by passing `transitionTypes={["nav-back"]}`.
 * Real browser/swipe back can't be tagged this way — Next's router doesn't
 * wrap that history traversal in a React transition, so ViewTransition never
 * activates for it at all — so it stays an instant swap, matching plain
 * browser behavior without view transitions.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={{ "nav-back": "page-enter-back", default: "page-enter-forward" }}
      exit={{ "nav-back": "page-exit-back", default: "page-exit-forward" }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
