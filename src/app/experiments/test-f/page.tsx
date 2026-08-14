import type { Metadata } from "next";
import PanelF from "@/components/experiments/PanelF";

export const metadata: Metadata = {
  title: "Swiss Minimal — Design Concept F",
  robots: { index: false, follow: false },
};

export default function TestFPage() {
  return <PanelF />;
}
