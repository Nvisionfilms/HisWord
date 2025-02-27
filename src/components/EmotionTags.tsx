'use client';

import { motion } from 'framer-motion';

interface EmotionTagsProps {
  onSelect?: (emotion: string) => void;
}

const emotions = [
  { name: 'Joy', emoji: '😊' },
  { name: 'Peace', emoji: '🕊️' },
  { name: 'Love', emoji: '❤️' },
  { name: 'Hope', emoji: '⭐' },
  { name: 'Faith', emoji: '🙏' },
  { name: 'Strength', emoji: '💪' },
  { name: 'Comfort', emoji: '🤗' },
  { name: 'Wisdom', emoji: '📚' },
  { name: 'Gratitude', emoji: '🙏' },
  { name: 'Trust', emoji: '🤝' }
];

export default function EmotionTags({ onSelect }: EmotionTagsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {emotions.map((emotion, index) => (
        <motion.button
          key={emotion.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelect?.(emotion.name)}
          className="emotion-button flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
        >
          <span role="img" aria-label={emotion.name} className="text-xl">
            {emotion.emoji}
          </span>
          <span className="font-medium">{emotion.name}</span>
        </motion.button>
      ))}
    </div>
  );
}
