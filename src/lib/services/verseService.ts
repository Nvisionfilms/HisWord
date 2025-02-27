import { supabase } from '../supabaseConfig';
import { extractKeywords } from '../utils/textProcessing';
import { getExpandedSynonyms, getEmotionalContext } from '../utils/bibleThesaurus';

export interface Verse {
  id: number;
  text: string;
  reference: string;
  translation?: string;
  emotions?: string[];
  keywords?: string[];
  relevance?: number;
}

interface BibleAPIResponse {
  reference: string;
  verses: Array<{
    book_id: string;
    book_name: string;
    chapter: number;
    verse: number;
    text: string;
  }>;
  text: string;
  translation_id: string;
  translation_name: string;
}

async function searchBibleAPI(query: string): Promise<Verse[]> {
  try {
    // Use multiple Bible API endpoints for comprehensive search
    const apis = [
      {
        url: `https://bible-api.com/search?query=${encodeURIComponent(query)}`,
        headers: {}
      },
      {
        url: `https://api.esv.org/v3/passage/search/?q=${encodeURIComponent(query)}`,
        headers: {
          'Authorization': `Token ${process.env.NEXT_PUBLIC_ESV_API_KEY || ''}`
        }
      },
      {
        url: `https://api.biblia.com/v1/bible/search/KJV.txt?query=${encodeURIComponent(query)}`,
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_BIBLIA_API_KEY || ''}`
        }
      }
    ];

    const results = await Promise.allSettled(
      apis.map(api => 
        fetch(api.url, { headers: api.headers })
          .then(response => response.json())
          .catch(error => {
            console.error(`API error for ${api.url}:`, error);
            return null;
          })
      )
    );

    const verses: Verse[] = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        const data = result.value;
        const apiVerses = Array.isArray(data.verses) ? data.verses : 
                         Array.isArray(data.results) ? data.results : 
                         [data];

        apiVerses.forEach((verse: any) => {
          verses.push({
            id: Date.now() + Math.random(),
            text: verse.text || verse.content || verse.passage,
            reference: verse.reference || verse.passage,
            translation: verse.translation || 'Multiple',
            keywords: [query],
            relevance: verse.score || 1
          });
        });
      }
    });

    return verses;
  } catch (error) {
    console.error('Error in Bible API search:', error);
    return [];
  }
}

async function expandedBibleSearch(query: string): Promise<Verse[]> {
  // Get keywords and their synonyms
  const keywords = extractKeywords(query);
  const expandedKeywords = new Set<string>();
  
  // Add original keywords
  keywords.forEach(keyword => expandedKeywords.add(keyword));
  
  // Add synonyms for each keyword
  keywords.forEach(keyword => {
    const synonyms = getExpandedSynonyms(keyword);
    synonyms.forEach(synonym => expandedKeywords.add(synonym));
  });
  
  // Add emotional context
  const emotionalContext = getEmotionalContext(query);
  emotionalContext.forEach(context => expandedKeywords.add(context));

  // Remove duplicates and common words
  const uniqueKeywords = Array.from(expandedKeywords)
    .filter(keyword => keyword.length > 2); // Filter out very short words

  console.log('Expanded search keywords:', uniqueKeywords);

  // Search for each keyword in parallel
  const searchPromises = uniqueKeywords.map(keyword => searchBibleAPI(keyword));
  const results = await Promise.allSettled(searchPromises);

  // Collect and deduplicate verses
  const allVerses = new Map<string, Verse>();
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      result.value.forEach(verse => {
        if (!allVerses.has(verse.reference)) {
          // Add the keyword that found this verse
          verse.keywords = [...(verse.keywords || []), uniqueKeywords[index]];
          allVerses.set(verse.reference, verse);
        } else {
          // Update existing verse with additional keywords
          const existingVerse = allVerses.get(verse.reference)!;
          existingVerse.keywords = [...new Set([
            ...(existingVerse.keywords || []),
            ...(verse.keywords || []),
            uniqueKeywords[index]
          ])];
        }
      });
    }
  });

  return Array.from(allVerses.values());
}

export async function searchVersesByText(
  text: string,
  limit: number = 10
): Promise<Verse[]> {
  try {
    // Perform expanded search with synonyms
    const verses = await expandedBibleSearch(text);
    
    // Calculate relevance scores
    const scoredVerses = verses.map(verse => ({
      ...verse,
      relevance: calculateVerseRelevance(verse, extractKeywords(text))
    }));

    // Sort by relevance and return top results
    return scoredVerses
      .sort((a, b) => (b.relevance || 0) - (a.relevance || 0))
      .slice(0, limit);

  } catch (error) {
    console.error('Error in verse search:', error);
    return searchLocalVerses(text);
  }
}

async function searchLocalVerses(query: string): Promise<Verse[]> {
  // Enhanced local search with common emotional phrases
  const emotionalPhrases: { [key: string]: string[] } = {
    'lost': [
      'The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters.',
      'For the Son of Man came to seek and to save the lost.',
      'I will instruct you and teach you in the way you should go; I will counsel you with my loving eye on you.',
      'Your word is a lamp for my feet, a light on my path.'
    ],
    'alone': [
      'So do not fear, for I am with you; do not be dismayed, for I am your God.',
      'The Lord himself goes before you and will be with you; he will never leave you nor forsake you.',
      'Even though I walk through the darkest valley, I will fear no evil, for you are with me.'
    ],
    'afraid': [
      'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.',
      'Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.',
      'For God has not given us a spirit of fear, but of power and of love and of a sound mind.'
    ],
    'worried': [
      'Cast your cares on the Lord and he will sustain you; he will never let the righteous be shaken.',
      'Therefore do not worry about tomorrow, for tomorrow will worry about itself.',
      'Cast all your anxiety on him because he cares for you.'
    ],
    'hopeless': [
      'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
      'Why, my soul, are you downcast? Why so disturbed within me? Put your hope in God, for I will yet praise him.',
      'But those who hope in the Lord will renew their strength. They will soar on wings like eagles.'
    ]
  };

  const queryLower = query.toLowerCase();
  let relevantVerses: Verse[] = [];

  // Check for emotional phrases
  Object.entries(emotionalPhrases).forEach(([emotion, verses]) => {
    if (queryLower.includes(emotion)) {
      verses.forEach((text, index) => {
        relevantVerses.push({
          id: Date.now() + index,
          text,
          reference: `Related to: ${emotion}`,
          translation: 'NIV',
          emotions: [emotion],
          keywords: [query],
          relevance: 1
        });
      });
    }
  });

  // Add mock verses that match the query
  const mockMatches = mockVerses.filter(verse => {
    const matchesText = verse.text.toLowerCase().includes(queryLower);
    const matchesEmotion = verse.emotions?.some(e => queryLower.includes(e.toLowerCase()));
    const matchesKeyword = verse.keywords?.some(k => queryLower.includes(k.toLowerCase()));
    return matchesText || matchesEmotion || matchesKeyword;
  });

  return [...relevantVerses, ...mockMatches];
}

function calculateVerseRelevance(verse: Verse, searchKeywords: string[]): number {
  let score = 0;
  const textLower = verse.text.toLowerCase();
  const keywordsLower = searchKeywords.map(k => k.toLowerCase());

  // Score based on keyword matches in text
  keywordsLower.forEach(keyword => {
    if (textLower.includes(keyword)) {
      score += 2;
    }
  });

  // Score based on emotional context matches
  if (verse.emotions) {
    searchKeywords.forEach(keyword => {
      const emotionalContext = getEmotionalContext(keyword);
      verse.emotions?.forEach(emotion => {
        if (emotionalContext.includes(emotion.toLowerCase())) {
          score += 1;
        }
      });
    });
  }

  // Bonus for multiple keyword matches
  const uniqueMatches = new Set(keywordsLower.filter(k => textLower.includes(k)));
  score += uniqueMatches.size * 0.5;

  return score;
}

export async function searchVersesByEmotion(
  query: string,
  limit: number = 10
): Promise<Verse[]> {
  // For emotion-based searches, expand the query with emotional context
  const emotionalContext = getEmotionalContext(query);
  const expandedQuery = [query, ...emotionalContext].join(' ');
  return searchVersesByText(expandedQuery, limit);
}

// Keep the mock verses as fallback
const mockVerses: Verse[] = [
  {
    id: 1,
    text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    reference: "John 3:16",
    translation: "NIV",
    emotions: ["love", "hope", "faith"],
    keywords: ["salvation", "eternal life", "belief"]
  },
  {
    id: 2,
    text: "The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.",
    reference: "Psalm 23:1-3",
    translation: "NIV",
    emotions: ["peace", "comfort", "trust"],
    keywords: ["guidance", "rest", "provision"]
  },
  {
    id: 3,
    text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    reference: "Joshua 1:9",
    translation: "NIV",
    emotions: ["strength", "courage", "faith"],
    keywords: ["courage", "presence", "guidance"]
  },
  {
    id: 4,
    text: "Rejoice in the Lord always. I will say it again: Rejoice!",
    reference: "Philippians 4:4",
    translation: "NIV",
    emotions: ["joy", "happiness", "praise"],
    keywords: ["rejoice", "praise", "worship"]
  },
  {
    id: 5,
    text: "Cast your anxiety on him because he cares for you.",
    reference: "1 Peter 5:7",
    translation: "NIV",
    emotions: ["peace", "comfort", "trust"],
    keywords: ["anxiety", "worry", "care"]
  },
  {
    id: 6,
    text: "But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control.",
    reference: "Galatians 5:22-23",
    translation: "NIV",
    emotions: ["joy", "peace", "love", "faith"],
    keywords: ["fruit", "spirit", "character"]
  },
  {
    id: 7,
    text: "Give thanks in all circumstances; for this is God's will for you in Christ Jesus.",
    reference: "1 Thessalonians 5:18",
    translation: "NIV",
    emotions: ["gratitude", "joy", "faith"],
    keywords: ["thanksgiving", "praise", "worship"]
  },
  {
    id: 8,
    text: "Trust in the Lord with all your heart and lean not on your own understanding.",
    reference: "Proverbs 3:5",
    translation: "NIV",
    emotions: ["trust", "faith", "wisdom"],
    keywords: ["guidance", "understanding", "direction"]
  },
  {
    id: 9,
    text: "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.",
    reference: "James 1:5",
    translation: "NIV",
    emotions: ["wisdom", "trust", "faith"],
    keywords: ["knowledge", "guidance", "prayer"]
  },
  {
    id: 10,
    text: "I can do all this through him who gives me strength.",
    reference: "Philippians 4:13",
    translation: "NIV",
    emotions: ["strength", "faith", "courage"],
    keywords: ["power", "ability", "confidence"]
  },
  {
    id: 11,
    text: "The joy of the Lord is your strength.",
    reference: "Nehemiah 8:10",
    translation: "NIV",
    emotions: ["joy", "strength", "faith"],
    keywords: ["happiness", "power", "worship"]
  },
  {
    id: 12,
    text: "Come to me, all you who are weary and burdened, and I will give you rest.",
    reference: "Matthew 11:28",
    translation: "NIV",
    emotions: ["comfort", "peace", "trust"],
    keywords: ["rest", "burden", "relief"]
  }
];

const fallbackVerse: Verse = {
  id: 1,
  text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
  reference: "John 3:16",
  emotions: ["love", "hope"],
  keywords: ["salvation", "eternal life"]
};

export async function searchVersesByEmotionSimple(emotion: string): Promise<Verse[]> {
  try {
    const { data, error } = await supabase
      .from('verses')
      .select('*')
      .contains('emotions', [emotion.toLowerCase()]);

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error searching verses:', error);
    return [];
  }
}

export async function getDailyVerseSimple(): Promise<Verse | null> {
  try {
    // Get a random verse for the day
    const { data, error } = await supabase
      .from('verses')
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error getting daily verse:', error);
    return null;
  }
}

export async function getTrendingVersesSimple(): Promise<Verse[]> {
  try {
    const { data, error } = await supabase
      .from('verses')
      .select('*')
      .limit(4);

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error getting trending verses:', error);
    return [];
  }
}

export async function getTrendingVerses(limit: number = 4): Promise<Verse[]> {
  const shuffled = [...mockVerses].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit);
}

export async function getDailyVerse(): Promise<Verse> {
  const randomIndex = Math.floor(Math.random() * mockVerses.length);
  return mockVerses[randomIndex];
}
