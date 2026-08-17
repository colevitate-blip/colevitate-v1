import Link from "next/link";
import { ColevitateMark } from "@/components/brand/Logo";
import { SignInCard } from "@/components/auth/SignInCard";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,var(--hero-glow-1),transparent),radial-gradient(ellipse_60%_50%_at_100%_0%,var(--hero-glow-2),transparent)]"
      />
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <Link href="/" className="mb-8 flex flex-col items-center gap-2">
        <ColevitateMark className="size-12" />
        <span className="text-lg font-bold tracking-tight">Colevitate</span>
      </Link>
      <SignInCard />
    </div>
  );
}
