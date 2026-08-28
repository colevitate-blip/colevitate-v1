import type { Metadata } from "next";
import { PeopleLayoutsShowcaseClient } from "@/components/experiments/PeopleLayoutsShowcaseClient";

export const metadata: Metadata = {
  title: "People Page Layouts — Design Experiments",
  robots: { index: false, follow: false },
};

export default function PeopleLayoutsExperimentPage() {
  return <PeopleLayoutsShowcaseClient />;
}
