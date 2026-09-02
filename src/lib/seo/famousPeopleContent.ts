// Individual famous-person profile pages (Tier 0 of IMPROVEMENT_PROMPTS.md).
// Every typing below is Colevitate's own editorial, speculative assessment —
// grounded in well-documented public behavior, interviews, or biography, and
// explicitly never presented as the person's own quiz result or as settled
// fact. See FAMOUS_PEOPLE_ROSTER.md for the reviewed source roster this was
// built from (approved 2026-08-26).
//
// Human Design is intentionally absent for every person here: assigning it
// requires an exact birth date, time, and location, and that bar isn't met
// for anyone in this roster with a reliably documented public source — see
// FAMOUS_PEOPLE_ROSTER.md for why.
//
// This file follows the same self-contained-content-array pattern as
// typeContent.ts and combinationContent.ts — routing, sitemap generation,
// and (per Tier 0.3) the `famousExamples` field all read from `FAMOUS_PEOPLE`
// directly, so adding a person here is enough to get them a live page.

import type { AssessmentId } from "@/lib/personality/types";
import { getPersonTranslation } from "./translations";

export type FamousPersonCategory =
  | "scientist"
  | "nobel-laureate"
  | "entertainment"
  | "politician"
  | "business"
  | "athlete"
  | "artist"
  | "author";

export const CATEGORY_LABEL: Record<FamousPersonCategory, string> = {
  scientist: "Scientist",
  "nobel-laureate": "Nobel Laureate",
  entertainment: "Entertainment",
  politician: "Politician",
  business: "Business & Innovation",
  athlete: "Athlete",
  artist: "Artist & Musician",
  author: "Author",
};

/** One framework's editorial typing for a person, with the specific public-behavior rationale it's grounded in. */
export interface FamousPersonTyping {
  framework: AssessmentId;
  /** Matches the `code` shape typeContent.ts expects for that framework (MBTI: uppercase 4-letter; Colors: lowercase id; Big Five: "<trait>-<high|low>"). */
  code: string;
  rationale: string;
}

export interface FamousPersonPhoto {
  /** Direct image file URL. */
  url: string;
  /** Wikimedia Commons file page, for attribution/verification. */
  sourceUrl: string;
  license: string;
  /** Required attribution text, rendered on the page wherever the license requires it. */
  attribution: string;
}

export interface FamousPersonContent {
  slug: string;
  name: string;
  category: FamousPersonCategory;
  /** Drives which silhouette PersonAvatar falls back to when photo is null or fails to load — not shown anywhere else. */
  gender: "man" | "woman";
  years: string;
  bio: string;
  typings: FamousPersonTyping[];
  /** null until a properly licensed photo is confirmed — pages render without an image rather than guess. */
  photo: FamousPersonPhoto | null;
}

export const FAMOUS_PEOPLE: FamousPersonContent[] = [
  // ---- Scientists ----
  {
    slug: "isaac-newton",
    name: "Isaac Newton",
    category: "scientist",
    gender: "man",
    years: "1642–1727",
    bio: "English physicist and mathematician whose Principia Mathematica laid the foundations of classical mechanics and universal gravitation.",
    typings: [
      {
        framework: "mbti",
        code: "INTJ",
        rationale:
          "Newton spent decades in near-total isolation unifying physical laws into a single system — contemporaries describe a man who worked obsessively on the Principia for years and had little patience for social life or collaboration.",
      },
      {
        framework: "colors",
        code: "blue",
        rationale: "His work is defined by exhaustive, precise mathematical proof rather than intuition or speed.",
      },
      {
        framework: "bigfive",
        code: "openness-high",
        rationale: "Reframed how the universe itself was understood, from optics to motion to gravitation.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Portrait_of_Sir_Isaac_Newton%2C_1689_%28brightened%29.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Portrait_of_Sir_Isaac_Newton,_1689_(brightened).jpg",
      license: "Public domain",
      attribution: "Godfrey Kneller, public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "charles-darwin",
    name: "Charles Darwin",
    category: "scientist",
    gender: "man",
    years: "1809–1882",
    bio: "English naturalist whose theory of evolution by natural selection, laid out in On the Origin of Species, reshaped biology.",
    typings: [
      {
        framework: "mbti",
        code: "INTP",
        rationale:
          "Darwin sat on his theory for over 20 years, methodically gathering and cross-checking evidence before he'd publish — famously reluctant to go public until the evidence was airtight.",
      },
      {
        framework: "colors",
        code: "blue",
        rationale: "Built his case through painstaking, systematic observation rather than a rush to conclusions.",
      },
      {
        framework: "bigfive",
        code: "openness-high",
        rationale: "Willing to follow evidence toward a conclusion that upended his own era's assumptions.",
      },
      {
        framework: "bigfive",
        code: "conscientiousness-high",
        rationale: "Two decades of meticulous specimen cataloguing before committing his theory to print.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Charles_Darwin_seated_crop.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Charles_Darwin_seated_crop.jpg",
      license: "Public domain",
      attribution: "Henry Maull & John Fox, public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "nikola-tesla",
    name: "Nikola Tesla",
    category: "scientist",
    gender: "man",
    years: "1856–1943",
    bio: "Serbian-American inventor and electrical engineer best known for his contributions to alternating-current (AC) electrical systems.",
    typings: [
      {
        framework: "mbti",
        code: "INTJ",
        rationale:
          "Tesla worked in self-directed isolation on systems — AC power, wireless transmission — years ahead of any practical market for them, driven by his own long-range vision rather than external validation.",
      },
      {
        framework: "colors",
        code: "blue",
        rationale: "Engineering-first approach, obsessively refining designs before demonstrating them publicly.",
      },
      {
        framework: "bigfive",
        code: "openness-high",
        rationale: "Repeatedly pursued ideas (wireless power, remote control) decades before the technology or market caught up.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/7/79/Tesla_circa_1890.jpeg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Tesla_circa_1890.jpeg",
      license: "Public domain",
      attribution: "Napoleon Sarony, public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "ada-lovelace",
    name: "Ada Lovelace",
    category: "scientist",
    gender: "woman",
    years: "1815–1852",
    bio: "English mathematician whose notes on Charles Babbage's Analytical Engine included what's widely considered the first published computer algorithm.",
    typings: [
      {
        framework: "mbti",
        code: "INTP",
        rationale:
          "Lovelace reasoned abstractly about a machine that didn't yet physically exist, describing her own thinking in letters as \"poetical science\" — theory built from first principles, not observation of a working system.",
      },
      {
        framework: "colors",
        code: "blue",
        rationale: "Her notes are dense, precise, and worked through with mathematical rigor.",
      },
      {
        framework: "bigfive",
        code: "openness-high",
        rationale: "Imagined general-purpose computation nearly a century before it was technically possible.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Ada_Lovelace_daguerreotype_by_Antoine_Claudet_1843_-_cropped.png",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Ada_Lovelace_daguerreotype_by_Antoine_Claudet_1843_-_cropped.png",
      license: "Public domain",
      attribution: "Antoine Claudet, public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "alan-turing",
    name: "Alan Turing",
    category: "scientist",
    gender: "man",
    years: "1912–1954",
    bio: "English mathematician and computer scientist whose work on computability and codebreaking at Bletchley Park helped shorten World War II.",
    typings: [
      {
        framework: "mbti",
        code: "INTP",
        rationale:
          "Turing solved abstract problems — the Enigma cipher, the theoretical limits of computation — through solitary formal reasoning; Bletchley Park colleagues described him as brilliant but socially awkward, singularly focused on the problem itself.",
      },
      {
        framework: "colors",
        code: "blue",
        rationale: "Approached codebreaking as a formal, systematic mathematical problem rather than guesswork.",
      },
      {
        framework: "bigfive",
        code: "openness-high",
        rationale: "Laid theoretical groundwork (the Turing machine) for computing before any computer existed.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Alan_turing_header.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Alan_turing_header.jpg",
      license: "Public domain",
      attribution: "Elliott & Fry, public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "carl-sagan",
    name: "Carl Sagan",
    category: "scientist",
    gender: "man",
    years: "1934–1996",
    bio: "American astronomer and science communicator who brought planetary science and cosmology to a mass audience through Cosmos.",
    typings: [
      {
        framework: "mbti",
        code: "ENFP",
        rationale:
          "Sagan built an entire public career on translating wonder and possibility to mass audiences, and repeatedly described science itself as driven by curiosity and \"delight\" rather than dry procedure.",
      },
      {
        framework: "colors",
        code: "yellow",
        rationale: "Warm, narrative-driven communication style aimed at inspiring rather than just informing.",
      },
      {
        framework: "bigfive",
        code: "extraversion-high",
        rationale: "Built a public-facing career (television, bestselling books, lecture tours) rather than staying purely in the lab.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/b/be/Carl_Sagan_Planetary_Society.JPG",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Carl_Sagan_Planetary_Society.JPG",
      license: "Public domain",
      attribution: "NASA/JPL, public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "jane-goodall",
    name: "Jane Goodall",
    category: "scientist",
    gender: "woman",
    years: "1934–",
    bio: "English primatologist whose decades of field research on chimpanzees at Gombe Stream reshaped understanding of animal behavior and cognition.",
    typings: [
      {
        framework: "mbti",
        code: "INFJ",
        rationale:
          "Goodall spent years patiently building trust with chimpanzee troops before publishing findings, and has consistently framed her scientific work in terms of empathy and connection rather than detached observation.",
      },
      {
        framework: "colors",
        code: "green",
        rationale: "A career built on patient, relationship-first fieldwork rather than fast results.",
      },
      {
        framework: "bigfive",
        code: "conscientiousness-high",
        rationale: "Decades of sustained, disciplined field observation before drawing conclusions.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/9/98/Deputy_Secretary_Higginbottom_Poses_for_a_Photo_With_Dr._Jane_Goodall_and_the_State_Department%27s_Global_Health_Diplomacy_Director_Jordan_in_Washington_(22365513310)_(2)_(cropped_2).jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Deputy_Secretary_Higginbottom_Poses_for_a_Photo_With_Dr._Jane_Goodall_and_the_State_Department%27s_Global_Health_Diplomacy_Director_Jordan_in_Washington_(22365513310)_(2)_(cropped_2).jpg",
      license: "Public domain (U.S. government work)",
      attribution: "U.S. Department of State, public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "stephen-hawking",
    name: "Stephen Hawking",
    category: "scientist",
    gender: "man",
    years: "1942–2018",
    bio: "English theoretical physicist known for his work on black holes and cosmology, and for A Brief History of Time.",
    typings: [
      {
        framework: "mbti",
        code: "INTJ",
        rationale:
          "Hawking pursued a single overarching theoretical goal — unifying gravity and quantum mechanics — across a roughly 50-year career despite ALS, and was known for dry, understated public communication rather than showmanship.",
      },
      {
        framework: "colors",
        code: "blue",
        rationale: "Precise, long-horizon theoretical work; famously dry, economical wit in public appearances.",
      },
      {
        framework: "bigfive",
        code: "openness-high",
        rationale: "Sustained pursuit of some of physics' most abstract, foundational questions.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Stephen_Hawking.StarChild.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Stephen_Hawking.StarChild.jpg",
      license: "Public domain (NASA)",
      attribution: "NASA, public domain, via Wikimedia Commons",
    },
  },

  // ---- Nobel laureates ----
  {
    slug: "albert-einstein",
    name: "Albert Einstein",
    category: "nobel-laureate",
    gender: "man",
    years: "1879–1955 · Nobel Prize in Physics, 1921",
    bio: "German-born theoretical physicist who developed the theory of relativity, fundamentally changing the understanding of space, time, and gravity.",
    typings: [
      {
        framework: "mbti",
        code: "INTP",
        rationale:
          "Einstein described a preference for solitary thought experiments over collaboration, and built his most famous work by directly challenging accepted Newtonian frameworks rather than working within them.",
      },
      {
        framework: "colors",
        code: "blue",
        rationale: "Built theories from first-principles logical consistency, not intuition or social consensus.",
      },
      {
        framework: "bigfive",
        code: "openness-high",
        rationale: "Repeatedly overturned foundational assumptions in physics rather than refining existing models.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/2/28/Albert_Einstein_Head_cleaned.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Albert_Einstein_Head_cleaned.jpg",
      license: "Public domain",
      attribution: "Oren Jack Turner, 1947, public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "marie-curie",
    name: "Marie Curie",
    category: "nobel-laureate",
    gender: "woman",
    years: "1867–1934 · Nobel Prize in Physics, 1903; Nobel Prize in Chemistry, 1911",
    bio: "Polish-French physicist and chemist, the first person to win Nobel Prizes in two different sciences, for her research on radioactivity.",
    typings: [
      {
        framework: "mbti",
        code: "ISTJ",
        rationale:
          "Curie's isolation of radium involved years of grueling, methodical lab work; biographers consistently describe relentless procedural rigor over flash or shortcuts.",
      },
      {
        framework: "colors",
        code: "blue",
        rationale: "Painstaking, replicable experimental method as the core of her scientific identity.",
      },
      {
        framework: "bigfive",
        code: "conscientiousness-high",
        rationale: "Years of exhausting, repetitive processing of pitchblende ore to isolate a new element.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Marie_Curie_c._1920s.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Marie_Curie_c._1920s.jpg",
      license: "Public domain",
      attribution: "Henri Manuel, public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "richard-feynman",
    name: "Richard Feynman",
    category: "nobel-laureate",
    gender: "man",
    years: "1918–1988 · Nobel Prize in Physics, 1965",
    bio: "American theoretical physicist known for his work on quantum electrodynamics and for his popular lectures and memoirs.",
    typings: [
      {
        framework: "mbti",
        code: "ENTP",
        rationale:
          "Feynman built a public reputation on playful, exploratory problem-solving and storytelling (Surely You're Joking, Mr. Feynman), and was known to dislike rote formality in favor of reasoning things out from scratch, live.",
      },
      {
        framework: "colors",
        code: "yellow",
        rationale: "Taught and explained physics through humor, anecdote, and improvisation.",
      },
      {
        framework: "bigfive",
        code: "extraversion-high",
        rationale: "Sought out performance settings — public lectures, bongo playing, safe-cracking — alongside physics.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/0/06/Richard_Feynman_1959.png",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Richard_Feynman_1959.png",
      license: "Public domain",
      attribution: "The Big T (Caltech yearbook), 1959, public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "toni-morrison",
    name: "Toni Morrison",
    category: "nobel-laureate",
    gender: "woman",
    years: "1931–2019 · Nobel Prize in Literature, 1993",
    bio: "American novelist and editor whose work, including Beloved and Song of Solomon, explores Black American life and history.",
    typings: [
      {
        framework: "mbti",
        code: "INFJ",
        rationale:
          "Morrison's interviews consistently describe writing as excavating buried, unspoken truths about identity and history, approached with deliberate, unhurried craft rather than fast output.",
      },
      {
        framework: "colors",
        code: "green",
        rationale: "Work centers on giving voice to overlooked interior lives and generational pain.",
      },
      {
        framework: "bigfive",
        code: "openness-high",
        rationale: "Structurally experimental novels built around non-linear, layered narrative forms.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Toni_Morrison.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Toni_Morrison.jpg",
      license: "CC BY-SA 2.0",
      attribution: "John Mathew Smith, CC BY-SA 2.0, via Wikimedia Commons",
    },
  },
  {
    slug: "ernest-hemingway",
    name: "Ernest Hemingway",
    category: "nobel-laureate",
    gender: "man",
    years: "1899–1961 · Nobel Prize in Literature, 1954",
    bio: "American novelist and journalist known for a spare, understated prose style and a life spent in war reporting, hunting, and fishing.",
    typings: [
      {
        framework: "mbti",
        code: "ISTP",
        rationale:
          "Hemingway's terse, action-first prose style mirrored a well-documented life built around hands-on pursuits — war reporting, big-game hunting, deep-sea fishing — over reflection or introspection.",
      },
      {
        framework: "colors",
        code: "red",
        rationale: "A public persona built around action, risk, and direct physical experience.",
      },
      {
        framework: "bigfive",
        code: "extraversion-high",
        rationale: "Sought out war zones, expatriate social circles, and physically demanding pursuits.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/2/28/ErnestHemingway.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:ErnestHemingway.jpg",
      license: "Public domain (PD-US-not-renewed)",
      attribution: "Lloyd Arnold, public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "gabriel-garcia-marquez",
    name: "Gabriel García Márquez",
    category: "nobel-laureate",
    gender: "man",
    years: "1927–2014 · Nobel Prize in Literature, 1982",
    bio: "Colombian novelist and journalist, a central figure of magical realism, best known for One Hundred Years of Solitude.",
    typings: [
      {
        framework: "mbti",
        code: "INFP",
        rationale:
          "García Márquez described his own fiction as inseparable from felt emotional truth over strict realism — his own explanation of \"magical realism\" in interviews was that it reflected how Latin American life actually felt, not a literary trick.",
      },
      {
        framework: "colors",
        code: "yellow",
        rationale: "Prose built around wonder, myth, and larger-than-life possibility.",
      },
      {
        framework: "bigfive",
        code: "openness-high",
        rationale: "Built a signature literary style by blending the fantastical directly into the everyday.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Gabriel_Garcia_Marquez.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Gabriel_Garcia_Marquez.jpg",
      license: "CC BY-SA 2.0",
      attribution: "Jose Lara, CC BY-SA 2.0, via Wikimedia Commons",
    },
  },
  {
    slug: "nelson-mandela",
    name: "Nelson Mandela",
    category: "nobel-laureate",
    gender: "man",
    years: "1918–2013 · Nobel Peace Prize, 1993",
    bio: "South African anti-apartheid leader and the country's first democratically elected president, imprisoned for 27 years before leading its transition to democracy.",
    typings: [
      {
        framework: "mbti",
        code: "ISFJ",
        rationale:
          "Mandela's 27 years of imprisonment were followed by a well-documented commitment to reconciliation over retribution; he consistently prioritized steady, dutiful process (the Truth and Reconciliation process) over dramatic gesture.",
      },
      {
        framework: "colors",
        code: "green",
        rationale: "Leadership defined by patience, steadiness, and reconciliation rather than confrontation.",
      },
      {
        framework: "bigfive",
        code: "agreeableness-high",
        rationale: "Publicly and repeatedly chose reconciliation with former political opponents over retribution.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/0/02/Nelson_Mandela_1994.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Nelson_Mandela_1994.jpg",
      license: "CC BY-SA 2.0",
      attribution: "John Mathew Smith, CC BY-SA 2.0, via Wikimedia Commons",
    },
  },
  {
    slug: "malala-yousafzai",
    name: "Malala Yousafzai",
    category: "nobel-laureate",
    gender: "woman",
    years: "1997– · Nobel Peace Prize, 2014",
    bio: "Pakistani education activist who survived an assassination attempt for advocating girls' education and became the youngest-ever Nobel laureate.",
    typings: [
      {
        framework: "mbti",
        code: "ENFJ",
        rationale:
          "Yousafzai turned a personal, near-fatal attack into a sustained global advocacy platform, with public speaking and direct engagement as her core method rather than working behind the scenes.",
      },
      {
        framework: "colors",
        code: "yellow",
        rationale: "Advocacy built on public storytelling and direct audience connection.",
      },
      {
        framework: "bigfive",
        code: "conscientiousness-high",
        rationale: "Sustained, structured global advocacy work (the Malala Fund) rather than a single moment of attention.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/0/03/Malala_Yousafzai_2023_portrait_2x3.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Malala_Yousafzai_2023_portrait_2x3.jpg",
      license: "CC BY 2.0",
      attribution: "flowcomm, CC BY 2.0, via Wikimedia Commons",
    },
  },
  {
    slug: "desmond-tutu",
    name: "Desmond Tutu",
    category: "nobel-laureate",
    gender: "man",
    years: "1931–2021 · Nobel Peace Prize, 1984",
    bio: "South African Anglican archbishop and anti-apartheid activist who chaired the Truth and Reconciliation Commission.",
    typings: [
      {
        framework: "mbti",
        code: "ENFJ",
        rationale:
          "Tutu led South Africa's Truth and Reconciliation Commission with a documented public style mixing warmth, humor, and moral urgency rather than a purely procedural or legalistic approach.",
      },
      {
        framework: "colors",
        code: "yellow",
        rationale: "Public presence known for warmth and humor even in the most difficult hearings.",
      },
      {
        framework: "bigfive",
        code: "extraversion-high",
        rationale: "Highly public, vocal moral leadership role sustained across decades.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Archbishop-Tutu-medium.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Archbishop-Tutu-medium.jpg",
      license: "Public domain",
      attribution: "Benny Gool, public domain, via Wikimedia Commons",
    },
  },

  // ---- Entertainment ----
  {
    slug: "meryl-streep",
    name: "Meryl Streep",
    category: "entertainment",
    gender: "woman",
    years: "1949–",
    bio: "American actress widely regarded as one of the most acclaimed of her generation, with a record number of Academy Award nominations.",
    typings: [
      {
        framework: "mbti",
        code: "INFJ",
        rationale:
          "Streep's preparation process — dialect coaches, months of research per role — is widely documented by directors and co-stars as immersive and deeply internal before a single scene is shot.",
      },
      {
        framework: "colors",
        code: "blue",
        rationale: "Reported preparation is research-driven and exacting rather than instinctive or improvised.",
      },
      {
        framework: "bigfive",
        code: "openness-high",
        rationale: "A career built on range across dramatically different characters, accents, and genres.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Meryl_Streep-_Press_conference_for_the_film_%22The_Devil_Wears_Prada_2%22_-_55194765350_%28cropped1%29.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Meryl_Streep-_Press_conference_for_the_film_%22The_Devil_Wears_Prada_2%22_-_55194765350_(cropped1).jpg",
      license: "CC BY-SA 4.0",
      attribution: "Ministry of Culture, Sports and Tourism/Lee Jeong-woo, CC BY-SA 4.0, via Wikimedia Commons",
    },
  },
  {
    slug: "tom-hanks",
    name: "Tom Hanks",
    category: "entertainment",
    gender: "man",
    years: "1956–",
    bio: "American actor and filmmaker known for roles in Forrest Gump, Cast Away, and Saving Private Ryan, and a long-standing public reputation for approachability.",
    typings: [
      {
        framework: "mbti",
        code: "ISFJ",
        rationale:
          "Co-stars and crew across decades of interviews describe Hanks as reliable, warm on set, and low-drama — a reputation for steady professionalism rather than volatility or self-promotion.",
      },
      {
        framework: "colors",
        code: "green",
        rationale: "Widely and consistently described as easy to work with and considerate toward crews.",
      },
      {
        framework: "bigfive",
        code: "agreeableness-high",
        rationale: "A public persona built specifically around warmth and likability, sustained for decades.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/3/39/TomHanksPrincEdw031223_%2811_of_41%29_%28cropped%29.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:TomHanksPrincEdw031223_(11_of_41)_(cropped).jpg",
      license: "CC BY 2.0",
      attribution: "Raph_PH, CC BY 2.0, via Wikimedia Commons",
    },
  },
  {
    slug: "audrey-hepburn",
    name: "Audrey Hepburn",
    category: "entertainment",
    gender: "woman",
    years: "1929–1993",
    bio: "British actress and humanitarian, a leading Hollywood star of the 1950s–60s who later devoted much of her life to UNICEF field work.",
    typings: [
      {
        framework: "mbti",
        code: "INFJ",
        rationale:
          "Hepburn shifted her public focus to UNICEF humanitarian field visits later in life, and colleagues described her as quietly principled rather than driven by self-promotion.",
      },
      {
        framework: "colors",
        code: "green",
        rationale: "Later career centered on service and advocacy rather than continued star visibility.",
      },
      {
        framework: "bigfive",
        code: "agreeableness-high",
        rationale: "Spent her final years in direct field work for children in crisis regions.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/7/74/AudreyKHepburn.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:AudreyKHepburn.jpg",
      license: "Public domain",
      attribution: "Bud Fraker, public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "robin-williams",
    name: "Robin Williams",
    category: "entertainment",
    gender: "man",
    years: "1951–2014",
    bio: "American actor and comedian known for rapid-fire improvisational comedy and roles spanning Mrs. Doubtfire to Good Will Hunting.",
    typings: [
      {
        framework: "mbti",
        code: "ENFP",
        rationale:
          "Williams was famous for unscripted, associative improvisation in both interviews and performance — longtime collaborators describe him as constantly generating alternate bits in real time.",
      },
      {
        framework: "colors",
        code: "yellow",
        rationale: "Comedy built on spontaneity, rapid association, and audience energy.",
      },
      {
        framework: "bigfive",
        code: "openness-high",
        rationale: "Range spanning manic comedy to serious dramatic roles, often departing from a scripted line.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Robin_Williams_1996_%28cropped%29_2.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Robin_Williams_1996_(cropped)_2.jpg",
      license: "CC BY-SA 2.0",
      attribution: "Kingkongphoto/John Mathew Smith, CC BY-SA 2.0, via Wikimedia Commons",
    },
  },
  {
    slug: "denzel-washington",
    name: "Denzel Washington",
    category: "entertainment",
    gender: "man",
    years: "1954–",
    bio: "American actor and director with a career spanning Malcolm X, Training Day, and Fences, and two Academy Awards.",
    typings: [
      {
        framework: "mbti",
        code: "ISTJ",
        rationale:
          "Washington has described a disciplined, faith- and work-ethic-driven approach in his own interviews, and directors note he prioritizes preparation and control over spontaneity on set.",
      },
      {
        framework: "colors",
        code: "red",
        rationale: "Known for commanding, decisive on-screen presence and directness in interviews.",
      },
      {
        framework: "bigfive",
        code: "conscientiousness-high",
        rationale: "Publicly attributes his career longevity to discipline and preparation over talent alone.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Denzel_Washington_at_the_2025_Cannes_Film_Festival.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Denzel_Washington_at_the_2025_Cannes_Film_Festival.jpg",
      license: "CC BY-SA 4.0",
      attribution: "Gabriel Hutchinson/WikiPortraits, CC BY-SA 4.0, via Wikimedia Commons",
    },
  },
  {
    slug: "oprah-winfrey",
    name: "Oprah Winfrey",
    category: "entertainment",
    gender: "woman",
    years: "1954–",
    bio: "American media executive and talk-show host who built a decades-long career and media company around long-form interviews.",
    typings: [
      {
        framework: "mbti",
        code: "ENFJ",
        rationale:
          "Winfrey built a media empire specifically on drawing out other people's stories and connecting with a mass audience emotionally, both on-air and through her production company.",
      },
      {
        framework: "colors",
        code: "yellow",
        rationale: "Interview style built around warmth, emotional connection, and audience rapport.",
      },
      {
        framework: "bigfive",
        code: "extraversion-high",
        rationale: "A career and business built entirely around live, public conversation.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Oprah_Winfrey_2016.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Oprah_Winfrey_2016.jpg",
      license: "Public domain",
      attribution: "US Embassy South Africa, public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "keanu-reeves",
    name: "Keanu Reeves",
    category: "entertainment",
    gender: "man",
    years: "1964–",
    bio: "Canadian actor known for roles in The Matrix and John Wick, and a widely reported public reputation for quiet generosity.",
    typings: [
      {
        framework: "mbti",
        code: "ISFP",
        rationale:
          "Reeves is consistently described by crew members in widely reported anecdotes as quiet, self-effacing, and personally generous off-camera despite blockbuster-level fame.",
      },
      {
        framework: "colors",
        code: "green",
        rationale: "Reported behavior toward crews and fans is consistently low-key and considerate.",
      },
      {
        framework: "bigfive",
        code: "agreeableness-high",
        rationale: "Numerous independently reported instances of quiet generosity toward crew and strangers.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Keanu_Reeves_at_TIFF_2025_02_%28Cropped%29.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Keanu_Reeves_at_TIFF_2025_02_(Cropped).jpg",
      license: "CC BY-SA 4.0",
      attribution: "Gabriel Hutchinson/WikiPortraits, CC BY-SA 4.0, via Wikimedia Commons",
    },
  },
  {
    slug: "emma-watson",
    name: "Emma Watson",
    category: "entertainment",
    gender: "woman",
    years: "1990–",
    bio: "British actress known for the Harry Potter film series, and a UN Women Goodwill Ambassador for gender equality.",
    typings: [
      {
        framework: "mbti",
        code: "INFJ",
        rationale:
          "Watson paused acting to complete a university degree and became a deliberate, research-grounded UN gender-equality advocate, a documented shift toward substance over continued screen visibility.",
      },
      {
        framework: "colors",
        code: "blue",
        rationale: "Advocacy work is research- and policy-grounded rather than purely symbolic.",
      },
      {
        framework: "bigfive",
        code: "openness-high",
        rationale: "Deliberately stepped outside the acting career track to pursue academic study and activism.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Emma_Watson_2013.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Emma_Watson_2013.jpg",
      license: "CC BY-SA 3.0",
      attribution: "Georges Biard, CC BY-SA 3.0, via Wikimedia Commons",
    },
  },

  // ---- Politicians ----
  {
    slug: "abraham-lincoln",
    name: "Abraham Lincoln",
    category: "politician",
    gender: "man",
    years: "1809–1865 · 16th U.S. President",
    bio: "16th President of the United States, who led the country through the Civil War and issued the Emancipation Proclamation.",
    typings: [
      {
        framework: "mbti",
        code: "INFJ",
        rationale:
          "Lincoln is documented to have deliberated privately for months before major decisions — the Emancipation Proclamation was drafted and held back until the political moment was right — and was a reluctant public speaker earlier in his career.",
      },
      {
        framework: "colors",
        code: "blue",
        rationale: "Decisions were reasoned through carefully in private before being announced publicly.",
      },
      {
        framework: "bigfive",
        code: "conscientiousness-high",
        rationale: "Extended, deliberate private drafting process before major policy actions.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/5/57/Abraham_Lincoln_1863_Portrait_%283x4_cropped%29.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Abraham_Lincoln_1863_Portrait_(3x4_cropped).jpg",
      license: "Public domain",
      attribution: "Alexander Gardner, public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "winston-churchill",
    name: "Winston Churchill",
    category: "politician",
    gender: "man",
    years: "1874–1965 · UK Prime Minister",
    bio: "British statesman who served as Prime Minister during World War II, known for his wartime speeches and leadership.",
    typings: [
      {
        framework: "mbti",
        code: "ENTJ",
        rationale:
          "Churchill's wartime command style was decisive and combative, and his documented output — speeches, books, memoranda — reflects a leader driven by sheer force of will and public rhetoric.",
      },
      {
        framework: "colors",
        code: "red",
        rationale: "Direct, combative rhetorical style built around decisive action over consensus-building.",
      },
      {
        framework: "bigfive",
        code: "extraversion-high",
        rationale: "Built wartime leadership substantially around public speeches and broadcasts.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/0/02/Sir_Winston_Churchill_-_19086236948_%28restored%29.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Sir_Winston_Churchill_-_19086236948_(restored).jpg",
      license: "Public domain",
      attribution: "Yousuf Karsh, public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "franklin-d-roosevelt",
    name: "Franklin D. Roosevelt",
    category: "politician",
    gender: "man",
    years: "1882–1945 · 32nd U.S. President",
    bio: "32nd President of the United States, who led the country through the Great Depression and most of World War II.",
    typings: [
      {
        framework: "mbti",
        code: "ENFJ",
        rationale:
          "Roosevelt's fireside chats were deliberately built around projecting personal warmth and reassurance directly to the public during national crisis, a signature communication choice of his presidency.",
      },
      {
        framework: "colors",
        code: "yellow",
        rationale: "Public communication built on optimism and personal reassurance during crisis.",
      },
      {
        framework: "bigfive",
        code: "extraversion-high",
        rationale: "Pioneered direct, warm radio communication with the public as a core governing tool.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/f/fd/FDR-1944-Campaign-Portrait_%283x4_retouched%2C_cropped%29.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:FDR-1944-Campaign-Portrait_(3x4_retouched,_cropped).jpg",
      license: "CC BY 2.0",
      attribution: "Leon Perskie, CC BY 2.0, via Wikimedia Commons",
    },
  },
  {
    slug: "eleanor-roosevelt",
    name: "Eleanor Roosevelt",
    category: "politician",
    gender: "woman",
    years: "1884–1962 · First Lady & UN diplomat",
    bio: "American diplomat and activist, First Lady of the United States, and a lead drafter of the Universal Declaration of Human Rights.",
    typings: [
      {
        framework: "mbti",
        code: "INFJ",
        rationale:
          "Roosevelt sustained decades of values-first advocacy — most notably chairing the drafting committee for the UN Declaration of Human Rights — over political theater or short-term visibility.",
      },
      {
        framework: "colors",
        code: "green",
        rationale: "Work centered on sustained advocacy for the vulnerable rather than personal political ambition.",
      },
      {
        framework: "bigfive",
        code: "agreeableness-high",
        rationale: "Career built around advocacy for civil rights and humanitarian causes.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Eleanor_Roosevelt_at_the_United_Nations%2C_circa_1946-1947_%283x4_cropped%29.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Eleanor_Roosevelt_at_the_United_Nations,_circa_1946-1947_(3x4_cropped).jpg",
      license: "CC BY 2.0",
      attribution: "FDR Presidential Library & Museum, CC BY 2.0, via Wikimedia Commons",
    },
  },
  {
    slug: "margaret-thatcher",
    name: "Margaret Thatcher",
    category: "politician",
    gender: "woman",
    years: "1925–2013 · UK Prime Minister",
    bio: "British stateswoman who served as Prime Minister from 1979–1990, the first woman to hold the office.",
    typings: [
      {
        framework: "mbti",
        code: "ESTJ",
        rationale:
          "Thatcher's public record shows a documented preference for direct confrontation and firm policy stances over consensus-seeking, summarized in her own words: \"The lady's not for turning.\"",
      },
      {
        framework: "colors",
        code: "red",
        rationale: "Governing style publicly built around firmness and resistance to compromise.",
      },
      {
        framework: "bigfive",
        code: "conscientiousness-high",
        rationale: "Trained as a chemist; brought a methodical, policy-first approach to governing.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/4/47/Margaret_Thatcher_stock_portrait_%282%29_%28cropped%29.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Margaret_Thatcher_stock_portrait_(2)_(cropped).jpg",
      license: "Copyrighted free use (released by copyright holder)",
      attribution: "Copyright holder released for free use, via Wikimedia Commons",
    },
  },
  {
    slug: "ronald-reagan",
    name: "Ronald Reagan",
    category: "politician",
    gender: "man",
    years: "1911–2004 · 40th U.S. President",
    bio: "40th President of the United States and former actor, known for his communication style and economic policies.",
    typings: [
      {
        framework: "mbti",
        code: "ESFJ",
        rationale:
          "Reagan's career, both as an actor and as \"The Great Communicator,\" was built on warm, reassuring public communication, with a well-documented preference for optimistic framing.",
      },
      {
        framework: "colors",
        code: "yellow",
        rationale: "Communication style centered on optimism and personal warmth toward the audience.",
      },
      {
        framework: "bigfive",
        code: "extraversion-high",
        rationale: "A career built almost entirely on public performance, from film to televised addresses.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/1/16/Official_Portrait_of_President_Reagan_1981.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Official_Portrait_of_President_Reagan_1981.jpg",
      license: "Public domain",
      attribution: "Michael Evans, White House, public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "mahatma-gandhi",
    name: "Mahatma Gandhi",
    category: "politician",
    gender: "man",
    years: "1869–1948 · Independence movement leader",
    bio: "Indian lawyer and independence leader who pioneered nonviolent civil disobedience against British colonial rule.",
    typings: [
      {
        framework: "mbti",
        code: "INFJ",
        rationale:
          "Gandhi sustained decades of principled, nonviolent civil disobedience organized around a consistent internal moral framework, documented across a lifetime of writing and public action.",
      },
      {
        framework: "colors",
        code: "green",
        rationale: "Strategy built on patience, self-discipline, and moral consistency over confrontation.",
      },
      {
        framework: "bigfive",
        code: "conscientiousness-high",
        rationale: "Decades-long, self-imposed personal discipline in service of a single sustained cause.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Mahatma-Gandhi%2C_studio%2C_1931.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Mahatma-Gandhi,_studio,_1931.jpg",
      license: "Public domain",
      attribution: "Elliott & Fry, public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "barack-obama",
    name: "Barack Obama",
    category: "politician",
    gender: "man",
    years: "1961– · 44th U.S. President",
    bio: "44th President of the United States, previously a U.S. Senator and constitutional law lecturer.",
    typings: [
      {
        framework: "mbti",
        code: "INFJ",
        rationale:
          "Obama's staff repeatedly described a reflective, deliberative decision style publicly nicknamed \"no-drama Obama,\" consistent with his background as a law-review editor and constitutional-law lecturer.",
      },
      {
        framework: "colors",
        code: "blue",
        rationale: "Widely reported preference for careful, methodical deliberation before major decisions.",
      },
      {
        framework: "bigfive",
        code: "openness-high",
        rationale: "Academic and writing background (two bestselling memoirs) emphasizing reflection and nuance.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/8/8d/President_Barack_Obama.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:President_Barack_Obama.jpg",
      license: "Public domain",
      attribution: "Official White House Photo by Pete Souza, public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "angela-merkel",
    name: "Angela Merkel",
    category: "politician",
    gender: "woman",
    years: "1954– · German Chancellor",
    bio: "German Chancellor from 2005–2021, previously a research scientist with a doctorate in quantum chemistry.",
    typings: [
      {
        framework: "mbti",
        code: "ISTJ",
        rationale:
          "Merkel trained as a scientist before entering politics, and is widely and consistently described as governing with a methodical, low-drama, data-first style over charisma-driven leadership.",
      },
      {
        framework: "colors",
        code: "blue",
        rationale: "Scientific training and a governing style built around careful, evidence-based deliberation.",
      },
      {
        framework: "bigfive",
        code: "conscientiousness-high",
        rationale: "Long tenure marked by procedural caution and incrementalism over bold, fast moves.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Angela_Merkel_2019_cropped.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Angela_Merkel_2019_cropped.jpg",
      license: "CC BY-SA 4.0",
      attribution: "Raimond Spekking, CC BY-SA 4.0, via Wikimedia Commons",
    },
  },
  // ---- Business & Innovation ----
  {
    slug: "steve-jobs",
    name: "Steve Jobs",
    category: "business",
    gender: "man",
    years: "1955–2011",
    bio: "American entrepreneur and co-founder of Apple, who drove the design of the Macintosh, iPod, iPhone, and iPad.",
    typings: [
      {
        framework: "mbti",
        code: "ENTJ",
        rationale:
          "Isaacson's biography documents Jobs repeatedly overriding others' input to chase his own product vision — from the original Mac's sealed case to the iPhone's touchscreen-only design — described by colleagues as commanding and confrontational in pursuit of it.",
      },
      {
        framework: "colors",
        code: "red",
        rationale: "Publicly documented as blunt, results-focused, and unwilling to compromise on product decisions.",
      },
      {
        framework: "bigfive",
        code: "openness-high",
        rationale: "Repeatedly bet the company on unproven product categories rather than iterate on what already worked.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/5/51/Steve_Jobs_Headshot_2010_(cropped_4).jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Steve_Jobs_Headshot_2010_(cropped_4).jpg",
      license: "CC BY-SA 3.0",
      attribution: "Matthew Yohe, CC BY-SA 3.0, via Wikimedia Commons",
    },
  },
  {
    slug: "bill-gates",
    name: "Bill Gates",
    category: "business",
    gender: "man",
    years: "1955–",
    bio: "American entrepreneur and co-founder of Microsoft, later a global-health philanthropist through the Gates Foundation.",
    typings: [
      {
        framework: "mbti",
        code: "INTJ",
        rationale:
          "Documented as spending solitary 'Think Weeks' reading technical papers, and colleagues describe grueling, detail-level interrogation of engineers' code and business plans rather than delegating strategy.",
      },
      {
        framework: "colors",
        code: "blue",
        rationale: "A systemizing, detail-driven approach to both software strategy and philanthropic giving.",
      },
      {
        framework: "bigfive",
        code: "openness-high",
        rationale: "Long-documented pattern of deep, self-directed reading across unrelated technical fields.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Bill_Gates_at_the_European_Commission_-_P067383-987995_(cropped)_5.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Bill_Gates_at_the_European_Commission_-_P067383-987995_(cropped)_5.jpg",
      license: "CC BY 4.0",
      attribution: "Bogdan Hoyaux / European Union, CC BY 4.0, via Wikimedia Commons",
    },
  },
  {
    slug: "warren-buffett",
    name: "Warren Buffett",
    category: "business",
    gender: "man",
    years: "1930–",
    bio: "American investor and longtime chairman of Berkshire Hathaway, known for a decades-long value-investing approach.",
    typings: [
      {
        framework: "mbti",
        code: "ISTJ",
        rationale:
          "Six decades of the same value-investing discipline run from a modest Omaha office — publicly documented aversion to trend-chasing, and reads annual reports and filings for hours daily by his own account.",
      },
      {
        framework: "colors",
        code: "blue",
        rationale: "Investment decisions are documented as methodical and evidence-driven rather than impulsive.",
      },
      {
        framework: "bigfive",
        code: "conscientiousness-high",
        rationale: "An unbroken, decades-long adherence to the same disciplined investing process.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Warren_Buffett_at_the_2015_SelectUSA_Investment_Summit_(cropped).jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Warren_Buffett_at_the_2015_SelectUSA_Investment_Summit_(cropped).jpg",
      license: "Public domain",
      attribution: "U.S. International Trade Administration, public domain (U.S. government work), via Wikimedia Commons",
    },
  },
  {
    slug: "henry-ford",
    name: "Henry Ford",
    category: "business",
    gender: "man",
    years: "1863–1947",
    bio: "American industrialist who founded the Ford Motor Company and pioneered the moving assembly line for mass automobile production.",
    typings: [
      {
        framework: "mbti",
        code: "INTJ",
        rationale:
          "Spent years methodically re-engineering every step of production before the Model T, documented as relentlessly standardizing manufacturing around a single efficiency vision.",
      },
      {
        framework: "colors",
        code: "blue",
        rationale: "A career built on systematizing and optimizing a process rather than improvising it.",
      },
      {
        framework: "bigfive",
        code: "conscientiousness-high",
        rationale: "Years of iterative, disciplined refinement of the assembly line before it paid off.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/2/27/Henry_Ford_portrait_1915_original_(3x4_cropped).png",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Henry_Ford_portrait_1915_original_(3x4_cropped).png",
      license: "Public domain",
      attribution: "Ford Motor Company Photographic Department, public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "walt-disney",
    name: "Walt Disney",
    category: "business",
    gender: "man",
    years: "1901–1966",
    bio: "American animator and entrepreneur who founded The Walt Disney Company and pioneered feature-length animated film.",
    typings: [
      {
        framework: "mbti",
        code: "ENFP",
        rationale:
          "Bet the company multiple times on unproven ideas — a feature-length cartoon, then a theme park — driven by an enthusiastic personal vision that his own financiers reportedly doubted.",
      },
      {
        framework: "colors",
        code: "yellow",
        rationale: "Documented as an energetic idea-generator who sold collaborators on vision before proof existed.",
      },
      {
        framework: "bigfive",
        code: "openness-high",
        rationale: "Repeatedly pursued entirely new mediums (animation, theme parks) rather than stay in one lane.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/5/50/Walt_Disney_1946_(cropped2).JPG",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Walt_Disney_1946_(cropped2).JPG",
      license: "Public domain",
      attribution: "Boy Scouts of America, public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "coco-chanel",
    name: "Coco Chanel",
    category: "business",
    gender: "woman",
    years: "1883–1971",
    bio: "French fashion designer and founder of the Chanel fashion house, who redefined women's clothing in the early 20th century.",
    typings: [
      {
        framework: "mbti",
        code: "ESTJ",
        rationale:
          "Built and tightly controlled her fashion house for over five decades, documented by biographers as decisive and blunt, and unwilling to cede creative control even to close collaborators.",
      },
      {
        framework: "colors",
        code: "red",
        rationale: "A publicly documented preference for direct control and fast, firm decisions over consensus.",
      },
      {
        framework: "bigfive",
        code: "conscientiousness-high",
        rationale: "Sustained personal oversight of every product line across decades of the house's growth.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/2/22/Coco_Chanel_in_Los_Angeles,_1931_(cropped).jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Coco_Chanel_in_Los_Angeles,_1931_(cropped).jpg",
      license: "CC BY 4.0",
      attribution: "Los Angeles Times Photographic Collection, UCLA Library, CC BY 4.0, via Wikimedia Commons",
    },
  },
  {
    slug: "richard-branson",
    name: "Richard Branson",
    category: "business",
    gender: "man",
    years: "1950–",
    bio: "British entrepreneur and founder of the Virgin Group, spanning music, airlines, and commercial spaceflight.",
    typings: [
      {
        framework: "mbti",
        code: "ENTP",
        rationale:
          "Documented pattern of launching ventures across unrelated industries — records, airlines, space travel — driven by whatever new challenge currently interests him, by his own account.",
      },
      {
        framework: "colors",
        code: "yellow",
        rationale: "A publicity-driven, high-energy approach to building and promoting new ventures.",
      },
      {
        framework: "bigfive",
        code: "extraversion-high",
        rationale: "A public career built on stunts, launches, and constant new ventures rather than steady management of one.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Richard_Branson_Addresses_the_Our_Ocean_Conference_2015_in_Valpara%C3%ADso_(21783214958)_(cropped).jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Richard_Branson_Addresses_the_Our_Ocean_Conference_2015_in_Valpara%C3%ADso_(21783214958)_(cropped).jpg",
      license: "Public domain",
      attribution: "U.S. Department of State, public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "andrew-carnegie",
    name: "Andrew Carnegie",
    category: "business",
    gender: "man",
    years: "1835–1919",
    bio: "Scottish-American industrialist who built the Carnegie Steel Company and later gave away most of his fortune to public libraries and education.",
    typings: [
      {
        framework: "mbti",
        code: "ENTJ",
        rationale:
          "Built and consolidated an entire industry through aggressive vertical integration, then applied the same systematic drive to giving away nearly his whole fortune under a self-authored philanthropic doctrine.",
      },
      {
        framework: "colors",
        code: "red",
        rationale: "Documented as aggressive and decisive in both business consolidation and philanthropic strategy.",
      },
      {
        framework: "bigfive",
        code: "conscientiousness-high",
        rationale: "Applied one systematic framework across both an industrial empire and a philanthropic program.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Andrew_Carnegie,_by_Theodore_Marceau_(cropped)_(2).jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Andrew_Carnegie,_by_Theodore_Marceau_(cropped)_(2).jpg",
      license: "Public domain",
      attribution: "Theodore C. Marceau, public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "sara-blakely",
    name: "Sara Blakely",
    category: "business",
    gender: "woman",
    years: "1971–",
    bio: "American entrepreneur who founded Spanx and became the youngest self-made female billionaire.",
    typings: [
      {
        framework: "mbti",
        code: "ENFP",
        rationale:
          "Publicly describes pitching Spanx door-to-door for over a year on enthusiasm and personal conviction before any retailer or manufacturer took her seriously.",
      },
      {
        framework: "colors",
        code: "yellow",
        rationale: "A documented sales approach built on personal enthusiasm and storytelling over formal pitches.",
      },
      {
        framework: "bigfive",
        code: "extraversion-high",
        rationale: "Credits repeated in-person rejection and pitching as central to how the company got built.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Sara_Blakely.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Sara_Blakely.jpg",
      license: "CC BY-SA 4.0",
      attribution: "Gillian Zoe Segal, CC BY-SA 4.0, via Wikimedia Commons",
    },
  },
  // ---- Athletes ----
  {
    slug: "michael-jordan",
    name: "Michael Jordan",
    category: "athlete",
    gender: "man",
    years: "1963–",
    bio: "American basketball player widely regarded as one of the greatest in NBA history, who won six championships with the Chicago Bulls.",
    typings: [
      {
        framework: "mbti",
        code: "ESTP",
        rationale:
          "The Last Dance documents him manufacturing rivalries out of minor, sometimes imagined slights specifically to fuel game-day intensity, a pattern teammates and coaches describe as constant across his career.",
      },
      {
        framework: "colors",
        code: "red",
        rationale: "A competitive style built around dominance and results over collaboration or patience.",
      },
      {
        framework: "bigfive",
        code: "extraversion-high",
        rationale: "Thrived specifically on high-pressure, public, in-the-moment competition.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Michael_Jordan_in_2014.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Michael_Jordan_in_2014.jpg",
      license: "Public domain",
      attribution: "DoD photo by D. Myles Cullen, public domain (U.S. government work), via Wikimedia Commons",
    },
  },
  {
    slug: "serena-williams",
    name: "Serena Williams",
    category: "athlete",
    gender: "woman",
    years: "1981–",
    bio: "American tennis player who won 23 Grand Slam singles titles across one of the most dominant careers in the sport's history.",
    typings: [
      {
        framework: "mbti",
        code: "ESTJ",
        rationale:
          "Sustained an elite competitive career for over two decades through a documented, highly disciplined training regimen, and has been publicly direct about setting explicit goals and pursuing them methodically.",
      },
      {
        framework: "colors",
        code: "red",
        rationale: "A documented, direct competitive style focused on results over crowd-pleasing flair.",
      },
      {
        framework: "bigfive",
        code: "conscientiousness-high",
        rationale: "A multi-decade career sustained through disciplined training rather than raw talent alone.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Guests_at_the_2026_Met_Gala_209_(cropped).jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Guests_at_the_2026_Met_Gala_209_(cropped).jpg",
      license: "CC BY 4.0",
      attribution: "SWinxy, CC BY 4.0, via Wikimedia Commons",
    },
  },
  {
    slug: "muhammad-ali",
    name: "Muhammad Ali",
    category: "athlete",
    gender: "man",
    years: "1942–2016",
    bio: "American boxer and three-time heavyweight champion known for his speed, showmanship, and activism outside the ring.",
    typings: [
      {
        framework: "mbti",
        code: "ENFP",
        rationale:
          "Built a public persona explicitly around performance and self-created narrative — predictions, poetry, trash talk — while also risking his career on a principled public stand against the Vietnam draft.",
      },
      {
        framework: "colors",
        code: "yellow",
        rationale: "A career built on charisma and public performance as much as athletic skill.",
      },
      {
        framework: "bigfive",
        code: "extraversion-high",
        rationale: "Documented as constantly generating public narrative and performance around his own fights.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/8/89/Muhammad_Ali_NYWTS.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Muhammad_Ali_NYWTS.jpg",
      license: "Public domain",
      attribution: "Ira Rosenberg, World Journal Tribune photo, public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "usain-bolt",
    name: "Usain Bolt",
    category: "athlete",
    gender: "man",
    years: "1986–",
    bio: "Jamaican sprinter and eight-time Olympic gold medalist, holder of the world records in the 100m and 200m.",
    typings: [
      {
        framework: "mbti",
        code: "ESFP",
        rationale:
          "Widely documented for showmanship before and after races, including his trademark pose, even at the Olympic final level, describing himself in interviews as motivated by enjoying the moment over grinding preparation.",
      },
      {
        framework: "colors",
        code: "yellow",
        rationale: "A documented public persona built on enjoyment and performance rather than stoic focus.",
      },
      {
        framework: "bigfive",
        code: "extraversion-high",
        rationale: "Consistently described as drawing energy from the crowd and the moment itself.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Usain_Bolt_Lightning_pose.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Usain_Bolt_Lightning_pose.jpg",
      license: "CC BY 2.0",
      attribution: "Brunel University, CC BY 2.0, via Wikimedia Commons",
    },
  },
  {
    slug: "simone-biles",
    name: "Simone Biles",
    category: "athlete",
    gender: "woman",
    years: "1997–",
    bio: "American gymnast and the most decorated gymnast in World Championship history.",
    typings: [
      {
        framework: "mbti",
        code: "ISTJ",
        rationale:
          "Trains skills few gymnasts attempt due to injury risk through incremental, highly methodical repetition, and publicly withdrew from the Tokyo Olympics team final over safety and mental-clarity concerns rather than push through by feel.",
      },
      {
        framework: "colors",
        code: "blue",
        rationale: "A documented preference for careful, methodical skill-building over risk-taking by feel.",
      },
      {
        framework: "bigfive",
        code: "conscientiousness-high",
        rationale: "Publicly prioritized safety and preparation over performing through underlying doubt.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Simone_Biles_National_Team_2024.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Simone_Biles_National_Team_2024.jpg",
      license: "CC BY-SA 4.0",
      attribution: "Ocoudis, CC BY-SA 4.0, via Wikimedia Commons",
    },
  },
  {
    slug: "michael-phelps",
    name: "Michael Phelps",
    category: "athlete",
    gender: "man",
    years: "1985–",
    bio: "American swimmer and the most decorated Olympian of all time, with 23 gold medals.",
    typings: [
      {
        framework: "mbti",
        code: "ISTJ",
        rationale:
          "Documented as following the same rigid daily training routine — including swimming every single day for years without exception — built by his coach, crediting that unbroken structure for his medal count.",
      },
      {
        framework: "colors",
        code: "blue",
        rationale: "A career built on an unwavering, repeatable routine rather than variable, instinctive training.",
      },
      {
        framework: "bigfive",
        code: "conscientiousness-high",
        rationale: "Years of daily, uninterrupted adherence to a fixed training structure.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Michael_Phelps_Rio_Olympics_2016.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Michael_Phelps_Rio_Olympics_2016.jpg",
      license: "CC BY 2.0",
      attribution: "Fernando Frazão/Agência Brasil Fotografias, CC BY 2.0, via Wikimedia Commons",
    },
  },
  {
    slug: "billie-jean-king",
    name: "Billie Jean King",
    category: "athlete",
    gender: "woman",
    years: "1943–",
    bio: "American tennis player and activist who won 39 Grand Slam titles and founded the Women's Tennis Association.",
    typings: [
      {
        framework: "mbti",
        code: "ENTJ",
        rationale:
          "Organized and led the founding of the Women's Tennis Association and the 'Battle of the Sexes' match as strategic, public confrontations with unequal pay in tennis, described by peers as a driven organizer as much as a player.",
      },
      {
        framework: "colors",
        code: "red",
        rationale: "A documented preference for direct confrontation of unequal treatment over quiet advocacy.",
      },
      {
        framework: "bigfive",
        code: "extraversion-high",
        rationale: "Built institutions (the WTA) rather than only competing within existing ones.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Billie_Jean_King_at_the_2026_Sundance_Film_Festival_02_(crop_2).jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Billie_Jean_King_at_the_2026_Sundance_Film_Festival_02_(crop_2).jpg",
      license: "CC BY-SA 4.0",
      attribution: "Claire Fridkin / WikiPortraits, CC BY-SA 4.0, via Wikimedia Commons",
    },
  },
  {
    slug: "pele",
    name: "Pelé",
    category: "athlete",
    gender: "man",
    years: "1940–2022",
    bio: "Brazilian footballer widely regarded as one of the greatest players of all time, a three-time World Cup winner.",
    typings: [
      {
        framework: "mbti",
        code: "ESFP",
        rationale:
          "Known throughout his career for improvisational, joyful flair on the field, and described by teammates as thriving on the crowd's energy in the moment rather than rigid tactical structure.",
      },
      {
        framework: "colors",
        code: "yellow",
        rationale: "A playing style defined by spontaneous flair and crowd-facing joy over tactical rigidity.",
      },
      {
        framework: "bigfive",
        code: "extraversion-high",
        rationale: "Documented as playing to and drawing energy from the crowd throughout his career.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Pele_con_brasil_(cropped).jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Pele_con_brasil_(cropped).jpg",
      license: "Public domain",
      attribution: "El Gráfico, public domain, via Wikimedia Commons",
    },
  },
  // ---- Artists & Musicians ----
  {
    slug: "frida-kahlo",
    name: "Frida Kahlo",
    category: "artist",
    gender: "woman",
    years: "1907–1954",
    bio: "Mexican painter known for surrealist and folk-influenced self-portraits exploring identity, pain, and Mexican culture.",
    typings: [
      {
        framework: "mbti",
        code: "INFJ",
        rationale:
          "Turned decades of chronic physical pain and personal turmoil into repeated, unflinching self-portraiture, describing her own work as painting 'my own reality' rather than external subjects.",
      },
      {
        framework: "colors",
        code: "green",
        rationale: "Work is rooted in deeply personal, internal experience processed through a consistent visual language.",
      },
      {
        framework: "bigfive",
        code: "openness-high",
        rationale: "A body of work defined by symbolic, unconventional imagery rather than realism.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/0/06/Frida_Kahlo,_by_Guillermo_Kahlo.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Frida_Kahlo,_by_Guillermo_Kahlo.jpg",
      license: "Public domain",
      attribution: "Guillermo Kahlo, public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "pablo-picasso",
    name: "Pablo Picasso",
    category: "artist",
    gender: "man",
    years: "1881–1973",
    bio: "Spanish painter and sculptor who co-founded Cubism and remained one of the most influential artists of the 20th century.",
    typings: [
      {
        framework: "mbti",
        code: "ENTP",
        rationale:
          "Deliberately abandoned his own successful styles multiple times over a 70-year career — the Blue Period, then Cubism, then Neoclassicism — purely to keep exploring new formal problems.",
      },
      {
        framework: "colors",
        code: "yellow",
        rationale: "An enormous, constantly shifting output driven by restless exploration over refinement of one style.",
      },
      {
        framework: "bigfive",
        code: "openness-high",
        rationale: "Repeatedly discarded proven, successful approaches to pursue unexplored ones.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/9/98/Pablo_picasso_1.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Pablo_picasso_1.jpg",
      license: "Public domain",
      attribution: "Revista Vea y Lea (Argentina), public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "vincent-van-gogh",
    name: "Vincent van Gogh",
    category: "artist",
    gender: "man",
    years: "1853–1890",
    bio: "Dutch post-Impressionist painter known for bold color and emotional intensity, largely unrecognized until after his death.",
    typings: [
      {
        framework: "mbti",
        code: "INFP",
        rationale:
          "His surviving letters to his brother Theo describe painting as an outlet for intense, direct emotional experience rather than technical planning, producing over 800 paintings in roughly a decade driven by that urgency.",
      },
      {
        framework: "colors",
        code: "yellow",
        rationale: "Work defined by raw, immediate emotional expression rather than careful, deliberate technique.",
      },
      {
        framework: "bigfive",
        code: "openness-high",
        rationale: "An intensely personal, unconventional visual style pursued despite a lack of recognition.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_(454045).jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Self-Portrait_-_Google_Art_Project_(454045).jpg",
      license: "Public domain",
      attribution: "Vincent van Gogh (self-portrait painting), public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "ludwig-van-beethoven",
    name: "Ludwig van Beethoven",
    category: "artist",
    gender: "man",
    years: "1770–1827",
    bio: "German composer and pianist who bridged the Classical and Romantic eras, composing some of his most celebrated works after losing his hearing.",
    typings: [
      {
        framework: "mbti",
        code: "INTJ",
        rationale:
          "Continued obsessively revising and composing — including the Ninth Symphony — after becoming completely deaf, documented through his notebooks as reworking passages dozens of times in pursuit of a specific internal structure.",
      },
      {
        framework: "colors",
        code: "blue",
        rationale: "A compositional process built on exhaustive revision toward a precise internal standard.",
      },
      {
        framework: "bigfive",
        code: "conscientiousness-high",
        rationale: "Documented obsessive reworking of compositions well beyond what was commercially necessary.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Joseph_Karl_Stieler%27s_Beethoven_mit_dem_Manuskript_der_Missa_solemnis.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Joseph_Karl_Stieler%27s_Beethoven_mit_dem_Manuskript_der_Missa_solemnis.jpg",
      license: "Public domain",
      attribution: "Joseph Karl Stieler (portrait painting), public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "bob-dylan",
    name: "Bob Dylan",
    category: "artist",
    gender: "man",
    years: "1941–",
    bio: "American singer-songwriter whose lyrics reshaped popular music, and the first songwriter to win the Nobel Prize in Literature.",
    typings: [
      {
        framework: "mbti",
        code: "INFP",
        rationale:
          "Repeatedly abandoned commercially successful personas — protest-folk icon, then electric rock, then gospel — whenever they stopped matching his own artistic direction, famously alienating fans at Newport in 1965 rather than stay predictable.",
      },
      {
        framework: "colors",
        code: "yellow",
        rationale: "A career defined by following personal artistic direction over audience expectation.",
      },
      {
        framework: "bigfive",
        code: "openness-high",
        rationale: "Repeated, deliberate reinvention across genres rather than repetition of a proven formula.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/2/2a/DylanYoungKilkenny140719v2_(50_of_52)_(52246124397)_(cropped).jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:DylanYoungKilkenny140719v2_(50_of_52)_(52246124397)_(cropped).jpg",
      license: "CC BY 2.0",
      attribution: "Raph_PH, CC BY 2.0, via Wikimedia Commons",
    },
  },
  {
    slug: "freddie-mercury",
    name: "Freddie Mercury",
    category: "artist",
    gender: "man",
    years: "1946–1991",
    bio: "British singer and songwriter, lead vocalist of Queen, known for his vocal range and elaborate live performances.",
    typings: [
      {
        framework: "mbti",
        code: "ESFP",
        rationale:
          "Documented by bandmates as living for the immediate feedback of a live crowd, restructuring entire songs — including 'Bohemian Rhapsody' — around dramatic performance moments rather than radio conventions.",
      },
      {
        framework: "colors",
        code: "yellow",
        rationale: "A performance style built around spectacle and direct audience connection.",
      },
      {
        framework: "bigfive",
        code: "extraversion-high",
        rationale: "A career defined by large-scale, high-energy live performance over studio-only work.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Freddie_Mercury_performing_in_New_Haven,_CT,_November_1977.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Freddie_Mercury_performing_in_New_Haven,_CT,_November_1977.jpg",
      license: "CC BY-SA 3.0",
      attribution: "Carl Lender, CC BY-SA 3.0, via Wikimedia Commons",
    },
  },
  {
    slug: "david-bowie",
    name: "David Bowie",
    category: "artist",
    gender: "man",
    years: "1947–2016",
    bio: "British singer-songwriter and actor known for constant musical reinvention across a five-decade career.",
    typings: [
      {
        framework: "mbti",
        code: "INFJ",
        rationale:
          "Deliberately constructed and then discarded a sequence of distinct public personas — Ziggy Stardust, the Thin White Duke, Berlin-era Bowie — as a documented, self-directed creative strategy rather than organic change.",
      },
      {
        framework: "colors",
        code: "blue",
        rationale: "Each persona shift was a deliberate, planned creative decision rather than an impulsive one.",
      },
      {
        framework: "bigfive",
        code: "openness-high",
        rationale: "A five-decade career defined by repeated, deliberate reinvention.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/e/e8/David-Bowie_Chicago_2002-08-08_photoby_Adam-Bielawski-cropped.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:David-Bowie_Chicago_2002-08-08_photoby_Adam-Bielawski-cropped.jpg",
      license: "CC BY-SA 3.0",
      attribution: "Adam Bielawski, CC BY-SA 3.0, via Wikimedia Commons",
    },
  },
  {
    slug: "louis-armstrong",
    name: "Louis Armstrong",
    category: "artist",
    gender: "man",
    years: "1901–1971",
    bio: "American trumpeter and singer, a foundational figure in jazz known for his improvisational virtuosity.",
    typings: [
      {
        framework: "mbti",
        code: "ESFP",
        rationale:
          "Built his career on in-the-moment improvisation, documented by collaborators as never playing a solo the same way twice and prioritizing a live audience's reaction over rehearsed precision.",
      },
      {
        framework: "colors",
        code: "yellow",
        rationale: "A performance style defined by spontaneity and warmth toward a live audience.",
      },
      {
        framework: "bigfive",
        code: "extraversion-high",
        rationale: "A decades-long career built specifically around live improvisation over fixed composition.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/1/16/Louis_Armstrong_in_Color_(restored).jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Louis_Armstrong_in_Color_(restored).jpg",
      license: "Public domain",
      attribution: "Harry Warnecke / Gus Schoenbaechler, public domain, via Wikimedia Commons",
    },
  },
  // ---- Authors ----
  {
    slug: "jane-austen",
    name: "Jane Austen",
    category: "author",
    gender: "woman",
    years: "1775–1817",
    bio: "English novelist known for Pride and Prejudice and Sense and Sensibility, and for ironic social observation.",
    typings: [
      {
        framework: "mbti",
        code: "INTJ",
        rationale:
          "Wrote and revised her novels privately for years before publication — Pride and Prejudice was drafted around 1797 but not published until 1813 — documented as a sharp, detached observer of the social dynamics around her rather than a participant in them.",
      },
      {
        framework: "colors",
        code: "blue",
        rationale: "A precise, ironic prose style built on close, analytical observation of social behavior.",
      },
      {
        framework: "bigfive",
        code: "openness-high",
        rationale: "A body of work built on sharp, original social insight rather than convention.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/c/cc/CassandraAusten-JaneAusten(c.1810)_hires.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:CassandraAusten-JaneAusten(c.1810)_hires.jpg",
      license: "Public domain",
      attribution: "Cassandra Austen (watercolor/pencil portrait, c.1810), public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "mark-twain",
    name: "Mark Twain",
    category: "author",
    gender: "man",
    years: "1835–1910",
    bio: "American writer and humorist known for The Adventures of Huckleberry Finn and Adventures of Tom Sawyer.",
    typings: [
      {
        framework: "mbti",
        code: "ENTP",
        rationale:
          "Built a career on live lecture tours and improvisational wit as much as writing, documented by contemporaries as constantly testing new business ventures and ideas — including several that bankrupted him — out of restless curiosity.",
      },
      {
        framework: "colors",
        code: "yellow",
        rationale: "A public career built on wit and live performance as much as the writing itself.",
      },
      {
        framework: "bigfive",
        code: "extraversion-high",
        rationale: "A restless pattern of chasing new ventures and ideas well outside of writing.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Mark_Twain_by_AF_Bradley_(cropped_2).jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Mark_Twain_by_AF_Bradley_(cropped_2).jpg",
      license: "Public domain",
      attribution: "A.F. Bradley, New York, public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "virginia-woolf",
    name: "Virginia Woolf",
    category: "author",
    gender: "woman",
    years: "1882–1941",
    bio: "English modernist writer known for Mrs Dalloway and To the Lighthouse, and for pioneering stream-of-consciousness narration.",
    typings: [
      {
        framework: "mbti",
        code: "INFJ",
        rationale:
          "Her diaries document an intensely internal, introspective process behind novels like Mrs Dalloway, deliberately built around characters' interior thought rather than external plot.",
      },
      {
        framework: "colors",
        code: "blue",
        rationale: "A literary technique built on careful, internal precision rather than plot-driven pacing.",
      },
      {
        framework: "bigfive",
        code: "openness-high",
        rationale: "Pioneered a genuinely new narrative form rather than working within existing convention.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/0/0b/George_Charles_Beresford_-_Virginia_Woolf_in_1902_-_Restoration.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:George_Charles_Beresford_-_Virginia_Woolf_in_1902_-_Restoration.jpg",
      license: "Public domain",
      attribution: "George Charles Beresford (restoration by Adam Cuerden), public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "leo-tolstoy",
    name: "Leo Tolstoy",
    category: "author",
    gender: "man",
    years: "1828–1910",
    bio: "Russian writer known for War and Peace and Anna Karenina, and later a moral and religious philosopher.",
    typings: [
      {
        framework: "mbti",
        code: "INFJ",
        rationale:
          "Abandoned his own aristocratic wealth and literary fame late in life to pursue a self-authored moral and religious philosophy, documented in letters and essays as driven by an uncompromising personal ethical framework.",
      },
      {
        framework: "colors",
        code: "green",
        rationale: "A late-life shift toward values-driven conviction over continued literary acclaim.",
      },
      {
        framework: "bigfive",
        code: "conscientiousness-high",
        rationale: "Restructured his entire life around a single, consistently applied moral framework.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/b/be/Leo_Tolstoy_1908_Portrait_(3x4_cropped).jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Leo_Tolstoy_1908_Portrait_(3x4_cropped).jpg",
      license: "Public domain",
      attribution: "Sergei Prokudin-Gorskii, public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "george-orwell",
    name: "George Orwell",
    category: "author",
    gender: "man",
    years: "1903–1950",
    bio: "English novelist and essayist known for 1984 and Animal Farm, and for politically engaged, direct prose.",
    typings: [
      {
        framework: "mbti",
        code: "INTJ",
        rationale:
          "Went and lived undercover among the poor in Paris and London, and later fought in the Spanish Civil War, specifically to ground his political writing in direct documented experience rather than theory.",
      },
      {
        framework: "colors",
        code: "blue",
        rationale: "A writing process built on direct, first-hand documentation rather than secondhand theorizing.",
      },
      {
        framework: "bigfive",
        code: "conscientiousness-high",
        rationale: "Deliberately sought out difficult firsthand experience to ground each major work.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/7/7e/George_Orwell_press_photo.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:George_Orwell_press_photo.jpg",
      license: "Public domain",
      attribution: "Branch of the National Union of Journalists (BNUJ), public domain, via Wikimedia Commons",
    },
  },
  {
    slug: "maya-angelou",
    name: "Maya Angelou",
    category: "author",
    gender: "woman",
    years: "1928–2014",
    bio: "American poet and memoirist known for I Know Why the Caged Bird Sings and decades of civil-rights-era public speaking.",
    typings: [
      {
        framework: "mbti",
        code: "ENFJ",
        rationale:
          "Moved fluidly across memoir, poetry, and public speaking specifically to reach and uplift audiences directly, framing her own writing across decades of interviews in terms of shared human connection over solitary craft.",
      },
      {
        framework: "colors",
        code: "yellow",
        rationale: "A body of work and public life oriented around direct, uplifting connection with an audience.",
      },
      {
        framework: "bigfive",
        code: "extraversion-high",
        rationale: "A career spanning writing and public speaking, both aimed outward at audiences.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Angelou_at_Clinton_inauguration_(cropped_2).jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Angelou_at_Clinton_inauguration_(cropped_2).jpg",
      license: "Public domain",
      attribution: "William J. Clinton Presidential Library, public domain (U.S. government work), via Wikimedia Commons",
    },
  },
  {
    slug: "agatha-christie",
    name: "Agatha Christie",
    category: "author",
    gender: "woman",
    years: "1890–1976",
    bio: "English writer of detective fiction, the best-selling novelist of all time, known for Hercule Poirot and Miss Marple.",
    typings: [
      {
        framework: "mbti",
        code: "ISTJ",
        rationale:
          "Constructed meticulously logical, fair-play mystery plots across 66 novels on a disciplined, decades-long writing schedule, documented biographically as a private, methodical planner rather than a public literary figure.",
      },
      {
        framework: "colors",
        code: "blue",
        rationale: "Plots built on rigorous internal logic and precisely planted clues rather than loose improvisation.",
      },
      {
        framework: "bigfive",
        code: "conscientiousness-high",
        rationale: "A 66-novel career sustained on a disciplined, consistent writing schedule.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Agatha_Christie_in_Nederland_(detectiveschrijfster),_bij_aankomst_op_Schiphol_me,_Bestanddeelnr_916-8898_(cropped).jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Agatha_Christie_in_Nederland_(detectiveschrijfster),_bij_aankomst_op_Schiphol_me,_Bestanddeelnr_916-8898_(cropped).jpg",
      license: "CC0",
      attribution: "Joop van Bilsen / Anefo, CC0, via Wikimedia Commons (Dutch National Archives)",
    },
  },
  {
    slug: "franz-kafka",
    name: "Franz Kafka",
    category: "author",
    gender: "man",
    years: "1883–1924",
    bio: "Czech-German-language writer known for The Metamorphosis and The Trial, exploring alienation and bureaucratic absurdity.",
    typings: [
      {
        framework: "mbti",
        code: "INFP",
        rationale:
          "Documented in his diaries and letters as intensely private and self-doubting, asking his friend Max Brod to burn his unpublished manuscripts after his death rather than have his internal work judged publicly.",
      },
      {
        framework: "colors",
        code: "blue",
        rationale: "A body of work built on precise, internally consistent depictions of alienating systems.",
      },
      {
        framework: "bigfive",
        code: "openness-high",
        rationale: "A body of work built on an entirely original, unconventional narrative mode.",
      },
    ],
    photo: {
      url: "https://upload.wikimedia.org/wikipedia/commons/2/26/Franz_Kafka,_1923.jpg",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Franz_Kafka,_1923.jpg",
      license: "Public domain",
      attribution: "Unknown photographer, 1923, public domain, via Wikimedia Commons",
    },
  },
];

export function getAllFamousPeopleSlugs(): string[] {
  return FAMOUS_PEOPLE.map((p) => p.slug);
}

// locale defaults to "en"; for de/es/fr/zh a real (non-machine-translated)
// override is applied where one exists — see src/lib/seo/translations/
// (Tier 4.3, phase 3). A translation may cover only some of a person's
// typings' rationales; any uncovered ones fall back to English individually.
export function getFamousPerson(slug: string, locale: string = "en"): FamousPersonContent | null {
  const p = FAMOUS_PEOPLE.find((p) => p.slug === slug);
  if (!p) return null;
  const t = getPersonTranslation(p.slug, locale);
  if (!t) return p;
  return {
    ...p,
    bio: t.bio,
    typings: p.typings.map((typing) => {
      const rationale = t.rationales[`${typing.framework}-${typing.code}`];
      return rationale ? { ...typing, rationale } : typing;
    }),
  };
}

/** Every person carrying a given framework+code typing — what Tier 0.3 uses to populate `famousExamples` and build "Famous [Type]" pages. */
export function getFamousPeopleByTyping(framework: AssessmentId, code: string): FamousPersonContent[] {
  return FAMOUS_PEOPLE.filter((p) =>
    p.typings.some((t) => t.framework === framework && t.code.toLowerCase() === code.toLowerCase())
  );
}
