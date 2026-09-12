import type { ReactNode } from "react";
import { PageTransition } from "@/components/nav/PageTransition";

// template.tsx (not layout.tsx) is what actually gets a fresh key per
// navigation from Next.js itself — see PageTransition.tsx for why that's
// required for its view-transition enter/exit to ever fire.
export default function SiteTemplate({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
