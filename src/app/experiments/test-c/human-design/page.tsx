import type { Metadata } from "next";
import HumanDesignQuiz from "./Quiz";

export const metadata: Metadata = {
  title: "Human Design — Editorial / Magazine Concept",
  robots: { index: false, follow: false },
};

export default function TestCHumanDesignPage() {
  return <HumanDesignQuiz />;
}
