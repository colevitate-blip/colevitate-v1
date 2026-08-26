import type { MbtiTypeTranslation } from "./types";

export const BIGFIVE_TRANSLATION_ES: Record<string, MbtiTypeTranslation> = {
  "openness-high": {
    name: "Alta apertura — El Explorador",
    tagline: "Apertura · Puntuación alta",
    description: "Te atraen las ideas nuevas, el arte y el pensamiento abstracto por encima de la rutina y la convención.",
    strengths: ["Aportas perspectivas frescas y poco convencionales a problemas que todos los demás ven igual."],
    challenges: ["Puede perseguir la siguiente idea interesante antes de terminar la actual."],
    careers: ["Roles de I+D o innovación", "Diseño o artes", "Estrategia o prospectiva", "Investigación científica", "Emprendimiento en un espacio novedoso"],
    relationships:
      "Quieres una relación que siga creciendo y explorando, no una que se asiente en una rutina fija, y te atraen las parejas que puedan acompañarte en esa curiosidad. La fricción suele aparecer con una pareja más orientada a la rutina que interpreta tu inquietud como insatisfacción en vez de simplemente tu forma de ser.",
  },
  "openness-low": {
    name: "Baja apertura — El Realista",
    tagline: "Apertura · Puntuación baja",
    description: "Prefieres lo práctico y lo probado por encima de lo abstracto y lo no probado.",
    strengths: ["Te mantienes anclado a lo concreto y demostrablemente fiable."],
    challenges: ["Puede descartar una idea poco convencional antes de considerarla de verdad."],
    careers: ["Gestión de operaciones o procesos", "Cumplimiento normativo o auditoría", "Oficios técnicos", "Contabilidad", "Control de calidad"],
    relationships:
      "Valoras una relación construida sobre la constancia y la confianza probada más que sobre la novedad constante, y no buscas una pareja que reinvente la relación regularmente. Esa cualidad arraigada puede ser un verdadero ancla para una pareja, siempre que sigas abierto a su necesidad ocasional de algo nuevo.",
  },
  "conscientiousness-high": {
    name: "Alta responsabilidad — El Organizador",
    tagline: "Responsabilidad · Puntuación alta",
    description: "Planificas con antelación, cumples lo que empiezas y te exiges un estándar alto.",
    strengths: ["La gente puede contar contigo para cumplir lo que dijiste que harías."],
    challenges: ["Los estándares pueden convertirse en perfeccionismo que ralentiza las cosas."],
    careers: ["Gestión de proyectos", "Finanzas o contabilidad", "Derecho", "Ingeniería", "Cirugía u otros roles médicos donde la precisión es crítica"],
    relationships:
      "Demuestras cariño a través de la fiabilidad y el cumplimiento, y esperas un nivel similar de compromiso a cambio. Las parejas que puedan estar a la altura de tus estándares — o que al menos comuniquen con claridad cuando no puedan — suelen evitar la frustración que aparece cuando sientes que eres el único sosteniendo las cosas.",
  },
  "conscientiousness-low": {
    name: "Baja responsabilidad — El Improvisador",
    tagline: "Responsabilidad · Puntuación baja",
    description: "Prefieres mantenerte flexible y adaptarte en el momento antes que planificar en detalle.",
    strengths: ["Te adaptas rápido cuando cambian los planes y rara vez te sientes encasillado."],
    challenges: ["Los plazos y el seguimiento rutinario pueden fallar sin más estructura."],
    careers: ["Roles creativos o improvisados", "Startups en etapa temprana", "Trabajo de crisis o primera respuesta", "Producción de eventos en vivo", "Trabajo freelance o por proyectos"],
    relationships:
      "Mantienes una relación con un aire espontáneo y flexible en vez de sobreplanificada, algo que muchas parejas realmente valoran. El lugar donde hace falta un esfuerzo consciente es el seguimiento de compromisos compartidos — una pareja que ayude a aportar la estructura justa completa bien la relación.",
  },
  "extraversion-high": {
    name: "Alta extraversión — El Conector",
    tagline: "Extraversión · Puntuación alta",
    description: "Sacas energía de la gente y sueles pensar en voz alta cuando estás en grupo.",
    strengths: ["Generas impulso y calidez rápidamente en una sala."],
    challenges: ["Puede que necesites reservar conscientemente tiempo más tranquilo y de baja estimulación."],
    careers: ["Ventas", "Docencia o formación", "Relaciones públicas", "Presentación de eventos", "Gestión de personas"],
    relationships:
      "Sacas verdadera energía del tiempo y las actividades compartidas con una pareja, y procesas en voz alta gran parte de lo que sientes. Una pareja que se sienta cómoda con tu ritmo social — o que sea honesta cuando necesita tiempo más tranquilo — ayuda a mantener la relación equilibrada en vez de desigual.",
  },
  "extraversion-low": {
    name: "Baja extraversión — El Observador",
    tagline: "Extraversión · Puntuación baja",
    description: "Te recargas en entornos más tranquilos y prefieres la profundidad a la amplitud en las conversaciones.",
    strengths: ["Aportas atención calmada y concentrada en conversaciones cara a cara."],
    challenges: ["Puede que te pasen por alto en entornos grupales ruidosos si no te esfuerzas por hacerte notar."],
    careers: ["Investigación", "Escritura o edición", "Ingeniería de software", "Análisis de datos", "Trabajo enfocado uno a uno, como terapia o tutorías"],
    relationships:
      "Prefieres la profundidad por encima de la actividad constante, y es probable que muestres cariño en tiempo tranquilo y concentrado más que en grandes gestos sociales. Las parejas que no confundan esa preferencia con desinterés, y que respeten tu necesidad de recargarte a solas, suelen encajar mejor.",
  },
  "agreeableness-high": {
    name: "Alta amabilidad — El Colaborador",
    tagline: "Amabilidad · Puntuación alta",
    description: "Priorizas la armonía y disfrutas de verdad ayudando a la gente a tu alrededor.",
    strengths: ["Generas confianza y cooperación con la gente rápida y sinceramente."],
    challenges: ["Puede evitar el conflicto necesario para mantener la paz."],
    careers: ["Terapia o asesoramiento", "Enfermería", "Docencia", "Recursos humanos", "Trabajo social o sin fines de lucro"],
    relationships:
      "Priorizas la comodidad de tu pareja y la armonía de la relación, a menudo de forma instintiva. El verdadero riesgo es evitar el conflicto — dejar un problema real sin abordar para mantener la paz —, así que las relaciones en las que una pareja invita activamente tu opinión sincera suelen sentarte mejor a largo plazo.",
  },
  "agreeableness-low": {
    name: "Baja amabilidad — El Retador",
    tagline: "Amabilidad · Puntuación baja",
    description: "Te sientes cómodo priorizando tu propio juicio sobre el consenso del grupo.",
    strengths: ["Dices lo honesto y a veces incómodo que evita que un grupo se engañe a sí mismo."],
    challenges: ["La franqueza puede sentirse brusca cuando la calidez habría funcionado mejor."],
    careers: ["Litigios", "Auditoría o aplicación de cumplimiento normativo", "Roles de crítica (editor, crítico)", "Inversión o capital de riesgo", "Emprendimiento que exige decisiones difíciles"],
    relationships:
      "Estás dispuesto a decir lo honesto, a veces incómodo, en vez de mantener la paz a toda costa, algo que las parejas que valoran la franqueza suelen apreciar. El ajuste que vale la pena hacer es la forma de decirlo — el mismo mensaje honesto suele caer mejor con un poco más de calidez.",
  },
  "neuroticism-high": {
    name: "Alta sensibilidad emocional — El Sensible",
    tagline: "Sensibilidad emocional · Puntuación alta",
    description: "Sientes las emociones con intensidad y te mantienes alerta a lo que podría salir mal.",
    strengths: ["Tu vigilancia detecta riesgos que la gente más relajada pasa completamente por alto."],
    challenges: ["La preocupación puede gastar energía en cosas que nunca llegan a suceder."],
    careers: ["Gestión de riesgos", "Seguridad o cumplimiento normativo", "Control de calidad", "Análisis de seguridad", "Asesoramiento (sensible a la angustia de otros)"],
    relationships:
      "Sientes intensamente los altibajos de una relación, y sueles ser el primero en notar que algo no va bien. Esa vigilancia también puede significar preocuparte por problemas que nunca se materializan — las parejas que te ayudan a distinguir preocupaciones reales de las ansiosas suelen ser una presencia estabilizadora.",
  },
  "neuroticism-low": {
    name: "Baja sensibilidad emocional — El Ancla",
    tagline: "Sensibilidad emocional · Puntuación baja",
    description: "Tiendes a mantenerte calmado y emocionalmente estable, incluso bajo presión real.",
    strengths: ["Te mantienes sereno en momentos que alterarían a la mayoría de la gente."],
    challenges: ["La baja urgencia puede hacer que se subestimen riesgos reales."],
    careers: ["Respuesta a emergencias", "Cirugía", "Aviación o pilotaje", "Gestión de crisis", "Negociación de alto riesgo"],
    relationships:
      "Aportas una actitud estable y equilibrada a una relación, especialmente durante el conflicto o el estrés, lo que puede ser una verdadera fuerza estabilizadora para una pareja más ansiosa. Lo que hay que vigilar es reaccionar poco ante algo que de verdad necesita atención — las señales de una pareja merecen tomarse en serio incluso cuando tú no sientes la urgencia.",
  },
};
