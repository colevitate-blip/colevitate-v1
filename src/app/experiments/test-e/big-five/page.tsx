import type { Metadata } from "next";
import BigFiveQuiz from "./Quiz";

export const metadata: Metadata = {
  title: "Big Five (OCEAN) — Bold Maximalist",
  robots: { index: false, follow: false },
};

export default function TestEBigFivePage() {
  return <BigFiveQuiz />;
}
