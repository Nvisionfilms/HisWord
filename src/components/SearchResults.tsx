'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { searchVersesByEmotion, type Verse } from '@/lib/services/verseService';

interface SearchResultsProps {
  query: string;
  onClose?: () => void;
}

export default function SearchResults({ query, onClose }: SearchResultsProps) {
  const [results, setResults] = useState<Verse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const verses = await searchVersesByEmotion(query);
        setResults(verses);
      } catch (err) {
        setError('Failed to fetch search results. Please try again.');
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 h-32 rounded-xl"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute -top-2 right-0 p-2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      {results.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Results Found</h3>
          <p className="text-gray-600 mb-4">
            Try searching with different words or browse our trending verses below.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90"
          >
            View Trending Verses
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Search Results for "{query}"
            </h2>
            <span className="text-gray-500">{results.length} verses found</span>
          </div>
          
          <div className="grid gap-6">
            {results.map((verse) => (
              <motion.div
                key={verse.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="verse-card"
              >
                <p className="verse-text">{verse.text}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="verse-reference">{verse.reference}</span>
                  <span className="text-sm text-gray-500">{verse.translation}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
