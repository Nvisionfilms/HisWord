-- Reading Plans Table
CREATE TABLE reading_plans (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    days INTEGER NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Reading Plan Content Table
CREATE TABLE plan_content (
    id SERIAL PRIMARY KEY,
    plan_id TEXT REFERENCES reading_plans(id) ON DELETE CASCADE,
    day INTEGER NOT NULL,
    title TEXT NOT NULL,
    verses TEXT[] NOT NULL,
    devotional TEXT NOT NULL,
    questions TEXT[] NOT NULL,
    prayer TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(plan_id, day)
);

-- User Plan Progress Table
CREATE TABLE user_plan_progress (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id TEXT REFERENCES reading_plans(id) ON DELETE CASCADE,
    current_day INTEGER NOT NULL DEFAULT 1,
    completed BOOLEAN NOT NULL DEFAULT false,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    last_read_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    completed_days INTEGER[] DEFAULT '{}' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, plan_id)
);

-- RLS Policies
ALTER TABLE reading_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_plan_progress ENABLE ROW LEVEL SECURITY;

-- Everyone can read reading plans and content
CREATE POLICY "Everyone can read reading plans"
    ON reading_plans FOR SELECT
    USING (true);

CREATE POLICY "Everyone can read plan content"
    ON plan_content FOR SELECT
    USING (true);

-- Only authenticated users can read their own progress
CREATE POLICY "Users can read own progress"
    ON user_plan_progress FOR SELECT
    USING (auth.uid() = user_id);

-- Only authenticated users can insert their own progress
CREATE POLICY "Users can insert own progress"
    ON user_plan_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Only authenticated users can update their own progress
CREATE POLICY "Users can update own progress"
    ON user_plan_progress FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create verses table
CREATE TABLE verses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    text TEXT NOT NULL,
    reference VARCHAR(255) NOT NULL,
    emotions TEXT[] DEFAULT '{}',
    keywords TEXT[] DEFAULT '{}',
    translation VARCHAR(50) DEFAULT 'NIV',
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create daily_verses table
CREATE TABLE daily_verses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    verse_id UUID REFERENCES verses(id),
    date DATE UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create saved_verses table for user favorites
CREATE TABLE saved_verses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    verse_id UUID REFERENCES verses(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, verse_id)
);

-- Insert sample verses with emotions and keywords
INSERT INTO verses (text, reference, emotions, keywords, translation) VALUES
(
    'For God has not given us a spirit of fear, but of power and of love and of a sound mind.',
    '2 Timothy 1:7',
    ARRAY['anxious', 'fearful', 'worried'],
    ARRAY['fear', 'anxiety', 'worry', 'courage', 'strength', 'power', 'love', 'peace'],
    'NKJV'
),
(
    'Cast your burden on the Lord, and he will sustain you; he will never permit the righteous to be moved.',
    'Psalm 55:22',
    ARRAY['burdened', 'overwhelmed', 'stressed'],
    ARRAY['burden', 'stress', 'worry', 'help', 'support', 'strength'],
    'ESV'
),
(
    'The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul.',
    'Psalm 23:1-3',
    ARRAY['peaceful', 'restless', 'tired'],
    ARRAY['peace', 'rest', 'comfort', 'guidance', 'restoration', 'calm'],
    'ESV'
),
(
    'Rejoice in hope, be patient in tribulation, be constant in prayer.',
    'Romans 12:12',
    ARRAY['hopeless', 'discouraged', 'impatient'],
    ARRAY['hope', 'patience', 'prayer', 'joy', 'perseverance'],
    'ESV'
),
(
    'The Lord is near to the brokenhearted and saves the crushed in spirit.',
    'Psalm 34:18',
    ARRAY['sad', 'heartbroken', 'depressed'],
    ARRAY['sadness', 'broken', 'hurt', 'comfort', 'healing', 'depression'],
    'ESV'
);

-- Create RLS policies
ALTER TABLE verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_verses ENABLE ROW LEVEL SECURITY;

-- Everyone can read verses and daily verses
CREATE POLICY "Verses are viewable by everyone" 
    ON verses FOR SELECT 
    USING (true);

CREATE POLICY "Daily verses are viewable by everyone" 
    ON daily_verses FOR SELECT 
    USING (true);

-- Users can only manage their own saved verses
CREATE POLICY "Users can manage their own saved verses" 
    ON saved_verses FOR ALL 
    USING (auth.uid() = user_id);

-- Create function to search verses by emotion
CREATE OR REPLACE FUNCTION search_verses_by_emotion(
    search_emotion TEXT,
    max_results INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    text TEXT,
    reference VARCHAR(255),
    emotions TEXT[],
    keywords TEXT[],
    translation VARCHAR(50),
    relevance INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH emotion_matches AS (
        SELECT v.*,
               CASE
                   WHEN search_emotion = ANY(v.emotions) THEN 3
                   WHEN search_emotion = ANY(v.keywords) THEN 2
                   ELSE 1
               END as relevance
        FROM verses v
        WHERE search_emotion = ANY(v.emotions)
           OR search_emotion = ANY(v.keywords)
           OR EXISTS (
               SELECT 1
               FROM unnest(v.keywords) k
               WHERE k LIKE '%' || search_emotion || '%'
           )
    )
    SELECT *
    FROM emotion_matches
    ORDER BY relevance DESC, likes DESC
    LIMIT max_results;
END;
$$;
