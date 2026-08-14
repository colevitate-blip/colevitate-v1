import type { Metadata } from "next";
import BigFiveQuiz from "./Quiz";

export const metadata: Metadata = {
  title: "Big Five — Soft Cloud Concept",
  robots: { index: false, follow: false },
};

export default function TestBBigFivePage() {
  return <BigFiveQuiz />;
}
