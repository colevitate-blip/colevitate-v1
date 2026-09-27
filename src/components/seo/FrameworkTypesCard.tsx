import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { ExpandableList } from "./ExpandableList";

/**
 * One framework's card on the /learn hub: a short "how it works" blurb (so a
 * visitor hits that before the raw list of sub-types, not after) plus its
 * type pills. Pills past `previewCount` start collapsed — 16 MBTI or 10 Big
 * Five pills dumped flat under a heading is the "overwhelming on mobile"
 * complaint this exists to fix; smaller frameworks (Human Design, Colors)
 * never hit the threshold so they render exactly as before, no toggle.
 *
 * `standing` is the framework's evidence verdict ("weaker evidence than Big
 * Five", "no scientific basis"). It labels the explainer link rather than
 * sitting beside it: when /types merged into /learn this card absorbed the
 * old learn card, whose entire call to action was that verdict — burying it
 * in body copy would drop the one thing distinguishing these four tools.
 *
 * No "use client" of its own any more: the collapse lives in ExpandableList,
 * which is the only part that needs state, so the card itself renders on the
 * server alongside the rest of the hub.
 */
export function FrameworkTypesCard({
  tagline,
  label,
  intro,
  standing,
  learnHref,
  pills,
  previewCount = 8,
}: {
  tagline: string;
  label: string;
  intro: string;
  standing?: string;
  learnHref: string;
  pills: { href: string; label: string }[];
  previewCount?: number;
}) {
  return (
    <div className="rounded-3xl border bg-card p-6">
      <Badge variant="outline" className="w-fit rounded-full">
        {tagline}
      </Badge>
      <h2 className="mt-3 text-xl font-semibold tracking-tight">{label}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{intro}</p>
      <Link
        href={learnHref}
        className="mt-2 inline-block text-sm font-medium text-primary underline-offset-2 hover:underline"
      >
        {standing ? `${standing} →` : `How ${label} works →`}
      </Link>

      <ExpandableList
        previewCount={previewCount}
        previewClassName="mt-4 flex flex-wrap gap-2"
        restClassName="mt-2 flex flex-wrap gap-2"
        toggleClassName="mt-3"
        items={pills.map((pill) => (
          <Link
            key={pill.href}
            href={pill.href}
            className="rounded-full border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted/50"
          >
            {pill.label}
          </Link>
        ))}
      />
    </div>
  );
}
