import type { Metadata } from "next";
import PanelC from "@/components/experiments/PanelC";

export const metadata: Metadata = {
  title: "Editorial / Magazine — Design Concept C",
  robots: { index: false, follow: false },
};

export default function TestCPage() {
  return <PanelC />;
}
