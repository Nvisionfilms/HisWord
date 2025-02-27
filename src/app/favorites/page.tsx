'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { getFavorites, updateFavoriteNotes } from '@/lib/services/favoriteService';
import { FavoriteVerse } from '@/lib/types/favorite';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Pencil, Save, Trash } from 'lucide-react';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteVerse[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>('');
  const user = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  async function loadFavorites() {
    const data = await getFavorites();
    setFavorites(data);
  }

  async function handleUpdateNotes(verseId: string) {
    const success = await updateFavoriteNotes(verseId, notes);
    if (success) {
      toast({
        title: "Notes Updated",
        description: "Your notes have been saved successfully."
      });
      setEditingId(null);
      loadFavorites();
    } else {
      toast({
        title: "Error",
        description: "Failed to update notes. Please try again.",
        variant: "destructive"
      });
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Favorite Verses</h1>
        <p>Please sign in to view your favorite verses.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Your Favorite Verses</h1>
      
      {favorites.length === 0 ? (
        <p>You haven't saved any verses yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((verse) => (
            <Card key={verse.id} className="p-4">
              <div className="font-semibold mb-2">{verse.verse_reference}</div>
              <p className="text-sm mb-4">{verse.verse_text}</p>
              <div className="text-xs text-gray-500 mb-2">
                Translation: {verse.translation}
              </div>
              
              {editingId === verse.id ? (
                <div className="space-y-2">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add your notes..."
                    className="w-full"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleUpdateNotes(verse.id)}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  {verse.notes && (
                    <p className="text-sm text-gray-600 mt-2">{verse.notes}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(verse.id);
                        setNotes(verse.notes || '');
                      }}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Add Notes
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
