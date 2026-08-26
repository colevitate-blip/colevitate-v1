import type { MbtiTypeTranslation } from "./types";

export const BIGFIVE_TRANSLATION_DE: Record<string, MbtiTypeTranslation> = {
  "openness-high": {
    name: "Hohe Offenheit — Der Entdecker",
    tagline: "Offenheit · Hoher Wert",
    description: "Du fühlst dich zu neuen Ideen, Kunst und abstraktem Denken hingezogen, mehr als zu Routine und Konvention.",
    strengths: ["Du bringst frische, unkonventionelle Perspektiven in Probleme ein, die alle anderen gleich sehen."],
    challenges: ["Kann der nächsten interessanten Idee nachjagen, bevor die aktuelle abgeschlossen ist."],
    careers: ["Forschung & Entwicklung oder Innovationsrollen", "Design oder Kunst", "Strategie- oder Zukunftsarbeit", "Wissenschaftliche Forschung", "Unternehmertum in einem neuen Bereich"],
    relationships:
      "Du willst eine Beziehung, die weiterwächst und sich weiterentwickelt, nicht eine, die sich in fester Routine einrichtet, und fühlst dich zu Partnern hingezogen, die diese Neugier mit dir teilen können. Reibung entsteht meist mit einem eher routineorientierten Partner, der deine Ruhelosigkeit als Unzufriedenheit deutet, statt einfach als deine Art zu sein.",
  },
  "openness-low": {
    name: "Niedrige Offenheit — Der Realist",
    tagline: "Offenheit · Niedriger Wert",
    description: "Du bevorzugst das Praktische und Bewährte gegenüber dem Abstrakten und Ungetesteten.",
    strengths: ["Du bleibst geerdet in dem, was konkret und nachweislich verlässlich ist."],
    challenges: ["Kann eine unkonventionelle Idee abtun, bevor sie wirklich durchdacht wurde."],
    careers: ["Betriebs- oder Prozessmanagement", "Compliance oder Wirtschaftsprüfung", "Handwerksberufe", "Buchhaltung", "Qualitätskontrolle"],
    relationships:
      "Du schätzt eine Beziehung, die auf Beständigkeit und bewährtem Vertrauen aufbaut, statt auf ständiger Neuheit, und suchst keinen Partner, der die Beziehung regelmäßig neu erfindet. Diese geerdete Qualität kann für einen Partner ein echter Anker sein, solange du offen bleibst für dessen gelegentliches Bedürfnis nach etwas Neuem.",
  },
  "conscientiousness-high": {
    name: "Hohe Gewissenhaftigkeit — Der Organisator",
    tagline: "Gewissenhaftigkeit · Hoher Wert",
    description: "Du planst voraus, bleibst am Ball und stellst hohe Ansprüche an dich selbst.",
    strengths: ["Menschen können sich darauf verlassen, dass du lieferst, was du versprochen hast."],
    challenges: ["Standards können in Perfektionismus umschlagen, der Dinge verlangsamt."],
    careers: ["Projektmanagement", "Finanzen oder Buchhaltung", "Recht", "Ingenieurwesen", "Chirurgie oder andere präzisionskritische medizinische Rollen"],
    relationships:
      "Du zeigst Liebe durch Verlässlichkeit und Durchhaltevermögen und erwartest im Gegenzug ein ähnliches Maß an Verbindlichkeit. Partner, die deinen Standards entsprechen können — oder zumindest klar kommunizieren, wenn sie es nicht können — verhindern meist die Frustration, die entsteht, wenn du das Gefühl hast, allein alles zusammenzuhalten.",
  },
  "conscientiousness-low": {
    name: "Niedrige Gewissenhaftigkeit — Der Improvisator",
    tagline: "Gewissenhaftigkeit · Niedriger Wert",
    description: "Du bleibst lieber flexibel und passt dich im Moment an, statt im Detail zu planen.",
    strengths: ["Du passt dich schnell an, wenn sich Pläne ändern, und fühlst dich selten eingeengt."],
    challenges: ["Termine und routinemäßige Umsetzung können ohne mehr Struktur ins Rutschen geraten."],
    careers: ["Kreative oder improvisierende Rollen", "Frühphasen-Startups", "Krisen- oder Erstversorgungsarbeit", "Live-Event-Produktion", "Freiberufliche oder projektbasierte Arbeit"],
    relationships:
      "Du hältst eine Beziehung spontan und flexibel, statt sie zu überplanen — das schätzen viele Partner wirklich. Der Bereich, der bewusste Anstrengung braucht, ist das Einhalten gemeinsamer Verpflichtungen — ein Partner, der genau die richtige Menge an Struktur einbringt, rundet die Beziehung gut ab.",
  },
  "extraversion-high": {
    name: "Hohe Extraversion — Der Verbinder",
    tagline: "Extraversion · Hoher Wert",
    description: "Du schöpfst Energie aus Menschen und denkst in einer Gruppe eher laut.",
    strengths: ["Du baust schnell Schwung und Wärme in einem Raum auf."],
    challenges: ["Musst dir möglicherweise bewusst ruhigere, reizarme Zeit einplanen."],
    careers: ["Vertrieb", "Lehre oder Ausbildung", "Öffentlichkeitsarbeit", "Veranstaltungsmoderation", "Personalführung"],
    relationships:
      "Du schöpfst echte Energie aus gemeinsamer Zeit und Aktivität mit einem Partner und verarbeitest vieles von dem, was du fühlst, laut. Ein Partner, der sich mit deinem sozialen Tempo wohlfühlt — oder ehrlich sagt, wenn er ruhigere Zeit braucht — hilft, die Beziehung ausgewogen statt einseitig zu halten.",
  },
  "extraversion-low": {
    name: "Niedrige Extraversion — Der Beobachter",
    tagline: "Extraversion · Niedriger Wert",
    description: "Du tankst in ruhigeren Umgebungen auf und bevorzugst in Gesprächen Tiefe statt Breite.",
    strengths: ["Du bringst ruhige, konzentrierte Aufmerksamkeit in Vier-Augen-Gespräche ein."],
    challenges: ["Kannst in lauten Gruppensituationen übersehen werden, wenn du dich nicht bemerkbar machst."],
    careers: ["Forschung", "Schreiben oder Lektorat", "Softwareentwicklung", "Datenanalyse", "Fokussierte Eins-zu-eins-Arbeit wie Therapie oder Nachhilfe"],
    relationships:
      "Du bevorzugst Tiefe gegenüber ständiger Aktivität und zeigst Liebe eher in ruhiger, konzentrierter Zweisamkeit als in großen sozialen Gesten. Partner, die diese Vorliebe nicht mit Desinteresse verwechseln und dein Bedürfnis nach Zeit für dich allein respektieren, passen meist am besten.",
  },
  "agreeableness-high": {
    name: "Hohe Verträglichkeit — Der Kooperative",
    tagline: "Verträglichkeit · Hoher Wert",
    description: "Du legst Wert auf Harmonie und hilfst den Menschen um dich herum wirklich gern.",
    strengths: ["Du baust schnell und aufrichtig Vertrauen und Kooperation mit Menschen auf."],
    challenges: ["Kannst notwendige Konflikte vermeiden, um den Frieden zu wahren."],
    careers: ["Beratung", "Pflege", "Lehre", "Personalwesen", "Gemeinnützige oder soziale Arbeit"],
    relationships:
      "Du stellst instinktiv das Wohlbefinden deines Partners und die Harmonie der Beziehung in den Vordergrund. Das eigentliche Risiko ist Konfliktvermeidung — ein echtes Problem unangesprochen zu lassen, um den Frieden zu wahren —, daher tun dir Beziehungen, in denen ein Partner aktiv nach deiner ehrlichen Meinung fragt, langfristig gut.",
  },
  "agreeableness-low": {
    name: "Niedrige Verträglichkeit — Der Herausforderer",
    tagline: "Verträglichkeit · Niedriger Wert",
    description: "Du bist bereit, dein eigenes Urteil über den Gruppenkonsens zu stellen.",
    strengths: ["Du sagst das schwierige, ehrliche Wort, das eine Gruppe davon abhält, sich selbst zu täuschen."],
    challenges: ["Direktheit kann schroff wirken, wo Wärme besser ankäme."],
    careers: ["Prozessführung", "Wirtschaftsprüfung oder Compliance-Durchsetzung", "Kritische Bewertungsrollen (Lektor, Kritiker)", "Investieren oder Risikokapital", "Unternehmertum, das schwierige Entscheidungen erfordert"],
    relationships:
      "Du bist bereit, das Ehrliche, manchmal Unbequeme zu sagen, statt um jeden Preis den Frieden zu wahren — das schätzen Partner, die Direktheit zu würdigen wissen. Was sich zu justieren lohnt, ist die Art der Übermittlung — derselbe ehrliche Punkt kommt oft besser an, wenn etwas mehr Wärme mitschwingt.",
  },
  "neuroticism-high": {
    name: "Hohe emotionale Sensibilität — Der Fühlende",
    tagline: "Emotionale Sensibilität · Hoher Wert",
    description: "Du empfindest Emotionen intensiv und bleibst wachsam gegenüber dem, was schiefgehen könnte.",
    strengths: ["Deine Wachsamkeit erkennt Risiken, die entspanntere Menschen völlig übersehen."],
    challenges: ["Sorgen können Energie für Dinge kosten, die nie eintreten."],
    careers: ["Risikomanagement", "Sicherheit oder Compliance", "Qualitätssicherung", "Sicherheitsanalyse", "Beratung (feinfühlig für die Belastung anderer)"],
    relationships:
      "Du spürst die Höhen und Tiefen einer Beziehung intensiv und bemerkst oft als Erster, wenn etwas nicht stimmt. Diese Wachsamkeit kann auch bedeuten, sich über Probleme zu sorgen, die nie eintreten — Partner, die dir helfen, echte Anliegen von ängstlichen zu unterscheiden, sind meist eine stabilisierende Präsenz.",
  },
  "neuroticism-low": {
    name: "Niedrige emotionale Sensibilität — Der Anker",
    tagline: "Emotionale Sensibilität · Niedriger Wert",
    description: "Du bleibst tendenziell ruhig und emotional stabil, selbst unter echtem Druck.",
    strengths: ["Du bleibst besonnen in Momenten, die die meisten Menschen aus der Ruhe bringen würden."],
    challenges: ["Geringe Dringlichkeit kann bedeuten, dass echte Risiken unterschätzt werden."],
    careers: ["Rettungsdienst", "Chirurgie", "Luftfahrt oder Pilotentätigkeit", "Krisenmanagement", "Verhandlungen mit hohem Einsatz"],
    relationships:
      "Du bringst eine stetige, ausgeglichene Haltung in eine Beziehung ein, besonders bei Konflikten oder Stress, was für einen ängstlicheren Partner eine echte Stabilität sein kann. Worauf du achten solltest, ist eine Unterreaktion auf etwas, das wirklich Aufmerksamkeit braucht — die Signale eines Partners verdienen es, ernst genommen zu werden, auch wenn du selbst die Dringlichkeit nicht spürst.",
  },
};
