import type { MbtiTypeTranslation } from "./types";

export const MBTI_TRANSLATION_FR: Record<string, MbtiTypeTranslation> = {
  INTJ: {
    name: "Le Stratège",
    tagline: "Indépendant · Visionnaire · Exigeant",
    description:
      "Les INTJ pensent en systèmes et sur le long terme. Vous vous forgez une vision indépendante et bien réfléchie de la direction que prennent les choses, et vous avez la discipline de travailler avec constance vers cet objectif, souvent des années avant tout le monde.",
    strengths: [
      "Repère le schéma structurel derrière des problèmes complexes qui dépassent les autres",
      "Se fixe des objectifs ambitieux à long terme et les poursuit avec une constance discrète",
      "Prend des décisions impopulaires lorsque la logique les justifie",
      "Affine constamment les idées plutôt que de se contenter d'une réponse suffisante",
    ],
    challenges: [
      "Peut paraître détaché quand les autres ont d'abord besoin de reconnaissance émotionnelle",
      "Peut écarter un avis qui n'arrive pas sous forme d'argument bien construit",
      "Le perfectionnisme peut retarder la livraison de quelque chose déjà suffisamment abouti",
    ],
    careers: [
      "Architecture de systèmes ou de produits",
      "Planification stratégique / conseil en gestion",
      "Recherche scientifique",
      "Stratégie d'investissement ou finance",
      "Ingénierie logicielle",
    ],
    relationships:
      "Vous montrez votre affection davantage par la compétence et la constance que par une affirmation permanente, et vous avez besoin d'une réelle indépendance au sein d'une relation pour rester engagé. Les partenaires qui respectent votre besoin de temps pour vous-même, et qui savent défendre leur point de vue dans une conversation directe, vous conviennent généralement le mieux.",
  },
  INTP: {
    name: "L'Analyste",
    tagline: "Curieux · Logique · Indépendant",
    description:
      "Les INTP sont animés par l'attrait d'un problème intéressant. Vous préférez comprendre en profondeur comment quelque chose fonctionne plutôt que d'avancer vite sur une lecture superficielle, et vous vous sentez le plus vivant en décortiquant une idée pour voir ce qui la tient ensemble.",
    strengths: [
      "Repère les incohérences logiques et les cas limites que d'autres manquent",
      "Génère des cadres originaux plutôt que de se rabattre sur la réponse évidente",
      "À l'aise pour dire 'je ne sais pas encore' plutôt que de feindre une certitude",
      "Apporte de la rigueur à des décisions que d'autres prennent au seul instinct",
    ],
    challenges: [
      "L'analyse peut tourner en boucle indéfiniment sans aboutir à une décision",
      "Le suivi des tâches routinières peut être en retard sur la qualité de vos idées",
      "Peut oublier de communiquer un raisonnement qui vous semble évident",
    ],
    careers: [
      "Recherche scientifique",
      "Développement logiciel ou d'algorithmes",
      "Analyse de systèmes",
      "Philosophie ou milieu universitaire théorique",
      "Rédaction technique",
    ],
    relationships:
      "Vous vous connectez plus facilement autour des idées, et vous pouvez devenir silencieux pendant de longues périodes lorsque vous êtes plongé dans la réflexion — ce n'est pas un signe de désintérêt, c'est simplement votre façon de traiter les choses. Un partenaire qui ne le prend pas personnellement et qui aime débattre d'une idée pour elle-même vous convient généralement bien.",
  },
  ENTJ: {
    name: "Le Commandant",
    tagline: "Décidé · Stratégique · Déterminé",
    description:
      "Les ENTJ transforment l'ambiguïté en plan d'action. Vous voyez naturellement le chemin le plus efficace entre la situation actuelle et l'objectif à atteindre, et vous mobilisez personnes et ressources pour y parvenir sans trop d'hésitation.",
    strengths: [
      "Prend des décisions claires rapidement, même avec des informations incomplètes",
      "Organise les personnes et les ressources autour d'un objectif commun et ambitieux",
      "Donne un retour direct qui fait avancer les projets",
      "Traite les revers comme des données, pas comme des raisons de ralentir",
    ],
    challenges: [
      "Peut passer outre des voix plus discrètes avant d'avoir entendu tout leur avis",
      "L'impatience face au processus peut nuire à l'adhésion de l'équipe",
      "Peut sous-estimer le coût émotionnel d'une décision purement efficace",
    ],
    careers: [
      "Direction générale / leadership exécutif",
      "Conseil en gestion",
      "Direction des opérations ou redressement d'entreprise",
      "Droit (contentieux ou stratégie d'entreprise)",
      "Entrepreneuriat",
    ],
    relationships:
      "Vous apportez à vos relations la même détermination qu'à votre travail — vous voulez un partenaire capable de suivre votre rythme et de vous contredire en cas de désaccord. Une vraie proximité demande un effort conscient, car votre instinct est de résoudre les problèmes plutôt que de simplement rester avec un ressenti.",
  },
  ENTP: {
    name: "L'Innovateur",
    tagline: "Inventif · Vif d'esprit · Contrariant",
    description:
      "Les ENTP pensent à voix haute en argumentant — avec les autres et avec eux-mêmes. Vous êtes stimulé par les possibilités, prompt à repérer la faille d'un plan et tout aussi prompt à en proposer trois meilleurs sur-le-champ.",
    strengths: [
      "Génère un large éventail d'options nouvelles plutôt que de s'ancrer sur la première idée",
      "Débat des idées avec rigueur sans prendre le désaccord personnellement",
      "S'adapte rapidement quand les circonstances changent en cours de route",
      "Dynamise une pièce et remet en question les hypothèses figées",
    ],
    challenges: [
      "Peut démarrer plus de projets qu'il n'en termine",
      "Jouer trop souvent l'avocat du diable peut sembler contrariant pour le principe",
      "L'exécution routinière peut sembler pesante une fois la nouveauté résolue",
    ],
    careers: [
      "Stratégie produit / rôles d'innovation",
      "Entrepreneuriat",
      "Investissement en capital-risque",
      "Droit à forte dimension argumentative (contentieux, politiques publiques)",
      "Stratégie créative ou publicitaire",
    ],
    relationships:
      "Vous gardez vos relations intéressantes en questionnant les certitudes, y compris celles de votre partenaire, qui doit pouvoir y voir un plaisir plutôt qu'une attaque. Vous vous entendez le mieux avec quelqu'un qui apprécie un bon débat autant que vous et qui n'a pas besoin d'une réassurance constante derrière la plaisanterie.",
  },
  INFJ: {
    name: "Le Défenseur",
    tagline: "Perspicace · Intègre · Discrètement intense",
    description:
      "Les INFJ combinent une boussole intérieure forte et une réelle sensibilité aux autres. Vous avez tendance à percevoir le sens d'une situation avant les autres, et il vous importe de bien faire les choses — pour les personnes concernées, pas seulement pour le résultat.",
    strengths: [
      "Perçoit les dynamiques sous-jacentes et les besoins non exprimés dans une pièce",
      "Tient à des valeurs fermes et mûrement réfléchies sans avoir besoin de les afficher",
      "Construit des relations profondes fondées sur la confiance plutôt que de nombreuses relations superficielles",
      "Relie une décision concrète à sa signification ou à son but plus large",
    ],
    challenges: [
      "Peut absorber le poids émotionnel des autres jusqu'à ce qu'il devienne le sien",
      "L'idéalisme peut se transformer en déception quand la réalité ne suit pas",
      "A tendance à se retirer plutôt qu'à affronter un conflit directement",
    ],
    careers: [
      "Thérapie ou psychologie",
      "Écriture ou travail éditorial",
      "Direction associative ou à vocation sociale",
      "Recherche UX",
      "Conception pédagogique",
    ],
    relationships:
      "Vous nouez peu de relations, mais celles que vous nouez sont profondes — vous cherchez une réelle compréhension, pas seulement de la compagnie. Vous pouvez porter le poids émotionnel d'un partenaire au-delà du soutenable, donc une relation réciproque vous convient généralement mieux sur la durée.",
  },
  INFP: {
    name: "L'Idéaliste",
    tagline: "Empathique · Authentique · Imaginatif",
    description:
      "Les INFP se guident par un sens intérieur clair de ce qui est juste et porteur de sens. Vous vous souciez moins de l'apparence extérieure des choses que de leur fidélité à vos valeurs, ce qui donne à votre travail une authenticité discrète.",
    strengths: [
      "Apporte une empathie sincère qui fait que les gens se sentent vraiment écoutés",
      "Reste ancré à ses valeurs personnelles sous la pression sociale ou commerciale",
      "Perçoit des angles créatifs et fondés sur des valeurs que d'autres négligent",
      "Défend les personnes qui seraient autrement réduites au silence",
    ],
    challenges: [
      "Peut prendre la critique d'une idée comme une critique de soi-même",
      "L'évitement du conflit peut laisser de petits problèmes se transformer en ressentiment",
      "Des attentes idéalisées peuvent rendre la réalité ordinaire décevante",
    ],
    careers: [
      "Écriture créative ou stratégie de contenu",
      "Thérapie ou travail social",
      "Plaidoyer associatif",
      "Design UX ou graphique",
      "Édition",
    ],
    relationships:
      "Vous avez besoin d'une relation qui semble honnête et alignée avec vos valeurs plus que simplement confortable ou conventionnelle. Vous pouvez idéaliser un partenaire au départ — les personnes qui vous conviennent le mieux sont celles qui vous laissent les voir entièrement, pas seulement les aspects qui correspondent à l'image que vous vous étiez faite.",
  },
  ENFJ: {
    name: "Le Mentor",
    tagline: "Chaleureux · Persuasif · Centré sur les autres",
    description:
      "Les ENFJ lisent une pièce et savent instinctivement comment faire ressortir le meilleur des personnes qui s'y trouvent. Vous êtes motivé par la croissance des autres, et vous avez un don naturel pour formuler une vision commune qui fait avancer les gens ensemble.",
    strengths: [
      "Repère les forces individuelles et aide activement les gens à s'y développer",
      "Communique une vision d'une manière qui rallie vraiment les gens",
      "Instaure rapidement la confiance avec des personnes très différentes",
      "Transforme les tensions d'un groupe en conversation constructive",
    ],
    challenges: [
      "Peut trop s'engager pour les besoins des autres au détriment des siens",
      "Le désir d'harmonie peut retarder une conversation difficile mais nécessaire",
      "Peut prendre un accueil froid personnellement plutôt que comme un retour neutre",
    ],
    careers: [
      "Enseignement ou formation",
      "Ressources humaines / développement des personnes",
      "Direction associative ou communautaire",
      "Coaching",
      "Relations publiques",
    ],
    relationships:
      "Vous remarquez ce dont un partenaire a besoin, parfois avant qu'il ne le dise — c'est un don, mais cela peut basculer vers un don de soi excessif s'il n'est pas réciproque. Les relations où vos propres besoins occupent autant de place tiennent généralement mieux dans la durée.",
  },
  ENFP: {
    name: "Le Catalyseur",
    tagline: "Enthousiaste · Imaginatif · Chaleureux",
    description:
      "Les ENFP apportent une curiosité sincère et de la chaleur à presque tout. Vous reliez des idées et des personnes qui ne se croiseraient normalement pas, et votre enthousiasme a le don de rendre les autres plus enthousiastes à propos de leur propre vie aussi.",
    strengths: [
      "Apporte de l'énergie et des possibilités à des conversations ou projets bloqués",
      "Forme rapidement des connexions authentiques avec un large éventail de personnes",
      "Voit des liens non évidents entre idées, personnes et opportunités",
      "Adapte les plans à la volée sans perdre son enthousiasme",
    ],
    challenges: [
      "Le suivi peut être en retard sur l'enthousiasme suscité par une idée nouvelle",
      "Peut se surinvestir socialement et avoir besoin de plus de temps de récupération que prévu",
      "La structure et la routine peuvent sembler contraignantes même quand elles aideraient",
    ],
    careers: [
      "Marketing ou stratégie de marque",
      "Entrepreneuriat",
      "Journalisme",
      "Programmation d'événements ou de communauté",
      "Direction créative",
    ],
    relationships:
      "Vous apportez une chaleur sincère et de la curiosité pour le monde intérieur de votre partenaire, et vous voulez une relation qui continue d'évoluer plutôt que de s'installer dans la routine. Un partenaire qui apporte un peu de stabilité aux côtés de votre enthousiasme aide à ce que le suivi soit à la hauteur de l'énergie.",
  },
  ISTJ: {
    name: "Le Gardien",
    tagline: "Fiable · Méthodique · Ancré",
    description:
      "Les ISTJ sont les personnes autour desquelles les autres construisent leurs plans, parce que vous faites réellement ce que vous dites. Vous faites confiance aux méthodes éprouvées, gardez la trace de détails qui échappent aux autres, et êtes fier d'aller vraiment jusqu'au bout.",
    strengths: [
      "Tient ses engagements de façon constante, même les moins gratifiants",
      "Repère les détails pratiques et les risques avant qu'ils ne deviennent des problèmes",
      "Apporte un jugement calme et posé sous pression",
      "Respecte le processus et les précédents plutôt que de réinventer la roue à chaque fois",
    ],
    challenges: [
      "Peut résister à une nouvelle approche meilleure simplement parce qu'elle est inconnue",
      "Peut minimiser ses propres besoins au profit du plan ou de l'équipe",
      "Des standards rigides peuvent sembler inflexibles aux personnes plus spontanées",
    ],
    careers: [
      "Comptabilité ou audit",
      "Gestion des opérations",
      "Gestion de projet",
      "Droit (conformité, contrats)",
      "Ingénierie",
    ],
    relationships:
      "Vous montrez votre engagement par la constance et la fiabilité plutôt que par de grands gestes, et vous prenez au sérieux les promesses faites. Un partenaire qui valorise cette stabilité et communique clairement les changements, plutôt que d'attendre que vous vous adaptiez simplement, vous convient généralement.",
  },
  ISFJ: {
    name: "Le Protecteur",
    tagline: "Dévoué · Attentionné · Constant",
    description:
      "Les ISFJ remarquent discrètement ce dont les gens autour d'eux ont besoin et agissent en conséquence sans qu'on le leur demande. Vous assumez une réelle responsabilité envers les personnes et les engagements de votre vie, et vous montrez votre attention par un soutien constant et concret.",
    strengths: [
      "Se souvient des détails précis qui font que les gens se sentent vraiment pris en considération",
      "Tient ses engagements discrètement et de façon fiable, sans besoin de reconnaissance",
      "Crée un environnement stable et calme sur lequel les autres peuvent s'appuyer",
      "Équilibre la tradition avec une réelle sensibilité aux besoins individuels",
    ],
    challenges: [
      "Peut se donner excessivement jusqu'à négliger ses propres besoins",
      "L'inconfort face au conflit peut laisser des problèmes non résolus trop longtemps",
      "Le changement peut sembler plus menaçant qu'il ne devrait l'être",
    ],
    careers: [
      "Soins infirmiers ou soutien de santé",
      "Administration ou gestion de bureau",
      "Enseignement primaire",
      "Ressources humaines ou gestion des avantages sociaux",
      "Travail social",
    ],
    relationships:
      "Vous exprimez votre attention par des gestes discrets et concrets, et vous remarquez souvent ce dont un partenaire a besoin avant qu'il ne le demande. Le risque est de trop vous donner jusqu'à négliger vos propres besoins — les relations où un partenaire s'enquiert activement de vos besoins vous conviennent le mieux.",
  },
  ESTJ: {
    name: "Le Directeur",
    tagline: "Organisé · Affirmé · Pragmatique",
    description:
      "Les ESTJ transforment les plans en actions concrètes. Vous apportez une structure claire à des situations ambiguës, tenez les gens responsables de ce qui a été convenu, et avez peu de patience pour un processus qui ne fait pas visiblement avancer les choses.",
    strengths: [
      "Organise personnes et échéances en un plan réalisable et exécutable",
      "Maintient un standard clair et cohérent et l'applique équitablement",
      "Prend des décisions efficacement et assume le résultat",
      "Coupe court à l'ambiguïté pour faire avancer les choses",
    ],
    challenges: [
      "Peut sous-estimer un avis qui n'arrive pas avec une justification claire",
      "La franchise peut heurter plus durement que prévu",
      "L'attachement à 'la bonne façon de faire' peut évincer une idée nouvelle réellement meilleure",
    ],
    careers: [
      "Gestion des opérations ou d'usine",
      "Gestion de projet ou de programme",
      "Direction dans les forces de l'ordre ou l'armée",
      "Direction commerciale",
      "Logistique",
    ],
    relationships:
      "Vous apportez structure et fiabilité à une relation, et attendez un engagement équivalent en retour — des plans vagues ou des engagements peu clairs vous frustrent rapidement. Les partenaires capables d'être directs avec vous, plutôt que d'attendre que vous lisiez entre les lignes, s'entendent généralement le mieux avec vous.",
  },
  ESFJ: {
    name: "L'Hôte",
    tagline: "Sociable · Bienveillant · Organisé",
    description:
      "Les ESFJ font tourner les groupes sans accroc — socialement et concrètement. Vous remarquez qui se sent inclus et qui ne l'est pas, et vous faites de réels efforts pour que les gens autour de vous se sentent soutenus et que les projets se concrétisent vraiment.",
    strengths: [
      "Construit rapidement des relations chaleureuses et coopératives au sein d'un groupe",
      "Organise les personnes et la logistique pour que tout se déroule sans accroc",
      "Remarque quand quelqu'un est laissé de côté et l'inclut",
      "Tient ses engagements envers les personnes qui comptent pour lui",
    ],
    challenges: [
      "Peut trop lier son estime de soi à l'approbation des autres",
      "La recherche d'harmonie peut signifier éviter un désaccord nécessaire",
      "Peut prendre une réaction neutre ou directe plus personnellement que voulu",
    ],
    careers: [
      "Organisation d'événements",
      "Coordination des soins de santé",
      "Ressources humaines",
      "Gestion hôtelière",
      "Relations communautaires ou clientèle",
    ],
    relationships:
      "Vous investissez un réel effort pour qu'une relation (et les personnes autour) se sentent soutenues et incluses, et vous remarquez quand cet effort n'est pas réciproque. Un partenaire à l'aise avec votre orientation sociale, qui ne confond pas votre recherche d'harmonie avec une absence d'opinions propres, vous convient bien.",
  },
  ISTP: {
    name: "L'Artisan",
    tagline: "Pragmatique · Indépendant · Calme",
    description:
      "Les ISTP apprennent mieux en démontant les choses — littéralement ou conceptuellement. Vous restez calme quand quelque chose casse, résolvez les problèmes avec une logique pratique, et valorisez une compétence réelle plutôt que d'en parler.",
    strengths: [
      "Résout les problèmes concrets efficacement, sans agitation inutile",
      "Reste posé et lucide en situation de crise",
      "S'adapte rapidement quand un plan cesse de fonctionner en cours d'exécution",
      "Préfère la compétence démontrée aux qualifications ou aux discours",
    ],
    challenges: [
      "Peut se désengager de situations qui semblent trop émotionnelles ou abstraites",
      "Peut éviter de s'engager dans des plans à long terme qui limitent sa flexibilité",
      "La concision peut être perçue comme du désintérêt même en étant pleinement investi",
    ],
    careers: [
      "Métiers techniques (électricité, mécanique)",
      "Ingénierie (surtout des rôles pratiques ou de terrain)",
      "Intervention d'urgence (ambulancier, pompier)",
      "Informatique ou dépannage de systèmes",
      "Pilotage ou conduite de véhicules",
    ],
    relationships:
      "Vous montrez votre attention par l'action plutôt que par les mots, ce qui peut sembler distant pour un partenaire qui a besoin de plus de réassurance verbale. Les relations où un partenaire vous laisse un réel espace, et ne prend pas votre besoin d'indépendance personnellement, fonctionnent généralement le mieux.",
  },
  ISFP: {
    name: "L'Artiste",
    tagline: "Doux · Esthétique · Indépendant",
    description:
      "Les ISFP vivent le monde à travers les sens et un ensemble de valeurs personnelles et discrètes. Vous préférez montrer ce que vous voulez dire plutôt que l'expliquer, et vous résistez à être enfermé dans un rôle qui ne reflète pas qui vous êtes vraiment.",
    strengths: [
      "Apporte une réelle sensibilité esthétique et sensorielle à son travail",
      "S'adapte avec fluidité et reste présent dans l'instant",
      "Agit selon des valeurs personnelles sans avoir besoin de les justifier publiquement",
      "Offre un soutien discret et sans jugement aux personnes qui l'entourent",
    ],
    challenges: [
      "L'évitement du conflit peut laisser de réels désaccords non exprimés",
      "Peut avoir du mal à planifier suffisamment à l'avance pour des objectifs à long terme",
      "La sensibilité à la critique peut durer plus longtemps que le moment où elle a été formulée",
    ],
    careers: [
      "Design (visuel, produit ou mode)",
      "Photographie ou arts visuels",
      "Métiers de la cuisine",
      "Vétérinaire ou soin animalier",
      "Travail paysager ou environnemental",
    ],
    relationships:
      "Vous avancez avec une loyauté discrète et un sens personnel fort de ce qui est juste, même sans le défendre à voix haute. Vous vous entendez le mieux avec un partenaire qui ne vous pousse pas à montrer vos émotions selon son propre calendrier, et qui valorise ce que vous montrez plus que ce que vous dites.",
  },
  ESTP: {
    name: "Le Fonceur",
    tagline: "Audacieux · Énergique · Pragmatique",
    description:
      "Les ESTP sont faits pour l'instant présent. Vous lisez une situation en direct rapidement, agissez sans trop réfléchir, et préférez apprendre en faisant plutôt qu'en planifiant chaque détail à l'avance.",
    strengths: [
      "Lit une pièce ou une situation rapidement et réagit en temps réel",
      "Agit avec détermination plutôt que de rester bloqué dans l'analyse",
      "Gère la pression et les changements inattendus avec calme",
      "Apporte énergie et élan à un groupe qui stagne",
    ],
    challenges: [
      "Peut agir avant d'avoir pleinement pesé les conséquences à long terme",
      "La routine et la planification détaillée peuvent sembler inutilement contraignantes",
      "La franchise sous pression peut paraître brusque",
    ],
    careers: ["Vente", "Médecine d'urgence ou secourisme", "Entrepreneuriat", "Coaching sportif", "Immobilier"],
    relationships:
      "Vous apportez énergie et spontanéité à une relation, et vous êtes à votre meilleur en vivant l'instant présent avec un partenaire plutôt qu'en planifiant excessivement l'avenir. Un engagement à long terme peut sembler contraignant s'il est présenté comme une limitation plutôt que comme sa propre forme d'aventure — les partenaires qui le présentent ainsi vous gardent généralement impliqué.",
  },
  ESFP: {
    name: "L'Amuseur",
    tagline: "Espiègle · Chaleureux · Spontané",
    description:
      "Les ESFP apportent une chaleur et une énergie sincères dans n'importe quelle pièce. Vous vivez intensément l'instant présent, percevez l'humeur des autres instantanément, et avez le don de rendre les moments ordinaires plus vivants et amusants.",
    strengths: [
      "Rehausse l'énergie et l'humeur des personnes autour de lui",
      "Remarque et répond en temps réel aux états émotionnels des autres",
      "S'adapte facilement à de nouvelles personnes et à des plans changeants",
      "Apporte un enthousiasme concret plutôt qu'une théorisation abstraite",
    ],
    challenges: [
      "Peut éviter de planifier à l'avance pour rester dans l'instant",
      "La sensibilité à la critique peut affecter le suivi d'un retour difficile",
      "L'attention peut se disperser sur des tâches longues et moins immédiatement gratifiantes",
    ],
    careers: [
      "Arts du spectacle ou divertissement",
      "Animation ou production d'événements",
      "Vente",
      "Hôtellerie ou tourisme",
      "Enseignement aux jeunes enfants",
    ],
    relationships:
      "Vous apportez de la chaleur et une attention sincère à l'humeur de votre partenaire dans l'instant. Les relations qui durent sont celles où un partenaire vous aide aussi à construire un peu de structure — car votre instinct à rester dans le présent peut faire de la planification commune à long terme un domaine sur lequel vous devez travailler ensemble.",
  },
};
