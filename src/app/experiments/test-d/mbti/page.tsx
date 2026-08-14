import type { Metadata } from "next";
import MbtiQuiz from "./Quiz";

export const metadata: Metadata = {
  title: "MBTI — Spatial / 3D Infrastruktur",
  robots: { index: false, follow: false },
};

export default function TestDMbtiPage() {
  return <MbtiQuiz />;
}
