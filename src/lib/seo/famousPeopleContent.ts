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

export type FamousPersonCategory = "scientist" | "nobel-laureate" | "entertainment" | "politician";

export const CATEGORY_LABEL: Record<FamousPersonCategory, string> = {
  scientist: "Scientist",
  "nobel-laureate": "Nobel Laureate",
  entertainment: "Entertainment",
  politician: "Politician",
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
