import type { Metadata } from "next";
import MbtiQuiz from "./Quiz";

export const metadata: Metadata = {
  title: "MBTI — Swiss Minimal Concept",
  robots: { index: false, follow: false },
};

export default function TestFMbtiPage() {
  return <MbtiQuiz />;
}
