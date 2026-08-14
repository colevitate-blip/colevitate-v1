import type { Metadata } from "next";
import ColorsQuiz from "./Quiz";

export const metadata: Metadata = {
  title: "4 Color Types — Soft Cloud Concept",
  robots: { index: false, follow: false },
};

export default function TestBColorsPage() {
  return <ColorsQuiz />;
}
