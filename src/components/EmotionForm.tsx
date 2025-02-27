'use client'

import { useState } from 'react'
import VerseDisplay from './VerseDisplay'

interface EmotionResponse {
  verses: any[]
  analysis?: {
    mainEmotion: string
    relatedEmotions: string[]
    themes: string[]
    keywords: string[]
  }
}

export default function EmotionForm() {
  const [emotion, setEmotion] = useState('')
  const [response, setResponse] = useState<EmotionResponse | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')
    setResponse(null)

    try {
      const response = await fetch('/api/emotion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emotion }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setStatus('success')
      setMessage('Found some verses for you!')
      setResponse(data)
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Failed to process emotion')
    }
  }

  return (
    <div className="space-y-8 px-4 py-8">
      <div className="max-w-md mx-auto glass-morphism rounded-2xl p-8">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">How are you feeling?</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="emotion" className="block text-sm font-medium text-gray-700 mb-2">
              Share your heart
            </label>
            <input
              type="text"
              id="emotion"
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              placeholder="e.g., overwhelmed with work, feeling blessed"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              required
            />
            <p className="mt-2 text-sm text-gray-500">
              Try being specific about what you're experiencing
            </p>
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className={`w-full py-3 px-6 rounded-xl text-white font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98]
              ${status === 'loading' 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg'
              }`}
          >
            {status === 'loading' ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Finding verses...
              </div>
            ) : 'Find Relevant Verses'}
          </button>
        </form>
        {message && (
          <div className={`mt-4 p-4 rounded-xl ${
            status === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}
      </div>

      {response && (
        <div className="max-w-3xl mx-auto">
          <VerseDisplay 
            emotion={emotion}
            verses={response.verses}
            analysis={response.analysis}
          />
        </div>
      )}
    </div>
  )
}
