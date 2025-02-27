'use client'

import { useState, useEffect } from 'react'
import FavoriteButton from './FavoriteButton'

interface Verse {
  id: string
  verse: string
  reference: string
  emotion: string
}

interface EmotionAnalysis {
  mainEmotion: string
  relatedEmotions: string[]
  themes: string[]
  keywords: string[]
}

export default function VerseDisplay({ 
  emotion,
  verses,
  analysis
}: { 
  emotion: string
  verses: Verse[]
  analysis?: EmotionAnalysis
}) {
  if (!verses || verses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No verses found for &quot;{emotion}&quot;</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {analysis && (
        <div className="glass-morphism rounded-2xl p-6">
          <h4 className="font-semibold text-gray-800 mb-4 text-lg">Understanding Your Heart</h4>
          <div className="space-y-3 text-gray-600">
            <p>
              <span className="font-medium text-blue-700">Main Emotion:</span>{' '}
              {analysis.mainEmotion}
            </p>
            {analysis.relatedEmotions.length > 0 && (
              <p>
                <span className="font-medium text-blue-700">Related Feelings:</span>{' '}
                {analysis.relatedEmotions.join(', ')}
              </p>
            )}
            {analysis.themes.length > 0 && (
              <p>
                <span className="font-medium text-blue-700">Biblical Themes:</span>{' '}
                {analysis.themes.join(', ')}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {verses.map((verse, index) => (
          <div 
            key={verse.id} 
            className="verse-card rounded-2xl p-6 transform transition-all hover:scale-[1.02]"
            style={{
              animationDelay: `${index * 150}ms`
            }}
          >
            <div className="flex justify-between items-start">
              <blockquote className="text-xl italic mb-4 text-gray-700 leading-relaxed flex-1">
                "{verse.verse}"
              </blockquote>
              <div className="ml-4">
                <FavoriteButton verseId={verse.id} />
              </div>
            </div>
            <cite className="block text-right text-gray-600 font-medium">
              — {verse.reference}
            </cite>
            <div className="mt-3 text-sm text-gray-500 border-t border-gray-100 pt-3">
              Related to: {verse.emotion}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
