import type { Metadata } from "next";
import HumanDesignQuiz from "./Quiz";

export const metadata: Metadata = {
  title: "Human Design — Swiss Minimal Concept",
  robots: { index: false, follow: false },
};

export default function TestFHumanDesignPage() {
  return <HumanDesignQuiz />;
}
