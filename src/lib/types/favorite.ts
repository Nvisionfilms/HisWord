export interface FavoriteVerse {
  id: string;
  user_id: string;
  verse_reference: string;
  verse_text: string;
  translation: string;
  notes?: string;
  created_at: string;
}

export interface CreateFavoriteVerse {
  verse_reference: string;
  verse_text: string;
  translation: string;
  notes?: string;
}
