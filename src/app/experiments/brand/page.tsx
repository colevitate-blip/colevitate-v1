import type { Metadata } from "next";
import { BrandTestClient } from "@/components/experiments/BrandTestClient";

export const metadata: Metadata = {
  title: "Brand Header Concepts — Personality Studio",
  robots: { index: false, follow: false },
};

export default function BrandTestPage() {
  return <BrandTestClient />;
}
