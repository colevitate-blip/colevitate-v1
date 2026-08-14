import type { Metadata } from "next";
import HumanDesignQuiz from "./Quiz";

export const metadata: Metadata = {
  title: "Human Design — Terminal Brutalism Concept",
  robots: { index: false, follow: false },
};

export default function TestAHumanDesignPage() {
  return <HumanDesignQuiz />;
}
