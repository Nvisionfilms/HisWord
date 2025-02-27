import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { analyzeEmotion } from '@/lib/openai'

export async function POST(request: Request) {
  try {
    const { emotion } = await request.json()

    if (!emotion) {
      return NextResponse.json(
        { error: 'Emotion is required' },
        { status: 400 }
      )
    }

    // First, analyze the emotion using GPT
    const analysis = await analyzeEmotion(emotion)
    
    let verses = []
    
    if (analysis) {
      // Search using all the keywords and themes from GPT analysis
      const searchTerms = [
        analysis.mainEmotion,
        ...analysis.relatedEmotions,
        ...analysis.themes,
        ...analysis.keywords
      ]

      // Remove duplicates and empty strings
      const uniqueTerms = [...new Set(searchTerms)].filter(Boolean)

      // Query Supabase for verses matching any of the terms
      const { data: gptVerses, error: gptError } = await supabase
        .from('verses')
        .select('*')
        .or(uniqueTerms.map(term => `emotion.ilike.%${term}%`).join(','))
        .limit(5)

      if (!gptError && gptVerses && gptVerses.length > 0) {
        verses = gptVerses
      }
    }

    // If no verses found through GPT analysis or if GPT analysis failed,
    // fallback to direct emotion matching
    if (verses.length === 0) {
      const { data: fallbackVerses, error: fallbackError } = await supabase
        .from('verses')
        .select('*')
        .ilike('emotion', `%${emotion}%`)
        .limit(3)

      if (!fallbackError) {
        verses = fallbackVerses || []
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Emotion processed',
      emotion,
      verses,
      analysis // Include the GPT analysis in the response
    })
  } catch (error) {
    console.error('Error processing emotion:', error)
    return NextResponse.json(
      { error: 'Failed to process emotion' },
      { status: 500 }
    )
  }
}
