import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PersonalityProvider } from "@/lib/personality/context";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { footerContent } from "@/data/personalityContent";

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
        <header className="sticky top-4 z-20 mx-auto mb-2 w-full max-w-6xl px-4">
          <div className="flex h-14 items-center justify-between rounded-2xl border bg-card/60 px-5 backdrop-blur-md">
            <Link href="/personality" className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-[#7c8cff] to-[#37e0c4] text-[#05070f]">
                <Sparkles className="size-3.5" />
              </span>
              Personality Studio
            </Link>
            <span
              aria-hidden
              className="size-2 rounded-full bg-[#37e0c4] shadow-[0_0_12px_#37e0c4]"
            />
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
