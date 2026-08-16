"use client";

import type { ReactNode } from "react";

function LogoAscent() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="size-6" aria-hidden>
      <polyline
        points="4,23 10,17 16,23"
        stroke="#a78bfa"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="12,15.5 18,9.5 24,15.5"
        stroke="#37e0c4"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="19,8 24,3 29,8"
        stroke="#7c8cff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LogoKnot() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="size-6" aria-hidden>
      <defs>
        <linearGradient id="knotGrad" x1="4" y1="22" x2="26" y2="6" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7c8cff" />
          <stop offset="1" stopColor="#37e0c4" />
        </linearGradient>
      </defs>
      <path
        d="M6 20 C 4 14, 10 8, 16 12 C 22 16, 26 10, 24 6 C 22 3, 16 6, 18 12 C 20 18, 12 22, 8 18 C 6 16, 8 13, 12 14"
        stroke="url(#knotGrad)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function LogoHalo() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="size-6" aria-hidden>
      <path d="M26.83,17.91 A11,11 0 0 1 17.91,26.83" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />
      <path d="M14.09,26.83 A11,11 0 0 1 5.17,17.91" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
      <path d="M5.17,14.09 A11,11 0 0 1 14.09,5.17" stroke="#e879f9" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M17.91,5.17 A11,11 0 0 1 26.83,14.09" stroke="#7c8cff" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="13" cy="18" r="1.8" fill="#37e0c4" />
    </svg>
  );
}

interface BrandVariant {
  key: string;
  label: string;
  Mark: () => ReactNode;
  slogan: string;
}

const VARIANTS: BrandVariant[] = [
  {
    key: "1",
    label: "Test 1 — The Ascent",
    Mark: LogoAscent,
    slogan: "Elevate your self-understanding.",
  },
  {
    key: "2",
    label: "Test 2 — The Woven Knot",
    Mark: LogoKnot,
    slogan: "Many lenses. One you.",
  },
  {
    key: "3",
    label: "Test 3 — The Fractured Halo",
    Mark: LogoHalo,
    slogan: "Where personality frameworks converge.",
  },
];

export function BrandTestClient() {
  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-background">
      <div aria-hidden className="spatial-grid-bg" />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(124,140,255,0.18),transparent),radial-gradient(ellipse_60%_50%_at_100%_0%,rgba(55,224,196,0.14),transparent)]"
      />
      <div className="mx-auto w-full max-w-3xl px-4 py-14">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight">Brand header concepts</h1>
        <p className="mb-10 text-sm leading-relaxed text-muted-foreground">
          Three custom marks, each built on a different construction principle — geometric,
          continuous-line, and negative-space — so they read as genuinely distinct directions,
          not variations of one idea.
        </p>

        <div className="space-y-10">
          {VARIANTS.map(({ key, label, Mark, slogan }) => (
            <div key={key}>
              <div className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
              </div>
              <div className="flex items-center gap-3 rounded-2xl border bg-card/60 px-5 py-4 backdrop-blur-md">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#0b1020] shadow-[0_8px_20px_-4px_rgba(0,0,0,0.6)]">
                  <Mark />
                </span>
                <div className="leading-tight">
                  <div className="font-semibold tracking-tight">Colevitate</div>
                  <div className="text-xs text-muted-foreground">{slogan}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
