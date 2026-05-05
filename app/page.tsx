'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Streamer } from '@/lib/supabase'

const KJ_STREAMER: Streamer & { featured?: boolean; stream_end?: string } = {
  id: 'kj-host',
  youtube_url: 'https://www.youtube.com/@kj1vr',
  channel_name: 'KJ1VR',
  meta_quest_username: 'KJ_Quest',
  stream_time: '2025-05-10T13:00:00-05:00',
  stream_end: '2025-05-10T16:00:00-05:00',
  created_at: '',
  featured: true,
}

function isLive(stream_time: string, stream_end?: string) {
  const now = Date.now()
  const start = new Date(stream_time).getTime()
  const end = stream_end ? new Date(stream_end).getTime() : start + 3 * 60 * 60 * 1000
  return now >= start && now <= end
}

function isUpcoming(stream_time: string) {
  return new Date(stream_time).getTime() > Date.now()
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'short',
  })
}

function getHandle(url: string) {
  try {
    const u = new URL(url)
    const parts = u.pathname.split('/').filter(Boolean)
    return parts[parts.length - 1]?.replace('@', '') || url
  } catch { return url }
}

export default function Home() {
  const [streamers, setStreamers] = useState<Streamer[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming'>('all')

  useEffect(() => {
    fetch('/api/streamers')
      .then(r => r.json())
      .then(d => { setStreamers(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const liveCount = streamers.filter(s => isLive(s.stream_time)).length
  const filtered = streamers.filter(s => {
    if (filter === 'live') return isLive(s.stream_time)
    if (filter === 'upcoming') return isUpcoming(s.stream_time)
    return true
  })

  const kjLive = isLive(KJ_STREAMER.stream_time, KJ_STREAMER.stream_end)
  const kjUpcoming = isUpcoming(KJ_STREAMER.stream_time)

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* STICKY HEADER */}
      <header style={{ borderBottom: '1px solid var(--border)', padding: '1rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(8,8,8,0.97)', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🐒</span>
          <div>
            <div className="font-display" style={{ fontSize: '1.05rem', lineHeight: 1, letterSpacing: '0.06em' }}>SCARY BABOON</div>
            <div className="font-mono" style={{ fontSize: '0.52rem', color: 'var(--text-muted)', letterSpacing: '0.14em' }}>FIGHT BACK UPDATE // STREAM EVENT</div>
          </div>
        </div>
        <Link href="/register">
          <button className="sb-btn" style={{ padding: '0.55rem 1.25rem', fontSize: '0.95rem' }}>+ Register</button>
        </Link>
      </header>

      {/* HERO */}
      <section style={{ padding: '2.5rem 1.75rem 2rem', borderBottom: '1px solid var(--border)', maxWidth: 860, margin: '0 auto' }}>
        <div className="fade-up" style={{ marginBottom: '0.6rem' }}><span className="tag">Meta Quest · Fight Back Update</span></div>
        <h1 className="font-display fade-up fade-up-delay-1" style={{ fontSize: 'clamp(2rem,5.5vw,3.8rem)', lineHeight: 1.06, margin: '0.5rem 0 1rem', maxWidth: 600 }}>
          STREAM EVENT —<br />SCARY BABOON<br /><span style={{ color: 'var(--accent)' }}>FIGHT BACK UPDATE</span>
        </h1>
        <p className="fade-up fade-up-delay-2" style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.8, maxWidth: 480, margin: '0 0 1.5rem' }}>
          Watch the community take on the <strong style={{ color: 'var(--text)' }}>new update</strong>. Register to stream and{' '}
          <strong style={{ color: 'var(--accent)' }}>KJ will join your stream</strong> — and maybe donate &amp; giveaway things!
        </p>
        <div className="fade-up fade-up-delay-3" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <div className="font-display" style={{ fontSize: '2rem', color: 'var(--accent)', lineHeight: 1 }}>{streamers.length + 1}</div>
            <div className="font-mono" style={{ fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginTop: 3 }}>STREAMERS</div>
          </div>
          <div>
            <div className="font-display" style={{ fontSize: '2rem', color: 'var(--green)', lineHeight: 1, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              {(liveCount + (kjLive ? 1 : 0)) > 0 && <span className="live-dot" style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />}
              {liveCount + (kjLive ? 1 : 0)}
            </div>
            <div className="font-mono" style={{ fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginTop: 3 }}>LIVE NOW</div>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        {/* KJ FEATURED */}
        <section style={{ padding: '1.5rem 1.75rem', borderBottom: '1px solid var(--border)' }}>
          <div className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>// HOSTING STREAMER</div>
          <div style={{ background: 'linear-gradient(135deg,#141414,#111)', border: '1px solid #333', padding: '1.8rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, background: 'radial-gradient(circle,rgba(255,69,0,0.07) 0%,transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.25rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.65rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1.4rem' }}>👑</span>
                  <a href={KJ_STREAMER.youtube_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <span className="font-display" style={{ fontSize: '2.2rem', color: 'var(--accent)' }}>KJ1VR</span>
                  </a>
                  {kjLive ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span className="live-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
                      <span className="tag tag-green">Live Now</span>
                    </span>
                  ) : kjUpcoming ? <span className="tag">Upcoming</span> : null}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.7rem' }}>
                  <span className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.07em' }}>META QUEST //</span>
                  <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text)' }}>{KJ_STREAMER.meta_quest_username}</span>
                </div>
                <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text)', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', display: 'inline-block', padding: '0.4rem 0.85rem', marginBottom: '0.65rem', lineHeight: 1.5 }}>
                  🗓&nbsp; Saturday, May 10 &nbsp;·&nbsp; 1:00 PM – 4:00 PM EST
                </div>
                <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: 380 }}>
                  KJ will hop into community streams during his session — register and he might join your lobby, donate, or giveaway something.
                </div>
              </div>
              <div style={{ paddingTop: '0.2rem' }}>
                <a href={KJ_STREAMER.youtube_url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.72rem', letterSpacing: '0.05em', color: 'var(--accent)', textDecoration: 'none', border: '1px solid rgba(255,69,0,0.3)', padding: '0.45rem 1.1rem', display: 'inline-block', transition: 'background 0.15s' }}>
                  WATCH LIVE →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* COMMUNITY LIST */}
        <section>
          <div style={{ padding: '1rem 1.75rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.12em' }}>// COMMUNITY STREAMERS ({streamers.length})</div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {(['all', 'live', 'upcoming'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} className="font-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.07em', textTransform: 'uppercase', padding: '0.3rem 0.85rem', border: '1px solid', borderColor: filter === f ? 'var(--accent)' : 'var(--border)', background: filter === f ? 'var(--accent)' : 'transparent', color: filter === f ? '#fff' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.15s' }}>
                  {f}{f === 'live' && liveCount > 0 ? ` (${liveCount})` : ''}
                </button>
              ))}
            </div>
          </div>

          <div style={{ padding: '1.25rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {loading && <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}><span className="font-mono" style={{ fontSize: '0.8rem', letterSpacing: '0.1em' }}>LOADING...</span></div>}

            {!loading && filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3.5rem 1rem', border: '1px dashed var(--border)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🐒</div>
                <div className="font-display" style={{ fontSize: '1.7rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>BE THE FIRST TO REGISTER</div>
                <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '1.4rem', lineHeight: 1.6 }}>No community streamers yet.<br />KJ will join whoever signs up!</div>
                <Link href="/register">
                  <button className="sb-btn" style={{ width: 'auto', padding: '0.75rem 2rem', fontSize: '1rem' }}>REGISTER YOUR STREAM →</button>
                </Link>
              </div>
            )}

            {filtered.map((s, i) => (
              <div key={s.id} className="streamer-card card-animate" style={{ animationDelay: `${i * 0.06}s`, opacity: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <span className="font-display" style={{ fontSize: '1.05rem', color: 'var(--text-dim)', minWidth: '1.6rem' }}>{String(i + 1).padStart(2, '0')}</span>
                      <a href={s.youtube_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <span className="font-display" style={{ fontSize: '1.5rem', color: isLive(s.stream_time) ? 'var(--green)' : 'var(--text)' }}>{s.channel_name || getHandle(s.youtube_url)}</span>
                      </a>
                      {isLive(s.stream_time) ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><span className="live-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} /><span className="tag tag-green">Live</span></span>
                      ) : isUpcoming(s.stream_time) ? <span className="tag">Upcoming</span> : <span className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>Ended</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.45rem' }}>
                      <span className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.07em' }}>META QUEST //</span>
                      <span className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text)' }}>{s.meta_quest_username}</span>
                    </div>
                    <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{fmtTime(s.stream_time)}</div>
                  </div>
                  <div style={{ paddingTop: '0.1rem' }}>
                    <a href={s.youtube_url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.65rem', letterSpacing: '0.05em', color: 'var(--accent)', textDecoration: 'none', border: '1px solid rgba(255,69,0,0.3)', padding: '0.25rem 0.65rem', display: 'inline-block' }}>WATCH →</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '1.25rem 1.75rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', maxWidth: 860, margin: '1rem auto 0' }}>
        <span className="font-mono" style={{ fontSize: '0.58rem', color: 'var(--text-dim)', letterSpacing: '0.08em' }}>ENVER STUDIO // SCARY BABOON VR</span>
        <span className="font-mono" style={{ fontSize: '0.58rem', color: 'var(--text-dim)', letterSpacing: '0.08em' }}>FIGHT BACK UPDATE · MAY 2025</span>
      </footer>
    </main>
  )
}
