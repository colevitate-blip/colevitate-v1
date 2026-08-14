import { cn } from "@/lib/utils";

interface TraitBarProps {
  label: string;
  value: number;
  gradient: string;
  leftCaption?: string;
  rightCaption?: string;
}

export function TraitBar({ label, value, gradient, leftCaption, rightCaption }: TraitBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-muted-foreground">{Math.round(clamped)}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r transition-all", gradient)}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {leftCaption || rightCaption ? (
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>{leftCaption}</span>
          <span>{rightCaption}</span>
        </div>
      ) : null}
    </div>
  );
}
