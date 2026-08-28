import { COLOR_THEME } from "@/lib/personality/theme";
import type { ColorId } from "@/lib/personality/types";
import type { FamousPersonContent } from "@/lib/seo/famousPeopleContent";

/**
 * Famous people only ever have ONE Colors-framework code stored (their
 * dominant color, e.g. "blue") — there's no per-person secondary/subdominant
 * color in the data. Rather than fabricate a second color, this uses that
 * color's own built-in two-stop gradient (COLOR_THEME[x].gradient, e.g.
 * blue -> indigo) as the pill's stroke, so it still reads as a gradient
 * without inventing data that doesn't exist.
 */
export function MbtiColorPill({ person }: { person: FamousPersonContent }) {
  const mbti = person.typings.find((t) => t.framework === "mbti")?.code;
  const colorCode = person.typings.find((t) => t.framework === "colors")?.code as ColorId | undefined;
  if (!mbti) return null;
  const theme = colorCode ? COLOR_THEME[colorCode] : null;

  return (
    <span className={`ml-auto shrink-0 rounded-full bg-gradient-to-r p-[1.5px] ${theme?.gradient ?? "from-border to-border"}`}>
      <span className="block rounded-full bg-background px-2.5 py-0.5 text-xs font-semibold">{mbti}</span>
    </span>
  );
}
