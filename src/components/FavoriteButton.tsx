import React, { useState, useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { addFavorite, removeFavorite } from '../lib/services/favoriteService';
import { Heart, HeartFilled } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

interface FavoriteButtonProps {
  verseReference: string;
  verseText: string;
  translation: string;
}

export function FavoriteButton({ verseReference, verseText, translation }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const user = useUser();
  const { toast } = useToast();

  useEffect(() => {
    // Check if verse is in favorites when component mounts
    checkFavoriteStatus();
  }, [verseReference, user]);

  async function checkFavoriteStatus() {
    if (!user) return;
    
    const { data } = await supabase
      .from('favorite_verses')
      .select('id')
      .eq('verse_reference', verseReference)
      .eq('user_id', user.id)
      .single();

    setIsFavorite(!!data);
  }

  async function toggleFavorite() {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save favorite verses.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorite) {
        const { data } = await supabase
          .from('favorite_verses')
          .select('id')
          .eq('verse_reference', verseReference)
          .eq('user_id', user.id)
          .single();

        if (data) {
          await removeFavorite(data.id);
          setIsFavorite(false);
          toast({
            title: "Removed from Favorites",
            description: `${verseReference} has been removed from your favorites.`
          });
        }
      } else {
        await addFavorite({
          verse_reference: verseReference,
          verse_text: verseText,
          translation
        });
        setIsFavorite(true);
        toast({
          title: "Added to Favorites",
          description: `${verseReference} has been added to your favorites.`
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleFavorite}
      disabled={isLoading}
      className="gap-2"
    >
      {isFavorite ? (
        <HeartFilled className="h-4 w-4 text-red-500" />
      ) : (
        <Heart className="h-4 w-4" />
      )}
      {isFavorite ? 'Saved' : 'Save'}
    </Button>
  );
}
