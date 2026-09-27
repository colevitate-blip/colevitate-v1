// The phrase side of the decoder matrix: common sentences that get misread
// across cultures, genders and settings, each with 3 candidate readings and
// the weights that move probability between them. Weights reference
// FeatureIds from model.ts — style dimensions (-1..1, the speaker's blended
// style) and situation/cue flags (0/1). Positive weight = this input makes
// the reading more likely.
//
// Keywords drive the free-text matcher (EN + DE regardless of UI locale, so
// a German user can paste an English email and vice versa). Readings' copy
// lives in messages/<locale>/understand.json under decoder.phrases.<id>.

import type { FeatureId } from "./model";

export type PhraseGroup = "yesNo" | "feedback" | "feelings" | "plans";

export interface Reading {
  id: string;
  prior?: number;
  weights: Partial<Record<FeatureId, number>>;
}

export interface Phrase {
  id: string;
  group: PhraseGroup;
  keywords: string[];
  readings: Reading[];
}

export const PHRASE_GROUPS: PhraseGroup[] = ["yesNo", "feedback", "feelings", "plans"];

export const PHRASES: Phrase[] = [
  /* ---------------- yes / no / maybe ---------------- */
  {
    id: "yes",
    group: "yesNo",
    keywords: ["yes", "yeah", "sure", "ok", "okay", "of course", "will do", "ja", "klar", "gerne", "mach ich", "natürlich", "in ordnung"],
    readings: [
      { id: "commit", prior: 0.4, weights: { context: -0.8, hierarchy: -0.4, confront: -0.3, warm: 0.3 } },
      { id: "heard", weights: { context: 0.7, hierarchy: 0.6, juniorDeference: 0.9, public: 0.3, client: 0.2 } },
      { id: "cantSayNo", weights: { trust: 0.5, confront: 0.6, juniorDeference: 0.4, curt: 0.3, delayed: 0.3 } },
    ],
  },
  {
    id: "thinkAboutIt",
    group: "yesNo",
    keywords: ["think about it", "consider it", "let me think", "sleep on it", "get back to you", "darüber nachdenken", "denke darüber nach", "überlege es mir", "überleg es mir", "melde mich"],
    readings: [
      { id: "seriously", prior: 0.2, weights: { context: -0.7, time: -0.5, feedback: -0.4, warm: 0.3 } },
      { id: "softNo", weights: { context: 0.8, confront: 0.8, feedback: 0.5, delayed: 0.7, newContact: 0.3, client: 0.3 } },
      { id: "needsOthers", weights: { hierarchy: 0.7, trust: 0.3, juniorDeference: 0.4, family: 0.4, partner: 0.3 } },
    ],
  },
  {
    id: "maybe",
    group: "yesNo",
    keywords: ["maybe", "perhaps", "we'll see", "we will see", "possibly", "might", "vielleicht", "mal sehen", "mal schauen", "eventuell", "mal gucken"],
    readings: [
      { id: "undecided", prior: 0.2, weights: { context: -0.6, time: 0.3, warm: 0.4 } },
      { id: "politeNo", weights: { context: 0.9, confront: 0.7, delayed: 0.5, newContact: 0.3, repeated: 0.5 } },
      { id: "lowPriority", weights: { time: 0.5, friend: 0.3, speakerSenior: 0.4, curt: 0.3 } },
    ],
  },
  {
    id: "difficult",
    group: "yesNo",
    keywords: ["difficult", "tricky", "challenging", "not easy", "complicated", "schwierig", "nicht so einfach", "kompliziert", "heikel"],
    readings: [
      { id: "obstacle", prior: 0.2, weights: { context: -0.8, feedback: -0.5, warm: 0.3 } },
      { id: "no", weights: { context: 1.0, feedback: 0.8, confront: 0.8, juniorDeference: 0.5, client: 0.3 } },
      { id: "resources", weights: { work: 0.4, time: -0.3, hierarchy: 0.3, speakerJunior: 0.3 } },
    ],
  },
  {
    id: "youDecide",
    group: "yesNo",
    keywords: ["i don't mind", "i dont mind", "you decide", "up to you", "whatever you prefer", "either is fine", "mir egal", "wie du willst", "wie du möchtest", "entscheide du", "ist mir gleich"],
    readings: [
      { id: "open", prior: 0.2, weights: { context: -0.7, warm: 0.4 } },
      { id: "hints", weights: { context: 0.8, trust: 0.4, partner: 0.4, friend: 0.2, repeated: 0.3 } },
      { id: "deferring", weights: { hierarchy: 0.7, juniorDeference: 0.8, family: 0.3, newContact: 0.3, client: -0.3 } },
    ],
  },
  {
    id: "noNeed",
    group: "yesNo",
    keywords: ["no need", "no thank you", "no thanks", "don't bother", "not necessary", "nicht nötig", "nein danke", "nein, danke", "musst du nicht", "brauchst du nicht"],
    readings: [
      { id: "realNo", prior: 0.2, weights: { context: -0.8, trust: -0.3 } },
      { id: "ritual", weights: { context: 0.8, trust: 0.6, hierarchy: 0.4, newContact: 0.3, family: 0.2 } },
      { id: "uncomfortable", weights: { expressive: -0.3, confront: 0.4, newContact: 0.4, curt: 0.4 } },
    ],
  },

  /* ---------------- feedback & praise ---------------- */
  {
    id: "interesting",
    group: "feedback",
    keywords: ["interesting", "intriguing", "that's a thought", "interessant", "spannend"],
    readings: [
      { id: "curious", prior: 0.2, weights: { context: -0.8, feedback: -0.6, curt: -0.5, warm: 0.5 } },
      { id: "politeNo", weights: { context: 0.9, feedback: 0.8, confront: 0.6, curt: 0.6, public: 0.4, juniorDeference: 0.5 } },
      { id: "needTime", prior: 0.1, weights: { trust: 0.3, hierarchy: 0.3, work: 0.3, time: 0.2 } },
    ],
  },
  {
    id: "notBad",
    group: "feedback",
    keywords: ["not bad", "quite good", "pretty good", "fairly good", "decent", "ok-ish", "nicht schlecht", "ganz gut", "ganz okay", "geht so", "passabel"],
    readings: [
      { id: "praise", weights: { expressive: -0.9, trust: -0.2, feedback: -0.3, warm: 0.3 } },
      { id: "lukewarm", weights: { expressive: 1.1, trust: 0.3, context: -0.2 } },
      { id: "needsWork", weights: { feedback: 0.7, context: 0.3, curt: 0.4, repeated: 0.2 } },
    ],
  },
  {
    id: "suggestion",
    group: "feedback",
    keywords: ["just a thought", "just a suggestion", "maybe you could", "you might want to", "you might consider", "have you considered", "it might be worth", "nur ein gedanke", "nur ein vorschlag", "vielleicht könntest du", "vielleicht könnten sie", "man könnte", "wäre es eine idee"],
    readings: [
      { id: "optional", prior: 0.1, weights: { context: -0.5, feedback: -0.6, hierarchy: -0.3, speakerJunior: 0.3, speakerSenior: -0.4 } },
      { id: "instruction", weights: { feedback: 0.7, context: 0.5, speakerSenior: 0.8, hierarchy: 0.3, womanAtWork: 0.4, client: 0.5 } },
      { id: "criticism", weights: { feedback: 0.5, repeated: 0.8, curt: 0.3 } },
    ],
  },
  {
    id: "whyQuestion",
    group: "feedback",
    keywords: ["why did you", "why would you", "why is it", "why was", "why this", "how come", "warum hast du", "warum haben sie", "wieso hast du", "weshalb", "warum ist das"],
    readings: [
      { id: "curious", prior: 0.2, weights: { trust: -0.3, context: -0.3, warm: 0.6 } },
      { id: "challenge", weights: { confront: -0.9, work: 0.3, hierarchy: -0.4 } },
      { id: "reproach", weights: { context: 0.6, feedback: 0.5, curt: 0.7, public: 0.4, speakerSenior: 0.3, repeated: 0.4 } },
    ],
  },
  {
    id: "greatJob",
    group: "feedback",
    keywords: ["great job", "good job", "well done", "amazing", "awesome", "fantastic", "excellent", "super gemacht", "gut gemacht", "toll gemacht", "klasse", "sehr gut"],
    readings: [
      { id: "genuine", prior: 0.2, weights: { expressive: -0.9, trust: -0.1, feedback: -0.3, warm: 0.3 } },
      { id: "routine", weights: { expressive: 0.9, trust: 0.1, repeated: 0.3, written: 0.2 } },
      { id: "setup", prior: -0.2, weights: { feedback: 0.5, work: 0.2, speakerSenior: 0.2, curt: 0.3 } },
    ],
  },
  {
    id: "blunt",
    group: "feedback",
    keywords: ["this is wrong", "that's wrong", "that is wrong", "doesn't work", "does not work", "not acceptable", "unacceptable", "this is bad", "das ist falsch", "das geht so nicht", "funktioniert nicht", "inakzeptabel", "so nicht", "das ist schlecht"],
    readings: [
      { id: "aboutWork", prior: 0.2, weights: { feedback: -1.0, confront: -0.7, work: 0.4 } },
      { id: "serious", weights: { feedback: 0.9, context: 0.4, hierarchy: 0.3, public: 0.3 } },
      { id: "angry", weights: { expressive: 0.5, curt: 0.6, repeated: 0.5, partner: 0.3 } },
    ],
  },

  /* ---------------- feelings ---------------- */
  {
    id: "fine",
    group: "feelings",
    keywords: ["i'm fine", "im fine", "it's fine", "its fine", "i am fine", "all good", "it's ok", "don't worry", "passt schon", "alles gut", "mir geht's gut", "mir gehts gut", "schon gut", "ist okay", "keine sorge"],
    readings: [
      { id: "reallyFine", prior: 0.2, weights: { context: -0.7, curt: -0.5, warm: 0.7 } },
      { id: "wantsAsked", weights: { context: 0.5, expressive: 0.4, trust: 0.3, partner: 0.6, family: 0.3, curt: 0.6, repeated: 0.4, woman: 0.2 } },
      { id: "dropIt", weights: { confront: 0.6, expressive: -0.4, work: 0.4, public: 0.5, curt: 0.4, man: 0.2 } },
    ],
  },
  {
    id: "silence",
    group: "feelings",
    keywords: ["no reply", "no answer", "no response", "silence", "silent", "went quiet", "ignored", "left on read", "keine antwort", "schweigt", "schweigen", "meldet sich nicht", "funkstille", "gelesen"],
    readings: [
      { id: "thinking", weights: { expressive: -0.7, context: 0.4, hierarchy: 0.2, warm: 0.3 } },
      { id: "disagreement", weights: { confront: 0.7, context: 0.5, expressive: 0.3, public: 0.3, partner: 0.3, repeated: 0.3 } },
      { id: "busy", weights: { written: 0.7, delayed: 0.3, work: 0.3, time: 0.4 } },
    ],
  },
  {
    id: "whatever",
    group: "feelings",
    keywords: ["do whatever you want", "whatever", "do what you want", "suit yourself", "fine, do it", "mach doch was du willst", "mach was du willst", "mach doch", "von mir aus", "egal"],
    readings: [
      { id: "freedom", prior: 0.1, weights: { context: -0.7, warm: 0.7, curt: -0.5, hierarchy: -0.3 } },
      { id: "frustrated", weights: { curt: 0.8, repeated: 0.3, expressive: 0.3, partner: 0.4, family: 0.3 } },
      { id: "testing", weights: { context: 0.7, trust: 0.5, partner: 0.5, family: 0.3 } },
    ],
  },
  {
    id: "noProblem",
    group: "feelings",
    keywords: ["no problem", "no worries", "no big deal", "happy to help", "anytime", "kein problem", "gern geschehen", "keine ursache", "kein ding", "passt"],
    readings: [
      { id: "trulyFine", prior: 0.2, weights: { context: -0.6, warm: 0.5 } },
      { id: "effort", weights: { trust: 0.7, hierarchy: 0.3, context: 0.5 } },
      { id: "annoyed", weights: { curt: 0.8, repeated: 0.5, delayed: 0.3 } },
    ],
  },
  {
    id: "sorry",
    group: "feelings",
    keywords: ["sorry", "apologies", "i apologize", "my bad", "excuse me", "entschuldigung", "tut mir leid", "sorry,", "verzeihung", "mein fehler"],
    readings: [
      { id: "ritual", prior: 0.1, weights: { context: 0.5, feedback: 0.8, expressive: -0.2, repeated: 0.5 } },
      { id: "real", prior: 0.1, weights: { context: -0.7, warm: 0.3, curt: -0.2 } },
      { id: "soften", weights: { confront: 0.5, feedback: 0.3, work: 0.15, womanAtWork: 0.3 } },
    ],
  },

  /* ---------------- plans & invitations ---------------- */
  {
    id: "coffeeSometime",
    group: "plans",
    keywords: ["coffee sometime", "grab a coffee", "grab coffee", "we should meet", "let's meet up", "we should hang out", "let's catch up", "catch up sometime", "mal einen kaffee", "mal kaffee trinken", "mal was trinken", "sollten uns mal treffen", "lass uns mal"],
    readings: [
      { id: "realInvite", weights: { time: -0.6, expressive: -0.4, friend: 0.4 } },
      { id: "politeClosing", weights: { expressive: 0.6, trust: -0.5, newContact: 0.6, work: 0.3 } },
      { id: "followUp", weights: { trust: 0.6, hierarchy: 0.3, context: 0.4 } },
    ],
  },
  {
    id: "busyThisWeek",
    group: "plans",
    keywords: ["busy this week", "really busy", "swamped", "crazy week", "no time", "maybe next week", "can't this week", "viel zu tun", "stressig", "keine zeit", "diese woche", "nächste woche vielleicht"],
    readings: [
      { id: "literal", prior: 0.2, weights: { time: -0.7, context: -0.6, warm: 0.5 } },
      { id: "notInterested", weights: { context: 0.8, confront: 0.7, newContact: 0.6, repeated: 0.8, delayed: 0.4 } },
      { id: "notPriority", weights: { work: 0.4, speakerSenior: 0.4, time: 0.3, client: 0.3 } },
    ],
  },
  {
    id: "canWeTalk",
    group: "plans",
    keywords: ["can we talk", "we need to talk", "have a minute", "quick chat", "got a sec", "can i have a word", "können wir reden", "können wir kurz reden", "wir müssen reden", "hast du kurz zeit", "kurz sprechen"],
    readings: [
      { id: "routine", prior: 0.2, weights: { context: -0.6, work: 0.5, warm: 0.6 } },
      { id: "problem", weights: { context: 0.5, curt: 0.6, speakerSenior: 0.5, written: 0.3, delayed: 0.2 } },
      { id: "repair", weights: { partner: 0.7, friend: 0.4, family: 0.4, trust: 0.6, expressive: 0.3 } },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Free-text matcher                                                   */
/* ------------------------------------------------------------------ */

function normalize(text: string): string {
  return ` ${text
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .replace(/[^\p{L}\p{N}' ]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim()} `;
}

export interface PhraseMatch {
  id: string;
  score: number;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Keywords match from a word start. Longer keywords (5+ chars) may also take a
// short inflection ending, so German "interessante" still hits "interessant";
// short ones must match whole words so "ja" doesn't fire on "Jahr".
const KEYWORD_PATTERNS = new Map(
  PHRASES.flatMap((phrase) =>
    phrase.keywords.map((kw) => {
      const needle = normalize(kw).trim();
      const suffix = needle.length >= 5 ? "\\p{L}{0,3}" : "";
      return [kw, { re: new RegExp(`(?:^|\\s)${escapeRegExp(needle)}${suffix}(?=\\s|$)`, "u"), weight: needle.length }] as const;
    })
  )
);

/** Ranks phrases by keyword overlap with the user's sentence. Longer keyword
 * matches count more, so "i'm fine" beats a stray "fine". */
export function matchPhrases(text: string): PhraseMatch[] {
  const hay = normalize(text).trim();
  if (hay.length === 0) return [];
  const matches: PhraseMatch[] = [];
  for (const phrase of PHRASES) {
    let score = 0;
    for (const kw of phrase.keywords) {
      const pattern = KEYWORD_PATTERNS.get(kw);
      if (pattern && pattern.re.test(hay)) score += pattern.weight;
    }
    if (score > 0) matches.push({ id: phrase.id, score });
  }
  return matches.sort((a, b) => b.score - a.score);
}
