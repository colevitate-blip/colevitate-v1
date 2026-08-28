import { ReactNode } from "react";

/**
 * Shared header for anything that shows a discovery-scoped profile — the
 * settings "what a stranger would see" preview and each card in the browse
 * grid both render through this, so the two surfaces can never drift into
 * showing different fields (only ever display name, avatar, archetype —
 * never anything derived from the raw PersonalityResults jsonb).
 */
export function SlimProfileCard({
  displayName,
  avatarUrl,
  archetypeName,
  children,
}: {
  displayName: string;
  avatarUrl: string | null;
  archetypeName: string | null;
  children?: ReactNode;
}) {
  return (
    <div className="space-y-4 rounded-2xl border bg-card p-5">
      <div className="flex items-center gap-3">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="size-11 rounded-full bg-muted object-cover" />
        ) : (
          <div className="flex size-11 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground">
            {displayName.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-sm font-medium">{displayName}</p>
          {archetypeName && <p className="text-xs text-muted-foreground">{archetypeName}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}
