import type { Metadata } from "next";
import MbtiQuiz from "./Quiz";

export const metadata: Metadata = {
  title: "16 Personalities — Bold Maximalist",
  robots: { index: false, follow: false },
};

export default function TestEMbtiPage() {
  return <MbtiQuiz />;
}
