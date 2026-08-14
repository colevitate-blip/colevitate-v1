import type { Metadata } from "next";
import { ExperimentsShowcaseClient } from "@/components/experiments/ExperimentsShowcaseClient";

export const metadata: Metadata = {
  title: "Design Experiments — Personality Studio",
  robots: { index: false, follow: false },
};

export default function ExperimentsPage() {
  return <ExperimentsShowcaseClient />;
}
