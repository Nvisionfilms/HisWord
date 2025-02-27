const commonWords = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours',
  'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers',
  'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
  'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are',
  'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does',
  'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until',
  'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into',
  'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down',
  'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here',
  'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
  'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now',
  'feel', 'feeling', 'felt', 'today', 'like', 'need', 'want', 'would', 'could'
]);

// Comprehensive emotional and situational context mapping
const emotionalContext: { [key: string]: string[] } = {
  // Relationships
  marriage: ['love', 'commitment', 'faithfulness', 'patience', 'understanding', 'unity', 'respect'],
  divorce: ['healing', 'peace', 'strength', 'hope', 'restoration', 'forgiveness', 'new beginning'],
  family: ['love', 'unity', 'patience', 'guidance', 'wisdom', 'responsibility', 'blessing'],
  relationship: ['love', 'trust', 'commitment', 'understanding', 'patience', 'respect', 'communication'],
  friendship: ['loyalty', 'trust', 'kindness', 'support', 'understanding', 'joy', 'companionship'],

  // Emotional States
  lonely: ['comfort', 'presence', 'companionship', 'peace', 'hope', 'love', 'community'],
  anxious: ['peace', 'trust', 'comfort', 'rest', 'confidence', 'protection', 'safety'],
  depressed: ['joy', 'hope', 'strength', 'healing', 'purpose', 'worth', 'light'],
  angry: ['peace', 'forgiveness', 'patience', 'love', 'self-control', 'understanding', 'calm'],
  afraid: ['courage', 'strength', 'faith', 'trust', 'protection', 'peace', 'confidence'],
  guilty: ['forgiveness', 'mercy', 'grace', 'peace', 'redemption', 'restoration', 'freedom'],
  confused: ['wisdom', 'guidance', 'direction', 'clarity', 'understanding', 'discernment', 'truth'],
  overwhelmed: ['peace', 'strength', 'rest', 'help', 'comfort', 'guidance', 'relief'],
  rejected: ['acceptance', 'love', 'worth', 'belonging', 'value', 'purpose', 'hope'],

  // Life Situations
  work: ['purpose', 'diligence', 'integrity', 'wisdom', 'success', 'guidance', 'excellence'],
  career: ['guidance', 'purpose', 'wisdom', 'success', 'integrity', 'direction', 'fulfillment'],
  money: ['provision', 'wisdom', 'stewardship', 'trust', 'contentment', 'generosity', 'faith'],
  health: ['healing', 'strength', 'faith', 'comfort', 'peace', 'hope', 'restoration'],
  decision: ['wisdom', 'guidance', 'direction', 'discernment', 'peace', 'clarity', 'trust'],
  future: ['hope', 'trust', 'guidance', 'purpose', 'faith', 'peace', 'promise'],
  purpose: ['guidance', 'meaning', 'fulfillment', 'calling', 'direction', 'wisdom', 'faith'],

  // Spiritual States
  faith: ['trust', 'belief', 'strength', 'hope', 'perseverance', 'courage', 'conviction'],
  doubt: ['faith', 'trust', 'assurance', 'truth', 'understanding', 'guidance', 'wisdom'],
  temptation: ['strength', 'resistance', 'faith', 'victory', 'purity', 'deliverance', 'protection'],
  sin: ['forgiveness', 'redemption', 'grace', 'mercy', 'repentance', 'restoration', 'freedom'],
  worship: ['praise', 'joy', 'gratitude', 'devotion', 'love', 'adoration', 'reverence'],
  prayer: ['faith', 'guidance', 'peace', 'communion', 'hope', 'trust', 'relationship'],

  // Positive States
  thankful: ['gratitude', 'praise', 'joy', 'blessing', 'appreciation', 'contentment', 'worship'],
  joyful: ['joy', 'praise', 'gratitude', 'blessing', 'celebration', 'delight', 'happiness'],
  peaceful: ['peace', 'rest', 'calm', 'tranquility', 'contentment', 'serenity', 'stillness'],
  hopeful: ['hope', 'faith', 'trust', 'expectation', 'confidence', 'assurance', 'promise'],
  loved: ['love', 'acceptance', 'worth', 'joy', 'blessing', 'gratitude', 'security'],

  // Difficult Situations
  grief: ['comfort', 'hope', 'peace', 'healing', 'strength', 'presence', 'understanding'],
  loss: ['comfort', 'hope', 'healing', 'peace', 'strength', 'restoration', 'presence'],
  addiction: ['freedom', 'healing', 'strength', 'deliverance', 'hope', 'recovery', 'victory'],
  stress: ['peace', 'rest', 'calm', 'strength', 'trust', 'relief', 'comfort'],
  failure: ['hope', 'strength', 'courage', 'perseverance', 'redemption', 'grace', 'new beginning'],
  crisis: ['help', 'strength', 'peace', 'protection', 'guidance', 'hope', 'deliverance']
};

// Emotion intensity modifiers
const intensityModifiers: { [key: string]: number } = {
  very: 1.5,
  really: 1.5,
  extremely: 2,
  somewhat: 0.5,
  little: 0.3,
  bit: 0.3,
  completely: 2,
  totally: 2,
  utterly: 2
};

export function extractKeywords(text: string): string[] {
  // Convert to lowercase and split into words
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/);

  // Get base keywords (excluding common words)
  const baseKeywords = words.filter(word => !commonWords.has(word));
  
  // Initialize result set
  const resultKeywords = new Set<string>();
  
  // Process each word and its context
  baseKeywords.forEach(word => {
    // Add the base word
    resultKeywords.add(word);
    
    // Add emotional context keywords
    if (word in emotionalContext) {
      emotionalContext[word].forEach(contextWord => resultKeywords.add(contextWord));
    }
    
    // Check for compound emotions (e.g., "very anxious")
    const wordIndex = words.indexOf(word);
    if (wordIndex > 0) {
      const modifier = words[wordIndex - 1];
      if (modifier in intensityModifiers) {
        // Add more context keywords for intense emotions
        if (word in emotionalContext) {
          emotionalContext[word].slice(0, 3).forEach(contextWord => resultKeywords.add(contextWord));
        }
      }
    }
  });

  // Convert to array and limit results
  return [...resultKeywords].slice(0, 7); // Increased limit to capture more context
}

export function getEmotionalContext(keyword: string): string[] {
  return emotionalContext[keyword.toLowerCase()] || [];
}
