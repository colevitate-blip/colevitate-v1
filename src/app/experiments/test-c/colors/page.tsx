import type { Metadata } from "next";
import ColorsQuiz from "./Quiz";

export const metadata: Metadata = {
  title: "4 Color Types — Editorial / Magazine Concept",
  robots: { index: false, follow: false },
};

export default function TestCColorsPage() {
  return <ColorsQuiz />;
}
