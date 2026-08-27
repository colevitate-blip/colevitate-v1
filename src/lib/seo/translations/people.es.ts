// Real (human-quality, not machine-translated placeholder) Spanish
// translations for the 34 people-profile pages — Tier 4.3 phase 3 of
// IMPROVEMENT_PROMPTS.md. See famousPeopleContent.ts for the English source
// and getFamousPerson() for how this is applied (locale defaults to "en";
// falls back to English per-field/per-rationale where a key is missing).
import type { PersonTranslation } from "./types";

export const PERSON_TRANSLATION_ES: Record<string, PersonTranslation> = {
  "isaac-newton": {
    bio: "Físico y matemático inglés cuyos Principia Mathematica sentaron las bases de la mecánica clásica y la gravitación universal.",
    rationales: {
      "mbti-INTJ":
        "Newton pasó décadas en un aislamiento casi total unificando las leyes físicas en un solo sistema: sus contemporáneos describen a un hombre que trabajó obsesivamente en los Principia durante años y tenía poca paciencia para la vida social o la colaboración.",
      "colors-blue":
        "Su trabajo se define por una demostración matemática exhaustiva y precisa, más que por la intuición o la rapidez.",
      "bigfive-openness-high":
        "Redefinió la comprensión misma del universo, desde la óptica hasta el movimiento y la gravitación.",
    },
  },
  "charles-darwin": {
    bio: "Naturalista inglés cuya teoría de la evolución por selección natural, expuesta en El origen de las especies, transformó la biología.",
    rationales: {
      "mbti-INTP":
        "Darwin guardó su teoría durante más de 20 años, reuniendo y verificando metódicamente pruebas antes de publicar: era famoso por su reticencia a hacerla pública hasta que la evidencia fuera irrefutable.",
      "colors-blue":
        "Construyó su argumento a partir de una observación sistemática y meticulosa, en lugar de conclusiones apresuradas.",
      "bigfive-openness-high":
        "Estuvo dispuesto a seguir la evidencia hasta una conclusión que trastocó las certezas de su propia época.",
      "bigfive-conscientiousness-high":
        "Dos décadas de catalogación meticulosa de especímenes antes de comprometer su teoría con la imprenta.",
    },
  },
  "nikola-tesla": {
    bio: "Inventor e ingeniero eléctrico serbio-estadounidense, conocido sobre todo por sus aportes a los sistemas eléctricos de corriente alterna (CA).",
    rationales: {
      "mbti-INTJ":
        "Tesla trabajó en un aislamiento autodirigido en sistemas —la energía de CA, la transmisión inalámbrica— años antes de que existiera un mercado práctico para ellos, guiado por su propia visión a largo plazo más que por la validación externa.",
      "colors-blue":
        "Un enfoque centrado en la ingeniería, refinando obsesivamente sus diseños antes de presentarlos en público.",
      "bigfive-openness-high":
        "Persiguió repetidamente ideas (energía inalámbrica, control remoto) décadas antes de que la tecnología o el mercado le dieran alcance.",
    },
  },
  "ada-lovelace": {
    bio: "Matemática inglesa cuyas notas sobre la Máquina Analítica de Charles Babbage incluyen lo que se considera ampliamente el primer algoritmo informático publicado.",
    rationales: {
      "mbti-INTP":
        "Lovelace razonó de forma abstracta sobre una máquina que aún no existía físicamente, describiendo su propio pensamiento en cartas como \"ciencia poética\": una teoría construida desde primeros principios, no a partir de la observación de un sistema en funcionamiento.",
      "colors-blue": "Sus notas son densas, precisas y desarrolladas con rigor matemático.",
      "bigfive-openness-high":
        "Imaginó la computación de propósito general casi un siglo antes de que fuera técnicamente posible.",
    },
  },
  "alan-turing": {
    bio: "Matemático e informático inglés cuyo trabajo sobre la computabilidad y el descifrado de códigos en Bletchley Park ayudó a acortar la Segunda Guerra Mundial.",
    rationales: {
      "mbti-INTP":
        "Turing resolvía problemas abstractos —el cifrado Enigma, los límites teóricos de la computación— mediante un razonamiento formal y solitario; sus colegas de Bletchley Park lo describían como brillante pero socialmente torpe, singularmente centrado en el problema en sí.",
      "colors-blue":
        "Abordó el descifrado de códigos como un problema matemático formal y sistemático, no como una conjetura.",
      "bigfive-openness-high":
        "Sentó las bases teóricas (la máquina de Turing) para la computación antes de que existiera ningún ordenador.",
    },
  },
  "carl-sagan": {
    bio: "Astrónomo y divulgador científico estadounidense que acercó la ciencia planetaria y la cosmología a un público masivo a través de Cosmos.",
    rationales: {
      "mbti-ENFP":
        "Sagan construyó toda una carrera pública traduciendo el asombro y la posibilidad a audiencias masivas, y describió repetidamente la ciencia misma como impulsada por la curiosidad y el \"deleite\" más que por el procedimiento árido.",
      "colors-yellow": "Un estilo de comunicación cálido y narrativo, orientado a inspirar más que a simplemente informar.",
      "bigfive-extraversion-high":
        "Construyó una carrera de cara al público (televisión, libros superventas, giras de conferencias) en lugar de quedarse solo en el laboratorio.",
    },
  },
  "jane-goodall": {
    bio: "Primatóloga inglesa cuyas décadas de investigación de campo sobre chimpancés en Gombe Stream transformaron la comprensión del comportamiento y la cognición animal.",
    rationales: {
      "mbti-INFJ":
        "Goodall pasó años construyendo pacientemente confianza con las tropas de chimpancés antes de publicar sus hallazgos, y siempre ha enmarcado su trabajo científico en términos de empatía y conexión, más que de observación distante.",
      "colors-green":
        "Una carrera construida sobre un trabajo de campo paciente y centrado en las relaciones, más que en resultados rápidos.",
      "bigfive-conscientiousness-high": "Décadas de observación de campo sostenida y disciplinada antes de extraer conclusiones.",
    },
  },
  "stephen-hawking": {
    bio: "Físico teórico inglés conocido por su trabajo sobre los agujeros negros y la cosmología, y por Una breve historia del tiempo.",
    rationales: {
      "mbti-INTJ":
        "Hawking persiguió un único objetivo teórico general —unificar la gravedad y la mecánica cuántica— a lo largo de una carrera de unos 50 años a pesar de la ELA, y era conocido por una comunicación pública seca y comedida, no por el espectáculo.",
      "colors-blue":
        "Un trabajo teórico preciso y de largo alcance; un ingenio seco y económico, célebre en sus apariciones públicas.",
      "bigfive-openness-high":
        "Persiguió de forma sostenida algunas de las preguntas más abstractas y fundamentales de la física.",
    },
  },
  "albert-einstein": {
    bio: "Físico teórico de origen alemán que desarrolló la teoría de la relatividad, transformando radicalmente la comprensión del espacio, el tiempo y la gravedad.",
    rationales: {
      "mbti-INTP":
        "Einstein describía una preferencia por el pensamiento solitario mediante experimentos mentales antes que la colaboración, y construyó su obra más famosa desafiando directamente los marcos newtonianos aceptados en lugar de trabajar dentro de ellos.",
      "colors-blue":
        "Construyó teorías a partir de la coherencia lógica de primeros principios, no de la intuición ni del consenso social.",
      "bigfive-openness-high":
        "Desmontó repetidamente supuestos fundamentales de la física en lugar de limitarse a refinar los modelos existentes.",
    },
  },
  "marie-curie": {
    bio: "Física y química polaco-francesa, la primera persona en ganar Premios Nobel en dos ciencias distintas, por su investigación sobre la radiactividad.",
    rationales: {
      "mbti-ISTJ":
        "El aislamiento del radio por parte de Curie implicó años de trabajo de laboratorio agotador y metódico; sus biógrafos describen sistemáticamente un rigor procedimental implacable, sin atajos ni golpes de efecto.",
      "colors-blue": "Un método experimental minucioso y replicable como núcleo de su identidad científica.",
      "bigfive-conscientiousness-high":
        "Años de un procesamiento agotador y repetitivo de mena de pechblenda para aislar un nuevo elemento.",
    },
  },
  "richard-feynman": {
    bio: "Físico teórico estadounidense conocido por su trabajo en electrodinámica cuántica y por sus populares conferencias y memorias.",
    rationales: {
      "mbti-ENTP":
        "Feynman construyó una reputación pública basada en la resolución de problemas lúdica y exploratoria y en la narración de historias (Está usted de broma, Sr. Feynman), y se sabía que le disgustaba la formalidad rutinaria a favor de razonar las cosas desde cero, en vivo.",
      "colors-yellow": "Enseñaba y explicaba física a través del humor, la anécdota y la improvisación.",
      "bigfive-extraversion-high":
        "Buscó activamente escenarios de actuación —conferencias públicas, tocar los bongos, abrir cajas fuertes— junto a la física.",
    },
  },
  "toni-morrison": {
    bio: "Novelista y editora estadounidense cuya obra, incluidas Beloved y Song of Solomon, explora la vida y la historia afroamericanas.",
    rationales: {
      "mbti-INFJ":
        "Las entrevistas de Morrison describen sistemáticamente la escritura como una excavación de verdades enterradas y no dichas sobre la identidad y la historia, abordada con un oficio deliberado y sin prisas, no con una producción acelerada.",
      "colors-green": "Su obra se centra en dar voz a vidas interiores y dolores generacionales pasados por alto.",
      "bigfive-openness-high":
        "Novelas estructuralmente experimentales construidas en torno a formas narrativas no lineales y estratificadas.",
    },
  },
  "ernest-hemingway": {
    bio: "Novelista y periodista estadounidense conocido por un estilo de prosa escueto y contenido, y por una vida dedicada al periodismo de guerra, la caza y la pesca.",
    rationales: {
      "mbti-ISTP":
        "El estilo de prosa terso y orientado a la acción de Hemingway reflejaba una vida bien documentada construida en torno a actividades prácticas —el periodismo de guerra, la caza mayor, la pesca de altura— por encima de la reflexión o la introspección.",
      "colors-red": "Una imagen pública construida en torno a la acción, el riesgo y la experiencia física directa.",
      "bigfive-extraversion-high":
        "Buscó activamente zonas de guerra, círculos sociales de expatriados y actividades físicamente exigentes.",
    },
  },
  "gabriel-garcia-marquez": {
    bio: "Novelista y periodista colombiano, figura central del realismo mágico, conocido sobre todo por Cien años de soledad.",
    rationales: {
      "mbti-INFP":
        "García Márquez describía su propia ficción como inseparable de la verdad emocional sentida, más que del realismo estricto: su propia explicación del \"realismo mágico\" en entrevistas era que reflejaba cómo se sentía realmente la vida latinoamericana, no un truco literario.",
      "colors-yellow": "Una prosa construida en torno al asombro, el mito y la posibilidad desmesurada.",
      "bigfive-openness-high": "Construyó un estilo literario propio mezclando lo fantástico directamente con lo cotidiano.",
    },
  },
  "nelson-mandela": {
    bio: "Líder sudafricano contra el apartheid y primer presidente de su país elegido democráticamente, encarcelado durante 27 años antes de guiar su transición a la democracia.",
    rationales: {
      "mbti-ISFJ":
        "Los 27 años de encarcelamiento de Mandela fueron seguidos por un compromiso bien documentado con la reconciliación por encima de la represalia; priorizó de forma constante un proceso paciente y responsable (la Comisión de la Verdad y la Reconciliación) por encima del gesto dramático.",
      "colors-green": "Un liderazgo definido por la paciencia, la estabilidad y la reconciliación, más que por la confrontación.",
      "bigfive-agreeableness-high":
        "Eligió pública y repetidamente la reconciliación con sus antiguos adversarios políticos por encima de la represalia.",
    },
  },
  "malala-yousafzai": {
    bio: "Activista pakistaní por la educación que sobrevivió a un intento de asesinato por defender la educación de las niñas y se convirtió en la premio Nobel más joven de la historia.",
    rationales: {
      "mbti-ENFJ":
        "Yousafzai convirtió un ataque personal casi mortal en una plataforma de activismo global sostenido, con la oratoria pública y la implicación directa como su método principal en lugar de trabajar entre bastidores.",
      "colors-yellow": "Un activismo construido sobre la narración pública y la conexión directa con la audiencia.",
      "bigfive-conscientiousness-high":
        "Un trabajo de activismo global sostenido y estructurado (el Fondo Malala), no un único momento de atención.",
    },
  },
  "desmond-tutu": {
    bio: "Arzobispo anglicano sudafricano y activista contra el apartheid que presidió la Comisión de la Verdad y la Reconciliación.",
    rationales: {
      "mbti-ENFJ":
        "Tutu presidió la Comisión de la Verdad y la Reconciliación de Sudáfrica con un estilo público bien documentado que combinaba calidez, humor y urgencia moral, en lugar de un enfoque puramente procedimental o legalista.",
      "colors-yellow": "Una presencia pública conocida por su calidez y humor incluso en las audiencias más difíciles.",
      "bigfive-extraversion-high": "Un papel de liderazgo moral muy público y vocal, sostenido a lo largo de décadas.",
    },
  },
  "meryl-streep": {
    bio: "Actriz estadounidense ampliamente considerada una de las más aclamadas de su generación, con un número récord de nominaciones al Óscar.",
    rationales: {
      "mbti-INFJ":
        "El proceso de preparación de Streep —entrenadores de dialecto, meses de investigación por papel— está ampliamente documentado por directores y compañeros de reparto como algo inmersivo y profundamente interno antes de rodar una sola escena.",
      "colors-blue": "Su preparación, según se relata, está impulsada por la investigación y es exigente, no instintiva ni improvisada.",
      "bigfive-openness-high": "Una carrera construida sobre la versatilidad en personajes, acentos y géneros radicalmente distintos.",
    },
  },
  "tom-hanks": {
    bio: "Actor y cineasta estadounidense conocido por papeles en Forrest Gump, Náufrago y Salvar al soldado Ryan, y por una reputación pública duradera de cercanía.",
    rationales: {
      "mbti-ISFJ":
        "Compañeros de reparto y equipo técnico, a lo largo de décadas de entrevistas, describen a Hanks como fiable, cálido en el set y de poco drama: una reputación de profesionalismo constante más que de volatilidad o autopromoción.",
      "colors-green": "Descrito de forma amplia y constante como fácil de trabajar con él y considerado con los equipos técnicos.",
      "bigfive-agreeableness-high": "Una imagen pública construida específicamente en torno a la calidez y la simpatía, sostenida durante décadas.",
    },
  },
  "audrey-hepburn": {
    bio: "Actriz y humanitaria británica, una de las grandes estrellas de Hollywood de los años 50 y 60 que más tarde dedicó buena parte de su vida al trabajo de campo con UNICEF.",
    rationales: {
      "mbti-INFJ":
        "Hepburn desplazó su atención pública hacia las visitas de campo humanitarias de UNICEF en la última etapa de su vida, y sus colegas la describían como discretamente comprometida con sus principios, más que motivada por la autopromoción.",
      "colors-green": "Su etapa final se centró en el servicio y la defensa de causas, no en mantener la visibilidad como estrella.",
      "bigfive-agreeableness-high": "Pasó sus últimos años en trabajo de campo directo con niños en regiones en crisis.",
    },
  },
  "robin-williams": {
    bio: "Actor y cómico estadounidense conocido por su comedia improvisada y vertiginosa, y por papeles que van de Mrs. Doubtfire a El indomable Will Hunting.",
    rationales: {
      "mbti-ENFP":
        "Williams era famoso por su improvisación no guionizada y asociativa, tanto en entrevistas como en las actuaciones; sus colaboradores de siempre lo describen generando constantemente ocurrencias alternativas en tiempo real.",
      "colors-yellow": "Una comedia construida sobre la espontaneidad, la asociación rápida y la energía del público.",
      "bigfive-openness-high":
        "Una versatilidad que abarcaba desde la comedia desbordante hasta papeles dramáticos serios, apartándose a menudo del guion.",
    },
  },
  "denzel-washington": {
    bio: "Actor y director estadounidense con una carrera que abarca Malcolm X, Día de entrenamiento y Fences, y dos premios de la Academia.",
    rationales: {
      "mbti-ISTJ":
        "Washington ha descrito, en sus propias entrevistas, un enfoque disciplinado, marcado por la fe y la ética del trabajo, y los directores señalan que prioriza la preparación y el control sobre la espontaneidad en el set.",
      "colors-red": "Conocido por una presencia en pantalla contundente y decidida, y por su franqueza en las entrevistas.",
      "bigfive-conscientiousness-high": "Atribuye públicamente la longevidad de su carrera a la disciplina y la preparación, más que solo al talento.",
    },
  },
  "oprah-winfrey": {
    bio: "Ejecutiva de medios y presentadora estadounidense que construyó una carrera y una empresa de medios de décadas en torno a las entrevistas en profundidad.",
    rationales: {
      "mbti-ENFJ":
        "Winfrey construyó un imperio mediático específicamente en torno a sacar a la luz las historias de otras personas y conectar emocionalmente con una audiencia masiva, tanto en el aire como a través de su productora.",
      "colors-yellow": "Un estilo de entrevista construido sobre la calidez, la conexión emocional y la complicidad con el público.",
      "bigfive-extraversion-high": "Una carrera y un negocio construidos por completo en torno a la conversación pública en vivo.",
    },
  },
  "keanu-reeves": {
    bio: "Actor canadiense conocido por sus papeles en Matrix y John Wick, y por una reputación pública ampliamente difundida de generosidad discreta.",
    rationales: {
      "mbti-ISFP":
        "Reeves es descrito de forma constante por miembros del equipo técnico, en anécdotas ampliamente difundidas, como discreto, sin afectación y personalmente generoso fuera de cámara pese a una fama de nivel superestelar.",
      "colors-green": "Su comportamiento hacia los equipos técnicos y los fans, según se relata, es sistemáticamente discreto y considerado.",
      "bigfive-agreeableness-high": "Numerosos casos, reportados de forma independiente, de generosidad discreta hacia el equipo técnico y desconocidos.",
    },
  },
  "emma-watson": {
    bio: "Actriz británica conocida por la saga cinematográfica de Harry Potter, y Embajadora de Buena Voluntad de ONU Mujeres para la igualdad de género.",
    rationales: {
      "mbti-INFJ":
        "Watson pausó su carrera como actriz para completar una carrera universitaria y se convirtió en una activista deliberada y fundamentada en la investigación por la igualdad de género en la ONU, un giro documentado hacia el fondo por encima de mantener la visibilidad en pantalla.",
      "colors-blue": "Su trabajo de activismo está fundamentado en la investigación y las políticas públicas, no es meramente simbólico.",
      "bigfive-openness-high": "Se apartó deliberadamente de la trayectoria de su carrera como actriz para dedicarse a los estudios académicos y al activismo.",
    },
  },
  "abraham-lincoln": {
    bio: "16.º presidente de los Estados Unidos, que condujo al país durante la Guerra Civil y promulgó la Proclamación de Emancipación.",
    rationales: {
      "mbti-INFJ":
        "Está documentado que Lincoln deliberaba en privado durante meses antes de las decisiones importantes —la Proclamación de Emancipación se redactó y se guardó hasta que el momento político fue el adecuado— y era un orador público reacio al principio de su carrera.",
      "colors-blue": "Las decisiones se razonaban con detenimiento en privado antes de anunciarse públicamente.",
      "bigfive-conscientiousness-high": "Un proceso de redacción privado, extenso y deliberado antes de las grandes acciones políticas.",
    },
  },
  "winston-churchill": {
    bio: "Estadista británico que ejerció como primer ministro durante la Segunda Guerra Mundial, conocido por sus discursos de guerra y su liderazgo.",
    rationales: {
      "mbti-ENTJ":
        "El estilo de mando de Churchill en tiempos de guerra fue decidido y combativo, y su producción documentada —discursos, libros, memorandos— refleja a un líder impulsado por una pura fuerza de voluntad y la retórica pública.",
      "colors-red": "Un estilo retórico directo y combativo, construido en torno a la acción decidida por encima del consenso.",
      "bigfive-extraversion-high": "Construyó su liderazgo en tiempos de guerra sustancialmente en torno a discursos públicos y emisiones radiofónicas.",
    },
  },
  "franklin-d-roosevelt": {
    bio: "32.º presidente de los Estados Unidos, que condujo al país durante la Gran Depresión y la mayor parte de la Segunda Guerra Mundial.",
    rationales: {
      "mbti-ENFJ":
        "Las charlas junto al fuego de Roosevelt se construyeron deliberadamente para proyectar calidez personal y tranquilidad directamente al público durante una crisis nacional, una elección de comunicación característica de su presidencia.",
      "colors-yellow": "Una comunicación pública construida sobre el optimismo y la tranquilidad personal durante la crisis.",
      "bigfive-extraversion-high": "Fue pionero en la comunicación radiofónica directa y cálida con el público como herramienta central de gobierno.",
    },
  },
  "eleanor-roosevelt": {
    bio: "Diplomática y activista estadounidense, primera dama de los Estados Unidos y principal redactora de la Declaración Universal de los Derechos Humanos.",
    rationales: {
      "mbti-INFJ":
        "Roosevelt sostuvo décadas de activismo centrado en los principios —sobre todo, presidiendo el comité de redacción de la Declaración de los Derechos Humanos de la ONU— por encima del teatro político o la visibilidad a corto plazo.",
      "colors-green": "Un trabajo centrado en el activismo sostenido por los más vulnerables, no en la ambición política personal.",
      "bigfive-agreeableness-high": "Una carrera construida en torno al activismo por los derechos civiles y las causas humanitarias.",
    },
  },
  "margaret-thatcher": {
    bio: "Estadista británica que ejerció como primera ministra de 1979 a 1990, la primera mujer en ocupar el cargo.",
    rationales: {
      "mbti-ESTJ":
        "El historial público de Thatcher muestra una preferencia documentada por la confrontación directa y las posturas políticas firmes por encima de la búsqueda de consenso, resumida en sus propias palabras: \"The lady's not for turning\" (\"La dama no da media vuelta\").",
      "colors-red": "Un estilo de gobierno construido públicamente sobre la firmeza y la resistencia al compromiso.",
      "bigfive-conscientiousness-high": "Formada como química, aportó un enfoque metódico y centrado en las políticas al ejercicio del gobierno.",
    },
  },
  "ronald-reagan": {
    bio: "40.º presidente de los Estados Unidos y antiguo actor, conocido por su estilo de comunicación y sus políticas económicas.",
    rationales: {
      "mbti-ESFJ":
        "La carrera de Reagan, tanto como actor como en su faceta de \"El Gran Comunicador\", se construyó sobre una comunicación pública cálida y tranquilizadora, con una preferencia bien documentada por el enfoque optimista.",
      "colors-yellow": "Un estilo de comunicación centrado en el optimismo y la calidez personal hacia la audiencia.",
      "bigfive-extraversion-high": "Una carrera construida casi por completo sobre la actuación pública, desde el cine hasta los discursos televisados.",
    },
  },
  "mahatma-gandhi": {
    bio: "Abogado y líder independentista indio que fue pionero de la desobediencia civil no violenta contra el dominio colonial británico.",
    rationales: {
      "mbti-INFJ":
        "Gandhi sostuvo décadas de desobediencia civil no violenta y basada en principios, organizada en torno a un marco moral interno constante, documentado a lo largo de toda una vida de escritura y acción pública.",
      "colors-green": "Una estrategia construida sobre la paciencia, la autodisciplina y la coherencia moral, por encima de la confrontación.",
      "bigfive-conscientiousness-high": "Una autodisciplina personal de décadas, autoimpuesta, al servicio de una única causa sostenida.",
    },
  },
  "barack-obama": {
    bio: "44.º presidente de los Estados Unidos, previamente senador estadounidense y profesor de derecho constitucional.",
    rationales: {
      "mbti-INFJ":
        "El personal de Obama describía repetidamente un estilo de decisión reflexivo y deliberativo, apodado públicamente \"no-drama Obama\", coherente con su trayectoria como editor de una revista jurídica y profesor de derecho constitucional.",
      "colors-blue": "Una preferencia ampliamente reportada por la deliberación cuidadosa y metódica antes de las grandes decisiones.",
      "bigfive-openness-high": "Una trayectoria académica y literaria (dos memorias superventas) que hace hincapié en la reflexión y el matiz.",
    },
  },
  "angela-merkel": {
    bio: "Canciller alemana de 2005 a 2021, previamente científica investigadora con un doctorado en química cuántica.",
    rationales: {
      "mbti-ISTJ":
        "Merkel se formó como científica antes de entrar en política, y se la describe de forma amplia y constante como alguien que gobierna con un estilo metódico, de poco drama y basado en datos, por encima de un liderazgo centrado en el carisma.",
      "colors-blue": "Su formación científica y un estilo de gobierno construido en torno a una deliberación cuidadosa y basada en la evidencia.",
      "bigfive-conscientiousness-high": "Un largo mandato marcado por la cautela procedimental y el incrementalismo, por encima de movimientos audaces y rápidos.",
    },
  },
};
