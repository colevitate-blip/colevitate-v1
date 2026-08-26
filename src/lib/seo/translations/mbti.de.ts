import type { MbtiTypeTranslation } from "./types";

export const MBTI_TRANSLATION_DE: Record<string, MbtiTypeTranslation> = {
  INTJ: {
    name: "Der Stratege",
    tagline: "Unabhängig · Visionär · Anspruchsvoll",
    description:
      "INTJs denken in Systemen und langen Zeiträumen. Du bildest dir eine unabhängige, gut durchdachte Meinung darüber, wohin sich die Dinge entwickeln, und hast die Disziplin, beharrlich darauf hinzuarbeiten — oft Jahre, bevor es alle anderen tun.",
    strengths: [
      "Erkennt das strukturelle Muster hinter komplexen Problemen, die andere überfordern",
      "Setzt sich ambitionierte langfristige Ziele und verfolgt sie mit stiller Beharrlichkeit",
      "Trifft unbequeme Entscheidungen, wenn die Logik dafürspricht",
      "Verfeinert Ideen ständig weiter, statt sich mit einer guten Antwort zufriedenzugeben",
    ],
    challenges: [
      "Kann distanziert wirken, wenn andere zuerst emotionale Anerkennung brauchen",
      "Neigt dazu, Einwände zu übergehen, die nicht als durchdachtes Argument vorgetragen werden",
      "Perfektionismus kann die Fertigstellung von etwas bereits Gutem verzögern",
    ],
    careers: [
      "Systemarchitektur oder Produktarchitektur",
      "Strategische Planung / Unternehmensberatung",
      "Wissenschaftliche Forschung",
      "Investment- oder Finanzstrategie",
      "Softwareentwicklung",
    ],
    relationships:
      "Du zeigst Liebe eher durch Kompetenz und Verlässlichkeit als durch ständige Bestätigung, und du brauchst in einer Beziehung echte Unabhängigkeit, um dauerhaft engagiert zu bleiben. Partner, die dein Bedürfnis nach Zeit für dich respektieren und sich in einem direkten Gespräch behaupten können, passen meist am besten.",
  },
  INTP: {
    name: "Der Analytiker",
    tagline: "Neugierig · Logisch · Unabhängig",
    description:
      "INTPs treibt der Reiz eines interessanten Problems an. Du willst lieber tief verstehen, wie etwas funktioniert, als schnell an der Oberfläche zu bleiben, und bist am lebendigsten, wenn du eine Idee auseinandernimmst, um zu sehen, was sie zusammenhält.",
    strengths: [
      "Erkennt logische Widersprüche und Grenzfälle, die andere übersehen",
      "Entwickelt originelle Denkmodelle, statt zur naheliegendsten Antwort zu greifen",
      "Sagt bereitwillig 'Das weiß ich noch nicht', statt Sicherheit vorzutäuschen",
      "Bringt Genauigkeit in Entscheidungen, die andere rein aus dem Bauch heraus treffen",
    ],
    challenges: [
      "Analysen können sich endlos im Kreis drehen, ohne zu einer Entscheidung zu kommen",
      "Die Ausführung von Routineaufgaben kann hinter der Qualität deiner Ideen zurückbleiben",
      "Vergisst manchmal, eine Überlegung mitzuteilen, die dir selbst offensichtlich erscheint",
    ],
    careers: [
      "Wissenschaftliche Forschung",
      "Software- oder Algorithmenentwicklung",
      "Systemanalyse",
      "Philosophie oder theoretische Wissenschaft",
      "Technisches Schreiben",
    ],
    relationships:
      "Du verbindest dich am leichtesten über Ideen und kannst über längere Zeit still werden, wenn du tief in Gedanken versunken bist — das ist kein Desinteresse, sondern einfach deine Art zu verarbeiten. Ein Partner, der das nicht persönlich nimmt und gerne eine Idee um ihrer selbst willen diskutiert, passt meist gut.",
  },
  ENTJ: {
    name: "Der Feldherr",
    tagline: "Entschlossen · Strategisch · Zielstrebig",
    description:
      "ENTJs verwandeln Unklarheit in einen Plan. Du erkennst instinktiv den effizientesten Weg vom aktuellen Stand zum Ziel und mobilisierst Menschen und Ressourcen, um dorthin zu gelangen, ohne viel zu zögern.",
    strengths: [
      "Trifft klare Entscheidungen schnell, auch bei unvollständigen Informationen",
      "Organisiert Menschen und Ressourcen um ein gemeinsames, ambitioniertes Ziel",
      "Gibt direktes Feedback, das Projekte voranbringt",
      "Behandelt Rückschläge als Daten, nicht als Gründe zum Innehalten",
    ],
    challenges: [
      "Kann leisere Stimmen überrollen, bevor sie ihre volle Meinung äußern konnten",
      "Ungeduld mit Prozessen kann die Zustimmung des Teams untergraben",
      "Kann die emotionalen Kosten einer rein effizienten Entscheidung unterschätzen",
    ],
    careers: [
      "Geschäftsführung / allgemeines Management",
      "Unternehmensberatung",
      "Restrukturierung oder Betriebsleitung",
      "Recht (Prozessführung oder Unternehmensstrategie)",
      "Unternehmertum",
    ],
    relationships:
      "Du bringst in Beziehungen dieselbe Zielstrebigkeit ein wie in die Arbeit — du willst einen Partner, der mit dir mithalten und bei Uneinigkeit widersprechen kann. Echte Nähe erfordert bewusste Anstrengung, denn dein Instinkt ist es, Probleme zu lösen, statt einfach nur bei einem Gefühl zu verweilen.",
  },
  ENTP: {
    name: "Der Innovator",
    tagline: "Erfinderisch · Schlagfertig · Widerspenstig",
    description:
      "ENTPs denken laut, indem sie argumentieren — mit anderen und mit sich selbst. Du wirst von Möglichkeiten angetrieben, erkennst schnell die Schwachstelle in einem Plan und schlägst genauso schnell drei bessere vor.",
    strengths: [
      "Entwickelt eine große Bandbreite neuer Optionen, statt an der ersten Idee festzuhalten",
      "Diskutiert Ideen rigoros, ohne Widerspruch persönlich zu nehmen",
      "Passt sich schnell an, wenn sich die Umstände mitten im Plan ändern",
      "Bringt Energie in einen Raum und hinterfragt festgefahrene Annahmen",
    ],
    challenges: [
      "Beginnt womöglich mehr Projekte, als er abschließt",
      "Zu häufiges Spielen des Advocatus Diaboli kann als Widerspruch um seiner selbst willen wirken",
      "Routineausführung kann sich zäh anfühlen, sobald der neue Reiz gelöst ist",
    ],
    careers: [
      "Produktstrategie / Innovationsrollen",
      "Unternehmertum",
      "Venture-Investing",
      "Diskussionsstarkes Recht (Prozessführung, Politik)",
      "Kreativ- oder Werbestrategie",
    ],
    relationships:
      "Du hältst Beziehungen spannend, indem du Annahmen infrage stellst — auch die deines Partners, der das als Genuss und nicht als Angriff verstehen können muss. Am besten passt jemand, der eine gute Diskussion genauso schätzt wie du und darunter keine ständige Bestätigung braucht.",
  },
  INFJ: {
    name: "Der Advokat",
    tagline: "Einfühlsam · Prinzipientreu · Still-intensiv",
    description:
      "INFJs verbinden einen starken inneren Kompass mit echtem Gespür für Menschen. Du erkennst oft die Bedeutung hinter einer Situation, bevor andere sie sehen, und dir liegt daran, es richtig zu machen — für die beteiligten Menschen, nicht nur für das Ergebnis.",
    strengths: [
      "Erkennt zugrunde liegende Dynamiken und unausgesprochene Bedürfnisse in einem Raum",
      "Hält an festen, gut durchdachten Werten fest, ohne sie laut zu vertreten",
      "Baut tiefe, vertrauensbasierte Beziehungen statt vieler oberflächlicher",
      "Verbindet eine konkrete Entscheidung mit ihrer größeren Bedeutung oder ihrem Zweck",
    ],
    challenges: [
      "Kann die emotionale Last anderer aufnehmen, bis sie zur eigenen wird",
      "Idealismus kann in Enttäuschung umschlagen, wenn die Realität nicht mithält",
      "Neigt dazu, sich zurückzuziehen, statt einen Konflikt direkt anzusprechen",
    ],
    careers: [
      "Beratung oder Psychologie",
      "Schriftstellerei oder redaktionelle Arbeit",
      "Gemeinnützige oder sinnstiftende Führungsarbeit",
      "UX-Forschung",
      "Didaktisches Design",
    ],
    relationships:
      "Du gehst nur wenige Beziehungen ein, aber die, die du eingehst, sind tiefgründig — du suchst echtes Verständnis, nicht nur Gesellschaft. Du kannst die emotionale Last eines Partners über das gesunde Maß hinaus tragen, daher tut dir eine Beziehung, die auf Gegenseitigkeit beruht, langfristig gut.",
  },
  INFP: {
    name: "Der Idealist",
    tagline: "Einfühlsam · Authentisch · Fantasievoll",
    description:
      "INFPs folgen einem klaren inneren Gefühl dafür, was richtig und bedeutsam ist. Dir ist wichtiger, ob etwas deinen Werten entspricht, als wie es von außen wirkt — das verleiht deiner Arbeit eine stille Authentizität.",
    strengths: [
      "Bringt echte Empathie ein, die Menschen sich wirklich gehört fühlen lässt",
      "Bleibt unter sozialem oder kommerziellem Druck bei den eigenen Werten verankert",
      "Erkennt kreative, wertebasierte Perspektiven, die andere übersehen",
      "Setzt sich für Menschen ein, die sonst übergangen würden",
    ],
    challenges: [
      "Kann Kritik an einer Idee als Kritik an sich selbst auffassen",
      "Konfliktvermeidung kann kleine Probleme zu Groll heranwachsen lassen",
      "Idealisierte Erwartungen können die gewöhnliche Realität enttäuschend wirken lassen",
    ],
    careers: [
      "Kreatives Schreiben oder Content-Strategie",
      "Beratung oder Sozialarbeit",
      "Gemeinnütziges Engagement",
      "UX- oder Grafikdesign",
      "Lektorat",
    ],
    relationships:
      "Du brauchst eine Beziehung, die sich ehrlich und wertekonform anfühlt, mehr als eine, die einfach nur bequem oder konventionell ist. Du kannst einen Partner am Anfang idealisieren — am besten passen Menschen, die dich ganz sehen lassen, nicht nur die Seiten, die in dein Bild passen.",
  },
  ENFJ: {
    name: "Der Mentor",
    tagline: "Warmherzig · Überzeugend · Menschenorientiert",
    description:
      "ENFJs lesen einen Raum und wissen instinktiv, wie sie das Beste in den Menschen darin wecken. Du bist von der Entwicklung anderer motiviert und hast die natürliche Gabe, eine gemeinsame Vision zu formulieren, die Menschen zusammen in Bewegung bringt.",
    strengths: [
      "Erkennt individuelle Stärken und hilft Menschen aktiv, in sie hineinzuwachsen",
      "Vermittelt eine Vision auf eine Weise, die Menschen wirklich mitreißt",
      "Baut schnell Vertrauen zu ganz unterschiedlichen Menschen auf",
      "Verwandelt Spannungen in einer Gruppe in ein konstruktives Gespräch",
    ],
    challenges: [
      "Kann sich für die Bedürfnisse anderer auf Kosten der eigenen verausgaben",
      "Der Wunsch nach Harmonie kann ein notwendiges schwieriges Gespräch verzögern",
      "Kann eine kühle Reaktion persönlich nehmen, statt sie als neutrales Feedback zu sehen",
    ],
    careers: [
      "Lehre oder Ausbildung",
      "Personalwesen / Personalentwicklung",
      "Gemeinnützige oder Community-Führung",
      "Coaching",
      "Öffentlichkeitsarbeit",
    ],
    relationships:
      "Du bemerkst, was ein Partner braucht, manchmal bevor es ausgesprochen wird — das ist eine Gabe, kann aber ins übermäßige Geben kippen, wenn es nicht erwidert wird. Beziehungen, in denen die eigenen Bedürfnisse ebenso viel Raum bekommen, tragen langfristig besser.",
  },
  ENFP: {
    name: "Der Katalysator",
    tagline: "Enthusiastisch · Fantasievoll · Warmherzig",
    description:
      "ENFPs bringen echte Neugier und Wärme in fast alles ein. Du verbindest Ideen und Menschen, die sonst nicht zusammenkämen, und deine Begeisterung steckt andere Menschen für ihr eigenes Leben an.",
    strengths: [
      "Bringt Energie und Möglichkeiten in festgefahrene Gespräche oder Projekte",
      "Baut schnell echte Verbindungen zu einer großen Bandbreite von Menschen auf",
      "Erkennt nicht offensichtliche Zusammenhänge zwischen Ideen, Menschen und Chancen",
      "Passt Pläne spontan an, ohne die Begeisterung zu verlieren",
    ],
    challenges: [
      "Die Umsetzung kann hinter der Begeisterung für eine neue Idee zurückbleiben",
      "Kann sich sozial überfordern und braucht mehr Erholungszeit als geplant",
      "Struktur und Routine können einengend wirken, selbst wenn sie helfen würden",
    ],
    careers: [
      "Marketing oder Markenstrategie",
      "Unternehmertum",
      "Journalismus",
      "Veranstaltungs- oder Community-Programmierung",
      "Kreativleitung",
    ],
    relationships:
      "Du bringst echte Wärme und Neugier für die Innenwelt eines Partners mit und wünschst dir eine Beziehung, die sich stetig weiterentwickelt, statt in Routine zu erstarren. Ein Partner, der etwas Beständigkeit neben deiner Begeisterung einbringt, hilft, dass die Umsetzung mit der Energie mithält.",
  },
  ISTJ: {
    name: "Der Verwalter",
    tagline: "Verlässlich · Methodisch · Bodenständig",
    description:
      "ISTJs sind die Menschen, um die andere ihre Pläne herum bauen, weil du tatsächlich tust, was du sagst. Du vertraust bewährten Methoden, behältst Details im Blick, die andere übersehen, und bist stolz darauf, Dinge vollständig zu Ende zu bringen.",
    strengths: [
      "Liefert verlässlich, was vereinbart wurde — auch bei wenig glanzvollen Aufgaben",
      "Erkennt praktische Details und Risiken, bevor sie zu Problemen werden",
      "Bringt ruhige, besonnene Urteilskraft unter Druck ein",
      "Respektiert Prozess und Präzedenzfall, statt das Rad jedes Mal neu zu erfinden",
    ],
    challenges: [
      "Kann einen besseren neuen Ansatz allein wegen seiner Unvertrautheit ablehnen",
      "Kann die eigenen Bedürfnisse zugunsten des Plans oder des Teams herunterspielen",
      "Starre Standards können bei spontaneren Menschen unflexibel wirken",
    ],
    careers: [
      "Buchhaltung oder Wirtschaftsprüfung",
      "Betriebsleitung",
      "Projektmanagement",
      "Recht (Compliance, Verträge)",
      "Ingenieurwesen",
    ],
    relationships:
      "Du zeigst Verbindlichkeit durch Beständigkeit und Verlässlichkeit statt durch große Gesten und nimmst gegebene Versprechen ernst. Ein Partner, der diese Beständigkeit schätzt und Veränderungen klar kommuniziert, statt zu erwarten, dass du dich einfach anpasst, passt meist gut.",
  },
  ISFJ: {
    name: "Der Beschützer",
    tagline: "Hingebungsvoll · Aufmerksam · Beständig",
    description:
      "ISFJs bemerken still, was die Menschen um sie herum brauchen, und handeln danach, ohne gefragt zu werden. Du übernimmst echte Verantwortung für die Menschen und Verpflichtungen in deinem Leben und zeigst Fürsorge durch beständige, praktische Unterstützung.",
    strengths: [
      "Merkt sich die konkreten Details, die Menschen sich wirklich umsorgt fühlen lassen",
      "Hält Verpflichtungen still und zuverlässig ein, ohne Anerkennung zu brauchen",
      "Schafft eine stabile, ruhige Umgebung, auf die andere sich stützen können",
      "Verbindet Tradition mit echtem Gespür für individuelle Bedürfnisse",
    ],
    challenges: [
      "Kann so lange geben, bis die eigenen Bedürfnisse unerfüllt bleiben",
      "Unbehagen mit Konflikten kann Probleme zu lange ungelöst lassen",
      "Veränderung kann bedrohlicher wirken, als sie sein müsste",
    ],
    careers: [
      "Pflege oder Gesundheitswesen",
      "Verwaltung oder Büromanagement",
      "Grundschulbildung",
      "Personalwesen oder Sozialleistungsverwaltung",
      "Sozialarbeit",
    ],
    relationships:
      "Du drückst Fürsorge durch stille, praktische Taten aus und bemerkst oft, was ein Partner braucht, bevor er danach fragt. Das Risiko ist, so viel zu geben, dass die eigenen Bedürfnisse unerfüllt bleiben — Beziehungen, in denen ein Partner aktiv nach deinen Bedürfnissen fragt, tun dir am besten.",
  },
  ESTJ: {
    name: "Der Direktor",
    tagline: "Organisiert · Durchsetzungsstark · Praktisch",
    description:
      "ESTJs verwandeln Pläne in Umsetzung. Du bringst klare Struktur in unklare Situationen, hältst Menschen an das Vereinbarte und hast wenig Geduld für Prozesse, die nichts sichtbar voranbringen.",
    strengths: [
      "Organisiert Menschen und Zeitpläne zu einem umsetzbaren, funktionierenden Plan",
      "Hält einen klaren, konsistenten Standard und wendet ihn fair an",
      "Trifft Entscheidungen effizient und übernimmt Verantwortung für das Ergebnis",
      "Durchbricht Unklarheit, um Dinge in Bewegung zu bringen",
    ],
    challenges: [
      "Kann Einwände unterschätzen, die nicht mit klarer Begründung kommen",
      "Direktheit kann härter wirken, als beabsichtigt",
      "Festhalten an 'dem richtigen Weg' kann eine wirklich bessere neue Idee verdrängen",
    ],
    careers: [
      "Betriebs- oder Werksleitung",
      "Projekt- oder Programmmanagement",
      "Führung bei Polizei oder Militär",
      "Vertriebsleitung",
      "Logistik",
    ],
    relationships:
      "Du bringst Struktur und Verlässlichkeit in eine Beziehung ein und erwartest im Gegenzug Verbindlichkeit — vage Pläne oder unklare Zusagen frustrieren dich schnell. Partner, die direkt mit dir sein können, statt zu erwarten, dass du zwischen den Zeilen liest, kommen meist am besten mit dir zurecht.",
  },
  ESFJ: {
    name: "Der Gastgeber",
    tagline: "Gesellig · Unterstützend · Organisiert",
    description:
      "ESFJs halten Gruppen sozial und praktisch am Laufen. Du bemerkst, wer sich einbezogen fühlt und wer nicht, und gibst dir wirklich Mühe, dass die Menschen um dich herum sich unterstützt fühlen und die Pläne tatsächlich umgesetzt werden.",
    strengths: [
      "Baut schnell warme, kooperative Beziehungen innerhalb einer Gruppe auf",
      "Organisiert Menschen und Logistik, damit alles reibungslos läuft",
      "Bemerkt, wenn jemand ausgeschlossen wird, und bezieht ihn ein",
      "Hält Verpflichtungen gegenüber Menschen ein, die dir wichtig sind",
    ],
    challenges: [
      "Kann den eigenen Selbstwert zu sehr an die Anerkennung anderer knüpfen",
      "Streben nach Harmonie kann bedeuten, eine notwendige Auseinandersetzung zu vermeiden",
      "Kann eine neutrale oder unverblümte Reaktion persönlicher nehmen, als sie gemeint war",
    ],
    careers: [
      "Veranstaltungsplanung",
      "Koordination im Gesundheitswesen",
      "Personalwesen",
      "Hotel- und Gastgewerbemanagement",
      "Community- oder Kundenbeziehungen",
    ],
    relationships:
      "Du investierst echte Mühe, damit sich eine Beziehung (und die Menschen darum herum) unterstützt und einbezogen fühlt, und merkst, wenn diese Mühe nicht erwidert wird. Ein Partner, der mit deiner sozialen Ausrichtung zurechtkommt und deinen Wunsch nach Harmonie nicht mit fehlender eigener Meinung verwechselt, passt gut.",
  },
  ISTP: {
    name: "Der Handwerker",
    tagline: "Praktisch · Unabhängig · Gelassen",
    description:
      "ISTPs lernen am besten, indem sie Dinge auseinandernehmen — buchstäblich oder gedanklich. Du bleibst ruhig, wenn etwas kaputtgeht, löst Probleme mit handfester Logik und schätzt echte Kompetenz mehr als das Reden darüber.",
    strengths: [
      "Löst praktische Probleme effizient, ohne unnötiges Aufheben",
      "Bleibt in einer Krise gefasst und klar im Kopf",
      "Passt sich schnell an, wenn ein Plan mitten in der Umsetzung nicht mehr funktioniert",
      "Bevorzugt nachgewiesenes Können gegenüber Zeugnissen oder Reden",
    ],
    challenges: [
      "Kann sich aus Situationen zurückziehen, die zu emotional oder abstrakt wirken",
      "Vermeidet womöglich langfristige Verpflichtungen, die die Flexibilität einschränken",
      "Wortkargheit kann als Desinteresse gelesen werden, selbst wenn du voll dabei bist",
    ],
    careers: [
      "Handwerksberufe (Elektro, Mechanik)",
      "Ingenieurwesen (besonders praxisnahe Tätigkeiten)",
      "Rettungsdienst (Notfallsanitäter, Feuerwehr)",
      "IT oder Systemfehlerbehebung",
      "Pilotieren oder Fahrzeugführung",
    ],
    relationships:
      "Du zeigst Fürsorge eher durch Handeln als durch Worte, was für einen Partner, der mehr verbale Bestätigung braucht, distanziert wirken kann. Beziehungen, in denen ein Partner dir echten Freiraum gibt und dein Bedürfnis nach Unabhängigkeit nicht persönlich nimmt, funktionieren meist am besten.",
  },
  ISFP: {
    name: "Der Künstler",
    tagline: "Sanft · Ästhetisch · Unabhängig",
    description:
      "ISFPs erleben die Welt über die Sinne und ein stilles, persönliches Wertesystem. Du zeigst lieber, was du meinst, als es zu erklären, und wehrst dich dagegen, in eine Rolle gedrängt zu werden, die nicht widerspiegelt, wer du wirklich bist.",
    strengths: [
      "Bringt echte ästhetische und sinnliche Sensibilität in deine Arbeit ein",
      "Passt sich mühelos an und bleibt im Moment präsent",
      "Handelt nach persönlichen Werten, ohne dafür öffentlich argumentieren zu müssen",
      "Bietet den Menschen um dich herum stille, nicht wertende Unterstützung",
    ],
    challenges: [
      "Konfliktvermeidung kann bedeuten, dass echte Meinungsverschiedenheiten unausgesprochen bleiben",
      "Fällt es womöglich schwer, weit genug für längerfristige Ziele zu planen",
      "Empfindlichkeit gegenüber Kritik kann länger anhalten als der Moment, in dem sie geäußert wurde",
    ],
    careers: [
      "Design (visuell, Produkt oder Mode)",
      "Fotografie oder bildende Kunst",
      "Kulinarik",
      "Tiermedizin oder Tierpflege",
      "Landschafts- oder Umweltarbeit",
    ],
    relationships:
      "Du gehst mit stiller Loyalität und einem starken persönlichen Gefühl für das Richtige voran, auch wenn du nicht laut dafür argumentierst. Am besten passt ein Partner, der dich nicht drängt, Emotionen nach seinem Zeitplan zu zeigen, und schätzt, was du zeigst, mehr als was du sagst.",
  },
  ESTP: {
    name: "Der Draufgänger",
    tagline: "Kühn · Energiegeladen · Pragmatisch",
    description:
      "ESTPs sind für den gegenwärtigen Moment gemacht. Du erfasst eine Situation live und schnell, handelst ohne viel Grübeln und lernst lieber durch Tun als durch minutiöse Vorausplanung.",
    strengths: [
      "Erfasst einen Raum oder eine Situation schnell und reagiert in Echtzeit",
      "Handelt entschlossen, statt in Analysen steckenzubleiben",
      "Bewältigt Druck und unerwartete Veränderungen mit Gelassenheit",
      "Bringt Energie und Schwung in eine festgefahrene Gruppe",
    ],
    challenges: [
      "Kann handeln, bevor langfristige Folgen vollständig abgewogen wurden",
      "Routine und detaillierte Planung können unnötig einengend wirken",
      "Direktheit unter Druck kann unverblümt wirken",
    ],
    careers: ["Vertrieb", "Notfallmedizin oder Rettungsdienst", "Unternehmertum", "Sportcoaching", "Immobilien"],
    relationships:
      "Du bringst Energie und Spontaneität in eine Beziehung ein und bist am besten, wenn du mit einem Partner im Moment lebst, statt die Zukunft übermäßig zu planen. Langfristige Verbindlichkeit kann einengend wirken, wenn sie als Einschränkung statt als eigene Art von Abenteuer dargestellt wird — Partner, die das so vermitteln, halten dich meist bei der Sache.",
  },
  ESFP: {
    name: "Der Entertainer",
    tagline: "Verspielt · Warmherzig · Spontan",
    description:
      "ESFPs bringen echte Wärme und Energie in jeden Raum. Du lebst voll im Moment, erfasst die Stimmung anderer sofort und hast das Talent, gewöhnliche Momente lebendiger und schöner zu machen.",
    strengths: [
      "Hebt die Energie und Stimmung der Menschen um dich herum",
      "Bemerkt die Gefühlslage anderer und reagiert in Echtzeit darauf",
      "Passt sich leicht an neue Menschen und sich ändernde Pläne an",
      "Bringt praktischen Enthusiasmus statt abstrakter Theorie ein",
    ],
    challenges: [
      "Kann Vorausplanung vermeiden, um im Moment zu bleiben",
      "Empfindlichkeit gegenüber Kritik kann die Umsetzung schwierigen Feedbacks beeinträchtigen",
      "Fokus kann bei längeren, weniger unmittelbar lohnenden Aufgaben abschweifen",
    ],
    careers: [
      "Darstellende Kunst oder Unterhaltung",
      "Veranstaltungsmoderation oder -produktion",
      "Vertrieb",
      "Hotel- und Reisegewerbe",
      "Unterrichten kleiner Kinder",
    ],
    relationships:
      "Du bringst Wärme und echtes Gespür für die Stimmung eines Partners im Moment ein. Die Beziehungen, die halten, sind die, in denen ein Partner dir auch hilft, etwas Struktur aufzubauen — denn dein Instinkt, im Jetzt zu bleiben, kann langfristige gemeinsame Planung zu einem Bereich machen, an dem ihr gemeinsam arbeiten müsst.",
  },
};
