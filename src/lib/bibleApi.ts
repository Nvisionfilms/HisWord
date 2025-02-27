// Rate limiting: 15 requests per 30 seconds (as per bible-api.com)
const RATE_LIMIT = 15;
const RATE_WINDOW = 30000; // 30 seconds in milliseconds
let requestCount = 0;
let windowStart = Date.now();

// Emotion to Bible verse mapping for common emotions
const EMOTION_VERSES: Record<string, string[]> = {
  // Challenging Emotions
  anxiety: ['php4:6-7', 'matt6:25-27', '1pet5:7', 'isa41:10', 'psa94:19'],
  fear: ['2tim1:7', 'isa41:10', 'psa56:3', 'josh1:9', 'psa27:1'],
  worry: ['matt6:34', '1pet5:7', 'php4:6-7', 'john14:27', 'psa55:22'],
  stress: ['matt11:28-30', 'psa55:22', 'john16:33', 'isa26:3', 'php4:6-7'],
  depression: ['psa34:17-18', 'psa42:11', 'isa41:10', 'jer29:11', 'rom8:38-39'],
  loneliness: ['deut31:6', 'matt28:20', 'isa41:10', 'psa23:4', 'josh1:5'],
  grief: ['matt5:4', 'psa34:18', 'rev21:4', '2cor1:3-4', 'psa147:3'],
  anger: ['eph4:26-27', 'james1:19-20', 'prov15:1', 'col3:8', 'psa37:8'],
  guilt: ['1john1:9', 'rom8:1', 'isa1:18', 'psa103:12', 'col1:13-14'],
  shame: ['rom8:1', '2cor5:17', 'psa34:5', 'isa61:7', '1pet2:9'],
  doubt: ['mark9:24', 'james1:6', 'matt21:21', 'luke17:6', 'heb11:6'],
  confusion: ['james1:5', 'prov3:5-6', '1cor14:33', 'psa119:105', 'isa30:21'],

  // Positive Emotions
  peace: ['john14:27', 'phil4:7', 'isa26:3', 'col3:15', 'psa29:11'],
  hope: ['rom15:13', 'jer29:11', 'heb10:23', 'psa71:14', 'rom12:12'],
  love: ['1cor13:4-7', '1john4:7-8', 'rom8:37-39', 'john15:13', 'eph3:17-19'],
  joy: ['phil4:4', 'psa16:11', 'john15:11', 'psa30:5', 'neh8:10'],
  strength: ['phil4:13', 'isa41:10', 'eph6:10', 'psa27:1', '2cor12:9-10'],
  comfort: ['2cor1:3-4', 'psa23:4', 'matt11:28', 'isa49:13', 'psa119:76'],
  faith: ['heb11:1', 'mark11:22-24', '2cor5:7', 'rom10:17', 'eph2:8-9'],
  gratitude: ['1thes5:18', 'psa107:1', 'col3:15', 'psa100:4', 'eph5:20'],
  confidence: ['phil1:6', '2tim1:7', 'heb13:6', 'psa27:3', 'isa54:17'],
  contentment: ['phil4:11-13', '1tim6:6-8', 'heb13:5', 'psa37:16', 'prov30:8'],
  
  // Growth & Guidance
  wisdom: ['james1:5', 'prov3:5-6', 'col3:16', 'prov2:6', 'eccl7:12'],
  patience: ['james1:3-4', 'rom12:12', 'col1:11', 'rom5:3-4', 'gal5:22'],
  forgiveness: ['1john1:9', 'col3:13', 'eph4:32', 'matt6:14-15', 'mark11:25'],
  courage: ['josh1:9', 'deut31:6', 'psa27:14', 'isa41:13', '1cor16:13'],
  purpose: ['jer29:11', 'phil3:14', 'rom8:28', 'eph2:10', 'col3:23'],
  growth: ['2pet3:18', 'phil1:6', 'col2:7', 'eph4:15', '2cor3:18'],
  healing: ['jer17:14', 'psa147:3', 'exod15:26', 'james5:14-15', 'isa53:5'],
  guidance: ['prov3:5-6', 'psa32:8', 'isa58:11', 'john16:13', 'psa48:14'],
  
  // Relationships
  friendship: ['prov17:17', 'john15:13', 'eccl4:9-10', 'prov27:17', '1thes5:11'],
  marriage: ['eph5:25', '1cor13:4-7', 'gen2:24', 'eccl4:12', 'mark10:9'],
  family: ['prov22:6', 'eph6:4', 'psa127:3', 'col3:20', '1tim5:8'],
  community: ['heb10:24-25', 'rom12:4-5', 'acts2:42', 'gal6:2', '1pet4:10'],
  
  // Life Challenges
  persecution: ['matt5:10-12', 'rom8:35-37', '2tim3:12', '1pet4:12-13', 'james1:2-4'],
  temptation: ['1cor10:13', 'james4:7', 'heb2:18', 'matt26:41', 'james1:12'],
  financial: ['phil4:19', 'mal3:10', 'matt6:33', 'luke6:38', 'prov3:9-10'],
  health: ['3john1:2', 'isa53:5', 'jer30:17', 'psa103:2-3', 'exod23:25'],
  decision: ['james1:5', 'prov3:5-6', 'psa32:8', 'phil4:6-7', 'col3:15']
};

// Alternative phrasings for emotions to improve matching
const EMOTION_ALTERNATIVES: Record<string, string[]> = {
  // Challenging Emotions
  anxiety: ['anxious', 'nervous', 'uneasy', 'restless', 'worried', 'panicked', 'stressed'],
  fear: ['scared', 'afraid', 'terrified', 'frightened', 'fearful', 'panic', 'dread'],
  worry: ['concerned', 'troubled', 'anxious', 'distressed', 'preoccupied', 'apprehensive'],
  stress: ['overwhelmed', 'pressured', 'tense', 'strained', 'burdened', 'exhausted'],
  depression: ['depressed', 'sad', 'hopeless', 'down', 'gloomy', 'melancholy', 'despair'],
  loneliness: ['lonely', 'alone', 'isolated', 'abandoned', 'solitary', 'disconnected'],
  grief: ['grieving', 'mourning', 'heartbroken', 'bereaved', 'sorrowful', 'loss'],
  anger: ['angry', 'mad', 'furious', 'irritated', 'outraged', 'frustrated', 'resentful'],
  guilt: ['guilty', 'ashamed', 'remorseful', 'regretful', 'sorry', 'conscience-stricken'],
  shame: ['ashamed', 'humiliated', 'embarrassed', 'disgraced', 'worthless'],
  doubt: ['uncertain', 'unsure', 'skeptical', 'questioning', 'hesitant', 'wavering'],
  confusion: ['confused', 'puzzled', 'perplexed', 'lost', 'disoriented', 'bewildered'],

  // Positive Emotions
  peace: ['peaceful', 'calm', 'tranquil', 'serene', 'relaxed', 'at peace', 'quiet'],
  hope: ['hopeful', 'optimistic', 'expectant', 'encouraged', 'confident', 'assured'],
  love: ['loving', 'loved', 'cherished', 'adored', 'cared for', 'beloved'],
  joy: ['joyful', 'happy', 'delighted', 'cheerful', 'glad', 'jubilant', 'blessed'],
  strength: ['strong', 'empowered', 'capable', 'mighty', 'powerful', 'resilient'],
  comfort: ['comforted', 'consoled', 'soothed', 'reassured', 'supported', 'at ease'],
  faith: ['faithful', 'believing', 'trusting', 'convicted', 'assured', 'confident'],
  gratitude: ['grateful', 'thankful', 'appreciative', 'blessed', 'indebted'],
  confidence: ['confident', 'assured', 'self-assured', 'bold', 'certain', 'secure'],
  contentment: ['content', 'satisfied', 'fulfilled', 'peaceful', 'complete'],

  // Growth & Guidance
  wisdom: ['wise', 'understanding', 'discerning', 'insight', 'knowledge', 'clarity'],
  patience: ['patient', 'waiting', 'enduring', 'persevering', 'long-suffering'],
  forgiveness: ['forgiving', 'pardoning', 'reconciling', 'merciful', 'gracious'],
  courage: ['courageous', 'brave', 'bold', 'fearless', 'valiant', 'strong-hearted'],
  purpose: ['purposeful', 'called', 'directed', 'motivated', 'driven', 'focused'],
  growth: ['growing', 'developing', 'maturing', 'learning', 'progressing'],
  healing: ['healed', 'restored', 'recovering', 'mending', 'renewed', 'whole'],
  guidance: ['guided', 'directed', 'led', 'shown', 'instructed', 'counseled'],

  // Relationships
  friendship: ['friend', 'companion', 'relationship', 'fellowship', 'brotherhood'],
  marriage: ['married', 'spouse', 'relationship', 'partnership', 'covenant'],
  family: ['families', 'parents', 'children', 'relatives', 'household'],
  community: ['fellowship', 'church', 'congregation', 'brotherhood', 'sisterhood'],

  // Life Challenges
  persecution: ['persecuted', 'oppressed', 'attacked', 'suffering', 'harassed'],
  temptation: ['tempted', 'tested', 'tried', 'enticed', 'lured', 'struggling'],
  financial: ['money', 'finances', 'debt', 'provision', 'poverty', 'abundance'],
  health: ['sick', 'ill', 'unwell', 'disease', 'healing', 'recovery'],
  decision: ['deciding', 'choices', 'crossroads', 'uncertain', 'direction']
};

interface BibleVerse {
  reference: string;
  text: string;
  translation_id: string;
  translation_name: string;
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
}

interface BibleApiResponse {
  reference: string;
  verses: {
    book_id: string;
    book_name: string;
    chapter: number;
    verse: number;
    text: string;
  }[];
  text: string;
  translation_id: string;
  translation_name: string;
  translation_note: string;
}

interface BibleApiMetadata {
  translations?: Record<string, {
    name: string;
    language: string;
    note?: string;
  }>;
  books?: Record<string, {
    name: string;
    chapters: number[];
  }>;
  chapters?: number[];
  verses?: Record<string, {
    book_name: string;
    text: string;
  }>;
}

const BASE_URL = 'https://bible-api.com';
const DEFAULT_TRANSLATION = 'web';

// Book categories for random verse selection
const BOOK_CATEGORIES = {
  OT: 'OT',
  NT: 'NT'
} as const;

async function checkRateLimit() {
  const now = Date.now();
  if (now - windowStart > RATE_WINDOW) {
    // Reset window
    requestCount = 0;
    windowStart = now;
  }
  
  if (requestCount >= RATE_LIMIT) {
    const waitTime = RATE_WINDOW - (now - windowStart);
    throw new Error(`Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds.`);
  }
  
  requestCount++;
}

async function fetchWithRateLimit(url: string): Promise<Response> {
  await checkRateLimit();
  
  return fetch(url, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'TheWord/1.0 (https://github.com/your-repo/the-word)'
    }
  });
}

async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again in a few seconds.');
    }
    throw new Error(`API request failed: ${response.statusText}`);
  }
  
  return response.json();
}

// Get available translations
export async function getTranslations(): Promise<BibleApiMetadata['translations']> {
  const response = await fetchWithRateLimit(`${BASE_URL}/data`);
  const data = await handleApiResponse<BibleApiMetadata>(response);
  return data.translations;
}

// Get books for a translation
export async function getBooks(translationId: string = DEFAULT_TRANSLATION): Promise<BibleApiMetadata['books']> {
  const response = await fetchWithRateLimit(`${BASE_URL}/data/${translationId}`);
  const data = await handleApiResponse<BibleApiMetadata>(response);
  return data.books;
}

// Get chapters for a book
export async function getChapters(
  bookId: string,
  translationId: string = DEFAULT_TRANSLATION
): Promise<number[]> {
  const response = await fetchWithRateLimit(`${BASE_URL}/data/${translationId}/${bookId.toUpperCase()}`);
  const data = await handleApiResponse<BibleApiMetadata>(response);
  return data.chapters || [];
}

// Get verses for a chapter
export async function getChapterVerses(
  bookId: string,
  chapter: number,
  translationId: string = DEFAULT_TRANSLATION
): Promise<BibleApiMetadata['verses']> {
  const response = await fetchWithRateLimit(
    `${BASE_URL}/data/${translationId}/${bookId.toUpperCase()}/${chapter}`
  );
  const data = await handleApiResponse<BibleApiMetadata>(response);
  return data.verses;
}

// Get a random verse
export async function getRandomVerse(
  options: {
    translationId?: string;
    bookIds?: string[] | typeof BOOK_CATEGORIES[keyof typeof BOOK_CATEGORIES];
  } = {}
): Promise<BibleVerse> {
  const { translationId = DEFAULT_TRANSLATION, bookIds } = options;
  
  let url = `${BASE_URL}/data/${translationId}/random`;
  
  if (bookIds) {
    if (Array.isArray(bookIds)) {
      url += `/${bookIds.join(',')}`;
    } else {
      url += `/${bookIds}`;
    }
  }
  
  const response = await fetchWithRateLimit(url);
  const data = await handleApiResponse<BibleApiResponse>(response);
  
  if (!data.verses || data.verses.length === 0) {
    throw new Error('No random verse found');
  }
  
  const verse = data.verses[0];
  return {
    reference: data.reference,
    text: verse.text.trim(),
    translation_id: data.translation_id,
    translation_name: data.translation_name,
    book_id: verse.book_id,
    book_name: verse.book_name,
    chapter: verse.chapter,
    verse: verse.verse
  };
}

// Get random verses from specific books
export async function getRandomVersesFromGospels(count: number = 1): Promise<BibleVerse[]> {
  const gospelBooks = ['MAT', 'MRK', 'LUK', 'JHN'];
  const verses = await Promise.all(
    Array(count).fill(null).map(() => 
      getRandomVerse({ bookIds: gospelBooks })
    )
  );
  return verses;
}

// Get random verses from Old or New Testament
export async function getRandomVersesFromTestament(
  testament: keyof typeof BOOK_CATEGORIES,
  count: number = 1
): Promise<BibleVerse[]> {
  const verses = await Promise.all(
    Array(count).fill(null).map(() => 
      getRandomVerse({ bookIds: BOOK_CATEGORIES[testament] })
    )
  );
  return verses;
}

async function fetchVerse(reference: string): Promise<BibleVerse> {
  await checkRateLimit();
  
  try {
    const response = await fetchWithRateLimit(`https://bible-api.com/${encodeURIComponent(reference)}`);
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a few seconds.');
      }
      throw new Error(`Failed to fetch verse: ${response.statusText}`);
    }
    
    const data: BibleApiResponse = await handleApiResponse<BibleApiResponse>(response);
    
    if (!data.verses || data.verses.length === 0) {
      throw new Error(`No verses found for reference: ${reference}`);
    }
    
    const verse = data.verses[0];
    return {
      reference: data.reference,
      text: verse.text.trim(),
      translation_id: data.translation_id,
      translation_name: data.translation_name,
      book_id: verse.book_id,
      book_name: verse.book_name,
      chapter: verse.chapter,
      verse: verse.verse
    };
  } catch (error) {
    console.error(`Error fetching verse ${reference}:`, error);
    throw error;
  }
}

async function findMatchingEmotion(input: string): Promise<string> {
  const normalizedInput = input.toLowerCase().trim();
  
  // Direct match
  if (EMOTION_VERSES[normalizedInput]) {
    return normalizedInput;
  }
  
  // Check alternatives
  for (const [emotion, alternatives] of Object.entries(EMOTION_ALTERNATIVES)) {
    if (alternatives.some(alt => 
      normalizedInput.includes(alt) || 
      alt.includes(normalizedInput)
    )) {
      return emotion;
    }
  }
  
  // Default to comfort if no match found
  return 'comfort';
}

export async function findRelevantVerses(emotion: string, count: number = 2): Promise<BibleVerse[]> {
  // Find matching emotion using alternatives
  const matchedEmotion = await findMatchingEmotion(emotion);
  
  // Get predefined verses for the emotion
  const versesToFetch = EMOTION_VERSES[matchedEmotion] || EMOTION_VERSES['comfort'];
  
  // Only fetch the requested number of verses
  const selectedVerses = versesToFetch.slice(0, count);
  
  try {
    // Fetch verses in parallel while respecting rate limits
    const verses = await Promise.all(
      selectedVerses.map(reference => fetchVerse(reference))
    );
    
    return verses;
  } catch (error) {
    console.error('Error finding relevant verses:', error);
    return [];
  }
}

export function formatVerse(verse: BibleVerse): string {
  return `${verse.text.trim()}\n- ${verse.reference}`;
}
