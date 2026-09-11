"use client";

import type {} from "react/canary";
import { ViewTransition } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Crossfades route content on navigation. Keyed by pathname so React treats
 * a page change as an exit/enter pair even though the group layout that
 * renders this wrapper persists across navigations.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <ViewTransition key={pathname} enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  );
}
