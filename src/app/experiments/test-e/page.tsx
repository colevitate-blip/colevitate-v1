import type { Metadata } from "next";
import PanelE from "@/components/experiments/PanelE";

export const metadata: Metadata = {
  title: "Bold Maximalist — Design Concept E",
  robots: { index: false, follow: false },
};

export default function TestEPage() {
  return <PanelE />;
}
