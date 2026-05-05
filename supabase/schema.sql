-- Run this in your Supabase SQL editor

create table streamers (
  id uuid default gen_random_uuid() primary key,
  youtube_url text not null,
  channel_name text,
  meta_quest_username text not null,
  stream_time timestamptz not null,
  created_at timestamptz default now()
);

-- Allow public read access
create policy "Public can read streamers"
  on streamers for select
  using (true);

-- Allow public insert (anyone can register)
create policy "Anyone can register"
  on streamers for insert
  with check (true);

-- Enable Row Level Security
alter table streamers enable row level security;
