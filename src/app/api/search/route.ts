import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is missing')
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { query, emotion } = body

    if (!query && !emotion) {
      return NextResponse.json(
        { error: 'Query or emotion is required' },
        { status: 400 }
      )
    }

    console.log('Searching for:', { query, emotion })

    // Ask GPT to find relevant verses
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a knowledgeable Bible scholar. When given a query or emotion, suggest 3-5 relevant Bible verses that would be meaningful to someone in that context. For each verse, provide:
          1. The complete verse text
          2. The exact reference (book chapter:verse)
          3. The primary emotion or theme
          4. Related themes
          5. Keywords for searching

          Format your response as JSON with this structure:
          {
            "verses": [
              {
                "reference": "Book Chapter:Verse",
                "verse": "Complete verse text",
                "emotion": "Primary emotion",
                "themes": ["theme1", "theme2"],
                "keywords": ["keyword1", "keyword2"]
              }
            ]
          }`
        },
        {
          role: "user",
          content: emotion 
            ? `Find Bible verses related to the emotion: ${emotion}`
            : `Find Bible verses relevant to this query: ${query}`
        }
      ],
      response_format: { type: "json_object" }
    })

    console.log('GPT Response received')

    if (!completion.choices[0].message.content) {
      throw new Error('No content in GPT response')
    }

    const gptResponse = JSON.parse(completion.choices[0].message.content)
    console.log('Parsed verses:', gptResponse.verses.length)

    // Store new verses in Supabase
    if (gptResponse.verses && gptResponse.verses.length > 0) {
      const { data: existingVerses, error: checkError } = await supabase
        .from('verses')
        .select('reference')
        .in('reference', gptResponse.verses.map((v: any) => v.reference))

      if (checkError) {
        console.error('Error checking existing verses:', checkError)
      }

      const existingRefs = new Set(existingVerses?.map(v => v.reference) || [])
      const newVerses = gptResponse.verses.filter((v: any) => !existingRefs.has(v.reference))

      if (newVerses.length > 0) {
        console.log('Inserting new verses:', newVerses.length)
        const { error: insertError } = await supabase
          .from('verses')
          .insert(newVerses)

        if (insertError) {
          console.error('Error inserting verses:', insertError)
        }
      }
    }

    return NextResponse.json(gptResponse.verses)
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process search' },
      { status: 500 }
    )
  }
}
