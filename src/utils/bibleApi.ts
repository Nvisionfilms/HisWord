export type BibleVerse = {
  reference: string;
  text: string;
  verses: Array<{
    book_id: string;
    book_name: string;
    chapter: number;
    verse: number;
    text: string;
  }>;
};

export type ThemeCategory = 
  | 'peace' 
  | 'hope' 
  | 'strength' 
  | 'love' 
  | 'wisdom' 
  | 'comfort' 
  | 'faith' 
  | 'anxiety' 
  | 'guidance';

// Map of themes to relevant Bible verses
export const verseThemes: Record<ThemeCategory, string[]> = {
  peace: ['john 14:27', 'philippians 4:6-7', 'psalm 23:1-4'],
  hope: ['romans 15:13', 'jeremiah 29:11', 'psalm 42:11'],
  strength: ['philippians 4:13', 'isaiah 41:10', 'psalm 46:1-3'],
  love: ['1 john 4:16', '1 corinthians 13:4-7', 'john 3:16'],
  wisdom: ['james 1:5', 'proverbs 3:5-6', 'psalm 119:105'],
  comfort: ['matthew 11:28-30', '2 corinthians 1:3-4', 'psalm 34:18'],
  faith: ['hebrews 11:1', 'mark 11:22-24', 'romans 10:17'],
  anxiety: ['1 peter 5:7', 'matthew 6:25-27', 'philippians 4:6-7'],
  guidance: ['proverbs 3:5-6', 'psalm 32:8', 'james 1:5'],
};

// Map of keywords to themes for better matching
export const themeKeywords: Record<ThemeCategory, string[]> = {
  peace: ['peace', 'calm', 'quiet', 'tranquil', 'rest', 'serenity'],
  hope: ['hope', 'future', 'promise', 'expectation', 'trust'],
  strength: ['strength', 'power', 'might', 'courage', 'strong'],
  love: ['love', 'compassion', 'kindness', 'care', 'heart'],
  wisdom: ['wisdom', 'knowledge', 'understanding', 'insight', 'discernment'],
  comfort: ['comfort', 'consolation', 'relief', 'solace', 'help'],
  faith: ['faith', 'belief', 'trust', 'confidence', 'assurance'],
  anxiety: ['anxiety', 'worry', 'fear', 'stress', 'troubled'],
  guidance: ['guidance', 'direction', 'lead', 'path', 'way'],
};

/**
 * Fetches a Bible verse from the Bible API
 * @param reference Bible verse reference (e.g., "john 3:16")
 * @returns Promise<BibleVerse | null>
 */
export async function fetchBibleVerse(reference: string): Promise<BibleVerse | null> {
  try {
    const response = await fetch(`https://bible-api.com/${encodeURIComponent(reference)}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching Bible verse:', error);
    return null;
  }
}

/**
 * Finds relevant Bible verses based on a query string
 * @param query Search query
 * @param maxVerses Maximum number of verses to return (default: 2)
 * @returns Promise<BibleVerse[]>
 */
export async function findRelevantVerses(query: string, maxVerses: number = 2): Promise<BibleVerse[]> {
  const queryLower = query.toLowerCase();
  
  // Find matching themes based on keywords
  const matchingThemes = Object.entries(themeKeywords)
    .filter(([_, keywords]) => 
      keywords.some(keyword => queryLower.includes(keyword))
    )
    .map(([theme]) => theme as ThemeCategory);

  // Use default theme if no matches found
  const themesToUse = matchingThemes.length > 0 ? matchingThemes : ['wisdom'];
  
  // Get verses for the themes
  const versesToFetch = themesToUse
    .flatMap(theme => verseThemes[theme])
    .slice(0, maxVerses);

  // Fetch verses in parallel
  const verses = await Promise.all(
    versesToFetch.map(reference => fetchBibleVerse(reference))
  );

  return verses.filter((verse): verse is BibleVerse => verse !== null);
}

/**
 * Gets a random verse from a specific theme
 * @param theme Theme category
 * @returns Promise<BibleVerse | null>
 */
export async function getRandomVerseByTheme(theme: ThemeCategory): Promise<BibleVerse | null> {
  const verses = verseThemes[theme];
  const randomVerse = verses[Math.floor(Math.random() * verses.length)];
  return await fetchBibleVerse(randomVerse);
}

/**
 * Gets a random daily verse
 * @returns Promise<BibleVerse | null>
 */
export async function getDailyVerse(): Promise<BibleVerse | null> {
  // Get all themes
  const themes = Object.keys(verseThemes) as ThemeCategory[];
  
  // Pick a random theme
  const randomTheme = themes[Math.floor(Math.random() * themes.length)];
  
  return await getRandomVerseByTheme(randomTheme);
}

/**
 * Formats a Bible verse for display
 * @param verse Bible verse object
 * @param includeQuotes Whether to include quotation marks
 * @returns Formatted verse string
 */
export function formatVerse(verse: BibleVerse, includeQuotes: boolean = true): string {
  const text = verse.text.trim();
  return includeQuotes 
    ? `"${text}" - ${verse.reference}`
    : `${text} - ${verse.reference}`;
}
