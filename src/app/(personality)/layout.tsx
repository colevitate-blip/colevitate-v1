import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PersonalityProvider } from "@/lib/personality/context";
import Link from "next/link";
import { footerContent } from "@/data/personalityContent";
import { ColevitateMark } from "@/components/brand/Logo";

export const metadata: Metadata = {
  title: "Personality Studio",
  description:
    "Explore 16 Personalities, Big Five, Human Design, and Color Type assessments — then combine them into one profile.",
};

export default function PersonalityLayout({ children }: { children: ReactNode }) {
  return (
    <PersonalityProvider>
      <div className="relative min-h-[100dvh] overflow-x-hidden bg-background">
        <div aria-hidden className="spatial-grid-bg" />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(124,140,255,0.18),transparent),radial-gradient(ellipse_60%_50%_at_100%_0%,rgba(55,224,196,0.14),transparent)]"
        />
        <header className="sticky top-2 z-20 mx-auto mb-2 w-full max-w-6xl px-3 sm:top-4 sm:px-4">
          <div className="relative flex flex-col items-center rounded-2xl border bg-card/60 px-4 py-5 text-center backdrop-blur-md sm:py-6">
            <span
              aria-hidden
              className="absolute right-4 top-4 size-2 rounded-full bg-[#37e0c4] shadow-[0_0_12px_#37e0c4] sm:right-5 sm:top-5"
            />
            <Link href="/" className="flex flex-col items-center gap-2">
              <ColevitateMark className="size-12 shrink-0 sm:size-14" />
              <span className="leading-tight">
                <span className="block text-xl font-bold tracking-tight sm:text-2xl">Colevitate</span>
                <span className="block text-xs text-muted-foreground sm:text-sm">Many lenses. One you.</span>
              </span>
            </Link>
          </div>
        </header>
        {children}
        <footer className="mx-auto mt-16 w-full max-w-6xl px-4 pb-10 text-center text-xs text-muted-foreground">
          {footerContent.tagline}
        </footer>
      </div>
    </PersonalityProvider>
  );
}
