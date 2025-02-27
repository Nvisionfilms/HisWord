import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://lrsgbyxxxmxbqsismnrb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyc2dieXh4eG14YnFzaXNtbnJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2MTUwNjQsImV4cCI6MjA1NjE5MTA2NH0.mdIRFvt6qbfGvgRhWClrUK19Ua-h-zNldqH-J8PyOHU'
)

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
    // Insert verses one by one
    for (const verse of verses) {
      const { error } = await supabase
        .from('verses')
        .insert({ 
          reference: verse.reference,
          verse: verse.verse,
          emotion: verse.emotion,
          themes: verse.themes.join(' ').toLowerCase(),
          keywords: verse.keywords.join(' ').toLowerCase()
        })

      if (error) {
        if (error.code === '23505') { // Unique violation
          console.log('Verse already exists:', verse.reference)
        } else {
          console.error('Error inserting verse:', verse.reference, error)
        }
      } else {
        console.log('Successfully inserted verse:', verse.reference)
      }
    }

    console.log('Finished populating verses!')
  } catch (error) {
    console.error('Error:', error)
  }
}

populateVerses()
