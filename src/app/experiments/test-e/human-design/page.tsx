import type { Metadata } from "next";
import HumanDesignQuiz from "./Quiz";

export const metadata: Metadata = {
  title: "Human Design — Bold Maximalist",
  robots: { index: false, follow: false },
};

export default function TestEHumanDesignPage() {
  return <HumanDesignQuiz />;
}
