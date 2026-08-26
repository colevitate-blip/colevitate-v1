import type { MbtiTypeTranslation } from "./types";

export const HD_TRANSLATION_FR: Record<string, MbtiTypeTranslation> = {
  generator: {
    name: "Le Générateur",
    tagline: "Stratégie : Répondre",
    description:
      "Les Générateurs portent une énergie stable et renouvelable. Vous êtes fait pour accomplir un travail que vous aimez vraiment sur de longues périodes, et vous trouvez votre voie non pas en poursuivant des plans, mais en répondant honnêtement à ce que la vie place devant vous.",
    strengths: [
      "Soutient un effort concentré bien plus longtemps que la plupart une fois véritablement engagé",
      "Apporte une énergie stable et ancrée sur laquelle les autres peuvent s'appuyer",
      "Maîtrise un métier par pure répétition satisfaisante",
      "Sait presque immédiatement si quelque chose est un véritable 'oui'",
    ],
    challenges: [
      "Rester dans un travail qui ne suscite pas un véritable 'oui' épuise vite l'énergie",
      "Peut dire 'oui' par habitude plutôt que par désir sincère",
      "La frustration grandit quand il faut initier plutôt que répondre",
    ],
    careers: [
      "Métiers techniques (électricien, menuisier, mécanicien)",
      "Travail culinaire ou artisanal",
      "Rôles spécialisés de longue durée",
      "Production ou fabrication",
      "Tout rôle auquel vous pouvez dire un véritable 'oui' et tenir dans la durée",
    ],
    relationships:
      "Vous vous engagez pleinement une fois qu'une chose est un véritable 'oui', et cette même honnêteté sert bien les relations — les partenaires qui vous laissent répondre à votre propre rythme, plutôt que de vous pousser à initier ou décider selon leur calendrier, obtiennent généralement le meilleur de votre énergie.",
  },
  "manifesting-generator": {
    name: "Le Multi-passionné",
    tagline: "Stratégie : Répondre, puis avancer",
    description:
      "Les Générateurs Manifestants combinent l'énergie durable d'un Générateur avec un rythme plus rapide et multi-pistes. Vous faites rarement une seule chose à la fois, et vous atteignez souvent votre destination par une voie efficace et peu évidente que d'autres n'emprunteraient pas.",
    strengths: [
      "Passe rapidement d'un projet à l'autre sans perdre l'élan global",
      "Trouve des raccourcis efficaces que les penseurs purement linéaires manquent",
      "Maîtrise plusieurs compétences apparemment sans rapport en parallèle",
      "Adapte les plans en cours de route sans perdre sa motivation",
    ],
    challenges: [
      "Sauter des étapes peut créer des lacunes qui apparaissent plus tard",
      "L'ennui s'installe vite une fois la nouveauté d'un projet estompée",
      "S'engager sur trop de fronts à la fois peut diluer le focus",
    ],
    careers: [
      "Entrepreneuriat / carrières multiples",
      "Conseil dans plusieurs domaines",
      "Rôles en startup couvrant plusieurs fonctions",
      "Direction créative",
      "Gestion de produit",
    ],
    relationships:
      "Vous vivez les relations comme vous vivez les projets — avec enthousiasme et une volonté de sauter les étapes 'attendues'. Les partenaires capables de suivre votre rythme, et qui ne lisent pas votre besoin de variété comme un manque d'engagement, vous conviennent le mieux.",
  },
  manifestor: {
    name: "L'Initiateur",
    tagline: "Stratégie : Informer, puis agir",
    description:
      "Les Manifesteurs sont faits pour initier. Vous n'avez besoin ni de permission ni d'une étincelle extérieure pour vous mettre en mouvement — vous générez votre propre élan, et les choses arrivent souvent parce que vous avez décidé qu'elles arriveraient.",
    strengths: [
      "Fait naître des choses de rien, sans avoir besoin de validation extérieure",
      "Agit avec détermination une fois sa propre clarté établie",
      "N'a pas peur de faire un premier pas impopulaire mais nécessaire",
      "Est naturellement indépendant dans sa façon de planifier et d'exécuter",
    ],
    challenges: [
      "Sauter l'étape 'informer' crée des frictions inutiles avec les autres",
      "La résistance à se faire dicter sa conduite peut sembler combative",
      "Les poussées d'activité intense nécessitent ensuite un vrai temps de récupération",
    ],
    careers: [
      "Fondateur ou chef d'entreprise",
      "Rôles de direction exécutive ou indépendante",
      "Travail indépendant / freelance",
      "Travail créatif avec un contrôle créatif total",
      "Pionnier d'une nouvelle équipe, d'un nouveau produit ou marché",
    ],
    relationships:
      "Vous avez besoin d'une réelle indépendance au sein d'une relation, et vous vous en sortez mieux avec un partenaire qui n'a pas besoin d'être consulté avant que vous agissiez — juste informé. La friction apparaît généralement quand cette étape 'informer' est sautée, pas quand vous prenez l'initiative.",
  },
  projector: {
    name: "Le Guide",
    tagline: "Stratégie : Attendre l'invitation",
    description:
      "Les Projecteurs sont faits pour voir les systèmes et les personnes clairement de l'extérieur, pas pour s'épuiser dans une production constante. Votre don est la perspicacité et l'orientation — cela fonctionne le mieux quand c'est vraiment invité plutôt que proposé spontanément.",
    strengths: [
      "Voit le chemin efficace à travers un système où d'autres sont bloqués",
      "Offre des conseils qui améliorent de façon fiable la façon dont les autres travaillent",
      "Lit les personnes et les dynamiques de groupe avec une réelle précision",
      "Se concentre profondément sans avoir besoin d'une activité extérieure constante",
    ],
    challenges: [
      "Les conseils non sollicités sont généralement mal reçus, aussi justes soient-ils",
      "L'énergie s'épuise plus vite que chez les types non-Projecteurs",
      "Attendre la reconnaissance peut sembler passif si ce n'est pas accompagné de visibilité",
    ],
    careers: [
      "Conseil",
      "Coaching ou mentorat",
      "Direction (une fois invité au rôle)",
      "Conception de systèmes ou de processus",
      "Curation, édition ou direction créative",
    ],
    relationships:
      "Vous offrez un réel aperçu des schémas et besoins de votre partenaire, mais cela fonctionne mieux quand c'est invité plutôt qu'offert spontanément. Les relations où un partenaire demande activement votre avis, plutôt que vous l'offrant sans qu'on vous le demande, se déroulent généralement plus facilement.",
  },
  reflector: {
    name: "Le Miroir",
    tagline: "Stratégie : Attendre un cycle lunaire",
    description:
      "Les Réflecteurs sont rares et profondément sensibles à leur environnement, absorbant et reflétant la santé des personnes et des espaces autour d'eux. Votre clarté vient avec le temps et le bon environnement, pas sous la pression du moment.",
    strengths: [
      "Offre une lecture inhabituellement honnête de la santé d'un groupe ou d'un environnement",
      "S'adapte et intègre des perspectives vraiment différentes avec aisance",
      "Remarque ce qui se passe vraiment sous une surface qui semble intacte",
      "Apporte une objectivité rare et à grand angle à des situations où d'autres sont impliqués",
    ],
    challenges: [
      "Les décisions prises dans l'urgence sous pression tiennent rarement par la suite",
      "L'environnement affecte l'humeur et l'énergie plus que la plupart ne le réalisent",
      "Peut absorber l'état émotionnel des autres comme s'il était le sien",
    ],
    careers: [
      "Rôles de conseil ou d'évaluation de la santé de groupes/organisations",
      "Organisation communautaire",
      "Travail indépendant ou à horaires flexibles",
      "Évaluation de culture ou d'environnement",
      "Rôles valorisant la perspective extérieure plutôt que la production quotidienne",
    ],
    relationships:
      "Vous êtes inhabituellement sensible à la santé globale d'une relation et à l'état émotionnel de votre partenaire, parfois plus qu'au vôtre. Les grandes décisions relationnelles bénéficient d'un temps réel plutôt que d'un engagement précipité, et les partenaires qui respectent ce rythme vous conviennent généralement le mieux.",
  },
};
