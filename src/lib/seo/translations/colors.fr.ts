import type { MbtiTypeTranslation } from "./types";

export const COLORS_TRANSLATION_FR: Record<string, MbtiTypeTranslation> = {
  red: {
    name: "Rouge — Le Fonceur",
    tagline: "Audacieux · Décidé · Orienté résultats",
    description:
      "Les Rouges sont motivés par l'action et les résultats. Vous prenez des décisions rapidement, surmontez les obstacles plutôt que de les contourner, et vous vous sentez le plus vivant en faisant avancer un objectif.",
    strengths: [
      "Prend des décisions rapides et sûres sous pression",
      "Fait avancer les projets et refuse de laisser l'élan retomber",
      "À l'aise pour prendre les commandes quand la situation l'exige",
      "Reste concentré sur les résultats plutôt que de se perdre dans le processus",
    ],
    challenges: [
      "Peut sembler brusque ou impatient face à des processus plus lents",
      "Peut passer outre un avis avant de l'avoir pleinement écouté",
      "Ralentir pour les détails peut sembler une perte de temps, même quand ce n'en est pas une",
    ],
    careers: ["Direction commerciale", "Entrepreneuriat", "Opérations ou direction générale", "Intervention d'urgence ou de crise", "Droit du contentieux"],
    relationships:
      "Vous apportez décision et élan à une relation, et préférez aborder un problème directement plutôt que de le laisser traîner. Les partenaires capables d'égaler votre franchise — ou au moins de ne pas en être déstabilisés — s'entendent généralement mieux avec vous que ceux qui ont besoin d'une approche plus douce.",
  },
  blue: {
    name: "Bleu — L'Analyste",
    tagline: "Précis · Réfléchi · Fiable",
    description:
      "Les Bleus sont motivés par l'exactitude et la compréhension. Vous préférez prendre le temps de bien faire les choses plutôt que de vous précipiter vers une réponse superficielle, et les gens font confiance à votre jugement parce qu'il est mûrement réfléchi.",
    strengths: [
      "Repère les erreurs et lacunes que les personnes plus rapides manquent",
      "Apporte un jugement prudent et bien raisonné aux décisions",
      "Livre un travail constamment fiable et de haute qualité",
      "Reste calme et objectif quand les autres réagissent avec émotion",
    ],
    challenges: [
      "Peut trop analyser et retarder une décision au-delà du point utile",
      "Peut sembler réservé ou difficile à cerner émotionnellement",
      "Des standards personnels élevés peuvent être appliqués trop rigidement aux autres",
    ],
    careers: ["Ingénierie", "Comptabilité ou analyse financière", "Recherche scientifique", "Analyse de données", "Assurance qualité"],
    relationships:
      "Vous montrez votre affection par la fiabilité et une attention réfléchie plutôt que par des démonstrations ouvertes d'émotion, et vous prenez au sérieux les engagements une fois pris. Un partenaire qui ne confond pas votre réserve avec du désintérêt, et qui vous laisse du temps pour traiter avant de répondre, vous convient généralement bien.",
  },
  green: {
    name: "Vert — Le Soutien",
    tagline: "Chaleureux · Patient · Constant",
    description:
      "Les Verts sont motivés par la connexion et la stabilité. Vous êtes la présence calme et fiable dont une équipe ou une relation a besoin, et vous vous souciez sincèrement de l'effet de vos décisions sur les personnes autour de vous.",
    strengths: [
      "Construit confiance et loyauté par une attention constante et sincère",
      "Maintient les groupes calmes et coopératifs dans les moments tendus",
      "Écoute bien et fait en sorte que les gens se sentent vraiment entendus",
      "Offre un soutien constant sur lequel les autres peuvent compter",
    ],
    challenges: [
      "Éviter le conflit peut laisser de vrais problèmes non résolus trop longtemps",
      "Peut faire passer les besoins des autres avant les siens trop souvent",
      "Peut résister au changement même quand il aiderait clairement",
    ],
    careers: ["Thérapie ou accompagnement", "Soins infirmiers ou santé", "Ressources humaines", "Enseignement", "Travail social"],
    relationships:
      "Vous êtes sincèrement attentif aux besoins de votre partenaire et donnez la priorité à une relation stable et calme. Le risque est de laisser de vrais problèmes non résolus pour éviter le conflit — les relations où un partenaire vous encourage à exprimer ce qui vous préoccupe vraiment sont généralement les plus saines pour vous.",
  },
  yellow: {
    name: "Jaune — L'Inspirateur",
    tagline: "Énergique · Sociable · Optimiste",
    description:
      "Les Jaunes sont motivés par la possibilité et la connexion. Vous apportez de l'enthousiasme dans une pièce, donnez aux gens un bon sentiment sur ce qui les attend, et vous épanouissez dans la variété, la spontanéité et les nouvelles expériences.",
    strengths: [
      "Dynamise et motive les personnes autour de vous",
      "Établit rapidement et sincèrement une relation avec de nouvelles personnes",
      "Voit des possibilités enthousiasmantes que d'autres manquent sur le moment",
      "S'adapte facilement et maintient le moral élevé pendant le changement",
    ],
    challenges: [
      "Le suivi peut être en retard sur l'enthousiasme d'une nouvelle idée",
      "Peut perdre le focus dans les détails d'une tâche longue et peu gratifiante",
      "L'enthousiasme peut nécessiter d'être tempéré dans des moments plus sérieux",
    ],
    careers: ["Marketing ou stratégie de marque", "Vente (orientée relation)", "Organisation d'événements", "Relations publiques", "Hôtellerie"],
    relationships:
      "Vous apportez chaleur, spontanéité et enthousiasme sincère à une relation, et les expériences partagées vous dynamisent. Les partenaires qui aident à traduire cette énergie en un suivi constant — la routine n'étant pas naturellement votre point fort — complètent bien l'ensemble.",
  },
};
