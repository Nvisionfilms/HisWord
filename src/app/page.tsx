'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import EmotionTags from '@/components/EmotionTags';
import DailyVerse from '@/components/DailyVerse';
import TrendingVerses from '@/components/TrendingVerses';
import SearchResults from '@/components/SearchResults';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
  };

  const handleEmotionSelect = (emotion: string) => {
    setSearchQuery(emotion);
    setIsSearching(true);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] bg-gradient-to-b from-amber-50 to-white">
        <div className="relative z-10 container mx-auto h-full flex flex-col justify-center items-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-900 space-y-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Find Comfort in His Word
            </h1>
            <p className="text-xl md:text-2xl text-gray-600">
              Discover Bible verses that speak to your heart
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto mt-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for verses, stories, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 rounded-full text-gray-900 bg-white
                           border-2 border-amber-100 shadow-lg
                           focus:outline-none focus:ring-2 focus:ring-primary/50
                           text-lg placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2
                           bg-primary text-white p-3 rounded-full
                           hover:bg-primary/90 transition-colors"
                >
                  <Search className="w-6 h-6" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Emotion Tags Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            How are you feeling today?
          </h2>
          <EmotionTags onSelect={handleEmotionSelect} />
        </section>

        {/* Search Results or Default Content */}
        {isSearching ? (
          <SearchResults query={searchQuery} onClose={() => setIsSearching(false)} />
        ) : (
          <>
            {/* Daily Verse */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                Daily Verse
              </h2>
              <DailyVerse />
            </section>

            {/* Trending Verses */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                Popular Bible Stories
              </h2>
              <TrendingVerses />
            </section>
          </>
        )}
      </div>
    </main>
  );
}
