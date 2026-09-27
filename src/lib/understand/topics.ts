/** Guide pages under /understand/<topic>. Copy lives in understand.json under topics.<id>. */
export const UNDERSTAND_TOPICS = ["cultures", "men-women", "workplace", "private"] as const;
export type UnderstandTopic = (typeof UNDERSTAND_TOPICS)[number];

export function isUnderstandTopic(value: string): value is UnderstandTopic {
  return (UNDERSTAND_TOPICS as readonly string[]).includes(value);
}

/** Which decoder phrase each guide links to as a worked example. */
export const TOPIC_EXAMPLE_PHRASE: Record<UnderstandTopic, string> = {
  cultures: "interesting",
  "men-women": "fine",
  workplace: "yes",
  private: "noNeed",
};
