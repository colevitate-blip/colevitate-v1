"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { AccentTheme } from "@/lib/personality/theme";

const MESSAGES = [
  "Reading your answers…",
  "Weighing the signals…",
  "Cross-checking patterns…",
  "Assembling your profile…",
];

interface AnalyzingScreenProps {
  label: string;
  accent: AccentTheme;
  durationMs?: number;
}

export function AnalyzingScreen({ label, accent, durationMs = 1900 }: AnalyzingScreenProps) {
  const [messageIndex, setMessageIndex] = React.useState(0);
  const [fill, setFill] = React.useState(0);

  React.useEffect(() => {
    const interval = window.setInterval(() => {
      setMessageIndex((i) => (i + 1) % MESSAGES.length);
    }, 650);
    return () => window.clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const raf = window.requestAnimationFrame(() => setFill(100));
    return () => window.cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-2xl flex-col items-center justify-center px-4 py-12 text-center">
      <div className="relative flex size-28 items-center justify-center sm:size-32">
        <span
          aria-hidden
          className={cn("absolute inset-0 rounded-full border-2 opacity-40", accent.border)}
          style={{ animation: "colevitate-analyzing-ping 1.8s cubic-bezier(0,0,0.2,1) infinite" }}
        />
        <span
          aria-hidden
          className={cn("absolute inset-3 rounded-full border-2 opacity-50", accent.border)}
          style={{ animation: "colevitate-analyzing-ping 1.8s cubic-bezier(0,0,0.2,1) infinite 0.35s" }}
        />
        <span aria-hidden className={cn("absolute inset-6 rounded-full border-2", accent.border)} />
        <span
          aria-hidden
          className={cn("size-4 rounded-full bg-gradient-to-br shadow-[0_0_20px_rgba(124,140,255,0.7)]", accent.gradient)}
          style={{ animation: "colevitate-analyzing-pulse 1.4s ease-in-out infinite" }}
        />
      </div>

      <p className="mt-8 text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <h1 className="mt-2 min-h-10 text-2xl font-semibold tracking-tight sm:text-3xl" aria-live="polite">
        {MESSAGES[messageIndex]}
      </h1>

      <div className="mt-8 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r", accent.gradient)}
          style={{ width: `${fill}%`, transition: `width ${durationMs}ms cubic-bezier(0.2,0,0.2,1)` }}
        />
      </div>

      <style>{`
        @keyframes colevitate-analyzing-ping {
          0% { transform: scale(0.85); opacity: 0.55; }
          75%, 100% { transform: scale(1.35); opacity: 0; }
        }
        @keyframes colevitate-analyzing-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.25); }
        }
      `}</style>
    </div>
  );
}
