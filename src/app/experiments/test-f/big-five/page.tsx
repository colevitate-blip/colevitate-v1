import type { Metadata } from "next";
import BigFiveQuiz from "./Quiz";

export const metadata: Metadata = {
  title: "Big Five — Swiss Minimal Concept",
  robots: { index: false, follow: false },
};

export default function TestFBigFivePage() {
  return <BigFiveQuiz />;
}
