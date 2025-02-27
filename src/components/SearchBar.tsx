'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { motion } from 'framer-motion'

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <motion.input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tell me how you're feeling today..."
          className="w-full px-4 py-3 pl-12 text-lg rounded-full border-2 border-gray-200 
                   focus:outline-none focus:border-primary/50 transition-all duration-300
                   placeholder:text-gray-400"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <Search className="absolute left-4 text-gray-400" size={20} />
        <motion.button
          type="submit"
          className="absolute right-3 px-4 py-1.5 bg-primary/10 text-primary 
                   rounded-full hover:bg-primary/20 active:scale-95 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Search
        </motion.button>
      </div>
    </form>
  )
}
