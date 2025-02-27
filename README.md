# The Word Bible App

A modern Bible application with verse search, favorites, and user authentication.

## Features

- 🔍 Advanced Bible verse search with emotional context
- ⭐ Save favorite verses (requires authentication)
- 📝 Add personal notes to saved verses
- 🌐 Multiple Bible translations (ESV, KJV)
- 🎯 Relevant verse suggestions based on user input
- 🔐 Secure user authentication via Supabase

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_ESV_API_KEY=your_esv_api_key
   NEXT_PUBLIC_BIBLE_API_KEY=your_bible_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel project settings
5. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Visit [Netlify](https://netlify.com)
3. Import your repository
4. Add environment variables in Netlify project settings
5. Deploy!

## Database Setup

The app uses Supabase for data storage. Create these tables in your Supabase project:

### favorite_verses
```sql
create table favorite_verses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  verse_reference text not null,
  verse_text text not null,
  translation text not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table favorite_verses enable row level security;

create policy "Users can view their own favorites"
  on favorite_verses for select
  using (auth.uid() = user_id);

create policy "Users can insert their own favorites"
  on favorite_verses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own favorites"
  on favorite_verses for update
  using (auth.uid() = user_id);

create policy "Users can delete their own favorites"
  on favorite_verses for delete
  using (auth.uid() = user_id);
```

## Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `NEXT_PUBLIC_ESV_API_KEY`: Your ESV API key
- `NEXT_PUBLIC_BIBLE_API_KEY`: Your Bible API key

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT License - feel free to use this project for any purpose.
