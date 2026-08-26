import type { MbtiTypeTranslation } from "./types";

export const BIGFIVE_TRANSLATION_FR: Record<string, MbtiTypeTranslation> = {
  "openness-high": {
    name: "Ouverture élevée — L'Explorateur",
    tagline: "Ouverture · Score élevé",
    description: "Vous êtes attiré par les idées nouvelles, l'art et la pensée abstraite plutôt que par la routine et la convention.",
    strengths: ["Vous apportez des angles nouveaux et non conventionnels à des problèmes que tout le monde voit de la même façon."],
    challenges: ["Peut courir après la prochaine idée intéressante avant de terminer la précédente."],
    careers: ["Rôles de R&D ou d'innovation", "Design ou arts", "Stratégie ou prospective", "Recherche scientifique", "Entrepreneuriat dans un domaine nouveau"],
    relationships:
      "Vous voulez une relation qui continue de grandir et d'explorer, pas une qui s'installe dans une routine fixe, et vous êtes attiré par des partenaires capables de partager cette curiosité. La friction apparaît généralement avec un partenaire plus routinier qui interprète votre agitation comme de l'insatisfaction plutôt que comme votre simple nature.",
  },
  "openness-low": {
    name: "Ouverture faible — Le Réaliste",
    tagline: "Ouverture · Score faible",
    description: "Vous privilégiez le pratique et l'éprouvé plutôt que l'abstrait et le non testé.",
    strengths: ["Vous restez ancré dans ce qui est concret et manifestement fiable."],
    challenges: ["Peut écarter une idée non conventionnelle avant de vraiment l'avoir considérée."],
    careers: ["Gestion des opérations ou des processus", "Conformité ou audit", "Métiers techniques", "Comptabilité", "Contrôle qualité"],
    relationships:
      "Vous valorisez une relation construite sur la constance et une confiance éprouvée plutôt que sur une nouveauté constante, et vous ne cherchez pas un partenaire qui réinvente régulièrement la relation. Cette qualité ancrée peut être un véritable point d'ancrage pour un partenaire, tant que vous restez ouvert à son besoin occasionnel de nouveauté.",
  },
  "conscientiousness-high": {
    name: "Conscienciosité élevée — L'Organisateur",
    tagline: "Conscienciosité · Score élevé",
    description: "Vous planifiez à l'avance, allez jusqu'au bout et vous tenez à un standard élevé.",
    strengths: ["Les gens peuvent compter sur vous pour livrer ce que vous avez dit que vous feriez."],
    challenges: ["Les standards peuvent basculer vers un perfectionnisme qui ralentit les choses."],
    careers: ["Gestion de projet", "Finance ou comptabilité", "Droit", "Ingénierie", "Chirurgie ou autres rôles médicaux où la précision est critique"],
    relationships:
      "Vous montrez votre affection par la fiabilité et le suivi, et vous attendez un niveau d'engagement similaire en retour. Les partenaires capables d'être à la hauteur de vos standards — ou qui communiquent au moins clairement quand ils ne peuvent pas — évitent généralement la frustration de vous sentir seul à tout tenir ensemble.",
  },
  "conscientiousness-low": {
    name: "Conscienciosité faible — L'Improvisateur",
    tagline: "Conscienciosité · Score faible",
    description: "Vous préférez rester flexible et vous adapter sur le moment plutôt que de planifier en détail.",
    strengths: ["Vous vous adaptez rapidement quand les plans changent et vous sentez rarement enfermé."],
    challenges: ["Les échéances et le suivi routinier peuvent glisser sans plus de structure."],
    careers: ["Rôles créatifs ou improvisés", "Startups en phase initiale", "Travail de crise ou de première intervention", "Production d'événements en direct", "Travail freelance ou basé sur des missions"],
    relationships:
      "Vous gardez une relation spontanée et flexible plutôt que trop planifiée, ce que de nombreux partenaires apprécient sincèrement. L'endroit qui demande un effort conscient est le suivi des engagements partagés — un partenaire qui aide à apporter juste assez de structure complète bien la relation.",
  },
  "extraversion-high": {
    name: "Extraversion élevée — Le Connecteur",
    tagline: "Extraversion · Score élevé",
    description: "Vous puisez votre énergie dans les autres et avez tendance à penser à voix haute en groupe.",
    strengths: ["Vous créez rapidement de l'élan et de la chaleur dans une pièce."],
    challenges: ["Vous pourriez avoir besoin de prévoir consciemment des moments plus calmes et peu stimulants."],
    careers: ["Vente", "Enseignement ou formation", "Relations publiques", "Animation d'événements", "Management d'équipe"],
    relationships:
      "Vous puisez une réelle énergie dans le temps et les activités partagés avec un partenaire, et vous exprimez beaucoup de ce que vous ressentez à voix haute. Un partenaire à l'aise avec votre rythme social — ou honnête quand il a besoin de calme — aide à garder la relation équilibrée plutôt qu'à sens unique.",
  },
  "extraversion-low": {
    name: "Extraversion faible — L'Observateur",
    tagline: "Extraversion · Score faible",
    description: "Vous vous ressourcez dans des environnements plus calmes et préférez la profondeur à l'étendue dans les conversations.",
    strengths: ["Vous apportez une attention calme et concentrée dans les conversations en tête-à-tête."],
    challenges: ["Vous pouvez être négligé dans des environnements de groupe bruyants si vous ne faites pas l'effort de vous faire entendre."],
    careers: ["Recherche", "Écriture ou édition", "Ingénierie logicielle", "Analyse de données", "Travail individuel concentré comme la thérapie ou le tutorat"],
    relationships:
      "Vous préférez la profondeur à l'activité constante, et vous êtes susceptible de montrer votre affection dans des moments plus calmes et concentrés en tête-à-tête plutôt que dans de grands gestes sociaux. Les partenaires qui ne confondent pas cette préférence avec du désintérêt, et qui respectent votre besoin de vous ressourcer seul, vous conviennent généralement le mieux.",
  },
  "agreeableness-high": {
    name: "Agréabilité élevée — Le Collaborateur",
    tagline: "Agréabilité · Score élevé",
    description: "Vous donnez la priorité à l'harmonie et aimez sincèrement aider les gens autour de vous.",
    strengths: ["Vous établissez rapidement et sincèrement confiance et coopération avec les gens."],
    challenges: ["Peut éviter un conflit nécessaire pour préserver la paix."],
    careers: ["Accompagnement thérapeutique", "Soins infirmiers", "Enseignement", "Ressources humaines", "Travail social ou associatif"],
    relationships:
      "Vous donnez la priorité au confort de votre partenaire et à l'harmonie de la relation, souvent instinctivement. Le vrai risque est l'évitement du conflit — laisser un problème réel non résolu pour préserver la paix — donc les relations où un partenaire vous invite activement à donner votre avis sincère vous conviennent généralement mieux sur la durée.",
  },
  "agreeableness-low": {
    name: "Agréabilité faible — Le Contestataire",
    tagline: "Agréabilité · Score faible",
    description: "Vous êtes à l'aise pour privilégier votre propre jugement plutôt que le consensus du groupe.",
    strengths: ["Vous dites la chose honnête, parfois inconfortable, qui empêche un groupe de se voiler la face."],
    challenges: ["La franchise peut sembler brusque là où la chaleur aurait mieux fonctionné."],
    careers: ["Contentieux", "Audit ou application de la conformité", "Rôles de critique (rédacteur, critique)", "Investissement ou capital-risque", "Entrepreneuriat exigeant des décisions difficiles"],
    relationships:
      "Vous êtes prêt à dire la chose honnête, parfois inconfortable, plutôt que de préserver la paix à tout prix, ce que les partenaires qui valorisent la franchise apprécient généralement. L'ajustement qui vaut la peine d'être fait concerne la façon de le dire — le même point honnête passe souvent mieux avec un peu plus de chaleur.",
  },
  "neuroticism-high": {
    name: "Sensibilité émotionnelle élevée — Le Sensible",
    tagline: "Sensibilité émotionnelle · Score élevé",
    description: "Vous ressentez les émotions intensément et restez à l'affût de ce qui pourrait mal tourner.",
    strengths: ["Votre vigilance repère des risques que des personnes plus détendues manquent complètement."],
    challenges: ["L'inquiétude peut dépenser de l'énergie sur des choses qui ne se produisent jamais."],
    careers: ["Gestion des risques", "Sécurité ou conformité", "Assurance qualité", "Analyse de sécurité", "Accompagnement (sensible à la détresse des autres)"],
    relationships:
      "Vous ressentez intensément les hauts et les bas d'une relation, et vous êtes souvent le premier à remarquer que quelque chose ne va pas. Cette vigilance peut aussi signifier s'inquiéter de problèmes qui ne se matérialisent jamais — les partenaires qui vous aident à distinguer les préoccupations réelles des anxieuses sont généralement une présence stabilisante.",
  },
  "neuroticism-low": {
    name: "Sensibilité émotionnelle faible — L'Ancre",
    tagline: "Sensibilité émotionnelle · Score faible",
    description: "Vous avez tendance à rester calme et émotionnellement stable, même sous une pression réelle.",
    strengths: ["Vous restez posé dans des moments qui déstabiliseraient la plupart des gens."],
    challenges: ["Une faible urgence peut faire sous-estimer des risques réels."],
    careers: ["Intervention d'urgence", "Chirurgie", "Aviation ou pilotage", "Gestion de crise", "Négociation à fort enjeu"],
    relationships:
      "Vous apportez une attitude stable et posée à une relation, particulièrement pendant les conflits ou le stress, ce qui peut être une véritable force stabilisante pour un partenaire plus anxieux. Ce qu'il faut surveiller, c'est de sous-réagir à quelque chose qui a réellement besoin d'attention — les signaux d'un partenaire méritent d'être pris au sérieux même quand vous ne ressentez pas l'urgence vous-même.",
  },
};
