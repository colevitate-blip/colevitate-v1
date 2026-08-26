import type { MbtiTypeTranslation } from "./types";

export const MBTI_TRANSLATION_ES: Record<string, MbtiTypeTranslation> = {
  INTJ: {
    name: "El Estratega",
    tagline: "Independiente · Visionario · Exigente",
    description:
      "Los INTJ piensan en sistemas y a largo plazo. Te formas una visión independiente y bien razonada de hacia dónde van las cosas, y tienes la disciplina para trabajar constantemente hacia ella, a menudo años antes que los demás.",
    strengths: [
      "Detecta el patrón estructural detrás de problemas complejos que abruman a otros",
      "Se marca metas ambiciosas a largo plazo y las persigue con constancia silenciosa",
      "Toma decisiones impopulares cuando la lógica las respalda",
      "Refina las ideas constantemente en vez de conformarse con una respuesta suficientemente buena",
    ],
    challenges: [
      "Puede parecer distante cuando otros necesitan primero reconocimiento emocional",
      "Puede descartar aportes que no llegan como un argumento bien formado",
      "El perfeccionismo puede retrasar la entrega de algo que ya era suficientemente bueno",
    ],
    careers: [
      "Arquitectura de sistemas o de producto",
      "Planificación estratégica / consultoría de gestión",
      "Investigación científica",
      "Estrategia de inversión o finanzas",
      "Ingeniería de software",
    ],
    relationships:
      "Demuestras cariño más a través de la competencia y el cumplimiento que de la afirmación constante, y necesitas verdadera independencia dentro de una relación para seguir comprometido. Las parejas que respetan tu necesidad de tiempo a solas y que pueden sostener su postura en una conversación directa suelen encajar mejor.",
  },
  INTP: {
    name: "El Analista",
    tagline: "Curioso · Lógico · Independiente",
    description:
      "A los INTP los mueve el atractivo de un problema interesante. Prefieres entender a fondo cómo funciona algo antes que avanzar rápido con una lectura superficial, y te sientes más vivo cuando desmontas una idea para ver qué la sostiene.",
    strengths: [
      "Detecta inconsistencias lógicas y casos límite que otros pasan por alto",
      "Genera marcos originales en vez de recurrir a la respuesta obvia",
      "Se siente cómodo diciendo 'todavía no lo sé' en vez de fingir certeza",
      "Aporta rigor a decisiones que otros toman puramente por instinto",
    ],
    challenges: [
      "El análisis puede dar vueltas indefinidamente sin llegar a una decisión",
      "El seguimiento de tareas rutinarias puede quedar por detrás de la calidad de tus ideas",
      "Puede olvidar comunicar un razonamiento que a ti te resulta obvio",
    ],
    careers: [
      "Investigación científica",
      "Desarrollo de software o algoritmos",
      "Análisis de sistemas",
      "Filosofía o academia teórica",
      "Redacción técnica",
    ],
    relationships:
      "Conectas más fácilmente a través de ideas, y puedes quedarte callado largos periodos cuando estás inmerso en el pensamiento — no es una señal de desinterés, es simplemente tu forma de procesar. Alguien que no se lo tome de forma personal y que disfrute debatir una idea por sí misma suele encajar bien contigo.",
  },
  ENTJ: {
    name: "El Comandante",
    tagline: "Decidido · Estratégico · Ambicioso",
    description:
      "Los ENTJ convierten la ambigüedad en un plan. Ves de forma natural el camino más eficiente desde donde están las cosas hasta donde necesitan estar, y movilizas personas y recursos para llegar allí sin muchas dudas.",
    strengths: [
      "Toma decisiones claras rápidamente, incluso con información incompleta",
      "Organiza personas y recursos en torno a un objetivo compartido y ambicioso",
      "Da feedback directo que hace avanzar los proyectos",
      "Trata los contratiempos como datos, no como razones para frenar",
    ],
    challenges: [
      "Puede pasar por encima de voces más discretas antes de escuchar su opinión completa",
      "La impaciencia con el proceso puede minar el compromiso del equipo",
      "Puede subestimar el costo emocional de una decisión puramente eficiente",
    ],
    careers: [
      "Liderazgo ejecutivo / dirección general",
      "Consultoría de gestión",
      "Liderazgo de operaciones o reestructuración",
      "Derecho (litigios o estrategia corporativa)",
      "Emprendimiento",
    ],
    relationships:
      "Llevas a las relaciones la misma determinación que a tu trabajo — quieres una pareja que pueda seguirte el ritmo y llevarte la contraria cuando no está de acuerdo. La verdadera cercanía requiere un esfuerzo consciente, porque tu instinto es resolver problemas, no simplemente quedarte con un sentimiento.",
  },
  ENTP: {
    name: "El Innovador",
    tagline: "Ingenioso · Agudo · Contrario",
    description:
      "Los ENTP piensan en voz alta discutiendo — con otros y consigo mismos. Te energiza la posibilidad, detectas rápido el fallo en un plan y propones con la misma rapidez tres mejores en el momento.",
    strengths: [
      "Genera una amplia variedad de opciones nuevas en vez de anclarse en la primera idea",
      "Debate ideas con rigor sin tomarse el desacuerdo de forma personal",
      "Se adapta rápido cuando las circunstancias cambian a mitad de plan",
      "Da energía a una sala y cuestiona suposiciones estancadas",
    ],
    challenges: [
      "Puede empezar más proyectos de los que termina",
      "Hacer demasiado de abogado del diablo puede sonar a llevar la contraria porque sí",
      "La ejecución rutinaria puede sentirse pesada una vez resuelta la parte novedosa",
    ],
    careers: [
      "Estrategia de producto / roles de innovación",
      "Emprendimiento",
      "Inversión de riesgo (venture capital)",
      "Derecho de debate intenso (litigios, políticas públicas)",
      "Estrategia creativa o publicitaria",
    ],
    relationships:
      "Mantienes las relaciones interesantes cuestionando suposiciones, incluidas las de tu pareja, que necesita poder disfrutarlo en vez de tomarlo como un ataque. Encajas mejor con alguien que valora un buen debate tanto como tú y que no necesita constante reafirmación detrás de la broma.",
  },
  INFJ: {
    name: "El Defensor",
    tagline: "Perspicaz · Con principios · Silenciosamente intenso",
    description:
      "Los INFJ combinan una brújula interior fuerte con una sensibilidad real hacia las personas. Sueles ver el significado detrás de una situación antes que los demás, y te importa hacerlo bien — por las personas involucradas, no solo por el resultado.",
    strengths: [
      "Percibe dinámicas subyacentes y necesidades no dichas en una sala",
      "Sostiene valores firmes y bien pensados sin necesidad de proclamarlos",
      "Construye relaciones profundas basadas en la confianza en vez de muchas superficiales",
      "Conecta una decisión concreta con su significado o propósito más amplio",
    ],
    challenges: [
      "Puede absorber el peso emocional de otros hasta que se convierte en el suyo propio",
      "El idealismo puede convertirse en decepción cuando la realidad no está a la altura",
      "Tiende a retirarse en vez de plantear un conflicto directamente",
    ],
    careers: [
      "Terapia o psicología",
      "Escritura o trabajo editorial",
      "Liderazgo sin fines de lucro o con propósito",
      "Investigación UX",
      "Diseño instruccional",
    ],
    relationships:
      "Formas pocas relaciones, pero las que formas son profundas — buscas verdadera comprensión, no solo compañía. Puedes absorber el peso emocional de una pareja más allá de lo sostenible, así que una relación recíproca suele funcionarte mejor a largo plazo.",
  },
  INFP: {
    name: "El Idealista",
    tagline: "Empático · Auténtico · Imaginativo",
    description:
      "Los INFP se guían por un claro sentido interior de lo correcto y lo significativo. Te importa menos cómo se ve algo desde fuera y más si es fiel a tus valores, lo que le da a tu trabajo una autenticidad silenciosa.",
    strengths: [
      "Aporta una empatía genuina que hace que la gente se sienta realmente escuchada",
      "Se mantiene anclado a sus valores personales bajo presión social o comercial",
      "Ve ángulos creativos y basados en valores que otros pasan por alto",
      "Defiende a las personas que de otro modo quedarían silenciadas",
    ],
    challenges: [
      "Puede tomarse la crítica a una idea como una crítica a sí mismo",
      "Evitar el conflicto puede dejar que pequeños problemas se conviertan en resentimiento",
      "Las expectativas idealizadas pueden hacer que la realidad ordinaria resulte decepcionante",
    ],
    careers: [
      "Escritura creativa o estrategia de contenido",
      "Terapia o trabajo social",
      "Activismo sin fines de lucro",
      "Diseño UX o gráfico",
      "Edición",
    ],
    relationships:
      "Necesitas una relación que se sienta honesta y alineada con tus valores más que una que simplemente sea cómoda o convencional. Puedes idealizar a una pareja al principio — las personas que mejor encajan son las que te dejan verlas por completo, no solo las partes que encajan con la imagen que te habías hecho.",
  },
  ENFJ: {
    name: "El Mentor",
    tagline: "Cálido · Persuasivo · Centrado en las personas",
    description:
      "Los ENFJ leen una sala y saben instintivamente cómo sacar lo mejor de las personas que están en ella. Te motiva el crecimiento de los demás y tienes un don natural para articular una visión compartida que hace que la gente avance junta.",
    strengths: [
      "Nota las fortalezas individuales y ayuda activamente a la gente a desarrollarlas",
      "Comunica una visión de una manera que realmente moviliza a las personas",
      "Genera confianza rápidamente con personas muy distintas entre sí",
      "Convierte la tensión en un grupo en una conversación constructiva",
    ],
    challenges: [
      "Puede comprometerse en exceso con las necesidades de otros a costa de las propias",
      "El deseo de armonía puede retrasar una conversación difícil pero necesaria",
      "Puede tomarse una recepción fría de forma personal en vez de como feedback neutral",
    ],
    careers: [
      "Docencia o formación",
      "Recursos humanos / desarrollo de personas",
      "Liderazgo comunitario o sin fines de lucro",
      "Coaching",
      "Relaciones públicas",
    ],
    relationships:
      "Notas lo que necesita una pareja, a veces antes de que lo diga — eso es un don, pero puede convertirse en dar en exceso si no es recíproco. Las relaciones en las que tus propias necesidades reciben el mismo espacio suelen sostenerse mejor con el tiempo.",
  },
  ENFP: {
    name: "El Catalizador",
    tagline: "Entusiasta · Imaginativo · Cálido",
    description:
      "Los ENFP aportan curiosidad genuina y calidez a casi todo. Conectas ideas y personas que normalmente no se cruzarían, y tu entusiasmo tiene la capacidad de emocionar a otras personas sobre sus propias vidas también.",
    strengths: [
      "Aporta energía y posibilidad a conversaciones o proyectos estancados",
      "Forma conexiones auténticas rápidamente con una amplia variedad de personas",
      "Ve vínculos no obvios entre ideas, personas y oportunidades",
      "Adapta planes sobre la marcha sin perder el entusiasmo",
    ],
    challenges: [
      "El seguimiento puede quedar por detrás del entusiasmo de una idea nueva",
      "Puede sobrepasarse socialmente y necesitar más tiempo de recuperación del previsto",
      "La estructura y la rutina pueden sentirse limitantes incluso cuando ayudarían",
    ],
    careers: [
      "Marketing o estrategia de marca",
      "Emprendimiento",
      "Periodismo",
      "Programación de eventos o comunidad",
      "Dirección creativa",
    ],
    relationships:
      "Aportas calidez genuina y curiosidad por el mundo interior de tu pareja, y quieres una relación que siga evolucionando en vez de asentarse en la rutina. Una pareja que aporte algo de estabilidad junto a tu entusiasmo ayuda a que el seguimiento esté a la altura de la energía.",
  },
  ISTJ: {
    name: "El Guardián",
    tagline: "Fiable · Metódico · Con los pies en la tierra",
    description:
      "Los ISTJ son las personas alrededor de las cuales otros construyen sus planes, porque de verdad haces lo que dices que harás. Confías en métodos probados, llevas la cuenta de detalles que a otros se les escapan, y sientes verdadero orgullo en cumplir por completo.",
    strengths: [
      "Cumple de forma consistente con sus compromisos, incluso los poco glamurosos",
      "Detecta detalles prácticos y riesgos antes de que se conviertan en problemas",
      "Aporta un juicio calmado y firme bajo presión",
      "Respeta el proceso y el precedente en vez de reinventar la rueda cada vez",
    ],
    challenges: [
      "Puede resistirse a un enfoque nuevo y mejor simplemente porque no lo conoce",
      "Puede minimizar sus propias necesidades a favor del plan o del equipo",
      "Los estándares rígidos pueden parecer inflexibles a personas más espontáneas",
    ],
    careers: [
      "Contabilidad o auditoría",
      "Gestión de operaciones",
      "Gestión de proyectos",
      "Derecho (cumplimiento normativo, contratos)",
      "Ingeniería",
    ],
    relationships:
      "Demuestras compromiso a través de la constancia y la fiabilidad más que con grandes gestos, y te tomas en serio las promesas hechas. Una pareja que valore esa estabilidad y comunique los cambios con claridad, en vez de esperar que simplemente te adaptes, suele encajar bien.",
  },
  ISFJ: {
    name: "El Protector",
    tagline: "Devoto · Atento · Constante",
    description:
      "Los ISFJ notan en silencio lo que necesita la gente a su alrededor y actúan en consecuencia sin que se lo pidan. Asumes verdadera responsabilidad por las personas y compromisos de tu vida, y muestras cariño a través de un apoyo constante y práctico.",
    strengths: [
      "Recuerda los detalles concretos que hacen que la gente se sienta realmente cuidada",
      "Cumple sus compromisos en silencio y de forma fiable, sin necesitar reconocimiento",
      "Crea un entorno estable y tranquilo en el que otros pueden apoyarse",
      "Equilibra la tradición con una sensibilidad real hacia las necesidades individuales",
    ],
    challenges: [
      "Puede darse en exceso hasta que sus propias necesidades quedan sin cubrir",
      "La incomodidad con el conflicto puede dejar problemas sin resolver demasiado tiempo",
      "El cambio puede sentirse más amenazante de lo que necesita ser",
    ],
    careers: [
      "Enfermería o apoyo sanitario",
      "Administración o gestión de oficina",
      "Educación primaria",
      "Recursos humanos o administración de beneficios",
      "Trabajo social",
    ],
    relationships:
      "Expresas cariño a través de actos tranquilos y prácticos, y a menudo notas lo que necesita una pareja antes de que lo pida. El riesgo es darte tanto que tus propias necesidades queden sin cubrir — las relaciones en las que una pareja pregunta activamente por tus necesidades te sientan mejor.",
  },
  ESTJ: {
    name: "El Director",
    tagline: "Organizado · Firme · Práctico",
    description:
      "Los ESTJ convierten los planes en ejecución. Aportas estructura clara a situaciones ambiguas, exiges a la gente que cumpla lo acordado, y tienes poca paciencia con procesos que no hacen avanzar visiblemente las cosas.",
    strengths: [
      "Organiza personas y plazos en un plan viable y ejecutable",
      "Mantiene un estándar claro y consistente y lo aplica con justicia",
      "Toma decisiones de forma eficiente y asume el resultado",
      "Corta la ambigüedad para poner las cosas en marcha",
    ],
    challenges: [
      "Puede infravalorar aportes que no llegan con una justificación clara",
      "La franqueza puede sentirse más dura de lo que pretendías",
      "El apego a 'la forma correcta' puede desplazar una idea nueva genuinamente mejor",
    ],
    careers: [
      "Gestión de operaciones o de planta",
      "Gestión de proyectos o programas",
      "Liderazgo en las fuerzas del orden o militar",
      "Gestión de ventas",
      "Logística",
    ],
    relationships:
      "Aportas estructura y fiabilidad a una relación, y esperas compromiso a cambio — los planes vagos o compromisos poco claros te frustran rápido. Las parejas que pueden ser directas contigo, en vez de esperar que leas entre líneas, suelen llevarse mejor contigo.",
  },
  ESFJ: {
    name: "El Anfitrión",
    tagline: "Sociable · Solidario · Organizado",
    description:
      "Los ESFJ mantienen a los grupos funcionando con fluidez — social y prácticamente. Notas quién se siente incluido y quién no, y te esfuerzas de verdad por que la gente a tu alrededor se sienta apoyada y por que los planes realmente sucedan.",
    strengths: [
      "Construye relaciones cálidas y cooperativas dentro de un grupo rápidamente",
      "Organiza personas y logística para que todo funcione sin problemas",
      "Nota cuando alguien se está quedando fuera y lo incluye",
      "Cumple sus compromisos con las personas que le importan",
    ],
    challenges: [
      "Puede vincular su autoestima demasiado a la aprobación de otros",
      "Buscar la armonía puede significar evitar un desacuerdo necesario",
      "Puede tomarse una reacción neutral o directa de forma más personal de lo que se pretendía",
    ],
    careers: [
      "Planificación de eventos",
      "Coordinación sanitaria",
      "Recursos humanos",
      "Gestión hotelera",
      "Relaciones comunitarias o con clientes",
    ],
    relationships:
      "Inviertes un esfuerzo real para que una relación (y las personas alrededor) se sientan apoyadas e incluidas, y notas cuando ese esfuerzo no es recíproco. Una pareja que se sienta cómoda con tu orientación social, y que no confunda tu búsqueda de armonía con falta de opiniones propias, encaja bien.",
  },
  ISTP: {
    name: "El Artesano",
    tagline: "Práctico · Independiente · Sereno",
    description:
      "Los ISTP aprenden mejor desmontando las cosas — literal o conceptualmente. Te mantienes tranquilo cuando algo se rompe, resuelves problemas con lógica práctica, y valoras ser genuinamente competente por encima de hablar de competencia.",
    strengths: [
      "Resuelve problemas prácticos de forma eficiente, sin aspavientos innecesarios",
      "Se mantiene sereno y con la cabeza clara en una crisis",
      "Se adapta rápido cuando un plan deja de funcionar a mitad de ejecución",
      "Prefiere la habilidad demostrada por encima de credenciales o discursos",
    ],
    challenges: [
      "Puede desconectar de situaciones que se sienten demasiado emocionales o abstractas",
      "Puede evitar comprometerse con planes a largo plazo que limiten su flexibilidad",
      "La parquedad puede leerse como desinterés incluso cuando estás totalmente implicado",
    ],
    careers: [
      "Oficios técnicos (electricidad, mecánica)",
      "Ingeniería (especialmente roles prácticos o de campo)",
      "Respuesta a emergencias (paramédico, bomberos)",
      "TI o resolución de problemas de sistemas",
      "Pilotaje o manejo de vehículos",
    ],
    relationships:
      "Muestras cariño a través de la acción más que de las palabras, lo que puede parecer distante para una pareja que necesita más reafirmación verbal. Las relaciones en las que una pareja te da verdadero espacio, y no se toma tu necesidad de independencia de forma personal, suelen funcionar mejor.",
  },
  ISFP: {
    name: "El Artista",
    tagline: "Suave · Estético · Independiente",
    description:
      "Los ISFP experimentan el mundo a través de los sentidos y un conjunto de valores personales y silenciosos. Prefieres mostrar lo que quieres decir antes que explicarlo, y te resistes a que te encasillen en un papel que no refleja quién eres realmente.",
    strengths: [
      "Aporta una sensibilidad estética y sensorial genuina a su trabajo",
      "Se adapta con fluidez y permanece presente en el momento",
      "Actúa según valores personales sin necesitar defenderlos públicamente",
      "Ofrece apoyo silencioso y sin juicios a las personas a su alrededor",
    ],
    challenges: [
      "Evitar el conflicto puede dejar desacuerdos reales sin expresar",
      "Puede costarle planificar con suficiente antelación para metas a largo plazo",
      "La sensibilidad a la crítica puede durar más que el momento en que se dio",
    ],
    careers: [
      "Diseño (visual, de producto o de moda)",
      "Fotografía o artes visuales",
      "Trabajo culinario",
      "Veterinaria o cuidado de animales",
      "Trabajo paisajístico o ambiental",
    ],
    relationships:
      "Avanzas con lealtad silenciosa y un fuerte sentido personal de lo correcto, aunque no lo defiendas en voz alta. Encajas mejor con una pareja que no te presione a mostrar emociones según su calendario, y que valore lo que muestras más que lo que dices.",
  },
  ESTP: {
    name: "El Dinamo",
    tagline: "Audaz · Enérgico · Pragmático",
    description:
      "Los ESTP están hechos para el momento presente. Lees una situación en vivo rápidamente, actúas sin pensarlo demasiado, y prefieres aprender haciendo antes que planificar cada detalle de antemano.",
    strengths: [
      "Lee una sala o situación rápidamente y responde en tiempo real",
      "Actúa de forma decidida en vez de quedarse atascado analizando",
      "Maneja la presión y los cambios inesperados con serenidad",
      "Aporta energía e impulso a un grupo estancado",
    ],
    challenges: [
      "Puede actuar antes de sopesar del todo las consecuencias a largo plazo",
      "La rutina y la planificación detallada pueden sentirse innecesariamente limitantes",
      "La franqueza bajo presión puede parecer brusca",
    ],
    careers: ["Ventas", "Medicina de urgencias o paramedicina", "Emprendimiento", "Entrenamiento deportivo", "Bienes raíces"],
    relationships:
      "Aportas energía y espontaneidad a una relación, y estás en tu mejor momento viviendo el presente con una pareja en vez de planificar el futuro en exceso. El compromiso a largo plazo puede sentirse limitante si se plantea como una restricción en vez de como su propio tipo de aventura — las parejas que lo plantean así suelen mantenerte comprometido.",
  },
  ESFP: {
    name: "El Animador",
    tagline: "Divertido · Cálido · Espontáneo",
    description:
      "Los ESFP aportan calidez y energía genuinas a cualquier sala. Vives intensamente en el presente, captas el estado de ánimo de los demás al instante, y tienes el don de hacer que los momentos cotidianos se sientan más divertidos y vivos.",
    strengths: [
      "Eleva la energía y el ánimo de las personas a su alrededor",
      "Nota y responde en tiempo real a los estados emocionales de los demás",
      "Se adapta fácilmente a personas nuevas y planes cambiantes",
      "Aporta entusiasmo práctico en vez de teorización abstracta",
    ],
    challenges: [
      "Puede evitar planificar con antelación por quedarse en el presente",
      "La sensibilidad a la crítica puede afectar el seguimiento de feedback difícil",
      "El foco puede desviarse en tareas largas y menos gratificantes de inmediato",
    ],
    careers: [
      "Artes escénicas o entretenimiento",
      "Presentación o producción de eventos",
      "Ventas",
      "Hostelería o turismo",
      "Enseñanza a niños pequeños",
    ],
    relationships:
      "Aportas calidez y una atención genuina al estado de ánimo de tu pareja en el momento. Las relaciones que duran son aquellas en las que una pareja también te ayuda a construir algo de estructura — porque tu instinto de mantenerte en el presente puede hacer que la planificación conjunta a largo plazo sea algo en lo que tengan que trabajar juntos.",
  },
};
