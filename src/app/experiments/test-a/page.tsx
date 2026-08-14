import type { Metadata } from "next";
import PanelA from "@/components/experiments/PanelA";

export const metadata: Metadata = {
  title: "Terminal Brutalism — Design Concept A",
  robots: { index: false, follow: false },
};

export default function TestAPage() {
  return <PanelA />;
}
