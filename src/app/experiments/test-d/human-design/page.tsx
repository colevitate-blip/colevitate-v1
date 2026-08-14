import type { Metadata } from "next";
import HumanDesignQuiz from "./Quiz";

export const metadata: Metadata = {
  title: "Human Design — Spatial / 3D Infrastruktur",
  robots: { index: false, follow: false },
};

export default function TestDHumanDesignPage() {
  return <HumanDesignQuiz />;
}
