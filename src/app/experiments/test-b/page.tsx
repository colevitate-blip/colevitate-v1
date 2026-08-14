import type { Metadata } from "next";
import PanelB from "@/components/experiments/PanelB";

export const metadata: Metadata = {
  title: "Soft Human Cloud — Design Concept B",
  robots: { index: false, follow: false },
};

export default function TestBPage() {
  return <PanelB />;
}
