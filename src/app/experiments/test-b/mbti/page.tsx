import type { Metadata } from "next";
import MbtiQuiz from "./Quiz";

export const metadata: Metadata = {
  title: "MBTI — Soft Cloud Concept",
  robots: { index: false, follow: false },
};

export default function TestBMbtiPage() {
  return <MbtiQuiz />;
}
