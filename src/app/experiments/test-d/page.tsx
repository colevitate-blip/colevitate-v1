import type { Metadata } from "next";
import PanelD from "@/components/experiments/PanelD";

export const metadata: Metadata = {
  title: "Spatial / 3D Infrastruktur — Design Concept D",
  robots: { index: false, follow: false },
};

export default function TestDPage() {
  return <PanelD />;
}
