import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Common emotions and their related keywords
const emotionKeywords = {
  peace: ['peace', 'calm', 'quiet', 'rest', 'tranquil', 'serenity'],
  love: ['love', 'kindness', 'compassion', 'care', 'affection'],
  hope: ['hope', 'future', 'promise', 'trust', 'faith'],
  joy: ['joy', 'happiness', 'gladness', 'rejoice', 'delight'],
  strength: ['strength', 'power', 'courage', 'might', 'endurance'],
  wisdom: ['wisdom', 'understanding', 'knowledge', 'insight', 'discernment'],
  comfort: ['comfort', 'consolation', 'solace', 'relief', 'support'],
  forgiveness: ['forgiveness', 'mercy', 'grace', 'pardon', 'reconciliation'],
  guidance: ['guidance', 'direction', 'lead', 'path', 'way'],
  faith: ['faith', 'belief', 'trust', 'confidence', 'assurance']
}

const verses = [
  {
    reference: "Philippians 4:6-7",
    verse: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
    emotion: "peace",
    themes: ["peace", "prayer", "anxiety"],
    keywords: ["peace", "anxiety", "prayer", "thanksgiving", "guard", "heart", "mind"]
  },
  {
    reference: "John 14:27",
    verse: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
    emotion: "peace",
    themes: ["peace", "comfort", "fear"],
    keywords: ["peace", "troubled", "afraid", "heart"]
  },
  {
    reference: "1 John 4:16",
    verse: "And so we know and rely on the love God has for us. God is love. Whoever lives in love lives in God, and God in them.",
    emotion: "love",
    themes: ["love", "faith", "relationship"],
    keywords: ["love", "God", "faith", "relationship"]
  },
  {
    reference: "Romans 15:13",
    verse: "May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.",
    emotion: "hope",
    themes: ["hope", "joy", "peace", "trust"],
    keywords: ["hope", "joy", "peace", "trust", "power", "Holy Spirit"]
  },
  {
    reference: "Isaiah 41:10",
    verse: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.",
    emotion: "strength",
    themes: ["strength", "courage", "fear"],
    keywords: ["fear", "strength", "help", "uphold", "God"]
  },
  {
    reference: "Psalm 23:1-3",
    verse: "The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.",
    emotion: "peace",
    themes: ["peace", "guidance", "provision"],
    keywords: ["shepherd", "peace", "rest", "soul", "guidance"]
  },
  {
    reference: "Matthew 11:28-30",
    verse: "Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls. For my yoke is easy and my burden is light.",
    emotion: "comfort",
    themes: ["rest", "comfort", "peace"],
    keywords: ["rest", "weary", "burden", "gentle", "humble", "soul"]
  },
  {
    reference: "Psalm 46:1",
    verse: "God is our refuge and strength, an ever-present help in trouble.",
    emotion: "strength",
    themes: ["strength", "protection", "help"],
    keywords: ["refuge", "strength", "help", "trouble", "protection"]
  },
  {
    reference: "James 1:5",
    verse: "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.",
    emotion: "wisdom",
    themes: ["wisdom", "prayer", "guidance"],
    keywords: ["wisdom", "ask", "give", "generous", "guidance"]
  },
  {
    reference: "Proverbs 3:5-6",
    verse: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    emotion: "guidance",
    themes: ["trust", "guidance", "wisdom"],
    keywords: ["trust", "heart", "understanding", "path", "guidance"]
  }
]

async function populateVerses() {
  try {
    // First, let's clear existing verses
    const { error: deleteError } = await supabase
      .from('verses')
      .delete()
      .neq('id', 0) // Delete all records

    if (deleteError) {
      console.error('Error clearing verses:', deleteError)
      return
    }

    // Now insert the new verses
    const { error: insertError } = await supabase
      .from('verses')
      .insert(verses)

    if (insertError) {
      console.error('Error inserting verses:', insertError)
      return
    }

    console.log('Successfully populated verses!')
  } catch (error) {
    console.error('Error:', error)
  }
}

populateVerses()
