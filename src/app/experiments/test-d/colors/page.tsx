import type { Metadata } from "next";
import ColorsQuiz from "./Quiz";

export const metadata: Metadata = {
  title: "4 Color Types — Spatial / 3D Infrastruktur",
  robots: { index: false, follow: false },
};

export default function TestDColorsPage() {
  return <ColorsQuiz />;
}
