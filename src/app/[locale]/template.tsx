import type { ReactNode } from "react";
import { PageTransition } from "@/components/nav/PageTransition";

// One template for the whole locale subtree, deliberately ABOVE both route
// groups' layouts rather than one template per group. A per-group template
// only remounts within its own group: navigating (personality) -> (site) —
// which is what every "People"/"Types"/"Learn" tap out of the burger menu
// does — tore down one group's template and mounted the other's, so React
// never formed an exit/enter pair and never called startViewTransition() at
// all. Measured: same-group navs animated over ~22 frames, cross-group navs
// produced zero view-transition animations and hard-swapped the page while
// the drawer was still sliding out. Hoisting the wrapper here puts it at a
// tree position that survives the group change, so the pair forms.
export default function LocaleTemplate({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
