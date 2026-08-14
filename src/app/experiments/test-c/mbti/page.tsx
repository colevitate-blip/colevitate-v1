import type { Metadata } from "next";
import MbtiQuiz from "./Quiz";

export const metadata: Metadata = {
  title: "MBTI — Editorial / Magazine Concept",
  robots: { index: false, follow: false },
};

export default function TestCMbtiPage() {
  return <MbtiQuiz />;
}
