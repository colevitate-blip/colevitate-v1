import { cn } from "@/lib/utils";

interface ResultBadgeProps {
  code: string;
  gradient: string;
  size?: "md" | "lg";
}

export function ResultBadge({ code, gradient, size = "lg" }: ResultBadgeProps) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-[2rem] bg-gradient-to-br shadow-[0_20px_44px_-14px_var(--elevation-shadow-sm)]",
        gradient,
        size === "lg" ? "size-28 sm:size-32" : "size-16"
      )}
    >
      <div className="absolute inset-0 rounded-[2rem] bg-white/10 mix-blend-overlay" />
      <span
        className={cn(
          "font-bold tracking-tight text-white",
          size === "lg" ? "text-3xl sm:text-4xl" : "text-lg"
        )}
      >
        {code}
      </span>
    </div>
  );
}
