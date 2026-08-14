import type { Metadata } from "next";
import ColorsQuiz from "./Quiz";

export const metadata: Metadata = {
  title: "4 Color Types — Bold Maximalist",
  robots: { index: false, follow: false },
};

export default function TestEColorsPage() {
  return <ColorsQuiz />;
}
