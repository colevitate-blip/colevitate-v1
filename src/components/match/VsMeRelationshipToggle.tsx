"use client";

import { useRouter, usePathname } from "@/i18n/navigation";
import { RelationshipTypeToggle } from "@/components/personality/compatibility/RelationshipTypeToggle";
import type { RelationshipType } from "@/components/personality/compatibility/relationshipFraming";

/** The vs=me flow's own relationship-type switch — CelebrityMatchPicker's toggle only renders on the two-roster-person picker, so the "You vs. a celebrity" page needs this thin routing wrapper around the same shared toggle. */
export function VsMeRelationshipToggle({ slug, value }: { slug: string; value: RelationshipType }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <RelationshipTypeToggle
      value={value}
      onSelect={(type) => router.replace(`${pathname}?a=${slug}&vs=me&type=${type}`, { scroll: false })}
    />
  );
}
