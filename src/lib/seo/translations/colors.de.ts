import type { MbtiTypeTranslation } from "./types";

export const COLORS_TRANSLATION_DE: Record<string, MbtiTypeTranslation> = {
  red: {
    name: "Rot — Der Antreiber",
    tagline: "Mutig · Entschlossen · Ergebnisorientiert",
    description:
      "Rote Typen sind von Handeln und Ergebnissen motiviert. Du triffst schnell Entscheidungen, überwindest Hindernisse direkt statt sie zu umgehen, und fühlst dich am lebendigsten, wenn du ein Ziel vorantreibst.",
    strengths: [
      "Trifft unter Druck schnelle, selbstbewusste Entscheidungen",
      "Treibt Projekte voran und lässt den Schwung nicht ins Stocken geraten",
      "Übernimmt bereitwillig die Führung, wenn eine Situation es verlangt",
      "Bleibt ergebnisorientiert, statt sich im Prozess zu verlieren",
    ],
    challenges: [
      "Kann bei langsameren Abläufen unverblümt oder ungeduldig wirken",
      "Kann Einwände überrollen, bevor sie vollständig gehört wurden",
      "Sich für Details Zeit zu nehmen, kann sich wie verschwendete Zeit anfühlen, auch wenn es das nicht ist",
    ],
    careers: ["Vertriebsleitung", "Unternehmertum", "Betriebs- oder allgemeine Führung", "Notfall- oder Krisenmanagement", "Prozessrecht"],
    relationships:
      "Du bringst Entschlossenheit und Schwung in eine Beziehung ein und sprichst ein Problem lieber direkt an, statt es schleifen zu lassen. Partner, die mit deiner Direktheit mithalten können — oder zumindest nicht davon aus der Ruhe gebracht werden — kommen meist besser mit dir zurecht als solche, die einen sanfteren Ansatz brauchen.",
  },
  blue: {
    name: "Blau — Der Analytiker",
    tagline: "Präzise · Nachdenklich · Zuverlässig",
    description:
      "Blaue Typen sind von Genauigkeit und Verständnis motiviert. Du nimmst dir lieber die Zeit, etwas richtig zu machen, statt zu einer oberflächlichen Antwort zu eilen, und Menschen vertrauen deinem Urteil, weil es sorgfältig durchdacht ist.",
    strengths: [
      "Erkennt Fehler und Lücken, die schnellere Menschen übersehen",
      "Bringt sorgfältiges, gut begründetes Urteilsvermögen in Entscheidungen ein",
      "Liefert durchgehend hochwertige, verlässliche Arbeit",
      "Bleibt ruhig und objektiv, wenn andere emotional reagieren",
    ],
    challenges: [
      "Kann zu viel analysieren und eine Entscheidung über den nützlichen Zeitpunkt hinaus verzögern",
      "Kann zurückhaltend oder emotional schwer lesbar wirken",
      "Hohe persönliche Standards können zu starr auf andere angewendet werden",
    ],
    careers: ["Ingenieurwesen", "Buchhaltung oder Finanzanalyse", "Wissenschaftliche Forschung", "Datenanalyse", "Qualitätssicherung"],
    relationships:
      "Du zeigst Fürsorge eher durch Verlässlichkeit und durchdachte Aufmerksamkeit als durch offene Gefühlsäußerungen, und du nimmst einmal eingegangene Verpflichtungen ernst. Ein Partner, der deine Zurückhaltung nicht mit Desinteresse verwechselt und dir Zeit zum Verarbeiten gibt, bevor er eine Reaktion erwartet, passt meist gut.",
  },
  green: {
    name: "Grün — Der Unterstützer",
    tagline: "Warmherzig · Geduldig · Beständig",
    description:
      "Grüne Typen sind von Verbindung und Stabilität motiviert. Du bist die ruhige, verlässliche Präsenz, die ein Team oder eine Beziehung braucht, und es ist dir wirklich wichtig, wie sich deine Entscheidungen auf die Menschen um dich herum auswirken.",
    strengths: [
      "Baut durch beständige, echte Fürsorge Vertrauen und Loyalität auf",
      "Hält Gruppen in angespannten Momenten ruhig und kooperativ",
      "Hört gut zu und gibt Menschen das Gefühl, wirklich gehört zu werden",
      "Bietet beständige Unterstützung, auf die sich andere verlassen können",
    ],
    challenges: [
      "Konfliktvermeidung kann echte Probleme zu lange ungelöst lassen",
      "Kann die Bedürfnisse anderer zu oft über die eigenen stellen",
      "Kann Veränderung widerstehen, selbst wenn sie eindeutig helfen würde",
    ],
    careers: ["Beratung oder Therapie", "Pflege oder Gesundheitswesen", "Personalwesen", "Lehre", "Sozialarbeit"],
    relationships:
      "Du gehst wirklich aufmerksam auf die Bedürfnisse eines Partners ein und legst Wert darauf, die Beziehung stabil und ruhig zu halten. Das Risiko besteht darin, echte Probleme unangesprochen zu lassen, um Konflikte zu vermeiden — Beziehungen, in denen ein Partner dich dazu bringt, offen zu sagen, was dich wirklich beschäftigt, sind für dich meist am gesündesten.",
  },
  yellow: {
    name: "Gelb — Der Inspirator",
    tagline: "Energiegeladen · Gesellig · Optimistisch",
    description:
      "Gelbe Typen sind von Möglichkeiten und Verbindung motiviert. Du bringst Begeisterung in einen Raum, gibst Menschen ein gutes Gefühl für das, was vor ihnen liegt, und blühst bei Abwechslung, Spontaneität und neuen Erfahrungen auf.",
    strengths: [
      "Bringt Energie und Motivation für die Menschen um dich herum",
      "Baut schnell und aufrichtig Beziehungen zu neuen Menschen auf",
      "Erkennt im Moment aufregende Möglichkeiten, die andere übersehen",
      "Passt sich leicht an und hält die Stimmung auch bei Veränderungen hoch",
    ],
    challenges: [
      "Die Umsetzung kann hinter der Begeisterung für eine neue Idee zurückbleiben",
      "Kann bei den Details einer langen, wenig glanzvollen Aufgabe den Fokus verlieren",
      "Begeisterung muss in ernsteren Momenten manchmal gezügelt werden",
    ],
    careers: ["Marketing oder Markenstrategie", "Vertrieb (beziehungsorientiert)", "Veranstaltungsplanung", "Öffentlichkeitsarbeit", "Gastgewerbe"],
    relationships:
      "Du bringst Wärme, Spontaneität und echte Begeisterung in eine Beziehung ein und tankst Energie aus gemeinsamen Erlebnissen. Partner, die dabei helfen, diese Energie in beständige Umsetzung zu übersetzen — da Routine nicht gerade deine Stärke ist — runden das Ganze gut ab.",
  },
};
