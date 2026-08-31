import { User } from "lucide-react";
import type { FamousPersonContent } from "@/lib/seo/famousPeopleContent";
import { PersonAvatar } from "@/components/seo/PersonAvatar";

function VersusSide({ person }: { person: FamousPersonContent | null }) {
  if (!person) {
    return (
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex size-16 items-center justify-center rounded-full border bg-muted text-muted-foreground">
          <User className="size-7" />
        </div>
        <p className="text-sm font-medium">You</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <PersonAvatar person={person} size={64} />
      <div>
        <p className="text-sm font-medium">{person.name}</p>
        <p className="text-xs text-muted-foreground">{person.years}</p>
      </div>
    </div>
  );
}

/** `null` for a side means "the viewer" — shown as a generic avatar labeled "You" instead of a celeb photo. */
export function PersonVersusHeader({
  personA,
  personB,
}: {
  personA: FamousPersonContent | null;
  personB: FamousPersonContent | null;
}) {
  return (
    <div className="mx-auto flex w-full max-w-3xl items-center justify-center gap-6 px-4 sm:gap-10">
      <VersusSide person={personA} />
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">vs</p>
      <VersusSide person={personB} />
    </div>
  );
}
