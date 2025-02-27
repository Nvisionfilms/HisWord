'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function VerseTest() {
  const [verses, setVerses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchVerses() {
      try {
        const { data, error } = await supabase
          .from('verses')
          .select('*')
        
        if (error) throw error
        
        setVerses(data || [])
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchVerses()
  }, [])

  if (loading) return <div>Loading verses...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Test Verses</h2>
      {verses.length === 0 ? (
        <p>No verses found. Add some through the Supabase dashboard!</p>
      ) : (
        <ul className="space-y-4">
          {verses.map((verse) => (
            <li key={verse.id} className="border p-4 rounded-lg">
              <p className="font-semibold">{verse.reference}</p>
              <p className="italic">{verse.verse}</p>
              <p className="text-sm text-gray-600">Emotion: {verse.emotion}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
