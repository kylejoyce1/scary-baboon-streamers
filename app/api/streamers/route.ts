import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase env vars not set')
  return createClient(url, key)
}

function getYouTubeHandle(url: string): string {
  try {
    const u = new URL(url)
    const parts = u.pathname.split('/').filter(Boolean)
    return parts[parts.length - 1]?.replace('@', '') || url
  } catch {
    return url
  }
}

export async function GET() {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('streamers')
      .select('*')
      .order('stream_time', { ascending: true })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase()
    const body = await req.json()
    const { youtube_url, meta_quest_username, stream_time } = body

    if (!youtube_url || !meta_quest_username || !stream_time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let cleanUrl = youtube_url.trim()
    if (!cleanUrl.startsWith('http')) cleanUrl = 'https://' + cleanUrl

    const channel_name = getYouTubeHandle(cleanUrl)

    const { data, error } = await supabase
      .from('streamers')
      .insert([{ youtube_url: cleanUrl, channel_name, meta_quest_username, stream_time }])
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
