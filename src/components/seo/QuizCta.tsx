import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function QuizCta({ href, label }: { href: string; label: string }) {
  return (
    <div className="mt-10 rounded-3xl border bg-card p-6 text-center sm:p-8">
      <p className="text-sm text-muted-foreground">Want your own combined profile?</p>
      <h2 className="mt-1 text-xl font-semibold tracking-tight">
        Take the quiz and see how your results connect
      </h2>
      <Button asChild className="mt-4 h-auto whitespace-normal rounded-full py-2 text-center">
        <Link href={href}>
          {label}
          <ArrowRight className="size-4 shrink-0" />
        </Link>
      </Button>
    </div>
  );
}
