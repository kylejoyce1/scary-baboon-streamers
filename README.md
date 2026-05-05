# 🐒 Scary Baboon — Streamer Hub

A dark, gaming-aesthetic dashboard for registering and showcasing streamers at the Scary Baboon VR weekend event.

## Features

- **Public streamer list** — live/upcoming/completed filters, auto-detects who is live
- **Self-registration** — streamers enter YouTube link, Meta Quest username, and stream time
- **Dark gaming aesthetic** — glitch effects, scanlines, noise texture, Space Mono / Bebas Neue fonts

---

## Setup

### 1. Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a free project
2. In your project, open the **SQL Editor** and run the contents of `supabase/schema.sql`
3. Copy your **Project URL** and **anon public key** from Settings → API

### 2. Environment Variables

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Add the two environment variables in Vercel's project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy 🚀

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Public streamer list with live/upcoming filters |
| `/register` | Registration form for streamers |
| `/api/streamers` | GET all streamers / POST new registration |

---

Built for Enver Studio // Scary Baboon VR
