# 📄 Bible Comfort App – Context Sheet

## 📝 **App Overview:**
The **Bible Comfort App** provides users with Bible verses based on emotions they submit. The app aims to offer comfort through scripture, with a clean, simple UI and the option for nuanced emotion-to-verse matching using GPT. Users can optionally sign in to save their favorite verses.

---

## 🧭 **Goals:**
- Allow users to submit emotions and receive relevant Bible verses.
- Provide advanced matching with GPT for complex emotions.
- Ensure a clean, comforting user interface with a soft background image.
- Optionally let users save favorite verses with authentication.
- Deploy the app for easy access via the web.

---

## 🧰 **Tech Stack:**
- **Frontend:** Next.js 15 (App Router), React, Tailwind CSS  
- **Backend:** Supabase (Database, Authentication, Storage)  
- **API:** OpenAI GPT (Emotion-to-verse matching)  
- **Deployment:** Vercel  

---

## 🗂️ **Key Features:**
- **Emotion Submission Form:** Users input an emotion (e.g., sadness, confidence).
- **Verse Retrieval:** Queries Supabase for relevant Bible verses.
- **GPT Integration:** Handles nuanced or complex emotion processing.
- **Clean UI:** Comforting background, responsive design.
- **Favorites (Optional):** Authenticated users can save verses.

---

## 📝 **Database Schema (Supabase):**
### Table: `verses`
- `id` (UUID) – Primary Key  
- `emotion` (TEXT) – Associated emotion keyword  
- `verse` (TEXT) – Bible verse content  
- `reference` (TEXT) – Bible verse reference (e.g., John 3:16)  
- `created_at` (TIMESTAMP) – Timestamp of entry  

### Table (Optional): `favorites`
- `id` (UUID) – Primary Key  
- `user_id` (UUID) – Linked to Supabase auth user  
- `verse_id` (UUID) – Linked to `verses` table  
- `created_at` (TIMESTAMP) – Timestamp of favorited verse  

---

## 🔑 **Environment Variables:**
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL  
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon public key  
- `OPENAI_API_KEY`: OpenAI GPT API key  

---

## 🧪 **User Flow:**
1. User lands on the homepage with a comforting background.
2. User submits an emotion via the input form.
3. API fetches verses related to the emotion from Supabase.
4. If no direct match, GPT suggests verses based on emotion context.
5. Display matched verses with reference.
6. (Optional) User logs in to save verses as favorites.

---

## 🎨 **UI Elements:**
- **Emotion Input Field:** Simple text input with submit button.
- **Verse Display:** Card layout showing verse text and reference.
- **Favorites Button (Optional):** Save verse (visible to logged-in users).
- **Background:** Soft, comforting wallpaper image.
- **Typography:** Readable, large text with adequate spacing.

---

## 🚀 **Deployment:**
- Use **Vercel** for one-click deployment.
- Set environment variables in Vercel dashboard.
- Ensure production build is optimized for speed and accessibility.

---

## 📚 **Reference Links:**
- [Next.js Docs](https://nextjs.org/docs)  
- [Supabase Docs](https://supabase.com/docs)  
- [OpenAI API Docs](https://platform.openai.com/docs)  
- [Tailwind CSS Docs](https://tailwindcss.com/docs)  
- [Vercel Deployment Guide](https://vercel.com/docs)  

---

## ✅ **Success Criteria:**
- Users can submit emotions and see relevant Bible verses.
- Verses appear quickly and accurately.
- GPT provides meaningful suggestions for nuanced emotions.
- UI is clean, responsive, and visually comforting.
- Deployed app is live, functional, and accessible.

---

## 🗓️ **Next Steps:**
- Begin with project setup (Prompt 1).  
- Proceed through the prompts sequentially for smooth development.  
- Test each feature thoroughly before deployment.  

---

Would you like to add more details or adjust any features?

