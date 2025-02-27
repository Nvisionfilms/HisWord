'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

interface Verse {
  id?: string
  verse: string
  reference: string
  emotion: string
  keywords: string[]
  themes: string[]
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const emotion = searchParams.get('emotion')
  const [loading, setLoading] = useState(true)
  const [verses, setVerses] = useState<Verse[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const searchVerses = async () => {
      setLoading(true)
      setError(null)
      try {
        console.log('Searching for:', { query, emotion })
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            emotion,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Search failed')
        }

        if (!Array.isArray(data)) {
          throw new Error('Invalid response format')
        }

        setVerses(data)
      } catch (error) {
        console.error('Error searching verses:', error)
        setError(
          error instanceof Error 
            ? error.message 
            : 'An error occurred while searching. Please try again.'
        )
      } finally {
        setLoading(false)
      }
    }

    if (query || emotion) {
      searchVerses()
    } else {
      setVerses([])
      setLoading(false)
    }
  }, [query, emotion])

  return (
    <div className="min-h-screen px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          {emotion
            ? `Verses about ${emotion}`
            : query
            ? `Search results for "${query}"`
            : 'Search Results'}
        </h1>

        {loading ? (
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-8 shadow-sm animate-pulse">
                <div className="h-24 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-amber-100 text-amber-700 rounded-full hover:bg-amber-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : verses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No verses found matching your search.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {verses.map((verse, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm">
                <blockquote className="mb-6">
                  <p className="text-2xl text-gray-700 leading-relaxed italic mb-4">
                    "{verse.verse}"
                  </p>
                  <footer className="text-right">
                    <cite className="text-lg text-gray-600 font-medium not-italic">
                      — {verse.reference}
                    </cite>
                  </footer>
                </blockquote>
                {verse.themes && verse.themes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {verse.themes.map((theme, themeIndex) => (
                      <span
                        key={themeIndex}
                        className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-sm font-medium"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
