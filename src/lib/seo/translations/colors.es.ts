import type { MbtiTypeTranslation } from "./types";

export const COLORS_TRANSLATION_ES: Record<string, MbtiTypeTranslation> = {
  red: {
    name: "Rojo — El Impulsor",
    tagline: "Audaz · Decidido · Orientado a resultados",
    description:
      "Los rojos se motivan por la acción y los resultados. Tomas decisiones rápido, superas los obstáculos en vez de rodearlos, y te sientes más vivo cuando estás impulsando un objetivo hacia adelante.",
    strengths: [
      "Toma decisiones rápidas y seguras bajo presión",
      "Impulsa los proyectos hacia adelante y no deja que el impulso se detenga",
      "Se siente cómodo tomando el mando cuando la situación lo requiere",
      "Se mantiene centrado en los resultados en vez de perderse en el proceso",
    ],
    challenges: [
      "Puede parecer brusco o impaciente con procesos más lentos",
      "Puede pasar por encima de opiniones antes de escucharlas por completo",
      "Bajar el ritmo para atender detalles puede sentirse como tiempo perdido, aunque no lo sea",
    ],
    careers: ["Liderazgo de ventas", "Emprendimiento", "Operaciones o dirección general", "Respuesta a emergencias o crisis", "Derecho litigioso"],
    relationships:
      "Aportas decisión e impulso a una relación, y prefieres abordar un problema directamente antes que dejarlo pasar. Las parejas que puedan igualar tu franqueza — o al menos no se alteren por ella — suelen llevarse mejor contigo que las que necesitan un enfoque más suave.",
  },
  blue: {
    name: "Azul — El Analista",
    tagline: "Preciso · Reflexivo · Fiable",
    description:
      "Los azules se motivan por la exactitud y la comprensión. Prefieres tomarte el tiempo necesario para hacer algo bien antes que apresurarte a una respuesta superficial, y la gente confía en tu juicio porque está cuidadosamente pensado.",
    strengths: [
      "Detecta errores y vacíos que la gente más rápida pasa por alto",
      "Aporta un juicio cuidadoso y bien razonado a las decisiones",
      "Entrega un trabajo consistentemente fiable y de alta calidad",
      "Se mantiene calmado y objetivo cuando otros reaccionan emocionalmente",
    ],
    challenges: [
      "Puede sobreanalizar y retrasar una decisión más allá del punto útil",
      "Puede parecer reservado o difícil de leer emocionalmente",
      "Los altos estándares personales pueden aplicarse de forma demasiado rígida a otros",
    ],
    careers: ["Ingeniería", "Contabilidad o análisis financiero", "Investigación científica", "Análisis de datos", "Control de calidad"],
    relationships:
      "Muestras cariño a través de la fiabilidad y la atención reflexiva más que con muestras abiertas de emoción, y te tomas en serio los compromisos una vez adquiridos. Una pareja que no confunda tu reserva con desinterés, y que te dé tiempo para procesar antes de responder, suele encajar bien.",
  },
  green: {
    name: "Verde — El Apoyo",
    tagline: "Cálido · Paciente · Constante",
    description:
      "Los verdes se motivan por la conexión y la estabilidad. Eres la presencia calmada y fiable que un equipo o una relación necesita, y realmente te importa cómo tus decisiones afectan a las personas a tu alrededor.",
    strengths: [
      "Genera confianza y lealtad a través de un cuidado constante y genuino",
      "Mantiene a los grupos calmados y cooperativos en momentos tensos",
      "Escucha bien y hace que la gente se sienta realmente escuchada",
      "Ofrece un apoyo constante en el que otros pueden confiar",
    ],
    challenges: [
      "Evitar el conflicto puede dejar problemas reales sin resolver demasiado tiempo",
      "Puede anteponer las necesidades de otros a las propias con demasiada frecuencia",
      "Puede resistirse al cambio incluso cuando claramente ayudaría",
    ],
    careers: ["Terapia o asesoramiento", "Enfermería o salud", "Recursos humanos", "Docencia", "Trabajo social"],
    relationships:
      "Prestas verdadera atención a las necesidades de tu pareja y priorizas mantener la relación estable y tranquila. El riesgo está en dejar problemas reales sin resolver para evitar el conflicto — las relaciones en las que una pareja te anima a decir lo que realmente te preocupa suelen ser las más sanas para ti.",
  },
  yellow: {
    name: "Amarillo — El Inspirador",
    tagline: "Enérgico · Sociable · Optimista",
    description:
      "Los amarillos se motivan por las posibilidades y la conexión. Aportas entusiasmo a una sala, haces que la gente se sienta bien sobre lo que se avecina, y prosperas con la variedad, la espontaneidad y las nuevas experiencias.",
    strengths: [
      "Energiza y motiva a las personas a su alrededor",
      "Genera confianza con gente nueva rápida y genuinamente",
      "Ve posibilidades emocionantes que otros pasan por alto en el momento",
      "Se adapta con facilidad y mantiene el ánimo alto durante el cambio",
    ],
    challenges: [
      "El seguimiento puede quedar por detrás del entusiasmo de una idea nueva",
      "Puede perder el foco en los detalles de una tarea larga y poco glamurosa",
      "El entusiasmo puede necesitar moderarse para encajar en momentos más serios",
    ],
    careers: ["Marketing o estrategia de marca", "Ventas (orientadas a las relaciones)", "Planificación de eventos", "Relaciones públicas", "Hostelería"],
    relationships:
      "Aportas calidez, espontaneidad y entusiasmo genuino a una relación, y te energizan las experiencias compartidas. Las parejas que ayudan a traducir esa energía en un seguimiento constante — ya que la rutina no es precisamente tu punto fuerte — completan bien el conjunto.",
  },
};
