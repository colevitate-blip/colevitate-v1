import type { Metadata } from "next";
import BigFiveQuiz from "./Quiz";

export const metadata: Metadata = {
  title: "Big Five — Terminal Brutalism Concept",
  robots: { index: false, follow: false },
};

export default function TestABigFivePage() {
  return <BigFiveQuiz />;
}
