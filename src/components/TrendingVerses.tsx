'use client';

import { motion } from 'framer-motion';

const trendingVerses = [
  {
    id: 1,
    text: "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.",
    reference: "Jeremiah 29:11",
    translation: "ESV",
    emotion: "Hope"
  },
  {
    id: 2,
    text: "The Lord is my shepherd; I shall not want. He makes me lie down in green pastures.",
    reference: "Psalm 23:1-2",
    translation: "ESV",
    emotion: "Peace"
  },
  {
    id: 3,
    text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    reference: "Joshua 1:9",
    translation: "NIV",
    emotion: "Courage"
  },
  {
    id: 4,
    text: "Cast your burden on the Lord, and he will sustain you; he will never permit the righteous to be moved.",
    reference: "Psalm 55:22",
    translation: "ESV",
    emotion: "Comfort"
  }
];

export default function TrendingVerses() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {trendingVerses.map((verse, index) => (
        <motion.div
          key={verse.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="verse-card group hover:shadow-lg transition-shadow"
        >
          <div className="flex flex-col h-full">
            <span className="text-sm text-primary mb-2">{verse.emotion}</span>
            <p className="verse-text flex-grow">{verse.text}</p>
            <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
              <span>{verse.reference}</span>
              <span>{verse.translation}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
