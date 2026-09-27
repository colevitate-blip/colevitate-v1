"use client";

import type {} from "react/canary";
import { ViewTransition } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Pushes route content on navigation.
 *
 * Mounted from src/app/[locale]/template.tsx — one template above BOTH route
 * groups, plus an explicit `key={pathname}`. Both halves are load-bearing,
 * and each alone fails in the opposite direction (measured with
 * document.getAnimations() sampled per rAF across a nav):
 *
 *   - One template per route group ((site)/template.tsx and
 *     (personality)/template.tsx) animated same-group navs over ~22 frames
 *     but produced ZERO view-transition animations across groups —
 *     startViewTransition() was never called at all. Crossing groups tears
 *     down one group's template and mounts the other's, so the two
 *     ViewTransition elements sit at different tree positions and React
 *     never forms an exit/enter pair. That hit exactly the burger-menu
 *     links that leave the personality app for /people, /types and /learn:
 *     the page hard-swapped instead of pushing.
 *   - Hoisting to [locale]/template.tsx alone inverted the failure exactly:
 *     cross-group navs animated, same-group navs got nothing, because Next
 *     reuses a template whose own segment ([locale]) didn't change.
 *
 * `key={pathname}` on a wrapper the framework already keeps above the group
 * boundary covers both: the key forces the remount Next declines to do for
 * same-group navs, and the position survives the group change. All six
 * navigations in the matrix now animate over ~21 frames.
 *
 * Because this sits above the group layouts, the header and footer are
 * inside the moving snapshot and push along with the content — deliberate:
 * the two groups have visually different chrome (tall floating card vs. slim
 * bar), and anchoring it would swap one header for the other in a single
 * frame, which is the pop this is meant to remove.
 *
 * enter/exit are keyed by transition type (per the Next.js view-transitions
 * guide's "directional motion" pattern): untagged navigation — burger-menu
 * links included — falls through to the `default` entry and gets the forward
 * push. A link that's conceptually a "back" action (a breadcrumb, an in-app
 * back button) can reverse it by passing `transitionTypes={["nav-back"]}`.
 * Real browser/swipe back can't be tagged this way — Next's router doesn't
 * wrap that history traversal in a React transition, so ViewTransition never
 * activates for it at all — so it stays an instant swap, matching plain
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
