export const keywordSynonyms: { [key: string]: string[] } = {
  // Emotional States
  "lost": ["wandering", "confused", "directionless", "astray", "searching"],
  "afraid": ["fear", "scared", "anxious", "worried", "terrified", "frightened"],
  "anxious": ["worried", "troubled", "distressed", "uneasy", "concerned", "fearful"],
  "angry": ["furious", "rage", "wrath", "bitter", "frustrated", "resentful"],
  "sad": ["sorrowful", "grieving", "depressed", "downcast", "heartbroken", "mourning"],
  "happy": ["joyful", "glad", "rejoicing", "delighted", "blessed", "cheerful"],
  "lonely": ["alone", "isolated", "abandoned", "solitary", "forsaken", "rejected"],
  "tired": ["weary", "exhausted", "fatigued", "burdened", "overwhelmed", "drained"],
  "hopeless": ["despairing", "discouraged", "desperate", "helpless", "defeated"],

  // Relationships
  "marriage": ["relationship", "husband", "wife", "spouse", "covenant", "commitment"],
  "family": ["children", "parents", "household", "relatives", "home", "loved ones"],
  "friend": ["companion", "neighbor", "brother", "sister", "fellowship", "relationship"],
  "enemy": ["adversary", "foe", "opponent", "persecutor", "opposition"],

  // Life Challenges
  "trouble": ["hardship", "difficulty", "trial", "struggle", "adversity", "problem"],
  "failure": ["defeat", "disappointment", "mistake", "setback", "loss"],
  "success": ["victory", "achievement", "prosperity", "blessing", "triumph"],
  "change": ["transition", "transformation", "renewal", "conversion", "reform"],
  "decision": ["choice", "guidance", "direction", "wisdom", "discernment"],

  // Spiritual Concepts
  "faith": ["belief", "trust", "confidence", "assurance", "conviction", "hope"],
  "sin": ["transgression", "wrongdoing", "iniquity", "disobedience", "evil"],
  "forgiveness": ["pardon", "mercy", "grace", "reconciliation", "restoration"],
  "prayer": ["petition", "supplication", "intercession", "request", "communion"],
  "worship": ["praise", "adoration", "devotion", "reverence", "thanksgiving"],
  "blessing": ["favor", "grace", "gift", "benefit", "prosperity", "abundance"],

  // Guidance
  "guidance": ["direction", "leadership", "instruction", "counsel", "wisdom"],
  "wisdom": ["understanding", "knowledge", "insight", "discernment", "prudence"],
  "truth": ["reality", "verity", "fact", "certainty", "authenticity"],

  // Protection
  "protection": ["safety", "security", "defense", "shelter", "refuge", "guard"],
  "strength": ["power", "might", "ability", "force", "courage", "fortitude"],
  "healing": ["restoration", "recovery", "cure", "wholeness", "health"],

  // Purpose
  "purpose": ["calling", "mission", "destiny", "goal", "meaning", "vocation"],
  "future": ["destiny", "prospect", "tomorrow", "hope", "plan"],
  "success": ["prosperity", "achievement", "victory", "blessing", "triumph"],

  // Common Feelings
  "love": ["affection", "devotion", "care", "compassion", "kindness"],
  "peace": ["tranquility", "calm", "serenity", "rest", "quietness"],
  "joy": ["happiness", "gladness", "delight", "rejoicing", "pleasure"],
  "hope": ["expectation", "anticipation", "confidence", "trust", "optimism"],
  "gratitude": ["thankfulness", "appreciation", "gratefulness", "praise"]
};

// Get all synonyms for a word, including synonyms of synonyms
export function getExpandedSynonyms(word: string): string[] {
  const synonyms = new Set<string>();
  synonyms.add(word.toLowerCase());

  // Add direct synonyms
  if (keywordSynonyms[word]) {
    keywordSynonyms[word].forEach(synonym => synonyms.add(synonym.toLowerCase()));
  }

  // Add related words by checking if the word appears in any synonym list
  Object.entries(keywordSynonyms).forEach(([key, values]) => {
    if (values.includes(word) || key.toLowerCase() === word.toLowerCase()) {
      synonyms.add(key.toLowerCase());
      values.forEach(value => synonyms.add(value.toLowerCase()));
    }
  });

  return Array.from(synonyms);
}

// Get emotional context for a phrase by checking multiple words
export function getEmotionalContext(phrase: string): string[] {
  const words = phrase.toLowerCase().split(/\s+/);
  const context = new Set<string>();

  words.forEach(word => {
    const synonyms = getExpandedSynonyms(word);
    synonyms.forEach(synonym => context.add(synonym));
  });

  return Array.from(context);
}
