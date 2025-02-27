import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getDailyVerse } from '@/lib/services/verseService';
import type { Verse } from '@/lib/services/verseService';
import { Share2, Heart } from 'lucide-react';

export default function DailyVerse() {
  const [verse, setVerse] = useState<Verse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    async function fetchDailyVerse() {
      try {
        const dailyVerse = await getDailyVerse();
        setVerse(dailyVerse);
      } catch (err) {
        setError('Failed to load daily verse. Please try again later.');
        console.error('Error fetching daily verse:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDailyVerse();
  }, []);

  const handleShare = async () => {
    if (!verse) return;

    const text = `"${verse.text}" - ${verse.reference}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Daily Verse',
          text: text,
        });
      } else {
        await navigator.clipboard.writeText(text);
        // You might want to show a toast notification here
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="verse-card">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="flex space-x-4">
              <div className="h-6 w-6 bg-gray-200 rounded"></div>
              <div className="h-6 w-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="verse-card bg-red-50">
        <p className="text-red-600 text-sm md:text-base">{error}</p>
      </div>
    );
  }

  if (!verse) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="verse-card"
    >
      <div className="space-y-4 md:space-y-6">
        <p className="text-base md:text-lg text-gray-800 leading-relaxed">
          {verse.text}
        </p>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-primary font-medium text-sm md:text-base">
            {verse.reference}
          </span>
          <div className="flex items-center space-x-2 md:space-x-4">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full transition-colors duration-200
                         hover:bg-gray-100 active:bg-gray-200
                         ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
              aria-label="Like verse"
            >
              <Heart className={`w-5 h-5 md:w-6 md:h-6 transition-transform duration-200
                               hover:scale-110 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={handleShare}
              className="p-2 rounded-full text-gray-500 transition-colors duration-200
                       hover:bg-gray-100 active:bg-gray-200 hover:text-gray-700"
              aria-label="Share verse"
            >
              <Share2 className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-200 hover:scale-110" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
