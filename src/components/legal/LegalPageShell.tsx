import Link from "next/link";
import type { ReactNode } from "react";
import { ColevitateMark } from "@/components/brand/Logo";

export function LegalPageShell({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-[100dvh] bg-background">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,var(--hero-glow-1),transparent),radial-gradient(ellipse_60%_50%_at_100%_0%,var(--hero-glow-2),transparent)]"
      />
      <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:py-16">
        <Link href="/" className="mb-10 flex items-center gap-2">
          <ColevitateMark className="size-8" />
          <span className="text-base font-bold tracking-tight">Colevitate</span>
        </Link>

        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-xs text-muted-foreground">Last updated: {lastUpdated}</p>

        <div className="prose-legal mt-8 flex flex-col gap-6 text-sm leading-relaxed text-foreground/90 [&_h2]:mt-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground [&_p]:text-muted-foreground [&_li]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4">
          {children}
        </div>

        <div className="mt-12 flex gap-4 border-t pt-6 text-xs text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-foreground hover:underline">
            Terms of Service
          </Link>
          <Link href="/" className="hover:text-foreground hover:underline">
            Back to Colevitate
          </Link>
        </div>
      </div>
    </div>
  );
}
