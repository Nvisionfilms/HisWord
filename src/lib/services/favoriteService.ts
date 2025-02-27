import { supabase } from '../supabaseConfig';
import { FavoriteVerse, CreateFavoriteVerse } from '../types/favorite';

export async function addFavorite(verse: CreateFavoriteVerse): Promise<FavoriteVerse | null> {
  const { data, error } = await supabase
    .from('favorite_verses')
    .insert([verse])
    .select()
    .single();

  if (error) {
    console.error('Error adding favorite:', error);
    return null;
  }

  return data;
}

export async function removeFavorite(verseId: string): Promise<boolean> {
  const { error } = await supabase
    .from('favorite_verses')
    .delete()
    .eq('id', verseId);

  if (error) {
    console.error('Error removing favorite:', error);
    return false;
  }

  return true;
}

export async function getFavorites(): Promise<FavoriteVerse[]> {
  const { data, error } = await supabase
    .from('favorite_verses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error getting favorites:', error);
    return [];
  }

  return data || [];
}

export async function updateFavoriteNotes(verseId: string, notes: string): Promise<boolean> {
  const { error } = await supabase
    .from('favorite_verses')
    .update({ notes })
    .eq('id', verseId);

  if (error) {
    console.error('Error updating notes:', error);
    return false;
  }

  return true;
}
