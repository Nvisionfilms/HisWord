import { supabase } from './supabaseConfig';
import { verseCache } from './cache';
import { findRelevantVerses } from './bibleApi';

export async function getVersesForEmotion(emotion: string) {
  // Check cache first
  const cachedVerses = verseCache.getByEmotion(emotion);
  if (cachedVerses.length > 0) {
    return { verses: cachedVerses, source: 'cache' };
  }

  // Try Supabase first
  const { data: supabaseVerses, error: supabaseError } = await supabase
    .from('verses')
    .select('*')
    .ilike('emotion', `%${emotion}%`)
    .limit(3);

  if (supabaseVerses && supabaseVerses.length > 0) {
    // Cache the verses
    supabaseVerses.forEach(verse => {
      verseCache.set(verse.reference, verse.verse, verse.emotion, verse.reference);
    });
    return { verses: supabaseVerses, source: 'supabase' };
  }

  // Get verses from Bible API
  const bibleVerses = await findRelevantVerses(emotion, 3);
  bibleVerses.forEach(verse => {
    verseCache.set(verse.reference, verse.text, emotion, verse.reference);
  });

  return {
    verses: bibleVerses,
    source: 'bible-api'
  };
}
