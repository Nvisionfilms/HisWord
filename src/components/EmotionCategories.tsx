'use client'

import { useRouter } from 'next/navigation'

const categories = [
  { name: 'LOVE', color: 'from-rose-500 to-rose-600' },
  { name: 'HEALING', color: 'from-emerald-500 to-emerald-600' },
  { name: 'ANXIETY', color: 'from-blue-500 to-blue-600' },
  { name: 'HOPE', color: 'from-teal-500 to-teal-600' },
  { name: 'PEACE', color: 'from-cyan-500 to-cyan-600' },
  { name: 'FAITH', color: 'from-violet-500 to-violet-600' },
]

export default function EmotionCategories() {
  const router = useRouter()

  const handleCategoryClick = (category: string) => {
    router.push(`/search?emotion=${encodeURIComponent(category.toLowerCase())}`)
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {categories.map((category) => (
        <button
          key={category.name}
          onClick={() => handleCategoryClick(category.name)}
          className={`px-4 py-3 rounded-xl bg-gradient-to-r ${category.color} text-white font-medium text-left transition-transform hover:scale-[1.02] active:scale-[0.98]`}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
