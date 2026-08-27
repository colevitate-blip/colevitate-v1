// Combination pages are Colevitate's actual differentiator over
// single-framework sites. Expanded per Tier 3.1a/3.1b of
// IMPROVEMENT_PROMPTS.md — no real keyword-volume tool was available, so
// this set is directionally prioritized (weighted toward higher-interest
// MBTI types, and toward psychologically defensible pairings) rather than
// verified-by-search-data; see the 3.1a research summary in chat history
// for the exact methodology. Everything downstream (routes, sitemap,
// generateStaticParams) reads from this list automatically.

import type { AssessmentId } from "@/lib/personality/types";
import { getTypeContent, FRAMEWORK_URL_SLUGS } from "./typeContent";
import { getCombinationTranslation } from "./translations";

export interface TypeRef {
  framework: AssessmentId;
  code: string;
}

export interface CombinationPageContent {
  slug: string;
  a: TypeRef;
  b: TypeRef;
  headline: string;
  summary: string;
  reinforcements: string[];
  contrasts: string[];
}

export const COMBINATIONS: CombinationPageContent[] = [
  {
    slug: "infj-and-high-openness",
    a: { framework: "mbti", code: "INFJ" },
    b: { framework: "bigfive", code: "openness-high" },
    headline: "INFJ + High Openness: Insight Meets Imagination",
    summary:
      "INFJ already leans toward seeing the meaning behind a situation before others do. Paired with a high Openness score, that instinct extends outward into a genuine pull toward novel ideas, art, and unconventional thinking — not just reading people accurately, but reading whole situations for what's possible, not only what's proven.",
    reinforcements: [
      "Both signals point toward abstract, pattern-first thinking rather than starting from concrete detail",
      "High Openness reinforces INFJ's tendency to connect a specific decision to a larger, less obvious meaning",
      "Together they suggest someone who gets restless inside purely conventional, by-the-book environments",
    ],
    contrasts: [
      "INFJ's insight is usually anchored to a firm internal value system; high Openness pulls toward exploring ideas even when they haven't been value-tested yet — that tension can show up as feeling torn between staying principled and staying curious",
    ],
  },
  {
    slug: "human-design-projector-and-infp",
    a: { framework: "humandesign", code: "projector" },
    b: { framework: "mbti", code: "INFP" },
    headline: "Human Design Projector + INFP: Quiet Depth, Waiting to Be Seen",
    summary:
      "Projector energy is built to see systems and people clearly from the outside, with guidance that lands best when it's invited rather than volunteered. INFP is guided by a private, values-driven sense of what's true and meaningful, and would rather show what it means than argue the case. Both types carry real depth that doesn't announce itself — it has to be noticed.",
    reinforcements: [
      "Neither type is built around constant self-promotion or forcing output to prove worth",
      "Both do their best work with focus and space, rather than under external pressure to constantly produce",
      "Each reads people and underlying dynamics with more accuracy than they typically get credit for",
    ],
    contrasts: [
      "Projector's strategy is explicitly about waiting for outside recognition and invitation, while INFP tends to be self-contained and doesn't need external validation to feel its values are true — one type's growth edge (needing to be seen) can sit awkwardly next to the other's instinct (not needing to perform)",
    ],
  },
  {
    slug: "entj-and-high-conscientiousness",
    a: { framework: "mbti", code: "ENTJ" },
    b: { framework: "bigfive", code: "conscientiousness-high" },
    headline: "ENTJ + High Conscientiousness: Speed Meets Discipline",
    summary:
      "ENTJ turns ambiguity into a plan and moves on it fast. High Conscientiousness adds real staying power to that — the discipline to follow the plan through to the unglamorous finish, not just call the shot. Together they point toward someone who both decides quickly and actually delivers.",
    reinforcements: [
      "Both traits favor clear structure and forward momentum over open-ended exploration",
      "High Conscientiousness reinforces ENTJ's natural tendency to hold people (including themselves) accountable to what was agreed",
      "Each independently produces someone who's genuinely reliable under a deadline, not just decisive in the moment",
    ],
    contrasts: [
      "ENTJ's bias is toward speed and treating setbacks as data to move past quickly; high Conscientiousness's perfectionist streak can pull the other way, slowing things down to get every detail right — worth watching for tension between shipping fast and shipping thorough",
    ],
  },
  {
    slug: "green-and-enfj",
    a: { framework: "colors", code: "green" },
    b: { framework: "mbti", code: "ENFJ" },
    headline: "Green + ENFJ: Steady Support Meets Active Guidance",
    summary:
      "Green energy is motivated by connection and stability — a calm, dependable presence a team can lean on. ENFJ reads a room and actively works to bring out the best in the people in it, often through a clearly articulated shared vision. Both are people-first, but one leads by steadiness and the other by active mobilization.",
    reinforcements: [
      "Both prioritize the wellbeing of the people around them over pure task efficiency",
      "Each builds trust quickly and is the person others bring problems to",
      "Both find real satisfaction in group harmony and cooperative outcomes",
    ],
    contrasts: [
      "Green tends to support quietly and prefers a steady pace; ENFJ is more likely to step forward and actively push a group toward a vision — one instinct is to hold space, the other is to lead it, and knowing which mode you're in can matter in group settings",
    ],
  },

  // ---- MBTI + Big Five ----
  {
    slug: "intj-and-high-openness",
    a: { framework: "mbti", code: "INTJ" },
    b: { framework: "bigfive", code: "openness-high" },
    headline: "INTJ + High Openness: Vision With No Ceiling",
    summary:
      "INTJ already thinks in systems and long horizons, building an independent, well-reasoned view of where things are headed. High Openness widens the raw material that view draws from — a genuine pull toward novel ideas and unconventional angles, not just proven ones. Together they suggest someone building an ambitious long-term vision out of unusually original components.",
    reinforcements: [
      "Both favor abstract, pattern-first thinking over concrete, step-by-step detail",
      "High Openness feeds INTJ's appetite for refining a strategic vision rather than settling for a good-enough one",
      "Neither is satisfied by convention for its own sake — both want to know the vision is actually the best available answer",
    ],
    contrasts: [
      "INTJ's vision-building is usually anchored to a specific, decided direction; high Openness keeps pulling toward exploring new alternatives even after a direction is set — that tension can show up as second-guessing a plan that was already sound",
    ],
  },
  {
    slug: "intj-and-high-conscientiousness",
    a: { framework: "mbti", code: "INTJ" },
    b: { framework: "bigfive", code: "conscientiousness-high" },
    headline: "INTJ + High Conscientiousness: The Plan Actually Gets Built",
    summary:
      "INTJ sets ambitious long-term goals and works toward them with quiet consistency. High Conscientiousness reinforces that with real follow-through discipline — the standard that makes sure the well-reasoned plan doesn't just stay a plan. Together they point toward someone who both designs the system and does the unglamorous work of building it.",
    reinforcements: [
      "Both favor structure, standards, and long-horizon thinking over improvisation",
      "High Conscientiousness matches INTJ's own discipline in working steadily toward a goal others might abandon",
      "Each independently produces someone people can trust to actually deliver on a stated plan",
    ],
    contrasts: [
      "INTJ's confidence in its own reasoning can clash with high Conscientiousness's perfectionist instinct to double-check everything — worth watching for a plan that's technically sound but gets delayed by excessive polishing",
    ],
  },
  {
    slug: "intp-and-high-openness",
    a: { framework: "mbti", code: "INTP" },
    b: { framework: "bigfive", code: "openness-high" },
    headline: "INTP + High Openness: Curiosity Without a Leash",
    summary:
      "INTP is driven by the pull of an interesting problem, wanting to deeply understand how something works rather than move fast on a shallow read. High Openness adds a genuine hunger for the novel and untested on top of that analytical drive. Together they suggest someone who doesn't just solve problems well, but actively seeks out the strangest, least-obvious ones to solve.",
    reinforcements: [
      "Both prioritize genuine understanding and original thinking over following convention",
      "High Openness reinforces INTP's tendency to generate frameworks nobody's tried rather than reach for the standard answer",
      "Neither treats an idea as settled just because it's widely accepted",
    ],
    contrasts: [
      "INTP's analysis can loop indefinitely without converging on a decision; high Openness adds even more directions worth exploring — together that can mean brilliant ideas that rarely reach a finished, shippable state",
    ],
  },
  {
    slug: "intp-and-low-conscientiousness",
    a: { framework: "mbti", code: "INTP" },
    b: { framework: "bigfive", code: "conscientiousness-low" },
    headline: "INTP + Low Conscientiousness: Deep Thinker, Loose Structure",
    summary:
      "INTP would rather deeply understand a problem than move fast on a shallow read, often at the expense of routine follow-through. Low Conscientiousness reinforces that — a genuine preference for staying flexible over planning in detail. Together they describe someone whose best thinking happens off-schedule, in whatever order the ideas actually arrive.",
    reinforcements: [
      "Both resist rigid structure in favor of following where the interesting problem actually leads",
      "Low Conscientiousness matches INTP's own tendency to let routine tasks lag behind the quality of the ideas",
      "Neither feels boxed in by a plan that isn't working anymore — both adapt readily",
    ],
    contrasts: [
      "INTP's ideas are often genuinely rigorous once worked through; low Conscientiousness makes it harder to reliably get from a good idea to a finished, delivered one — the gap between insight and execution can widen here",
    ],
  },
  {
    slug: "entj-and-high-openness",
    a: { framework: "mbti", code: "ENTJ" },
    b: { framework: "bigfive", code: "openness-high" },
    headline: "ENTJ + High Openness: Bold Plans, Original Ones",
    summary:
      "ENTJ turns ambiguity into a plan and mobilizes people to execute it fast. High Openness means that plan is more likely to be a genuinely original one, not just the most efficient version of the obvious move. Together they suggest a decisive leader who's also willing to bet on an unconventional strategy.",
    reinforcements: [
      "Both are comfortable challenging the established way of doing things",
      "High Openness gives ENTJ's decisiveness more unconventional options to decide between",
      "Neither treats 'that's how it's always been done' as a real argument",
    ],
    contrasts: [
      "ENTJ wants to decide and move; high Openness keeps generating new possibilities even after a decision is made — that tension can show up as a leader who's tempted to pivot strategy mid-execution",
    ],
  },
  {
    slug: "entp-and-high-openness",
    a: { framework: "mbti", code: "ENTP" },
    b: { framework: "bigfive", code: "openness-high" },
    headline: "ENTP + High Openness: Possibility on Top of Possibility",
    summary:
      "ENTP is energized by possibility, quick to spot the flaw in a plan and propose three better ones. High Openness reinforces that instinct at a deeper level — a genuine draw toward the novel and untested, not just a knack for argument. Together they describe someone who treats convention as a starting point to argue with, not a constraint to work within.",
    reinforcements: [
      "Both actively seek out the unconventional over the proven",
      "High Openness feeds ENTP's habit of generating a wide range of novel options rather than anchoring on the first idea",
      "Each independently challenges stale assumptions rather than accepting them",
    ],
    contrasts: [
      "ENTP already starts more projects than it finishes; high Openness adds even more tempting new directions to chase — together that can mean an unusually large gap between ideas generated and ideas actually completed",
    ],
  },
  {
    slug: "entp-and-low-conscientiousness",
    a: { framework: "mbti", code: "ENTP" },
    b: { framework: "bigfive", code: "conscientiousness-low" },
    headline: "ENTP + Low Conscientiousness: Fast, Flexible, and a Little Chaotic",
    summary:
      "ENTP adapts fast when circumstances change mid-plan, energized by the new rather than anxious about it. Low Conscientiousness reinforces that flexibility with a genuine preference for improvising over detailed planning. Together they describe someone who's genuinely at their best in fluid, fast-moving situations — and genuinely uncomfortable being pinned to a rigid schedule.",
    reinforcements: [
      "Both treat a fixed plan as something to adapt, not something to protect",
      "Low Conscientiousness matches ENTP's tendency to start more than it finishes",
      "Neither feels particularly boxed in when a situation changes suddenly",
    ],
    contrasts: [
      "ENTP's flexibility is usually paired with sharp, fast reasoning about what to do next; low Conscientiousness can mean that reasoning doesn't translate into reliable follow-through even once a good next step is clear",
    ],
  },
  {
    slug: "infj-and-high-conscientiousness",
    a: { framework: "mbti", code: "INFJ" },
    b: { framework: "bigfive", code: "conscientiousness-high" },
    headline: "INFJ + High Conscientiousness: Quiet Vision, Real Follow-Through",
    summary:
      "INFJ holds a firm, well-considered set of values and cares about getting things right for the people involved, not just the outcome. High Conscientiousness adds the discipline to actually carry that care through to completion rather than let it stay a good intention. Together they suggest someone whose principles reliably show up in what they actually deliver.",
    reinforcements: [
      "Both take commitments seriously once made, rather than treating them as flexible",
      "High Conscientiousness reinforces INFJ's instinct to connect a specific decision to its larger meaning and see it through",
      "Each independently produces someone others can genuinely count on",
    ],
    contrasts: [
      "INFJ's idealism can clash with high Conscientiousness's perfectionist streak — together, a project can stall while waiting for it to meet an internal standard that's already been met in every practical sense",
    ],
  },
  {
    slug: "infp-and-high-openness",
    a: { framework: "mbti", code: "INFP" },
    b: { framework: "bigfive", code: "openness-high" },
    headline: "INFP + High Openness: Imagination With Real Conviction",
    summary:
      "INFP sees creative, values-driven angles that others overlook, guided by a clear internal sense of what's meaningful. High Openness reinforces that with a genuine pull toward the novel and unconventional, on top of the values-driven lens. Together they describe someone whose imaginative ideas are also personally, deeply felt — not just intellectually interesting.",
    reinforcements: [
      "Both resist settling for the conventional, expected answer",
      "High Openness widens the range of ideas INFP's values get applied to",
      "Neither is satisfied by an idea that's proven but doesn't feel true",
    ],
    contrasts: [
      "INFP anchors new ideas to a personal values framework; high Openness can pull toward exploring ideas before they've been value-tested — that tension can feel like being drawn to something exciting that hasn't yet earned the same trust",
    ],
  },
  {
    slug: "infp-and-low-conscientiousness",
    a: { framework: "mbti", code: "INFP" },
    b: { framework: "bigfive", code: "conscientiousness-low" },
    headline: "INFP + Low Conscientiousness: Following the Feeling, Not the Plan",
    summary:
      "INFP cares less about how things look from the outside and more about whether they're true to its values, which doesn't always map onto a tidy schedule. Low Conscientiousness reinforces that — a genuine preference for staying flexible and adapting in the moment. Together they describe someone whose best, most authentic work rarely follows a predictable timeline.",
    reinforcements: [
      "Both resist rigid structure that doesn't leave room for how something actually feels in the moment",
      "Low Conscientiousness matches INFP's tendency to let routine follow-through slip when it's not personally meaningful",
      "Neither treats a plan as more important than staying true to what actually matters",
    ],
    contrasts: [
      "INFP's values-driven work benefits from real follow-through to reach people; low Conscientiousness makes that follow-through the hardest part — worth building in outside structure specifically for the parts that matter most",
    ],
  },
  {
    slug: "enfj-and-high-openness",
    a: { framework: "mbti", code: "ENFJ" },
    b: { framework: "bigfive", code: "openness-high" },
    headline: "ENFJ + High Openness: A Vision Worth Following",
    summary:
      "ENFJ has a natural gift for articulating a shared vision that genuinely rallies people. High Openness means that vision is more likely to be a fresh, original one, not just a well-communicated version of the expected path. Together they describe a leader whose ideas are both inspiring and genuinely new.",
    reinforcements: [
      "Both are drawn to fresh possibility over the safe, familiar option",
      "High Openness gives ENFJ's persuasive instincts something more original to persuade people toward",
      "Neither treats convention as a reason on its own to stick with a plan",
    ],
    contrasts: [
      "ENFJ's vision usually needs to land clearly with a group to work; high Openness can pull that vision toward ideas that are exciting but harder for others to immediately follow — worth translating the novel idea back into something concrete",
    ],
  },
  {
    slug: "enfj-and-high-conscientiousness",
    a: { framework: "mbti", code: "ENFJ" },
    b: { framework: "bigfive", code: "conscientiousness-high" },
    headline: "ENFJ + High Conscientiousness: Warmth That Actually Delivers",
    summary:
      "ENFJ notices individual strengths and actively helps people grow into them. High Conscientiousness reinforces that with real reliability — the follow-through that turns a supportive intention into consistent, structured mentorship. Together they suggest someone whose care for people shows up in dependable action, not just good intentions.",
    reinforcements: [
      "Both take commitments to other people seriously and follow through on them",
      "High Conscientiousness reinforces ENFJ's instinct to build a shared vision people can actually count on",
      "Each independently produces someone who's organized as well as genuinely warm",
    ],
    contrasts: [
      "ENFJ can overcommit to others' needs; high Conscientiousness adds the drive to actually follow through on every one of those commitments — together that combination is prone to real overextension without deliberate limits",
    ],
  },
  {
    slug: "enfp-and-high-openness",
    a: { framework: "mbti", code: "ENFP" },
    b: { framework: "bigfive", code: "openness-high" },
    headline: "ENFP + High Openness: Curiosity at Full Volume",
    summary:
      "ENFP connects ideas and people that wouldn't normally intersect, driven by genuine curiosity and warmth. High Openness reinforces that at the root — a real hunger for the new, not just a knack for making connections. Together they describe someone whose enthusiasm for possibility runs all the way down.",
    reinforcements: [
      "Both are consistently drawn toward the novel over the routine",
      "High Openness reinforces ENFP's habit of seeing non-obvious links between ideas, people, and opportunities",
      "Neither loses energy exploring an unconventional direction just because it's untested",
    ],
    contrasts: [
      "ENFP's follow-through already tends to lag behind its excitement for a new idea; high Openness adds even more new ideas competing for that same attention — together, finishing what's already started can be the real challenge",
    ],
  },
  {
    slug: "enfp-and-low-conscientiousness",
    a: { framework: "mbti", code: "ENFP" },
    b: { framework: "bigfive", code: "conscientiousness-low" },
    headline: "ENFP + Low Conscientiousness: Enthusiasm, Unscheduled",
    summary:
      "ENFP adapts plans on the fly without losing enthusiasm, energized by momentum rather than a fixed structure. Low Conscientiousness reinforces that with a genuine comfort staying flexible rather than planning in detail. Together they describe someone who thrives on spontaneity, and for whom a rigid schedule genuinely gets in the way rather than just feeling unnecessary.",
    reinforcements: [
      "Both treat structure as optional rather than a prerequisite for good work",
      "Low Conscientiousness matches ENFP's own tendency for follow-through to lag behind the excitement of something new",
      "Neither feels particularly anxious when a plan changes at the last minute",
    ],
    contrasts: [
      "ENFP's enthusiasm is genuinely contagious and can carry a project a long way; low Conscientiousness means that momentum needs external structure to actually cross the finish line, or it risks staying a great idea rather than a finished one",
    ],
  },
  {
    slug: "istj-and-low-openness",
    a: { framework: "mbti", code: "ISTJ" },
    b: { framework: "bigfive", code: "openness-low" },
    headline: "ISTJ + Low Openness: Trust What's Already Proven",
    summary:
      "ISTJ trusts proven methods and keeps track of details others let slip, favoring the reliable over the untested. Low Openness reinforces that directly — a genuine preference for the practical and proven over the abstract and speculative. Together they describe someone whose reliability comes from consistently choosing the option that's already demonstrated to work.",
    reinforcements: [
      "Both are comfortable sticking with what's known to work rather than chasing novelty",
      "Low Openness reinforces ISTJ's respect for process and precedent over reinventing the wheel",
      "Neither needs a new approach to feel legitimate before trusting it",
    ],
    contrasts: [
      "ISTJ's resistance to unfamiliar approaches is already a known growth edge; low Openness adds an even stronger pull toward the concrete and proven — worth deliberately testing a genuinely better new idea before dismissing it",
    ],
  },
  {
    slug: "istj-and-high-conscientiousness",
    a: { framework: "mbti", code: "ISTJ" },
    b: { framework: "bigfive", code: "conscientiousness-high" },
    headline: "ISTJ + High Conscientiousness: Reliability, Doubled Down",
    summary:
      "ISTJ delivers consistently on commitments, even the unglamorous ones nobody's tracking. High Conscientiousness reinforces that at the root — a genuine internal standard for planning ahead and following through. Together they describe someone whose dependability isn't a role they play, it's how they're actually wired.",
    reinforcements: [
      "Both hold themselves to a high standard regardless of who's watching",
      "High Conscientiousness reinforces ISTJ's respect for process, precedent, and doing things the right way",
      "Each independently produces someone who catches problems before they become visible",
    ],
    contrasts: [
      "ISTJ can resist a genuinely better new approach out of unfamiliarity; high Conscientiousness's perfectionist streak can reinforce that by making any change feel like a risk to already-high standards — worth periodically stress-testing whether 'proven' is still true",
    ],
  },
  {
    slug: "isfj-and-low-openness",
    a: { framework: "mbti", code: "ISFJ" },
    b: { framework: "bigfive", code: "openness-low" },
    headline: "ISFJ + Low Openness: Steady Care, Familiar Ground",
    summary:
      "ISFJ creates a stable, calm environment others can lean on, built from consistency more than novelty. Low Openness reinforces that directly — genuine comfort with the practical and familiar over the abstract and untested. Together they describe someone whose steadiness is a deliberate, felt preference, not just a byproduct of caution.",
    reinforcements: [
      "Both find real comfort and value in consistency and tradition",
      "Low Openness reinforces ISFJ's instinct to balance tradition with sensitivity to individual needs, rather than chase reinvention",
      "Neither needs novelty to feel like life is meaningful or full",
    ],
    contrasts: [
      "ISFJ can find change more threatening than it needs to be; low Openness adds an even stronger pull toward the familiar — worth noticing when a genuinely helpful change is being avoided just because it's unfamiliar",
    ],
  },
  {
    slug: "isfj-and-high-conscientiousness",
    a: { framework: "mbti", code: "ISFJ" },
    b: { framework: "bigfive", code: "conscientiousness-high" },
    headline: "ISFJ + High Conscientiousness: Care You Can Set Your Watch To",
    summary:
      "ISFJ keeps commitments quietly and reliably, without needing recognition for it. High Conscientiousness reinforces that at the root — a genuine internal standard for follow-through, not just a sense of obligation. Together they describe someone whose care for others is backed by real, consistent discipline.",
    reinforcements: [
      "Both take quiet pride in doing things properly, whether or not anyone notices",
      "High Conscientiousness reinforces ISFJ's tendency to remember and act on the specific details that make people feel cared for",
      "Each independently produces someone who rarely lets a commitment quietly slide",
    ],
    contrasts: [
      "ISFJ already risks over-giving until its own needs go unmet; high Conscientiousness's drive to follow through on everything can make that harder to interrupt — worth treating your own needs as a commitment worth keeping too",
    ],
  },
  {
    slug: "estj-and-low-openness",
    a: { framework: "mbti", code: "ESTJ" },
    b: { framework: "bigfive", code: "openness-low" },
    headline: "ESTJ + Low Openness: Execution Over Experimentation",
    summary:
      "ESTJ cuts through ambiguity to get things moving, with little patience for process that doesn't visibly work. Low Openness reinforces that directly — a genuine preference for the practical and proven over the speculative. Together they describe someone who gets things done specifically by sticking with what's already known to work.",
    reinforcements: [
      "Both trust demonstrated results over untested theory",
      "Low Openness reinforces ESTJ's attachment to 'the right way' — the way that's already been shown to succeed",
      "Neither wastes time debating an approach that's already proven itself",
    ],
    contrasts: [
      "ESTJ's attachment to the established way of doing things can crowd out a genuinely better new idea; low Openness reinforces that same instinct — worth deliberately making space to evaluate a new approach on its merits, not its novelty",
    ],
  },
  {
    slug: "estj-and-high-conscientiousness",
    a: { framework: "mbti", code: "ESTJ" },
    b: { framework: "bigfive", code: "conscientiousness-high" },
    headline: "ESTJ + High Conscientiousness: The Standard Never Slips",
    summary:
      "ESTJ holds a clear, consistent standard and applies it fairly across a team or project. High Conscientiousness reinforces that at the root — a genuine internal drive to plan ahead and follow through completely. Together they describe someone whose organizational discipline runs deep, not just outward-facing.",
    reinforcements: [
      "Both hold themselves to the same high bar they set for others",
      "High Conscientiousness reinforces ESTJ's instinct to organize people and timelines into something genuinely executable",
      "Each independently produces someone who owns outcomes rather than excuses",
    ],
    contrasts: [
      "ESTJ's directness can already land harder than intended; high Conscientiousness's perfectionism can sharpen that further when others don't meet the same standard — worth pairing high standards with real patience for how others get there",
    ],
  },
  {
    slug: "esfj-and-low-openness",
    a: { framework: "mbti", code: "ESFJ" },
    b: { framework: "bigfive", code: "openness-low" },
    headline: "ESFJ + Low Openness: Warmth Within a Familiar Frame",
    summary:
      "ESFJ builds warm, cooperative relationships and keeps a group's plans actually running. Low Openness reinforces that with a genuine comfort in the tried-and-true, rather than a constant pull toward reinvention. Together they describe someone whose social warmth is expressed through familiar, dependable rituals rather than novel ones.",
    reinforcements: [
      "Both find real comfort in consistency and established social ritual",
      "Low Openness reinforces ESFJ's instinct to organize logistics the way that's already known to work",
      "Neither needs a new approach to feel like the group is thriving",
    ],
    contrasts: [
      "ESFJ's harmony-seeking can already mean avoiding a needed disagreement; low Openness's discomfort with the unfamiliar can add resistance to a genuinely needed change to group norms — worth separating 'unfamiliar' from 'actually risky'",
    ],
  },
  {
    slug: "esfj-and-high-conscientiousness",
    a: { framework: "mbti", code: "ESFJ" },
    b: { framework: "bigfive", code: "conscientiousness-high" },
    headline: "ESFJ + High Conscientiousness: Hospitality, Fully Organized",
    summary:
      "ESFJ organizes people and logistics so things actually run smoothly, not just pleasantly. High Conscientiousness reinforces that at the root — a genuine internal standard for planning and follow-through. Together they describe someone whose care for a group shows up as real, dependable organization, not just good intentions.",
    reinforcements: [
      "Both take real pride in things being properly, thoroughly handled",
      "High Conscientiousness reinforces ESFJ's follow-through on commitments to the people who matter to them",
      "Each independently produces someone who's genuinely trusted to make an event or project actually happen",
    ],
    contrasts: [
      "ESFJ already risks tying self-worth too closely to others' approval; high Conscientiousness's perfectionism can raise the personal stakes of every commitment even further — worth remembering that 'good enough' is sometimes actually enough",
    ],
  },
  {
    slug: "istp-and-low-openness",
    a: { framework: "mbti", code: "ISTP" },
    b: { framework: "bigfive", code: "openness-low" },
    headline: "ISTP + Low Openness: Hands-On, Not Hypothetical",
    summary:
      "ISTP solves hands-on problems efficiently, learning best by taking things apart rather than theorizing about them. Low Openness reinforces that directly — a genuine preference for the concrete and demonstrably reliable over the abstract. Together they describe someone who trusts what they can test with their own hands over what merely sounds plausible.",
    reinforcements: [
      "Both trust direct, practical experience over untested theory",
      "Low Openness reinforces ISTP's preference for demonstrated skill over talk or credentials",
      "Neither needs a novel approach when a proven one already works",
    ],
    contrasts: [
      "ISTP can already disengage from things that feel overly abstract; low Openness adds even more resistance to purely theoretical ideas — worth staying open to a good idea before it's been physically proven, not just after",
    ],
  },
  {
    slug: "istp-and-low-conscientiousness",
    a: { framework: "mbti", code: "ISTP" },
    b: { framework: "bigfive", code: "conscientiousness-low" },
    headline: "ISTP + Low Conscientiousness: Fix It When It Breaks",
    summary:
      "ISTP adapts quickly when a plan stops working mid-execution, comfortable troubleshooting on the fly rather than following a rigid script. Low Conscientiousness reinforces that with a genuine ease staying flexible rather than planning in detail. Together they describe someone who's most capable exactly when things go off-plan.",
    reinforcements: [
      "Both are comfortable abandoning a plan the moment it stops serving the actual problem",
      "Low Conscientiousness matches ISTP's own resistance to committing to long-term plans that limit flexibility",
      "Neither treats structure as necessary for good, effective work",
    ],
    contrasts: [
      "ISTP's terseness can already read as disinterest even when it isn't; low Conscientiousness's looser follow-through can compound that by making commitments feel genuinely less reliable, not just quietly held — worth being explicit when something actually matters",
    ],
  },
  {
    slug: "isfp-and-low-openness",
    a: { framework: "mbti", code: "ISFP" },
    b: { framework: "bigfive", code: "openness-low" },
    headline: "ISFP + Low Openness: Quiet Values, Familiar Ground",
    summary:
      "ISFP acts on personal values without needing to make a public case for them, expressing itself through sensory, felt experience. Low Openness reinforces that with a genuine comfort in the practical and familiar rather than the abstract. Together they describe someone whose authenticity is expressed through consistent, grounded choices rather than constant reinvention.",
    reinforcements: [
      "Both find real value in what's already known and demonstrated, not just what's new",
      "Low Openness reinforces ISFP's tendency to act on quiet, personal conviction rather than chase the latest trend",
      "Neither needs external novelty to feel like life is full",
    ],
    contrasts: [
      "ISFP may already struggle to plan far enough ahead; low Openness's comfort with the familiar can make even a beneficial new direction feel unnecessary to consider — worth staying curious about ideas that don't immediately match past experience",
    ],
  },
  {
    slug: "isfp-and-low-conscientiousness",
    a: { framework: "mbti", code: "ISFP" },
    b: { framework: "bigfive", code: "conscientiousness-low" },
    headline: "ISFP + Low Conscientiousness: Led by Feel, Not by Schedule",
    summary:
      "ISFP adapts smoothly and stays present in the moment, resisting being boxed into a role that doesn't reflect who they actually are. Low Conscientiousness reinforces that with a genuine preference for flexibility over detailed planning. Together they describe someone whose best, most authentic work happens off a rigid schedule, in response to how something actually feels.",
    reinforcements: [
      "Both resist structure that would override how something genuinely feels in the moment",
      "Low Conscientiousness matches ISFP's own difficulty planning far ahead for longer-term goals",
      "Neither treats a missed deadline as a moral failing the way a more structured type might",
    ],
    contrasts: [
      "ISFP's quiet loyalty and care can go unnoticed without some visible follow-through; low Conscientiousness makes that follow-through the hardest part to sustain — worth building light structure around the commitments that matter most personally",
    ],
  },
  {
    slug: "estp-and-low-openness",
    a: { framework: "mbti", code: "ESTP" },
    b: { framework: "bigfive", code: "openness-low" },
    headline: "ESTP + Low Openness: Act on What's Real, Not What's Theoretical",
    summary:
      "ESTP reads a live situation quickly and acts on it without overthinking, preferring to learn by doing. Low Openness reinforces that directly — a genuine trust in the concrete and proven over the speculative. Together they describe someone who moves fast specifically because they're not weighing untested possibilities, just what's actually in front of them.",
    reinforcements: [
      "Both trust direct, immediate experience over abstract theorizing",
      "Low Openness reinforces ESTP's preference for practical action over detailed advance planning",
      "Neither gets stuck debating hypotheticals when a real decision needs making",
    ],
    contrasts: [
      "ESTP can already act before fully weighing longer-term consequences; low Openness's discomfort with the untested can mean genuinely useful new information gets discounted too — worth pairing quick action with occasional deliberate reflection",
    ],
  },
  {
    slug: "estp-and-low-conscientiousness",
    a: { framework: "mbti", code: "ESTP" },
    b: { framework: "bigfive", code: "conscientiousness-low" },
    headline: "ESTP + Low Conscientiousness: Built for the Moment, Not the Plan",
    summary:
      "ESTP brings energy and momentum to a stalled situation, handling pressure and unexpected change with real composure. Low Conscientiousness reinforces that with a genuine ease staying flexible rather than committing to detailed plans. Together they describe someone who's consistently most effective exactly when a rigid plan has already fallen apart.",
    reinforcements: [
      "Both are comfortable abandoning a plan the moment the situation calls for it",
      "Low Conscientiousness matches ESTP's own tendency to find routine and detailed planning unnecessarily constraining",
      "Neither loses composure when circumstances suddenly change",
    ],
    contrasts: [
      "ESTP's directness under pressure can already come across as blunt; low Conscientiousness's looser follow-through can add a sense of unreliability on top of that — worth flagging commitments explicitly, even when the plan itself stays loose",
    ],
  },
  {
    slug: "esfp-and-low-openness",
    a: { framework: "mbti", code: "ESFP" },
    b: { framework: "bigfive", code: "openness-low" },
    headline: "ESFP + Low Openness: Present, Warm, and Grounded",
    summary:
      "ESFP lives vividly in the present, bringing practical enthusiasm rather than abstract theorizing to a room. Low Openness reinforces that directly — a genuine comfort with the familiar and demonstrated over the untested. Together they describe someone whose warmth is expressed through real, concrete moments rather than big new ideas.",
    reinforcements: [
      "Both find genuine satisfaction in the tangible and immediate over the hypothetical",
      "Low Openness reinforces ESFP's practical, action-first approach over abstract planning",
      "Neither needs novelty for a moment to feel genuinely fun or meaningful",
    ],
    contrasts: [
      "ESFP's focus can already drift from longer, less immediately rewarding tasks; low Openness's comfort with the familiar can add resistance to trying an unfamiliar approach even when it would help — worth staying open to the occasional detour",
    ],
  },
  {
    slug: "esfp-and-low-conscientiousness",
    a: { framework: "mbti", code: "ESFP" },
    b: { framework: "bigfive", code: "conscientiousness-low" },
    headline: "ESFP + Low Conscientiousness: All In on Right Now",
    summary:
      "ESFP adapts easily to new people and changing plans, staying genuinely present rather than anxious about what's next. Low Conscientiousness reinforces that with a real comfort in flexibility over detailed advance planning. Together they describe someone whose spontaneity is a deep, consistent trait — not just a mood.",
    reinforcements: [
      "Both are energized by the present moment more than by a mapped-out future",
      "Low Conscientiousness matches ESFP's own tendency to avoid planning ahead in favor of staying in the moment",
      "Neither feels particularly anxious when plans shift at the last minute",
    ],
    contrasts: [
      "ESFP's sensitivity to criticism can already affect follow-through on tough feedback; low Conscientiousness can make consistent follow-through harder across the board, not just after criticism — worth building in just enough structure to protect the commitments that matter most",
    ],
  },

  // ---- MBTI + Colors ----
  {
    slug: "intj-and-blue",
    a: { framework: "mbti", code: "INTJ" },
    b: { framework: "colors", code: "blue" },
    headline: "INTJ + Blue: Strategy Built on Precision",
    summary:
      "INTJ forms an independent, well-reasoned view of where things are headed. Blue's motivation for accuracy and understanding reinforces the reasoning underneath that view — not just having a strategy, but one that's been carefully checked. Together they describe someone whose long-range thinking is both original and rigorously verified.",
    reinforcements: [
      "Both are motivated by getting the underlying reasoning right, not just landing on a plausible-sounding answer",
      "Blue's careful, well-considered judgment reinforces INTJ's own discipline in refining an idea before acting on it",
      "Neither is satisfied by a shallow or rushed conclusion",
    ],
    contrasts: [
      "INTJ wants to move on a decided strategy; Blue can over-analyze past the point of usefulness — together, a genuinely good plan can sit unexecuted while still being refined",
    ],
  },
  {
    slug: "intp-and-blue",
    a: { framework: "mbti", code: "INTP" },
    b: { framework: "colors", code: "blue" },
    headline: "INTP + Blue: Understanding Before Anything Else",
    summary:
      "INTP wants to deeply understand how something works before moving fast on a shallow read. Blue reinforces that instinct directly, prioritizing accuracy over speed in almost everything. Together they describe someone for whom genuine understanding isn't optional — it's the actual goal.",
    reinforcements: [
      "Both would rather be right than be fast",
      "Blue's careful, error-catching instincts reinforce INTP's own logical rigor",
      "Neither fakes certainty just to move a conversation along",
    ],
    contrasts: [
      "INTP's analysis can already loop without converging; Blue's tendency to delay a decision past the point of usefulness reinforces that same pattern — worth setting an explicit deadline for 'good enough understanding'",
    ],
  },
  {
    slug: "entj-and-red",
    a: { framework: "mbti", code: "ENTJ" },
    b: { framework: "colors", code: "red" },
    headline: "ENTJ + Red: Decisive, and Then Some",
    summary:
      "ENTJ turns ambiguity into a plan and moves fast on it. Red reinforces that with a motivation toward action and outcomes at the root — decisions made quickly, obstacles pushed through rather than around. Together they describe someone whose decisiveness is close to a default setting, not just a professional skill.",
    reinforcements: [
      "Both treat momentum as something to protect, not something to second-guess",
      "Red's comfort taking charge reinforces ENTJ's natural instinct to mobilize people around a plan",
      "Neither gets lost in process when a clear next step is already obvious",
    ],
    contrasts: [
      "ENTJ can already steamroll quieter input before hearing it fully; Red's bluntness under pressure can compound that — worth deliberately slowing down to actually hear dissent before it's too late to use it",
    ],
  },
  {
    slug: "entp-and-yellow",
    a: { framework: "mbti", code: "ENTP" },
    b: { framework: "colors", code: "yellow" },
    headline: "ENTP + Yellow: Ideas That Pull People In",
    summary:
      "ENTP energizes a room and challenges stale assumptions with a wide range of novel options. Yellow reinforces that with genuine enthusiasm and optimism as the underlying motivation, not just clever argument. Together they describe someone whose new ideas are as socially magnetic as they are intellectually sharp.",
    reinforcements: [
      "Both bring real energy into a room rather than just information",
      "Yellow's sociability reinforces ENTP's habit of connecting people and ideas in unexpected ways",
      "Neither loses enthusiasm for a new possibility just because it's unproven",
    ],
    contrasts: [
      "ENTP already starts more than it finishes; Yellow's follow-through can lag behind its own excitement the same way — together, a genuinely exciting idea risks staying just that",
    ],
  },
  {
    slug: "infj-and-green",
    a: { framework: "mbti", code: "INFJ" },
    b: { framework: "colors", code: "green" },
    headline: "INFJ + Green: Depth That Shows Up as Steadiness",
    summary:
      "INFJ reads underlying dynamics and unspoken needs in a room, building deep, trust-based relationships. Green reinforces that with genuine motivation toward connection and stability at the root. Together they describe someone whose insight into people expresses itself as consistent, calm support rather than performance.",
    reinforcements: [
      "Both build trust through consistency rather than charisma or persuasion",
      "Green's patient, steady presence reinforces INFJ's own instinct to hold space for people without needing the spotlight",
      "Neither treats a relationship as transactional",
    ],
    contrasts: [
      "INFJ can absorb others' emotional weight until it becomes their own; Green's conflict-avoidance can compound that by letting real needs go unspoken on both sides — worth naming what's actually being carried before it becomes too much",
    ],
  },
  {
    slug: "infp-and-green",
    a: { framework: "mbti", code: "INFP" },
    b: { framework: "colors", code: "green" },
    headline: "INFP + Green: Quiet Values, Genuine Care",
    summary:
      "INFP brings genuine empathy that makes people feel truly heard, guided by a strong internal sense of what's right. Green reinforces that with a real motivation toward connection and stability. Together they describe someone whose values-driven warmth is also steady and dependable, not just deeply felt.",
    reinforcements: [
      "Both prioritize how people actually feel over how efficient an interaction is",
      "Green's patience reinforces INFP's instinct to advocate gently for people who might otherwise be overlooked",
      "Neither pushes for a decision that would compromise someone's genuine wellbeing",
    ],
    contrasts: [
      "INFP's conflict-avoidance can already let resentment build; Green's own instinct to avoid conflict reinforces that further — together, a real issue can go unspoken for a long time before either side raises it",
    ],
  },
  {
    slug: "enfp-and-yellow",
    a: { framework: "mbti", code: "ENFP" },
    b: { framework: "colors", code: "yellow" },
    headline: "ENFP + Yellow: Warmth That Lights Up a Room",
    summary:
      "ENFP forms authentic connections with a wide range of people quickly, sparking energy in stalled conversations. Yellow reinforces that at the root, with genuine enthusiasm and optimism as its core motivation. Together they describe someone whose social energy isn't a performance — it's a real, consistent source of momentum for everyone around them.",
    reinforcements: [
      "Both are genuinely energized by people and new possibility, not just tolerant of them",
      "Yellow's optimism reinforces ENFP's instinct to see exciting possibilities others miss",
      "Neither needs much warm-up time to build real rapport with someone new",
    ],
    contrasts: [
      "ENFP's follow-through can already lag behind its enthusiasm; Yellow shares that exact pattern — together, a project can lose momentum the moment the initial excitement fades unless something else supplies the structure",
    ],
  },
  {
    slug: "istj-and-blue",
    a: { framework: "mbti", code: "ISTJ" },
    b: { framework: "colors", code: "blue" },
    headline: "ISTJ + Blue: Reliability, Verified",
    summary:
      "ISTJ delivers consistently on commitments and catches practical details others miss. Blue reinforces that with genuine motivation toward accuracy — not just getting things done, but getting them exactly right. Together they describe someone whose dependability comes with real, careful precision underneath it.",
    reinforcements: [
      "Both would rather be thorough than fast",
      "Blue's error-catching instinct reinforces ISTJ's own attention to detail",
      "Neither cuts a corner just to finish sooner",
    ],
    contrasts: [
      "ISTJ can already resist a better new approach out of unfamiliarity; Blue's tendency to over-analyze can slow down even a decision both sides already agree on — worth setting a clear point where 'checked enough' is actually enough",
    ],
  },
  {
    slug: "isfj-and-green",
    a: { framework: "mbti", code: "ISFJ" },
    b: { framework: "colors", code: "green" },
    headline: "ISFJ + Green: Quiet Care, Consistently Given",
    summary:
      "ISFJ notices what people need before they ask, creating a stable environment others can lean on. Green reinforces that directly, with connection and stability as its core motivation. Together they describe someone whose steady presence is a defining trait, not just a helpful habit.",
    reinforcements: [
      "Both find real satisfaction in being the dependable, calming presence in a room",
      "Green's patience reinforces ISFJ's tendency to balance tradition with genuine attention to individual needs",
      "Neither seeks recognition for the support they quietly provide",
    ],
    contrasts: [
      "ISFJ can already over-give until its own needs go unmet; Green's own conflict-avoidance reinforces that pattern by making it harder to ask for something in return — worth treating your own needs as worth stating plainly",
    ],
  },
  {
    slug: "estj-and-red",
    a: { framework: "mbti", code: "ESTJ" },
    b: { framework: "colors", code: "red" },
    headline: "ESTJ + Red: Get It Done, No Detours",
    summary:
      "ESTJ organizes people and timelines into a workable, executable plan. Red reinforces that with a core motivation toward action and results, pushing through obstacles rather than around them. Together they describe someone whose organizational skill comes paired with real momentum, not just structure for its own sake.",
    reinforcements: [
      "Both treat visible progress as the actual measure of success",
      "Red's decisiveness under pressure reinforces ESTJ's instinct to make a clear call and own the outcome",
      "Neither has much patience for process that doesn't move something forward",
    ],
    contrasts: [
      "ESTJ's directness can already land harder than intended; Red's bluntness under pressure compounds that — worth pairing the push for results with real attention to how it's landing on the people involved",
    ],
  },
  {
    slug: "esfj-and-yellow",
    a: { framework: "mbti", code: "ESFJ" },
    b: { framework: "colors", code: "yellow" },
    headline: "ESFJ + Yellow: Warmth That Organizes a Room",
    summary:
      "ESFJ builds warm, cooperative relationships and notices when someone's being left out. Yellow reinforces that with genuine enthusiasm and sociability as the underlying motivation. Together they describe someone whose social warmth is both a felt trait and an organizing force — the person who makes sure everyone's actually included and having a good time.",
    reinforcements: [
      "Both are genuinely energized by bringing people together, not just skilled at it",
      "Yellow's optimism reinforces ESFJ's instinct to keep morale high through logistics and change alike",
      "Neither treats social connection as a means to an end",
    ],
    contrasts: [
      "ESFJ already risks avoiding a needed disagreement to preserve harmony; Yellow's own enthusiasm-first instinct can make it even easier to smooth over a real problem rather than name it — worth being willing to sit in some discomfort for the sake of honesty",
    ],
  },
  {
    slug: "istp-and-blue",
    a: { framework: "mbti", code: "ISTP" },
    b: { framework: "colors", code: "blue" },
    headline: "ISTP + Blue: Calm, Precise Problem-Solving",
    summary:
      "ISTP solves hands-on problems efficiently and stays composed under pressure. Blue reinforces that with a core motivation toward accuracy — the same steadiness applied to getting the details exactly right. Together they describe someone whose calm under pressure comes from genuine competence, carefully built.",
    reinforcements: [
      "Both trust demonstrated skill and careful process over talk or improvisation",
      "Blue's precision reinforces ISTP's preference for solving a problem correctly the first time",
      "Neither panics or rushes when something goes wrong",
    ],
    contrasts: [
      "ISTP can already come across as disengaged from anything overly emotional; Blue's own reserve can compound that impression further — worth deliberately signaling investment, even when the process itself stays quiet",
    ],
  },
  {
    slug: "isfp-and-green",
    a: { framework: "mbti", code: "ISFP" },
    b: { framework: "colors", code: "green" },
    headline: "ISFP + Green: Gentle Values, Steady Presence",
    summary:
      "ISFP offers quiet, non-judgmental support to the people around it, acting on personal values without needing to make a public case. Green reinforces that with connection and stability as its underlying motivation. Together they describe someone whose warmth is genuinely felt but never performed.",
    reinforcements: [
      "Both express care through consistent presence rather than grand gestures",
      "Green's patience reinforces ISFP's instinct to let actions speak louder than argument",
      "Neither needs to be the center of attention to feel like they've contributed",
    ],
    contrasts: [
      "ISFP's conflict-avoidance can already leave real disagreements unspoken; Green's own instinct to avoid conflict reinforces that pattern — together, tension can build quietly for a long time before either side names it",
    ],
  },
  {
    slug: "estp-and-red",
    a: { framework: "mbti", code: "ESTP" },
    b: { framework: "colors", code: "red" },
    headline: "ESTP + Red: Built for the Moment, Twice Over",
    summary:
      "ESTP reads a live situation quickly and acts without overthinking. Red reinforces that with a core motivation toward action and results — obstacles are something to push through, not deliberate around. Together they describe someone whose fast, decisive instincts run all the way to the root.",
    reinforcements: [
      "Both are genuinely most comfortable in the middle of live, high-pressure action",
      "Red's fast, confident decision-making reinforces ESTP's own bias toward acting over analyzing",
      "Neither loses momentum waiting for more information that isn't strictly necessary",
    ],
    contrasts: [
      "ESTP can already act before weighing longer-term consequences; Red's impatience with slower processes reinforces that same pattern — worth building in a brief pause for genuinely high-stakes calls specifically",
    ],
  },
  {
    slug: "esfp-and-yellow",
    a: { framework: "mbti", code: "ESFP" },
    b: { framework: "colors", code: "yellow" },
    headline: "ESFP + Yellow: Pure, Undiluted Energy",
    summary:
      "ESFP lifts the energy and mood of the people around it, living vividly in the present. Yellow reinforces that at the root, with sociability and optimism as its core motivation. Together they describe someone whose warmth and spontaneity aren't a performance for others — they're a genuine, constant state.",
    reinforcements: [
      "Both draw real energy from people and the present moment, not just tolerate socializing",
      "Yellow's adaptability reinforces ESFP's own comfort with changing plans on the fly",
      "Neither needs a script to make a room feel more fun",
    ],
    contrasts: [
      "ESFP's focus can already drift from longer, less immediately rewarding tasks; Yellow's own follow-through gap reinforces that same pattern — worth pairing the shared energy with someone (or something) that supplies the missing structure",
    ],
  },

  // ---- MBTI + Human Design ----
  {
    slug: "human-design-manifestor-and-entj",
    a: { framework: "humandesign", code: "manifestor" },
    b: { framework: "mbti", code: "ENTJ" },
    headline: "Human Design Manifestor + ENTJ: Built to Initiate",
    summary:
      "Manifestor energy is built to start things from nothing, generating its own momentum without waiting for permission or a spark from outside. ENTJ turns ambiguity into a plan and mobilizes people around it just as readily. Together they describe someone whose default mode is genuinely to make things happen, not to wait for the right moment.",
    reinforcements: [
      "Both move on their own initiative rather than waiting to be invited",
      "ENTJ's decisiveness reinforces Manifestor's instinct to act on its own clarity, once set",
      "Neither is deterred by an unpopular first step, as long as it's the necessary one",
    ],
    contrasts: [
      "Manifestor's strategy explicitly requires informing people before acting, to avoid unnecessary friction; ENTJ's instinct to just move can skip that step entirely — worth treating 'inform first' as a genuine strategic advantage, not an extra formality",
    ],
  },
  {
    slug: "human-design-manifestor-and-estj",
    a: { framework: "humandesign", code: "manifestor" },
    b: { framework: "mbti", code: "ESTJ" },
    headline: "Human Design Manifestor + ESTJ: Independent, and Organized About It",
    summary:
      "Manifestor generates its own momentum, unafraid to take an unpopular but necessary first step. ESTJ organizes people and timelines into something genuinely executable. Together they describe someone who doesn't just start things independently, but builds real structure around what they've started.",
    reinforcements: [
      "Both are naturally independent in how they plan and execute",
      "ESTJ's organizational instinct gives Manifestor's initiating energy a clear, workable shape",
      "Neither has much patience for waiting on permission that isn't actually required",
    ],
    contrasts: [
      "Manifestor's bursts of output need real recovery time after; ESTJ's instinct to keep executing can override that need — worth building in deliberate rest as part of the plan, not just as a reaction to burnout",
    ],
  },
  {
    slug: "human-design-manifestor-and-estp",
    a: { framework: "humandesign", code: "manifestor" },
    b: { framework: "mbti", code: "ESTP" },
    headline: "Human Design Manifestor + ESTP: Fast to Move, Hard to Stop",
    summary:
      "Manifestor moves decisively once its own clarity is set, generating momentum without external validation. ESTP reads a live situation and acts on it without overthinking. Together they describe someone whose independence and speed reinforce each other — decisions get made and acted on almost simultaneously.",
    reinforcements: [
      "Both trust their own read on a situation over waiting for outside confirmation",
      "ESTP's comfort with pressure reinforces Manifestor's independent, self-directed momentum",
      "Neither needs a lengthy runway before taking action",
    ],
    contrasts: [
      "Manifestor's strategy is to inform people before moving, to keep the peace; ESTP's instinct to just act can skip that step under pressure — worth treating a quick heads-up as part of moving fast, not a delay to it",
    ],
  },
  {
    slug: "human-design-projector-and-intj",
    a: { framework: "humandesign", code: "projector" },
    b: { framework: "mbti", code: "INTJ" },
    headline: "Human Design Projector + INTJ: Sees the System, Waits to Share It",
    summary:
      "Projector energy is built to see systems and people clearly from the outside, offering guidance that lands best when invited. INTJ forms an independent, well-reasoned view of where things are headed. Together they describe someone with real strategic insight, whose instinct is to hold that insight until the right moment to offer it.",
    reinforcements: [
      "Both see the structural pattern behind a situation before others do",
      "INTJ's discipline in refining an idea reinforces Projector's role as the one who's actually right, not just quick",
      "Neither needs constant external motion to feel like they're contributing",
    ],
    contrasts: [
      "INTJ can come across as detached when others need emotional acknowledgment first; Projector's guidance already lands poorly when unsolicited — together, real insight risks going unheard simply because of how and when it's offered",
    ],
  },
  {
    slug: "human-design-projector-and-infj",
    a: { framework: "humandesign", code: "projector" },
    b: { framework: "mbti", code: "INFJ" },
    headline: "Human Design Projector + INFJ: Deep Insight, Quietly Held",
    summary:
      "Projector reads people and group dynamics with real accuracy, its gift landing best when it's genuinely invited. INFJ reads underlying dynamics and unspoken needs in a room in much the same way. Together they describe someone with an unusually accurate read on the people around them — one that stays private more often than it's voiced.",
    reinforcements: [
      "Both notice what's actually going on beneath a surface that looks fine",
      "INFJ's instinct to connect a decision to its larger meaning reinforces Projector's role as a source of real, considered guidance",
      "Neither needs to be the loudest voice in the room to have the clearest read on it",
    ],
    contrasts: [
      "INFJ can withdraw rather than raise a conflict directly; Projector's energy runs out faster than most people's around it — together, real insight can go unshared simply because voicing it costs more than it seems to",
    ],
  },
  {
    slug: "human-design-projector-and-enfj",
    a: { framework: "humandesign", code: "projector" },
    b: { framework: "mbti", code: "ENFJ" },
    headline: "Human Design Projector + ENFJ: Guidance That Actually Lands",
    summary:
      "Projector offers guidance that reliably improves how others work, but only once it's been genuinely invited. ENFJ has a natural gift for articulating a shared vision that rallies people around it. Together they describe someone whose insight into people comes paired with the social skill to actually be heard when it counts.",
    reinforcements: [
      "Both are motivated by helping other people operate at their best",
      "ENFJ's persuasive communication style helps solve Projector's core challenge of being heard",
      "Neither offers guidance carelessly — both read the room before speaking",
    ],
    contrasts: [
      "ENFJ can overcommit to others' needs at its own expense; Projector's energy runs out faster than most people's around it — together, that combination is especially prone to real burnout if invitations to help aren't occasionally declined",
    ],
  },
  {
    slug: "human-design-manifesting-generator-and-entp",
    a: { framework: "humandesign", code: "manifesting-generator" },
    b: { framework: "mbti", code: "ENTP" },
    headline: "Human Design Manifesting Generator + ENTP: Fast, Multi-Track, and Efficient",
    summary:
      "Manifesting Generator moves quickly between projects without losing overall momentum, often skipping steps that are correct to skip. ENTP generates a wide range of novel options and adapts fast when circumstances change. Together they describe someone who moves through ideas and projects at real speed, without the usual cost to quality.",
    reinforcements: [
      "Both find efficient shortcuts that purely linear thinkers miss",
      "ENTP's quick adaptability reinforces Manifesting Generator's own comfort adjusting plans mid-course",
      "Neither loses motivation when a project's direction shifts unexpectedly",
    ],
    contrasts: [
      "Manifesting Generator's skipped steps can create gaps that surface later; ENTP already starts more than it finishes — together, the risk isn't slowing down, it's leaving real gaps behind at high speed",
    ],
  },
  {
    slug: "human-design-manifesting-generator-and-enfp",
    a: { framework: "humandesign", code: "manifesting-generator" },
    b: { framework: "mbti", code: "ENFP" },
    headline: "Human Design Manifesting Generator + ENFP: Enthusiasm at Full Speed",
    summary:
      "Manifesting Generator masters multiple, seemingly unrelated skills in parallel, adapting mid-course without losing motivation. ENFP connects ideas and people that wouldn't normally intersect, energized by genuine curiosity. Together they describe someone whose enthusiasm for a wide range of things translates into real, if unconventional, momentum.",
    reinforcements: [
      "Both move fluidly between interests without needing to fully finish one before starting another",
      "ENFP's warmth reinforces Manifesting Generator's efficient, non-obvious way of connecting with people and projects alike",
      "Neither needs a single, linear path to feel like they're making real progress",
    ],
    contrasts: [
      "Manifesting Generator's boredom sets in fast once a project's novelty fades; ENFP's follow-through already tends to lag the same way — together, a genuinely promising direction can lose momentum unusually fast without deliberate structure",
    ],
  },
  {
    slug: "human-design-manifesting-generator-and-esfp",
    a: { framework: "humandesign", code: "manifesting-generator" },
    b: { framework: "mbti", code: "ESFP" },
    headline: "Human Design Manifesting Generator + ESFP: Momentum That Feels Like Fun",
    summary:
      "Manifesting Generator adapts plans mid-course without losing motivation, finding efficient shortcuts others miss. ESFP lives vividly in the present and adapts easily to changing plans. Together they describe someone whose fast, multi-track energy is also genuinely enjoyable to be around — momentum that reads as enthusiasm, not just speed.",
    reinforcements: [
      "Both are comfortable moving fast and changing direction without losing energy",
      "ESFP's warmth and presence reinforce Manifesting Generator's instinct to stay engaged with what's happening right now",
      "Neither needs a fully mapped-out plan to feel confident moving forward",
    ],
    contrasts: [
      "Manifesting Generator's boredom sets in fast once novelty fades; ESFP's focus can already drift from longer, unrewarding tasks the same way — together, real follow-through needs deliberate outside support to survive both instincts",
    ],
  },
  {
    slug: "human-design-generator-and-istj",
    a: { framework: "humandesign", code: "generator" },
    b: { framework: "mbti", code: "ISTJ" },
    headline: "Human Design Generator + ISTJ: Steady Effort, Sustained",
    summary:
      "Generator carries steady, renewable energy, mastering a craft through sheer accumulated, satisfying repetition. ISTJ delivers consistently on commitments, even the unglamorous ones. Together they describe someone whose reliability is powered by genuine, sustainable energy — not willpower alone.",
    reinforcements: [
      "Both sustain focused effort far longer than most once genuinely engaged",
      "ISTJ's respect for process reinforces Generator's own instinct to build mastery through repetition, not shortcuts",
      "Neither needs external pressure to keep showing up consistently",
    ],
    contrasts: [
      "Generator's frustration builds when initiating instead of responding; ISTJ's methodical planning can sometimes require exactly that kind of proactive initiation — worth noticing when steady effort is being applied to something that was never a genuine 'yes'",
    ],
  },
  {
    slug: "human-design-generator-and-isfj",
    a: { framework: "humandesign", code: "generator" },
    b: { framework: "mbti", code: "ISFJ" },
    headline: "Human Design Generator + ISFJ: Quiet, Sustainable Devotion",
    summary:
      "Generator finds its way by responding honestly to what life puts in front of it, sustaining effort once genuinely engaged. ISFJ notices what people need before they ask and shows up for it consistently. Together they describe someone whose care for others is backed by real, renewable stamina, not a burst of effort that fades.",
    reinforcements: [
      "Both bring a steady, grounded energy that others can genuinely build on",
      "ISFJ's attentiveness reinforces Generator's own instinct to respond honestly to what's actually needed",
      "Neither burns out quickly on work they've genuinely said yes to",
    ],
    contrasts: [
      "Generator can default to 'yes' out of habit rather than genuine desire; ISFJ's tendency to over-give reinforces that same risk — together, worth periodically checking whether a commitment is still a real yes, not just a habit",
    ],
  },
  {
    slug: "human-design-generator-and-istp",
    a: { framework: "humandesign", code: "generator" },
    b: { framework: "mbti", code: "ISTP" },
    headline: "Human Design Generator + ISTP: Craft, Mastered Over Time",
    summary:
      "Generator masters a craft through sheer accumulated, satisfying repetition, knowing almost immediately whether something is a genuine yes. ISTP learns best by taking things apart, valuing demonstrated competence over talk. Together they describe someone whose hands-on skill is the product of real, sustained engagement, not just natural aptitude.",
    reinforcements: [
      "Both find genuine satisfaction in mastering something concrete through repetition",
      "ISTP's preference for demonstrated skill reinforces Generator's instinct to build mastery the honest way",
      "Neither needs external validation to know when something's actually working",
    ],
    contrasts: [
      "Generator's frustration builds when initiating instead of responding; ISTP's independence can mean less external structure is offered to help — together, worth deliberately noticing when energy is being spent on something that isn't a real 'yes'",
    ],
  },
  {
    slug: "human-design-generator-and-isfp",
    a: { framework: "humandesign", code: "generator" },
    b: { framework: "mbti", code: "ISFP" },
    headline: "Human Design Generator + ISFP: Steady Craft, Personally Meant",
    summary:
      "Generator masters a craft through accumulated repetition, guided by whether something is a genuine yes. ISFP offers quiet, non-judgmental support and acts on personal values without needing to explain them. Together they describe someone whose sustained energy is always in service of something they personally, quietly believe in.",
    reinforcements: [
      "Both need real, personal buy-in before sustained effort feels possible at all",
      "ISFP's aesthetic and sensory sensitivity reinforces Generator's satisfaction in a craft well-practiced",
      "Neither performs commitment they don't actually feel",
    ],
    contrasts: [
      "Generator can default to 'yes' out of habit; ISFP's conflict-avoidance can make it harder to say no even when something's stopped being a genuine fit — worth checking in on whether the yes is still real",
    ],
  },
  {
    slug: "human-design-generator-and-esfj",
    a: { framework: "humandesign", code: "generator" },
    b: { framework: "mbti", code: "ESFJ" },
    headline: "Human Design Generator + ESFJ: Warmth, Sustained Over Time",
    summary:
      "Generator carries steady, renewable energy for work it genuinely loves. ESFJ builds warm, cooperative relationships and follows through on commitments to the people who matter. Together they describe someone whose social warmth is backed by real, lasting stamina, not a burst of enthusiasm.",
    reinforcements: [
      "Both sustain genuine effort for people and work they've truly said yes to",
      "ESFJ's organizational instinct gives Generator's steady energy a clear, useful shape",
      "Neither treats commitment as something to perform rather than actually feel",
    ],
    contrasts: [
      "Generator can default to 'yes' out of habit rather than genuine desire; ESFJ's own instinct to tie self-worth to others' approval can reinforce saying yes for the wrong reasons — worth checking that a commitment is a real 'yes,' not just an expected one",
    ],
  },
  {
    slug: "human-design-reflector-and-intp",
    a: { framework: "humandesign", code: "reflector" },
    b: { framework: "mbti", code: "INTP" },
    headline: "Human Design Reflector + INTP: An Outsider's Clear-Eyed Read",
    summary:
      "Reflector is rare and deeply sensitive to its environment, offering an unusually honest read on a group's or system's health. INTP wants to deeply understand how something works, generating original frameworks rather than reaching for the obvious answer. Together they describe someone whose outside-the-system perspective is both emotionally attuned and analytically sharp.",
    reinforcements: [
      "Both notice what's really going on beneath a surface that looks fine to everyone else",
      "INTP's logical rigor gives Reflector's intuitive read a framework to actually explain itself",
      "Neither is satisfied by the version of events everyone else has already agreed on",
    ],
    contrasts: [
      "Reflector's clarity comes with real time and the right environment, not under pressure; INTP's analysis can already loop indefinitely on its own — together, a genuinely accurate read on a situation can take unusually long to actually surface",
    ],
  },

  // ---- Colors + Big Five ----
  {
    slug: "red-and-high-extraversion",
    a: { framework: "colors", code: "red" },
    b: { framework: "bigfive", code: "extraversion-high" },
    headline: "Red + High Extraversion: Momentum, Out Loud",
    summary:
      "Red is motivated by action and outcomes, pushing through obstacles rather than around them. High Extraversion reinforces that with genuine energy drawn from people and momentum, not just a bias toward action. Together they describe someone whose drive is both internally felt and outwardly, socially expressed.",
    reinforcements: [
      "Both are genuinely energized by moving fast in front of other people, not just in private",
      "High Extraversion reinforces Red's comfort taking charge when a situation calls for it",
      "Neither needs much recovery time after a high-intensity, high-visibility push",
    ],
    contrasts: [
      "Red can come across as blunt or impatient with slower processes; high Extraversion's tendency to think out loud can broadcast that impatience even more visibly — worth pausing before an unfiltered reaction goes public",
    ],
  },
  {
    slug: "red-and-low-agreeableness",
    a: { framework: "colors", code: "red" },
    b: { framework: "bigfive", code: "agreeableness-low" },
    headline: "Red + Low Agreeableness: Direct, and Comfortable With It",
    summary:
      "Red makes fast, confident decisions under pressure, staying focused on outcomes over process. Low Agreeableness reinforces that with genuine comfort prioritizing personal judgment over group consensus. Together they describe someone who's not just willing to make the hard call — they're genuinely unbothered by the discomfort it might cause.",
    reinforcements: [
      "Both are comfortable being the one who says the hard, honest thing",
      "Low Agreeableness reinforces Red's instinct to stay focused on results rather than managing how a decision is received",
      "Neither delays a necessary decision just to keep the peace",
    ],
    contrasts: [
      "Red can steamroll input before fully hearing it; low Agreeableness's directness can land as even blunter without much natural warmth to soften it — worth deliberately pairing the honest call with a genuine effort to actually listen first",
    ],
  },
  {
    slug: "blue-and-high-conscientiousness",
    a: { framework: "colors", code: "blue" },
    b: { framework: "bigfive", code: "conscientiousness-high" },
    headline: "Blue + High Conscientiousness: Precision, Fully Committed",
    summary:
      "Blue is motivated by accuracy and understanding, delivering consistently high-quality, dependable work. High Conscientiousness reinforces that at the root, with a genuine internal standard for planning ahead and following through. Together they describe someone whose careful, considered work is also reliably, consistently delivered.",
    reinforcements: [
      "Both hold themselves to a high internal standard regardless of external pressure",
      "High Conscientiousness reinforces Blue's instinct to catch errors and gaps others miss",
      "Neither ships something that hasn't actually been checked",
    ],
    contrasts: [
      "Blue can already over-analyze past the point of usefulness; high Conscientiousness's perfectionism reinforces that same tendency — worth agreeing in advance on what 'done' actually looks like",
    ],
  },
  {
    slug: "blue-and-low-openness",
    a: { framework: "colors", code: "blue" },
    b: { framework: "bigfive", code: "openness-low" },
    headline: "Blue + Low Openness: Trust What's Already Been Checked",
    summary:
      "Blue brings careful, well-reasoned judgment to decisions, staying calm and objective when others react emotionally. Low Openness reinforces that with a genuine preference for the practical and proven over the untested. Together they describe someone whose careful judgment is grounded specifically in what's already demonstrated to be reliable.",
    reinforcements: [
      "Both trust evidence and precedent over speculation or hype",
      "Low Openness reinforces Blue's instinct to verify before trusting a new claim",
      "Neither is swayed by an idea just because it's new or exciting",
    ],
    contrasts: [
      "Blue's high personal standards can already be applied too rigidly to others; low Openness's resistance to unfamiliar approaches can reinforce that same rigidity — worth staying open to a genuinely better idea before it's been fully proven",
    ],
  },
  {
    slug: "green-and-high-agreeableness",
    a: { framework: "colors", code: "green" },
    b: { framework: "bigfive", code: "agreeableness-high" },
    headline: "Green + High Agreeableness: Care as a Consistent Practice",
    summary:
      "Green is motivated by connection and stability, genuinely caring how its decisions affect the people around it. High Agreeableness reinforces that at the root, prioritizing harmony and genuinely enjoying helping others. Together they describe someone whose warmth isn't situational — it's a consistent, deeply held orientation toward people.",
    reinforcements: [
      "Both build trust and cooperation with people quickly and sincerely",
      "High Agreeableness reinforces Green's steady, dependable presence in a group",
      "Neither treats kindness as a strategy — both genuinely mean it",
    ],
    contrasts: [
      "Green's conflict-avoidance can already let real issues go unaddressed too long; high Agreeableness's own instinct to avoid necessary conflict reinforces that pattern — worth practicing raising something difficult before it's urgent",
    ],
  },
  {
    slug: "green-and-low-neuroticism",
    a: { framework: "colors", code: "green" },
    b: { framework: "bigfive", code: "neuroticism-low" },
    headline: "Green + Low Neuroticism (Anchor): Calm That Others Can Lean On",
    summary:
      "Green keeps groups calm and cooperative during tense moments, providing steady support others can rely on. Low Neuroticism reinforces that at the root, with genuine emotional steadiness even under real pressure. Together they describe someone whose calm presence isn't effortful — it's how they're actually built.",
    reinforcements: [
      "Both stay level-headed in moments that would rattle most people",
      "Low Neuroticism reinforces Green's role as the steady presence a group leans on during stress",
      "Neither needs to manage their own anxiety before they can be present for someone else's",
    ],
    contrasts: [
      "Green can resist change even when it would clearly help; low Neuroticism's low sense of urgency can mean a real risk gets underestimated the same way — worth deliberately checking whether calm is masking something that actually needs attention",
    ],
  },
  {
    slug: "yellow-and-high-extraversion",
    a: { framework: "colors", code: "yellow" },
    b: { framework: "bigfive", code: "extraversion-high" },
    headline: "Yellow + High Extraversion: Energy That Fills the Room",
    summary:
      "Yellow energizes and motivates the people around it, building rapport with new people quickly and genuinely. High Extraversion reinforces that at the root, drawing real energy from people rather than spending it on them. Together they describe someone for whom social energy is a genuine source of fuel, not a skill they've simply developed.",
    reinforcements: [
      "Both are recharged, not drained, by being around people",
      "High Extraversion reinforces Yellow's instinct to adapt easily and keep morale high through change",
      "Neither needs much encouragement to jump into a new social situation",
    ],
    contrasts: [
      "Yellow's follow-through can already lag behind the excitement of a new idea; high Extraversion's preference for thinking out loud can mean commitments get made in the moment that are harder to sustain later — worth writing down what's actually been agreed to",
    ],
  },
  {
    slug: "yellow-and-high-openness",
    a: { framework: "colors", code: "yellow" },
    b: { framework: "bigfive", code: "openness-high" },
    headline: "Yellow + High Openness: Possibility, Enthusiastically Pursued",
    summary:
      "Yellow sees exciting possibilities others miss in the moment, thriving on variety and new experiences. High Openness reinforces that at the root, with a genuine pull toward novel ideas over routine and convention. Together they describe someone whose enthusiasm for what's new is both deeply felt and consistently acted on.",
    reinforcements: [
      "Both are drawn to the unfamiliar and untested rather than intimidated by it",
      "High Openness reinforces Yellow's instinct to adapt easily and embrace change",
      "Neither needs an idea to be proven before getting genuinely excited about it",
    ],
    contrasts: [
      "Yellow can lose focus in the details of a long, unglamorous task; high Openness's pull toward the next interesting idea reinforces that same pattern — worth finishing the current exciting thing before chasing the next one",
    ],
  },

  // ---- Human Design + Big Five ----
  {
    slug: "human-design-generator-and-high-conscientiousness",
    a: { framework: "humandesign", code: "generator" },
    b: { framework: "bigfive", code: "conscientiousness-high" },
    headline: "Human Design Generator + High Conscientiousness: Sustainable, and Disciplined About It",
    summary:
      "Generator sustains focused effort far longer than most once genuinely engaged, mastering a craft through sheer accumulated repetition. High Conscientiousness reinforces that with a genuine internal standard for planning and follow-through. Together they describe someone whose sustained energy is also carefully, deliberately structured.",
    reinforcements: [
      "Both are capable of long, consistent effort toward something they've genuinely committed to",
      "High Conscientiousness reinforces Generator's instinct to build mastery through steady, disciplined repetition",
      "Neither treats a commitment as casual once it's been genuinely made",
    ],
    contrasts: [
      "Generator's frustration builds when initiating instead of responding; high Conscientiousness's planning instinct often requires exactly that kind of proactive initiation — worth noticing when discipline is being applied to something that isn't a genuine 'yes'",
    ],
  },
  {
    slug: "human-design-manifesting-generator-and-high-openness",
    a: { framework: "humandesign", code: "manifesting-generator" },
    b: { framework: "bigfive", code: "openness-high" },
    headline: "Human Design Manifesting Generator + High Openness: Variety as a Way of Working",
    summary:
      "Manifesting Generator masters multiple, seemingly unrelated skills in parallel, rarely doing just one thing at a time. High Openness reinforces that at the root, with a genuine pull toward novel ideas and experiences. Together they describe someone whose multi-track energy is powered by real, deep curiosity, not just restlessness.",
    reinforcements: [
      "Both are drawn toward variety and the untested rather than a single, narrow lane",
      "High Openness reinforces Manifesting Generator's instinct to find efficient, non-obvious shortcuts",
      "Neither loses momentum when a plan shifts into unfamiliar territory",
    ],
    contrasts: [
      "Manifesting Generator's boredom sets in fast once a project's novelty fades; high Openness's own pull toward the next interesting idea reinforces that pattern — worth pairing the shared curiosity with a way to track what's still unfinished",
    ],
  },
  {
    slug: "human-design-manifestor-and-low-agreeableness",
    a: { framework: "humandesign", code: "manifestor" },
    b: { framework: "bigfive", code: "agreeableness-low" },
    headline: "Human Design Manifestor + Low Agreeableness: Independent, on Its Own Terms",
    summary:
      "Manifestor starts things from nothing without needing outside validation, unafraid to take an unpopular but necessary first step. Low Agreeableness reinforces that with genuine comfort prioritizing personal judgment over group consensus. Together they describe someone whose independence is both a strategic strength and a felt, natural preference.",
    reinforcements: [
      "Both are comfortable moving forward without needing group buy-in first",
      "Low Agreeableness reinforces Manifestor's willingness to take a necessary but unpopular first step",
      "Neither delays a decision just to keep everyone comfortable",
    ],
    contrasts: [
      "Manifestor's resistance to being told what to do can already read as combative; low Agreeableness's bluntness reinforces that impression further — worth pairing genuine independence with a deliberate effort to explain the reasoning, not just the decision",
    ],
  },
  {
    slug: "human-design-projector-and-high-openness",
    a: { framework: "humandesign", code: "projector" },
    b: { framework: "bigfive", code: "openness-high" },
    headline: "Human Design Projector + High Openness: Sees the System, Sees the Possibility",
    summary:
      "Projector sees the efficient path through a system others are stuck inside of, offering guidance that reliably improves how others work. High Openness reinforces that at the root, with a genuine pull toward novel and unconventional thinking. Together they describe someone whose outside-in insight is also genuinely original, not just accurate.",
    reinforcements: [
      "Both see patterns and possibilities that people inside a system tend to miss",
      "High Openness reinforces Projector's ability to offer guidance that's genuinely fresh, not just a restatement of the obvious",
      "Neither is satisfied by the conventional explanation when a better one is available",
    ],
    contrasts: [
      "Projector's insight lands best when it's invited; high Openness's enthusiasm for a new idea can make it tempting to share it before that invitation exists — worth waiting for the moment, even when the insight feels urgent",
    ],
  },
  {
    slug: "human-design-reflector-and-high-neuroticism",
    a: { framework: "humandesign", code: "reflector" },
    b: { framework: "bigfive", code: "neuroticism-high" },
    headline: "Human Design Reflector + High Neuroticism (Feeler): Deeply Attuned to Everything Around Them",
    summary:
      "Reflector absorbs and reflects the health of the people and spaces around it, deeply sensitive to its environment. High Neuroticism reinforces that at the root, with genuine emotional intensity and alertness to what could go wrong. Together they describe someone whose sensitivity to their surroundings is both a real gift and something that needs real, deliberate protecting.",
    reinforcements: [
      "Both notice shifts in mood, tension, and environment that most people miss entirely",
      "High Neuroticism's vigilance reinforces Reflector's unusually honest read on a group's or space's health",
      "Neither can easily switch that sensitivity off, even when it would be convenient to",
    ],
    contrasts: [
      "Reflector can absorb others' emotional state as if it were its own; high Neuroticism's tendency to worry about things that never happen can compound that — worth building real, deliberate space to separate what's actually yours to carry",
    ],
  },

  // ---- Colors + Human Design ----
  {
    slug: "red-and-human-design-manifestor",
    a: { framework: "colors", code: "red" },
    b: { framework: "humandesign", code: "manifestor" },
    headline: "Red + Human Design Manifestor: Two Different Engines for the Same Drive",
    summary:
      "Red makes fast, confident decisions and pushes through obstacles rather than around them. Manifestor generates its own momentum, starting things from nothing without needing outside validation. Together they describe someone whose instinct to act independently and decisively runs through both how they're motivated and how they're energetically built.",
    reinforcements: [
      "Both are comfortable taking charge and moving first, without waiting for consensus",
      "Manifestor's independent initiative reinforces Red's own bias toward action over deliberation",
      "Neither needs external permission to feel confident about a decision already made",
    ],
    contrasts: [
      "Red can be blunt or impatient with slower processes; Manifestor's strategy specifically calls for informing others before acting, to avoid friction — worth treating that step as a genuine advantage, not a concession to speed",
    ],
  },
  {
    slug: "blue-and-human-design-projector",
    a: { framework: "colors", code: "blue" },
    b: { framework: "humandesign", code: "projector" },
    headline: "Blue + Human Design Projector: Insight From the Outside, Verified",
    summary:
      "Blue is motivated by accuracy and careful understanding, bringing well-reasoned judgment to decisions. Projector sees systems and people clearly from the outside, offering guidance that reliably improves how others work. Together they describe someone whose outside perspective on a group or system is both genuinely accurate and carefully considered before it's shared.",
    reinforcements: [
      "Both would rather be thoroughly right than quickly heard",
      "Projector's focus without constant external motion pairs naturally with Blue's preference for calm, considered analysis",
      "Neither offers a read on a situation without having actually thought it through",
    ],
    contrasts: [
      "Blue can over-analyze past the point of usefulness; Projector's energy runs out faster than most people's around it — together, real insight can take a long time to actually surface, even once it's fully formed",
    ],
  },
  {
    slug: "green-and-human-design-generator",
    a: { framework: "colors", code: "green" },
    b: { framework: "humandesign", code: "generator" },
    headline: "Green + Human Design Generator: Steadiness, Sustained",
    summary:
      "Green is motivated by connection and stability, providing steady support others can reliably lean on. Generator carries steady, renewable energy, doing work it genuinely loves for long stretches. Together they describe someone whose dependability is powered by real, sustainable energy rather than obligation.",
    reinforcements: [
      "Both find genuine satisfaction in consistency over constant novelty",
      "Generator's instinct to respond honestly to what's genuinely a 'yes' reinforces Green's own care about the people involved in a decision",
      "Neither burns out quickly on commitments that are genuinely felt",
    ],
    contrasts: [
      "Green can resist change even when it would clearly help; Generator's frustration builds specifically when initiating instead of responding — together, worth someone else occasionally supplying the push toward a change that's actually needed",
    ],
  },
  {
    slug: "yellow-and-human-design-manifesting-generator",
    a: { framework: "colors", code: "yellow" },
    b: { framework: "humandesign", code: "manifesting-generator" },
    headline: "Yellow + Human Design Manifesting Generator: Fast, Warm, and Everywhere at Once",
    summary:
      "Yellow thrives on variety, spontaneity, and new experiences, energizing the people around it. Manifesting Generator moves quickly between projects without losing overall momentum. Together they describe someone whose enthusiasm and multi-track energy reinforce each other — genuinely excited about a lot of things, and genuinely capable of moving fast on several at once.",
    reinforcements: [
      "Both are energized by variety rather than worn down by it",
      "Manifesting Generator's efficient shortcuts pair naturally with Yellow's adaptability through change",
      "Neither needs a single, linear focus to feel like real progress is happening",
    ],
    contrasts: [
      "Yellow's follow-through can lag behind the excitement of something new; Manifesting Generator's boredom sets in fast once novelty fades — together, the shared risk is real, and worth countering with some outside structure for what actually needs finishing",
    ],
  },
];

export function getAllCombinationSlugs(): string[] {
  return COMBINATIONS.map((c) => c.slug);
}

// locale defaults to "en"; for de/es/fr/zh a real (non-machine-translated)
// override is applied where one exists — see src/lib/seo/translations/
// (Tier 4.3, phase 3).
export function getCombinationContent(slug: string, locale: string = "en"): CombinationPageContent | null {
  const c = COMBINATIONS.find((c) => c.slug === slug);
  if (!c) return null;
  const t = getCombinationTranslation(c.slug, locale);
  if (!t) return c;
  return { ...c, headline: t.headline, summary: t.summary, reinforcements: t.reinforcements, contrasts: t.contrasts };
}

/** Combinations that feature a given type — used for "related pages" internal linking from a single-type page. */
export function getCombinationsForType(framework: AssessmentId, code: string, locale: string = "en"): CombinationPageContent[] {
  return COMBINATIONS.filter(
    (c) =>
      (c.a.framework === framework && c.a.code.toLowerCase() === code.toLowerCase()) ||
      (c.b.framework === framework && c.b.code.toLowerCase() === code.toLowerCase())
  ).map((c) => getCombinationContent(c.slug, locale)!);
}

/** Resolves a TypeRef's own content + URL, for rendering a link/card to it from a combination page. */
export function resolveTypeRef(ref: TypeRef, locale: string = "en") {
  const content = getTypeContent(FRAMEWORK_URL_SLUGS[ref.framework], ref.code.toLowerCase(), locale);
  return content;
}
