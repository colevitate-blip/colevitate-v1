"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle, ArrowDown, HelpCircle, MessageCircle, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { usePersonality } from "@/lib/personality/context";
import { computeScoringMatrix } from "@/components/personality/combined/scoringMatrix";
import type { AxisId } from "@/lib/personality/types";
import {
  CUES,
  CULTURE_IDS,
  PRIVATE_RELATIONS,
  UNKNOWN_INDIVIDUAL,
  WORK_RELATIONS,
  decode,
  individualFromAxisScores,
  type Cue,
  type CultureId,
  type Driver,
  type Gender,
  type IndividualStyle,
  type Relation,
  type Setting,
} from "@/lib/understand/model";
import { PHRASES, PHRASE_GROUPS, matchPhrases } from "@/lib/understand/phrases";

const AXIS_ORDER: AxisId[] = ["energy", "structure", "people", "novelty"];
const AXIS_STEPS = [-1, -0.5, 0, 0.5, 1];
const LISTENER_CULTURE_KEY = "colevitate.understand.listenerCulture";

// computeScoringMatrix wants a translator for its labels; the decoder only
// needs the numeric scores, so an identity translator is enough.
const identity = (key: string) => key;

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-9 rounded-full border px-3 py-1.5 text-sm transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "bg-card text-foreground hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border bg-card p-4 sm:p-5">
      <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
        <span className="flex size-6 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
          {n}
        </span>
        {title}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">{children}</span>;
}

function CultureSelect({
  id,
  value,
  onChange,
  unknownLabel,
  labelFor,
}: {
  id: string;
  value: CultureId | null;
  onChange: (v: CultureId | null) => void;
  unknownLabel: string;
  labelFor: (c: CultureId) => string;
}) {
  return (
    <select
      id={id}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value ? (e.target.value as CultureId) : null)}
      className="h-10 w-full rounded-xl border bg-background px-3 text-sm"
    >
      <option value="">{unknownLabel}</option>
      {CULTURE_IDS.map((c) => (
        <option key={c} value={c}>
          {labelFor(c)}
        </option>
      ))}
    </select>
  );
}

export function Decoder({ initialPhrase }: { initialPhrase?: string }) {
  const t = useTranslations("understand");
  const { results, mounted } = usePersonality();

  const [text, setText] = React.useState("");
  const [phraseId, setPhraseId] = React.useState<string | null>(
    initialPhrase && PHRASES.some((p) => p.id === initialPhrase) ? initialPhrase : null
  );
  const [setting, setSetting] = React.useState<Setting>("work");
  const [relation, setRelation] = React.useState<Relation | null>(null);
  const [speakerCulture, setSpeakerCulture] = React.useState<CultureId | null>(null);
  const [gender, setGender] = React.useState<Gender>("unspecified");
  const [individual, setIndividual] = React.useState<IndividualStyle>(UNKNOWN_INDIVIDUAL);
  const [cues, setCues] = React.useState<Cue[]>([]);
  const [listenerCulture, setListenerCulture] = React.useState<CultureId | null>(null);
  const [useProfile, setUseProfile] = React.useState(true);

  // Remember the user's own background between visits — a per-viewer convenience only.
  React.useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LISTENER_CULTURE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved && (CULTURE_IDS as readonly string[]).includes(saved)) setListenerCulture(saved as CultureId);
    } catch {
      /* storage unavailable */
    }
  }, []);
  const updateListenerCulture = (value: CultureId | null) => {
    setListenerCulture(value);
    try {
      if (value) window.localStorage.setItem(LISTENER_CULTURE_KEY, value);
      else window.localStorage.removeItem(LISTENER_CULTURE_KEY);
    } catch {
      /* storage unavailable */
    }
  };

  const matches = React.useMemo(() => matchPhrases(text), [text]);
  const onTextChange = (value: string) => {
    setText(value);
    const best = matchPhrases(value)[0];
    if (best) setPhraseId(best.id);
  };

  const ownAxes = React.useMemo(
    () => (mounted ? computeScoringMatrix(results, identity) : []),
    [mounted, results]
  );
  const hasProfile = ownAxes.length > 0;
  const listenerIndividual = hasProfile && useProfile ? individualFromAxisScores(ownAxes) : UNKNOWN_INDIVIDUAL;

  const result = React.useMemo(
    () =>
      phraseId
        ? decode({
            phraseId,
            speaker: { culture: speakerCulture, gender, individual },
            listener: { culture: listenerCulture, gender: "unspecified", individual: listenerIndividual },
            situation: { setting, relation, cues },
          })
        : null,
    [phraseId, speakerCulture, gender, individual, listenerCulture, listenerIndividual, setting, relation, cues]
  );

  const relations = setting === "work" ? WORK_RELATIONS : PRIVATE_RELATIONS;
  const cultureLabel = (c: CultureId) => t(`cultures.${c}`);
  const readingKey = (rid: string) => `decoder.phrases.${phraseId}.readings.${rid}`;

  const driverText = (d: Driver) => {
    if (d.info.kind === "style") {
      const pole = d.info.pole === "left" ? "left" : "right";
      return `${t(`decoder.drivers.source.${d.info.source}`)}: ${t(`dimensions.${d.info.dimension}.label`)} · ${t(
        `dimensions.${d.info.dimension}.${pole}`
      )}`;
    }
    return t(`decoder.drivers.feature.${d.info.feature}`);
  };

  const top = result?.readings[0];
  // Some readings deliberately have no check-question (e.g. "take the compliment") — stored as "".
  const askFor = (rid: string) => (t.raw(`${readingKey(rid)}.ask`) as string | undefined) ?? "";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start">
      <div className="space-y-4">
        {/* 1 — what was said */}
        <Step n={1} title={t("decoder.said.title")}>
          <textarea
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder={t("decoder.said.placeholder")}
            rows={2}
            className="w-full resize-y rounded-2xl border bg-background px-3 py-2.5 text-base leading-relaxed sm:text-sm"
          />
          {text.trim().length > 0 ? (
            <p className="text-xs text-muted-foreground">
              {matches.length > 0 && phraseId ? (
                <>
                  {t("decoder.said.detected")}:{" "}
                  <span className="font-medium text-foreground">{t(`decoder.phrases.${phraseId}.label`)}</span>
                </>
              ) : (
                t("decoder.said.noMatch")
              )}
            </p>
          ) : null}
          <div>
            <FieldLabel>{t("decoder.said.orPick")}</FieldLabel>
            <div className="space-y-3">
              {PHRASE_GROUPS.map((group) => (
                <div key={group}>
                  <p className="mb-1.5 text-xs text-muted-foreground">{t(`decoder.groups.${group}`)}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {PHRASES.filter((p) => p.group === group).map((p) => (
                      <Chip key={p.id} active={phraseId === p.id} onClick={() => setPhraseId(p.id)}>
                        {t(`decoder.phrases.${p.id}.label`)}
                      </Chip>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Step>

        {/* 2 — who said it */}
        <Step n={2} title={t("decoder.who.title")}>
          <div>
            <FieldLabel>{t("decoder.who.setting")}</FieldLabel>
            <div className="flex flex-wrap gap-1.5">
              {(["work", "private"] as Setting[]).map((s) => (
                <Chip
                  key={s}
                  active={setting === s}
                  onClick={() => {
                    setSetting(s);
                    setRelation(null);
                  }}
                >
                  {t(`decoder.who.${s}`)}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <FieldLabel>{t("decoder.who.relation")}</FieldLabel>
            <div className="flex flex-wrap gap-1.5">
              {relations.map((r) => (
                <Chip key={r} active={relation === r} onClick={() => setRelation(relation === r ? null : r)}>
                  {t(`decoder.who.relations.${r}`)}
                </Chip>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="speaker-culture">
                <FieldLabel>{t("decoder.who.background")}</FieldLabel>
              </label>
              <CultureSelect
                id="speaker-culture"
                value={speakerCulture}
                onChange={setSpeakerCulture}
                unknownLabel={t("decoder.who.unknownBackground")}
                labelFor={cultureLabel}
              />
            </div>
            <div>
              <FieldLabel>{t("decoder.who.gender")}</FieldLabel>
              <div className="flex flex-wrap gap-1.5">
                {(["woman", "man", "unspecified"] as Gender[]).map((g) => (
                  <Chip key={g} active={gender === g} onClick={() => setGender(g)}>
                    {t(`decoder.who.genders.${g}`)}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{t("decoder.who.genderNote")}</p>

          <details className="group rounded-2xl border bg-muted/30 p-3">
            <summary className="cursor-pointer list-none text-sm font-medium">
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="size-4 text-primary" />
                {t("decoder.who.style.title")}
              </span>
            </summary>
            <div className="mt-3 space-y-3">
              {AXIS_ORDER.map((axis) => (
                <div key={axis} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-xs">
                  <span className="text-right text-muted-foreground">{t(`decoder.who.axes.${axis}.left`)}</span>
                  <div className="flex gap-1" role="radiogroup" aria-label={`${t(`decoder.who.axes.${axis}.left`)} – ${t(`decoder.who.axes.${axis}.right`)}`}>
                    {AXIS_STEPS.map((step) => {
                      const active = individual[axis] === step;
                      return (
                        <button
                          key={step}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          aria-label={step === 0 ? t("decoder.who.style.unknown") : String(step)}
                          onClick={() => setIndividual({ ...individual, [axis]: step })}
                          className={`flex size-8 items-center justify-center rounded-full border text-[11px] transition-colors ${
                            active ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
                          }`}
                        >
                          {step === 0 ? t("decoder.who.style.unknown") : ""}
                          {step !== 0 ? (
                            <span
                              aria-hidden
                              className={`rounded-full ${active ? "bg-primary-foreground" : "bg-muted-foreground/60"} ${
                                Math.abs(step) === 1 ? "size-2.5" : "size-1.5"
                              }`}
                            />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-muted-foreground">{t(`decoder.who.axes.${axis}.right`)}</span>
                </div>
              ))}
            </div>
          </details>
        </Step>

        {/* 3 — how it was said */}
        <Step n={3} title={t("decoder.how.title")}>
          <div className="flex flex-wrap gap-1.5">
            {CUES.map((c) => (
              <Chip
                key={c}
                active={cues.includes(c)}
                onClick={() => setCues(cues.includes(c) ? cues.filter((x) => x !== c) : [...cues, c])}
              >
                {t(`decoder.how.cues.${c}`)}
              </Chip>
            ))}
          </div>
        </Step>

        {/* 4 — about you */}
        <Step n={4} title={t("decoder.you.title")}>
          <div>
            <label htmlFor="listener-culture">
              <FieldLabel>{t("decoder.you.background")}</FieldLabel>
            </label>
            <CultureSelect
              id="listener-culture"
              value={listenerCulture}
              onChange={updateListenerCulture}
              unknownLabel={t("decoder.who.unknownBackground")}
              labelFor={cultureLabel}
            />
          </div>
          {hasProfile ? (
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={useProfile}
                onChange={(e) => setUseProfile(e.target.checked)}
                className="mt-0.5 size-4 accent-[var(--primary)]"
              />
              <span>
                {t("decoder.you.useProfile")}
                <span className="block text-xs text-muted-foreground">{t("decoder.you.profileHint")}</span>
              </span>
            </label>
          ) : mounted ? (
            <p className="text-sm text-muted-foreground">
              {t("decoder.you.noProfile")}{" "}
              <Link href="/" className="font-medium text-primary underline underline-offset-2">
                {t("decoder.you.takeQuiz")}
              </Link>
            </p>
          ) : null}
        </Step>
      </div>

      {/* Results */}
      <aside id="decoder-result" className="scroll-mt-20 lg:sticky lg:top-20">
        <div className="rounded-3xl border bg-card p-4 sm:p-5">
          <h2 className="text-base font-semibold tracking-tight">{t("decoder.result.heading")}</h2>

          {!result || !top ? (
            <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
              <MessageCircle className="mt-0.5 size-4 shrink-0" />
              {t("decoder.result.empty")}
            </p>
          ) : (
            <div className="mt-3 space-y-4">
              <p className="text-sm italic text-muted-foreground">{t(`decoder.phrases.${result.phraseId}.label`)}</p>

              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                  result.confidence === "high"
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                    : result.confidence === "medium"
                      ? "bg-sky-500/15 text-sky-700 dark:text-sky-300"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {t(`decoder.result.confidence.${result.confidence}`)}
              </span>

              {/* Top reading */}
              <div className="rounded-2xl border border-primary/40 bg-primary/5 p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-base font-semibold leading-snug">{t(`${readingKey(top.id)}.title`)}</h3>
                  <span className="shrink-0 text-lg font-bold tabular-nums text-primary">
                    {Math.round(top.probability * 100)}%
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`${readingKey(top.id)}.meaning`)}</p>
                {askFor(top.id) ? (
                  <div className="mt-3 rounded-xl bg-background/70 p-3">
                    <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      <HelpCircle className="size-3.5" />
                      {t("decoder.result.ask")}
                    </p>
                    <p className="mt-1 text-sm font-medium">{askFor(top.id)}</p>
                  </div>
                ) : null}
                <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {t("decoder.result.respond")}
                </p>
                <p className="mt-1 text-sm">{t(`${readingKey(top.id)}.respond`)}</p>
              </div>

              {/* Other readings */}
              <ul className="space-y-3">
                {result.readings.slice(1).map((r) => (
                  <li key={r.id}>
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="font-medium">{t(`${readingKey(r.id)}.title`)}</span>
                      <span className="shrink-0 tabular-nums text-muted-foreground">
                        {Math.round(r.probability * 100)}%
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary/50" style={{ width: `${r.probability * 100}%` }} />
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t(`${readingKey(r.id)}.meaning`)}</p>
                  </li>
                ))}
              </ul>

              {result.ownFilterReading ? (
                <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3">
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-amber-800 dark:text-amber-200">
                    <AlertTriangle className="size-4" />
                    {t("decoder.result.filterTitle")}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-amber-900/90 dark:text-amber-100/90">
                    {t("decoder.result.filterBody", {
                      own: t(`${readingKey(result.ownFilterReading)}.title`),
                      their: t(`${readingKey(top.id)}.title`),
                    })}
                  </p>
                </div>
              ) : null}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {t("decoder.result.why")}
                </p>
                {result.drivers.length > 0 ? (
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {result.drivers.map((d) => (
                      <li key={d.key} className="rounded-full border px-2.5 py-1 text-xs">
                        {driverText(d)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-xs text-muted-foreground">{t("decoder.result.noDrivers")}</p>
                )}
              </div>

              <p className="border-t pt-3 text-[11px] leading-relaxed text-muted-foreground">
                {t("decoder.result.disclaimer")}
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile: results sit below the inputs, so keep the current top reading in reach. */}
      {result && top ? (
        <a
          href="#decoder-result"
          className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex items-center gap-2 rounded-full border bg-card/95 px-4 py-3 text-sm shadow-lg backdrop-blur lg:hidden"
        >
          <span className="min-w-0 flex-1 truncate font-medium">{t(`${readingKey(top.id)}.title`)}</span>
          <span className="shrink-0 font-bold tabular-nums text-primary">{Math.round(top.probability * 100)}%</span>
          <ArrowDown className="size-4 shrink-0 text-muted-foreground" />
        </a>
      ) : null}
    </div>
  );
}
