import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { TypePageContent } from "@/lib/seo/typeContent";
import type { FamousPersonContent } from "@/lib/seo/famousPeopleContent";

export function FamousTypeTemplate({
  content,
  headline,
  people,
}: {
  content: TypePageContent;
  headline: string;
  people: FamousPersonContent[];
}) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
      <p className="text-sm font-medium text-muted-foreground">
        <Link href={`/types/${content.frameworkUrlSlug}/${content.slug}`} className="underline underline-offset-2">
          {content.frameworkLabel}
        </Link>{" "}
        · {content.name}
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{headline}</h1>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
        Colevitate&apos;s editorial take on well-known people who fit this profile, based on public behavior and
        biography — never presented as their own quiz result or as fact.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {people.map((person) => (
          <Link
            key={person.slug}
            href={`/people/${person.slug}`}
            className="flex items-center gap-3 rounded-2xl border p-3 transition-colors hover:bg-muted/50"
          >
            {person.photo ? (
              <div className="relative size-14 shrink-0 overflow-hidden rounded-full border">
                <Image src={person.photo.url} alt={person.name} fill sizes="56px" className="object-cover" />
              </div>
            ) : (
              <div className="size-14 shrink-0 rounded-full border bg-muted" aria-hidden />
            )}
            <div>
              <p className="text-sm font-semibold">{person.name}</p>
              <p className="text-xs text-muted-foreground">{person.years}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
