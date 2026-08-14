import type { Metadata } from "next";
import BigFiveQuiz from "./Quiz";

export const metadata: Metadata = {
  title: "Big Five — Spatial / 3D Infrastruktur",
  robots: { index: false, follow: false },
};

export default function TestDBigFivePage() {
  return <BigFiveQuiz />;
}
