import type { Metadata } from "next";
import MbtiQuiz from "./Quiz";

export const metadata: Metadata = {
  title: "MBTI — Terminal Brutalism Concept",
  robots: { index: false, follow: false },
};

export default function TestAMbtiPage() {
  return <MbtiQuiz />;
}
