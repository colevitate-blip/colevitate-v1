"use client";

import type {} from "react/canary";
import { ViewTransition } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Pushes route content on navigation, keyed by pathname so React treats a
 * page change as an exit/enter pair even though the group layout that
 * renders this wrapper persists across navigations (the key forces a
 * remount on every pathname change instead of an in-place update, which is
 * what actually lets enter/exit fire from a layout — see the Next.js
 * view-transitions guide's warning that they normally only fire from
 * page.tsx, not a persisting layout).
 *
 * enter/exit are keyed by transition type (per that same guide's
 * "directional motion" pattern): untagged navigation — burger-menu links
 * included — falls through to the `default` entry and gets the forward
 * push, same as before. A link that's conceptually a "back" action (a
 * breadcrumb, an in-app back button) can reverse it by passing
 * `transitionTypes={["nav-back"]}`. Real browser/swipe back can't be tagged
 * this way — Next's router doesn't wrap that history traversal in a React
 * transition, so ViewTransition never activates for it at all (verified
 * empirically: zero view-transition animations fire on a back-button nav,
 * not just the untyped ones) — so it stays an instant swap, matching plain
 * browser behavior without view transitions.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <ViewTransition
      key={pathname}
      enter={{ "nav-back": "page-enter-back", default: "page-enter-forward" }}
      exit={{ "nav-back": "page-exit-back", default: "page-exit-forward" }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
