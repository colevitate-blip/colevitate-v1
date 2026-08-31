import { FAMOUS_PEOPLE, type FamousPersonContent } from "./famousPeopleContent";

// Cheap deterministic hash so suggestions are stable across renders/builds
// (person pages are statically generated) without needing per-person
// hand-curated lists to maintain as the roster grows.
function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return h;
}

/** Deterministically picks a mix of same-category ("similar") and other-category ("contrast") people to suggest comparing against. */
export function pickComparisonSuggestions(
  current: FamousPersonContent,
  all: FamousPersonContent[] = FAMOUS_PEOPLE,
  count = 3
): FamousPersonContent[] {
  const others = all.filter((p) => p.slug !== current.slug);
  const sameCategory = others
    .filter((p) => p.category === current.category)
    .sort((a, b) => hash(current.slug + a.slug) - hash(current.slug + b.slug));
  const otherCategory = others
    .filter((p) => p.category !== current.category)
    .sort((a, b) => hash(current.slug + a.slug) - hash(current.slug + b.slug));

  const sameCount = Math.min(2, sameCategory.length, count);
  const picked = sameCategory.slice(0, sameCount);
  for (const p of otherCategory) {
    if (picked.length >= count) break;
    picked.push(p);
  }
  for (const p of sameCategory.slice(sameCount)) {
    if (picked.length >= count) break;
    picked.push(p);
  }
  return picked;
}
