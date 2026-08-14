import { Baloo_2, Nunito } from "next/font/google";

// Shared design tokens for the test-b (Soft Human Cloud) working quizzes.
// Mirrors the tokens established in PanelB.tsx exactly — reused here so the
// quiz + result screens feel like the same product as the landing page.
export const heading = Baloo_2({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--tb-heading" });
export const body = Nunito({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--tb-body" });

export const COLORS = ["#7c6cf0", "#37c2a8", "#f0708e", "#f2b544"];
export const INK = "#34324a";
export const MUTED = "#7c7a94";

export const fontVariables = `${heading.variable} ${body.variable}`;
