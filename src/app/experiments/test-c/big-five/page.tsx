import type { Metadata } from "next";
import BigFiveQuiz from "./Quiz";

export const metadata: Metadata = {
  title: "Big Five — Editorial / Magazine Concept",
  robots: { index: false, follow: false },
};

export default function TestCBigFivePage() {
  return <BigFiveQuiz />;
}
