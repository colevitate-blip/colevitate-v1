import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PersonalityProvider } from "@/lib/personality/context";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Personality Studio",
  description:
    "Explore 16 Personalities, Big Five, Human Design, and Color Type assessments — then combine them into one profile.",
};

export default function PersonalityLayout({ children }: { children: ReactNode }) {
  return (
    <PersonalityProvider>
      <div className="relative min-h-[100dvh] overflow-x-hidden bg-background">
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,theme(colors.violet.500/0.15),transparent),radial-gradient(ellipse_60%_50%_at_100%_0%,theme(colors.emerald.500/0.1),transparent)]"
        />
        <header className="sticky top-0 z-20 border-b bg-background/70 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
            <Link href="/personality" className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-emerald-500 text-white">
                <Sparkles className="size-3.5" />
              </span>
              Personality Studio
            </Link>
            <ThemeToggle />
          </div>
        </header>
        {children}
      </div>
    </PersonalityProvider>
  );
}
