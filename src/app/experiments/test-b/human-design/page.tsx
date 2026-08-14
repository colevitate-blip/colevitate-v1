import type { Metadata } from "next";
import HumanDesignQuiz from "./Quiz";

export const metadata: Metadata = {
  title: "Human Design — Soft Cloud Concept",
  robots: { index: false, follow: false },
};

export default function TestBHumanDesignPage() {
  return <HumanDesignQuiz />;
}
