-- Insert sample reading plans
INSERT INTO reading_plans (id, title, days, image, category, description) VALUES
(
    'giving-jesus-away',
    '[Giving Jesus Away] to Seek and to Save',
    3,
    '/assets/plans/giving-jesus-away.jpg',
    'Evangelism',
    'Learn how to share your faith with others in a natural and loving way, following Jesus'' example of meeting people where they are.'
),
(
    'complicated-people',
    'How to Deal With Complicated People',
    7,
    '/assets/plans/complicated-people.jpg',
    'Relationships',
    'Discover biblical wisdom for navigating difficult relationships and loving challenging people as Christ loves us.'
),
(
    'sermon-mount',
    'BibleProject | Sermon on the Mount',
    10,
    '/assets/plans/sermon-mount.jpg',
    'Bible Study',
    'Dive deep into Jesus'' most famous sermon and discover the revolutionary teachings that have transformed lives for generations.'
),
(
    'finding-freedom',
    'Finding Freedom: Trusting God',
    5,
    '/assets/plans/finding-freedom.jpg',
    'Faith',
    'Break free from fear, anxiety, and doubt by learning to fully trust in God''s faithfulness and sovereignty.'
),
(
    'boat-middle-lake',
    'In a Boat in the Middle of a Lake',
    5,
    '/assets/plans/boat-middle-lake.jpg',
    'Trust',
    'Find peace and strength in life''s storms by understanding how God meets us in our difficulties.'
),
(
    'rahab',
    'Rahab: How God Uses the Unlikely',
    5,
    '/assets/plans/rahab.jpg',
    'Character Study',
    'Explore the incredible story of Rahab and discover how God can use anyone for His divine purposes.'
);

-- Insert sample plan content for "Giving Jesus Away"
INSERT INTO plan_content (plan_id, day, title, verses, devotional, questions, prayer) VALUES
(
    'giving-jesus-away',
    1,
    'The Heart of Evangelism',
    ARRAY['Luke 19:10', 'Matthew 28:19-20', '2 Corinthians 5:14-15'],
    'Jesus came with a clear mission: "to seek and save the lost." This wasn''t just a task for Him; it was His heart''s desire. He saw people not as projects, but as precious souls worth dying for. When we share our faith, we''re not just following a command - we''re joining in God''s heart for humanity.',
    ARRAY[
        'What motivates you to share your faith with others?',
        'How does seeing evangelism as joining God''s mission change your perspective?',
        'What fears or hesitations do you have about sharing your faith?'
    ],
    'Lord, give me Your heart for people. Help me see others as You see them - precious, valuable, and worth reaching out to. Remove my fears and fill me with Your love and compassion.'
),
(
    'giving-jesus-away',
    2,
    'Meeting People Where They Are',
    ARRAY['John 4:4-10', 'Acts 17:22-23', '1 Corinthians 9:19-23'],
    'Jesus was a master at meeting people where they were. With the Samaritan woman, He started with water. With the scholars in Athens, Paul began with their own cultural references. True evangelism starts with genuine interest in people''s lives and experiences.',
    ARRAY[
        'How can you better understand and connect with people different from you?',
        'What are some ways you can start spiritual conversations naturally?',
        'How has God used your own life experiences to help you relate to others?'
    ],
    'Father, give me wisdom to connect with others authentically. Help me listen well and show genuine love. Use my experiences to build bridges to others.'
),
(
    'giving-jesus-away',
    3,
    'The Power of Your Story',
    ARRAY['Mark 5:18-20', 'Acts 26:12-18', '1 Peter 3:15-16'],
    'Your testimony - your story of encountering Jesus - is a powerful tool for evangelism. The healed demoniac was simply told to "Go home to your friends and tell them how much the Lord has done for you." Your story of God''s work in your life can open doors to hearts.',
    ARRAY[
        'What is your story of encountering Jesus?',
        'How has God changed your life in ways that others might relate to?',
        'How can you share your story in a way that points to Jesus?'
    ],
    'Thank You, Lord, for my story of grace. Help me share it with humility and hope, always pointing to Your goodness and love.'
);

-- Insert sample plan content for "Complicated People"
INSERT INTO plan_content (plan_id, day, title, verses, devotional, questions, prayer) VALUES
(
    'complicated-people',
    1,
    'Understanding Difficult People',
    ARRAY['Matthew 5:43-48', 'Romans 5:8', 'Ephesians 4:31-32'],
    'Jesus calls us to a radical kind of love - loving even those who are hard to love. He modeled this by loving us when we were still sinners. Understanding that we too can be difficult helps us extend grace to others.',
    ARRAY[
        'Who are the difficult people in your life?',
        'How does remembering God''s grace toward you affect how you view others?',
        'What makes someone "difficult" in your eyes?'
    ],
    'Lord, help me see difficult people through Your eyes. Remind me of Your grace toward me when I struggle to show grace to others.'
),
(
    'complicated-people',
    2,
    'Setting Healthy Boundaries',
    ARRAY['Proverbs 4:23', 'Matthew 10:16', '2 Timothy 1:7'],
    'Loving others doesn''t mean letting them harm us. Jesus calls us to be wise as serpents and innocent as doves. Setting healthy boundaries is part of loving both ourselves and others well.',
    ARRAY[
        'What boundaries do you need to set in difficult relationships?',
        'How can you be both loving and wise in challenging relationships?',
        'What makes it hard for you to set boundaries?'
    ],
    'Father, give me wisdom to know how to love well while protecting the heart You''ve given me. Show me how to set healthy boundaries.'
),
(
    'complicated-people',
    3,
    'The Power of Forgiveness',
    ARRAY['Matthew 18:21-35', 'Colossians 3:13', 'Ephesians 4:32'],
    'Forgiveness is not optional in the Christian life. Jesus tells a powerful parable about a servant who was forgiven much but refused to forgive others. When we struggle with difficult people, remembering God''s forgiveness toward us can soften our hearts.',
    ARRAY[
        'What makes forgiveness difficult for you?',
        'How has experiencing God''s forgiveness changed you?',
        'Is there someone you need to forgive today?'
    ],
    'Lord, help me forgive as You have forgiven me. Heal the hurts that make forgiveness difficult.'
),
(
    'complicated-people',
    4,
    'Speaking Truth in Love',
    ARRAY['Ephesians 4:15', 'Proverbs 15:1', 'Colossians 4:6'],
    'Truth without love is harsh; love without truth is enabling. Jesus perfectly balanced both. Learning to speak truth in love is essential for healthy relationships, especially with difficult people.',
    ARRAY[
        'How can you better balance truth and love in your communication?',
        'When was a time someone spoke truth to you in love?',
        'What truth do you need to speak to someone, and how can you do it lovingly?'
    ],
    'Father, give me wisdom to know what to say and how to say it. Let my words be seasoned with grace.'
),
(
    'complicated-people',
    5,
    'The Ministry of Presence',
    ARRAY['Romans 12:15', 'Galatians 6:2', '1 Thessalonians 5:11'],
    'Sometimes the most powerful thing we can do for difficult people is simply be present. Jesus often ministered through presence - eating with sinners, touching the untouchable, sitting with the suffering.',
    ARRAY[
        'How can your presence make a difference in someone''s life?',
        'What makes it hard to be present with difficult people?',
        'How has someone''s presence helped you in a difficult time?'
    ],
    'Jesus, help me be present with others as You are present with me. Give me patience and compassion.'
),
(
    'complicated-people',
    6,
    'Finding Support and Self-Care',
    ARRAY['Ecclesiastes 4:9-10', 'Galatians 6:2-5', '1 Peter 5:7'],
    'Dealing with difficult people can be draining. Jesus often withdrew to pray and rest. It''s important to find support and practice self-care while navigating challenging relationships.',
    ARRAY[
        'Who supports you when dealing with difficult relationships?',
        'What self-care practices help you stay healthy in challenging situations?',
        'How do you balance caring for others with caring for yourself?'
    ],
    'Lord, show me how to care for myself while caring for others. Lead me to supportive community.'
),
(
    'complicated-people',
    7,
    'The Long View of Love',
    ARRAY['1 Corinthians 13:4-7', 'Romans 5:3-5', 'Galatians 6:9'],
    'Love is a marathon, not a sprint. Paul describes love as patient and persevering. When dealing with difficult people, we need to take the long view, trusting God''s timing and work in their lives.',
    ARRAY[
        'How has God developed patience in you through difficult relationships?',
        'What gives you hope when relationships are challenging?',
        'How can you maintain love for someone who is consistently difficult?'
    ],
    'Father, give me endurance in loving difficult people. Help me see them as You see them and love them for the long haul.'
);

-- Insert sample plan content for "Sermon on the Mount"
INSERT INTO plan_content (plan_id, day, title, verses, devotional, questions, prayer) VALUES
(
    'sermon-mount',
    1,
    'The Beatitudes: A New Kind of Blessing',
    ARRAY['Matthew 5:1-12'],
    'The Beatitudes turn our world''s values upside down. Jesus presents a radical vision of blessing that differs from the world''s definition of success and happiness. Here, the poor in spirit, the mourners, and the meek are called blessed.',
    ARRAY[
        'How do Jesus'' definitions of blessing differ from the world''s?',
        'Which beatitude most challenges your perspective?',
        'How might these values transform your community if lived out?'
    ],
    'Lord Jesus, help me embrace Your upside-down kingdom values. Transform my heart to see blessing as You do.'
),
(
    'sermon-mount',
    2,
    'Salt and Light: Living as Kingdom Influence',
    ARRAY['Matthew 5:13-16', 'Philippians 2:14-16'],
    'Jesus calls His followers to be salt and light - preserving influence and revealing truth in the world. This isn''t about standing out for our own sake, but about revealing God''s character through our lives.',
    ARRAY[
        'What does it mean to be "salt" in today''s world?',
        'How can your life shine light in your specific context?',
        'What might cause salt to lose its saltiness in our lives?'
    ],
    'Father, make me effective salt and bright light in my world. Help me live in ways that draw others to Your goodness.'
);

-- Insert content for "Finding Freedom" plan
INSERT INTO plan_content (plan_id, day, title, verses, devotional, questions, prayer) VALUES
(
    'finding-freedom',
    1,
    'Breaking Free from Fear',
    ARRAY['Isaiah 41:10', 'Psalm 34:4', '2 Timothy 1:7'],
    'Fear can be a prison that keeps us from experiencing the full life God has for us. But God hasn''t given us a spirit of fear; He''s given us power, love, and self-discipline.',
    ARRAY[
        'What fears hold you back from fully trusting God?',
        'How has God helped you overcome fear in the past?',
        'What truth about God counters your biggest fear?'
    ],
    'Lord, I give you my fears. Replace them with faith in Your perfect love and care for me.'
),
(
    'finding-freedom',
    2,
    'The Prison of Perfectionism',
    ARRAY['2 Corinthians 12:9', 'Philippians 3:12-14', 'Hebrews 4:16'],
    'Perfectionism can be a subtle form of bondage, keeping us from experiencing God''s grace. True freedom comes when we embrace our weakness and let God''s strength work through us.',
    ARRAY[
        'How does perfectionism show up in your life?',
        'What would it look like to embrace God''s grace in your weaknesses?',
        'How can you show yourself the same grace God shows you?'
    ],
    'Father, help me rest in Your grace rather than striving for perfection. Thank You that Your power is made perfect in my weakness.'
);

-- Insert content for "Rahab" plan
INSERT INTO plan_content (plan_id, day, title, verses, devotional, questions, prayer) VALUES
(
    'rahab',
    1,
    'An Unlikely Hero',
    ARRAY['Joshua 2:1-7', 'Hebrews 11:31', 'James 2:25'],
    'Rahab''s story shows that God doesn''t call the qualified; He qualifies the called. Despite her past, God had a divine purpose for her life, even including her in Jesus'' genealogy.',
    ARRAY[
        'How does Rahab''s story challenge your assumptions about who God can use?',
        'What aspects of your past make you feel disqualified from serving God?',
        'How has God shown you that He can use anyone for His purposes?'
    ],
    'Lord, thank You that You can use anyone for Your purposes. Help me trust that You can use me too.'
),
(
    'rahab',
    2,
    'Faith in Action',
    ARRAY['Joshua 2:8-14', 'Hebrews 11:31', 'James 2:14-26'],
    'Rahab''s faith wasn''t just theoretical; it led to action. She risked her life to protect God''s people because she believed in their God. True faith always produces action.',
    ARRAY[
        'How does your faith influence your actions?',
        'What risks might God be calling you to take in faith?',
        'How can you demonstrate your faith in practical ways today?'
    ],
    'Father, give me courage to act on my faith, even when it''s risky. Let my actions demonstrate my trust in You.'
);
