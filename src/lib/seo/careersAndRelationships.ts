// Careers and relationships copy for every type page (Tier 1.3 of
// IMPROVEMENT_PROMPTS.md). English-only — see typeContent.ts for how this
// gets pulled into TypePageContent. Grounded in each type's own
// description/strengths/growth already defined in
// src/components/personality/{mbti,humandesign,colors,bigfive}/content.ts —
// not generic filler that could apply to any type.

import type { ColorId, HumanDesignType } from "@/lib/personality/types";

export const MBTI_CAREERS: Record<string, string[]> = {
  INTJ: ["Systems or product architecture", "Strategic planning / management consulting", "Scientific research", "Investment or financial strategy", "Software engineering"],
  INTP: ["Research science", "Software or algorithm design", "Systems analysis", "Philosophy or theoretical academia", "Technical writing"],
  ENTJ: ["Executive leadership / general management", "Management consulting", "Operations or turnaround leadership", "Law (litigation or corporate strategy)", "Entrepreneurship"],
  ENTP: ["Product strategy / innovation roles", "Entrepreneurship", "Venture investing", "Debate-heavy law (litigation, policy)", "Creative or advertising strategy"],
  INFJ: ["Counseling or psychology", "Writing or editorial work", "Nonprofit or mission-driven leadership", "UX research", "Instructional design"],
  INFP: ["Creative writing or content strategy", "Counseling or social work", "Nonprofit advocacy", "UX or graphic design", "Editing"],
  ENFJ: ["Teaching or training", "Human resources / people development", "Nonprofit or community leadership", "Coaching", "Public relations"],
  ENFP: ["Marketing or brand strategy", "Entrepreneurship", "Journalism", "Event or community programming", "Creative direction"],
  ISTJ: ["Accounting or auditing", "Operations management", "Project management", "Law (compliance, contracts)", "Engineering"],
  ISFJ: ["Nursing or healthcare support", "Administrative or office management", "Elementary education", "HR or benefits administration", "Social work"],
  ESTJ: ["Operations or plant management", "Project or program management", "Law enforcement or military leadership", "Sales management", "Logistics"],
  ESFJ: ["Event planning", "Healthcare coordination", "Human resources", "Hospitality management", "Community or customer relations"],
  ISTP: ["Skilled trades (electrical, mechanical)", "Engineering (especially hands-on/field roles)", "Emergency response (EMT, firefighting)", "IT or systems troubleshooting", "Piloting or vehicle operation"],
  ISFP: ["Design (visual, product, or fashion)", "Photography or visual arts", "Culinary work", "Veterinary or animal care", "Landscape or environmental work"],
  ESTP: ["Sales", "Emergency medicine or paramedicine", "Entrepreneurship", "Athletic coaching", "Real estate"],
  ESFP: ["Performing arts or entertainment", "Event hosting or production", "Sales", "Hospitality or tourism", "Teaching young children"],
};

export const MBTI_RELATIONSHIPS: Record<string, string> = {
  INTJ: "You show love through competence and follow-through more than constant affirmation, and you need real independence inside a relationship to stay engaged. Partners who respect your need for solo time, and who can hold their own in a direct conversation, tend to fit best.",
  INTP: "You connect most easily over ideas, and can go quiet for long stretches when you're deep in thought — not a sign of disengagement, just how you process. A partner who doesn't take that quiet personally, and who enjoys debating an idea for its own sake, tends to be a good match.",
  ENTJ: "You bring the same drive to relationships that you bring to work — you want a partner who can keep pace with you and push back when they disagree. Real intimacy takes conscious effort, since your instinct is to solve problems rather than just sit with a feeling.",
  ENTP: "You keep relationships interesting by challenging assumptions, including your partner's — which they need to be able to enjoy rather than take as an attack. You do best with someone who values a good argument as much as you do and doesn't need constant reassurance underneath the banter.",
  INFJ: "You form few relationships, but the ones you do form run deep — you're looking for real understanding, not just company. You can absorb a partner's emotional weight past the point of sustainability, so a relationship that goes both ways tends to work better for you long-term.",
  INFP: "You need a relationship that feels honest and values-aligned more than one that's simply convenient or conventional. You can idealize a partner early on, so the people who fit best are ones who let you see them fully, not just the parts that fit the picture in your head.",
  ENFJ: "You're naturally attuned to what a partner needs, sometimes before they've said it — which is a gift, but it can tip into over-giving if it's not reciprocated. Relationships where your own needs get equal airtime, not just theirs, tend to hold up best over time.",
  ENFP: "You bring warmth and genuine curiosity about your partner's inner world, and you want a relationship that keeps evolving rather than settling into routine. Partners who can offer some steadiness alongside your enthusiasm help keep the relationship's follow-through matching its energy.",
  ISTJ: "You show commitment through consistency and reliability rather than grand gestures, and you take promises seriously once you've made them. A partner who values that steadiness — and who communicates change clearly rather than expecting you to just adapt — tends to fit well.",
  ISFJ: "You express care through quiet, practical acts of support, often noticing what a partner needs before they ask. The risk is over-giving without asking for the same in return, so relationships where a partner actively checks in on your needs tend to be the healthiest ones for you.",
  ESTJ: "You bring structure and reliability to a relationship, and you expect follow-through in return — vague plans or unclear commitments tend to frustrate you. Partners who can be direct with you, rather than expecting you to read between the lines, tend to get along with you best.",
  ESFJ: "You invest real effort into making a relationship (and the people around it) feel supported and included, and you notice when that effort isn't reciprocated. A partner who's comfortable with your social orientation, and who doesn't mistake your harmony-seeking for a lack of real opinions, fits well.",
  ISTP: "You show care through action rather than conversation, which can read as distant to a partner who needs more verbal reassurance. Relationships where a partner gives you real space, and doesn't take your need for independence personally, tend to work best.",
  ISFP: "You lead with quiet loyalty and a strong personal sense of what's right, even if you don't argue for it loudly. You do best with a partner who doesn't push you to perform emotions on their timeline, and who values what you show over what you say.",
  ESTP: "You bring energy and spontaneity to a relationship, and you're at your best living in the present with a partner rather than over-planning the future. Long-term commitment can feel confining if it's framed as limiting rather than as its own kind of adventure — partners who frame it that way tend to keep you engaged.",
  ESFP: "You bring warmth, fun, and genuine attentiveness to a partner's mood in the moment. The relationships that last are the ones where a partner also helps you build in some structure — since your instinct to stay present can make longer-term planning together an area you need to work at.",
};

export const HD_CAREERS: Record<HumanDesignType, string[]> = {
  generator: ["Skilled trades (electrician, carpenter, mechanic)", "Culinary or craft-based work", "Long-tenure specialist or technical roles", "Production or manufacturing", "Any role you can say a genuine 'yes' to and sustain"],
  "manifesting-generator": ["Entrepreneurship / multi-hyphenate careers", "Consulting across several domains", "Startup roles that span multiple functions", "Creative direction", "Product management"],
  manifestor: ["Founder or business owner", "Executive or independent leadership roles", "Independent contracting / freelancing", "Creative work with full creative control", "Pioneering a new team, product, or market"],
  projector: ["Consulting or advising", "Coaching or mentorship", "Management (once invited into the role)", "Systems or process design", "Curation, editing, or creative direction"],
  reflector: ["Advisory or evaluator roles assessing group/organizational health", "Community organizing", "Freelance or flexible-schedule work", "Culture or environment assessment", "Roles that reward outside perspective over daily production"],
};

export const HD_RELATIONSHIPS: Record<HumanDesignType, string> = {
  generator: "You commit fully once something's a genuine 'yes,' and that same honesty serves relationships well — partners who let you respond in your own time, rather than pushing you to initiate or decide on their schedule, tend to get your best energy.",
  "manifesting-generator": "You move through relationships the way you move through projects — with enthusiasm and a willingness to skip the 'expected' steps. Partners who can keep up with your pace, and who don't read your need for variety as a lack of commitment, fit best.",
  manifestor: "You need real independence inside a relationship, and you do best with a partner who doesn't need to be consulted before you act — just informed. The friction usually shows up when that 'inform' step gets skipped, not when you take initiative.",
  projector: "You offer real insight into a partner's patterns and needs, but it lands best when it's invited rather than volunteered unprompted. Relationships where a partner actively asks for your read on things, rather than you offering it unasked, tend to go more smoothly.",
  reflector: "You're unusually sensitive to a relationship's overall health and to your partner's emotional state, sometimes more than your own. Big relationship decisions benefit from real time rather than snap commitment, and partners who respect that pace tend to be the best fit.",
};

export const COLOR_CAREERS: Record<ColorId, string[]> = {
  red: ["Sales leadership", "Entrepreneurship", "Operations or general management", "Emergency or crisis response", "Trial law"],
  blue: ["Engineering", "Accounting or financial analysis", "Research science", "Data analysis", "Quality assurance"],
  green: ["Counseling or therapy", "Nursing or healthcare", "Human resources", "Teaching", "Social work"],
  yellow: ["Marketing or brand strategy", "Sales (relationship-driven)", "Event planning", "Public relations", "Hospitality"],
};

export const COLOR_RELATIONSHIPS: Record<ColorId, string> = {
  red: "You bring decisiveness and momentum to a relationship, and you'd rather address a problem directly than let it linger. Partners who can match your directness — or at least aren't rattled by it — tend to get along with you better than ones who need a softer approach.",
  blue: "You show care through reliability and considered attention rather than open displays of emotion, and you take commitments seriously once made. A partner who doesn't mistake your reserve for disinterest, and who gives you time to process before responding, tends to fit well.",
  green: "You're genuinely attentive to a partner's needs and prioritize keeping the relationship steady and calm. The risk is letting real issues go unaddressed to avoid conflict — relationships where a partner draws you out on what's actually bothering you tend to be healthiest for you.",
  yellow: "You bring warmth, spontaneity, and genuine enthusiasm into a relationship, and you're energized by shared experiences. Partners who can help translate that energy into consistent follow-through — since routine isn't naturally where you shine — tend to round things out well.",
};

export const BIGFIVE_CAREERS: Record<string, string[]> = {
  "openness-high": ["R&D or innovation roles", "Design or the arts", "Strategy or futures work", "Research science", "Entrepreneurship in a novel space"],
  "openness-low": ["Operations or process management", "Compliance or auditing", "Skilled trades", "Accounting", "Quality control"],
  "conscientiousness-high": ["Project management", "Finance or accounting", "Law", "Engineering", "Surgery or other precision-critical medical roles"],
  "conscientiousness-low": ["Creative or improvisational roles", "Early-stage startups", "Crisis or first-response work", "Live events production", "Freelance or gig-based work"],
  "extraversion-high": ["Sales", "Teaching or training", "Public relations", "Event hosting", "People management"],
  "extraversion-low": ["Research", "Writing or editing", "Software engineering", "Data analysis", "One-on-one focused work like therapy or tutoring"],
  "agreeableness-high": ["Counseling", "Nursing", "Teaching", "Human resources", "Nonprofit or social work"],
  "agreeableness-low": ["Litigation", "Auditing or compliance enforcement", "Critical review roles (editor, critic)", "Investing or venture capital", "Entrepreneurship requiring hard calls"],
  "neuroticism-high": ["Risk management", "Safety or compliance", "Quality assurance", "Security analysis", "Counseling (attuned to others' distress)"],
  "neuroticism-low": ["Emergency response", "Surgery", "Aviation or piloting", "Crisis management", "High-stakes negotiation"],
};

export const BIGFIVE_RELATIONSHIPS: Record<string, string> = {
  "openness-high": "You want a relationship that keeps growing and exploring, not one that settles into a fixed routine, and you're drawn to partners who can meet you in that curiosity. The friction usually shows up with a more routine-oriented partner who reads your restlessness as dissatisfaction rather than just how you're wired.",
  "openness-low": "You value a relationship built on consistency and proven trust rather than constant novelty, and you're not looking for a partner to reinvent the relationship regularly. That grounded quality can be a real anchor for a partner, as long as you stay open to their occasional need for something new.",
  "conscientiousness-high": "You show love through reliability and follow-through, and you expect a similar level of commitment in return. Partners who can match your standards — or who at least communicate clearly when they can't — tend to avoid the frustration that comes when you feel like the only one holding things together.",
  "conscientiousness-low": "You keep a relationship feeling spontaneous and flexible rather than over-planned, which many partners genuinely value. The place this needs conscious effort is follow-through on shared commitments — a partner who helps build in just enough structure tends to round out the relationship well.",
  "extraversion-high": "You draw real energy from shared time and activity with a partner, and you process a lot of what you're feeling out loud. A partner who's comfortable with your social pace — or who's honest when they need quieter time — helps keep the relationship balanced rather than one-sided.",
  "extraversion-low": "You prefer depth over constant activity, and you're likely to show love in quieter, more focused one-on-one time than in big social gestures. Partners who don't mistake that preference for disinterest, and who respect your need to recharge alone, tend to be the best fit.",
  "agreeableness-high": "You prioritize your partner's comfort and the relationship's harmony, often instinctively. The real risk is conflict-avoidance — letting a real issue go unaddressed to keep the peace — so relationships where a partner actively invites your honest opinion tend to serve you better long-term.",
  "agreeableness-low": "You're willing to say the honest, sometimes uncomfortable thing rather than keep the peace at any cost, which partners who value directness tend to appreciate. The adjustment worth making is delivery — the same honest point often lands better with a little more warmth attached.",
  "neuroticism-high": "You feel a relationship's ups and downs intensely, and you're often the first to notice something's off. That vigilance can also mean worrying about problems that never materialize — partners who can help you distinguish real concerns from anxious ones tend to be a steadying presence.",
  "neuroticism-low": "You bring a steady, even keel to a relationship, especially during conflict or stress, which can be a real stabilizing force for a more anxious partner. The thing to watch for is under-reacting to something that genuinely does need attention — a partner's cues are worth taking seriously even when you don't feel the urgency yourself.",
};
