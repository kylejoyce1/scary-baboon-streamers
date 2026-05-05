'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Streamer } from '@/lib/supabase'

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
    timeZoneName: 'short'
  })
}

function isLive(stream_time: string) {
  const t = new Date(stream_time).getTime()
  const now = Date.now()
  return now >= t && now <= t + 3 * 60 * 60 * 1000
}

function isUpcoming(stream_time: string) {
  return new Date(stream_time).getTime() > Date.now()
}

function getYouTubeHandle(url: string) {
  try {
    const u = new URL(url)
    const parts = u.pathname.split('/').filter(Boolean)
    return parts[parts.length - 1] || url
  } catch {
    return url
  }
}

export default function Home() {
  const [streamers, setStreamers] = useState<Streamer[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming'>('all')

  useEffect(() => {
    fetch('/api/streamers')
      .then(r => r.json())
      .then(data => { setStreamers(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = streamers.filter(s => {
    if (filter === 'live') return isLive(s.stream_time)
    if (filter === 'upcoming') return isUpcoming(s.stream_time)
    return true
  })

  const liveCount = streamers.filter(s => isLive(s.stream_time)).length

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        padding: '1.5rem 0',
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(8,8,8,0.95)',
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>🐒</span>
            <div>
              <div className="font-display" style={{ fontSize: '1.4rem', color: 'var(--text)', lineHeight: 1 }}>
                SCARY BABOON
              </div>
              <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>
                STREAMER HUB // WEEKEND EVENT
              </div>
            </div>
          </div>
          <Link href="/register">
            <button className="sb-btn" style={{ padding: '0.6rem 1.4rem', fontSize: '1rem' }}>
              + Register
            </button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        padding: '4rem 1.5rem 3rem',
        maxWidth: 900, margin: '0 auto',
        borderBottom: '1px solid var(--border)'
      }}>
        <div className="fade-up" style={{ marginBottom: '0.5rem' }}>
          <span className="tag">Meta Quest Event</span>
        </div>
        <h1
          className="font-display glitch-text fade-up fade-up-delay-1"
          data-text="THE HORDE STREAMS"
          style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', lineHeight: 1.05, marginTop: '1rem', marginBottom: '1rem' }}
        >
          THE HORDE STREAMS
        </h1>
        <p className="fade-up fade-up-delay-2" style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 480, lineHeight: 1.7 }}>
          Watch the community take on Scary Baboon in VR. Every streamer below is part of the weekend chaos.
        </p>

        <div className="fade-up fade-up-delay-3" style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          <div>
            <div className="font-display" style={{ fontSize: '2.5rem', color: 'var(--accent)' }}>{streamers.length}</div>
            <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>REGISTERED</div>
          </div>
          {liveCount > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="live-dot" style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--green)' }} />
                <div className="font-display" style={{ fontSize: '2.5rem', color: 'var(--green)' }}>{liveCount}</div>
              </div>
              <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>LIVE NOW</div>
            </div>
          )}
        </div>
      </section>

      {/* Filter */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '1.5rem 1.5rem 0' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['all', 'live', 'upcoming'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="font-mono"
              style={{
                padding: '0.4rem 1rem',
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                background: filter === f ? 'var(--accent)' : 'var(--surface)',
                color: filter === f ? '#fff' : 'var(--text-muted)',
                border: '1px solid',
                borderColor: filter === f ? 'var(--accent)' : 'var(--border)',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {f}
              {f === 'live' && liveCount > 0 && (
                <span style={{ marginLeft: '0.4rem', background: 'rgba(255,255,255,0.2)', borderRadius: 2, padding: '0 4px', fontSize: '0.65rem' }}>
                  {liveCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Streamer List */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '1.5rem' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <div className="font-mono" style={{ fontSize: '0.85rem', letterSpacing: '0.1em' }}>LOADING...</div>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '5rem 2rem',
            border: '1px dashed var(--border)',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🐒</div>
            <div className="font-display" style={{ fontSize: '1.5rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              {filter === 'live' ? 'NO ONE IS LIVE YET' : filter === 'upcoming' ? 'NO UPCOMING STREAMS' : 'NO STREAMERS YET'}
            </div>
            <p className="font-mono" style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
              {filter === 'all' ? 'Be the first to register below.' : 'Check back soon.'}
            </p>
            {filter === 'all' && (
              <Link href="/register">
                <button className="sb-btn" style={{ marginTop: '1.5rem' }}>Join The Horde</button>
              </Link>
            )}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map((s, i) => {
            const live = isLive(s.stream_time)
            const upcoming = isUpcoming(s.stream_time)
            return (
              <div
                key={s.id}
                className="streamer-card card-animate"
                style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Number + Channel */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <span className="font-display" style={{
                        fontSize: '1.4rem',
                        color: 'var(--text-dim)',
                        minWidth: '2rem'
                      }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <a
                        href={s.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none' }}
                      >
                        <span className="font-display" style={{
                          fontSize: '1.4rem',
                          color: live ? 'var(--green)' : 'var(--text)',
                          letterSpacing: '0.02em',
                          transition: 'color 0.15s'
                        }}>
                          {getYouTubeHandle(s.youtube_url)}
                        </span>
                      </a>
                    </div>

                    {/* Meta Quest Username */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                        META QUEST //
                      </span>
                      <span className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--text)' }}>
                        {s.meta_quest_username}
                      </span>
                    </div>

                    {/* Time */}
                    <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      🕐 {formatTime(s.stream_time)}
                    </div>
                  </div>

                  {/* Status badge */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    {live && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <div className="live-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)' }} />
                        <span className="tag tag-green">LIVE</span>
                      </div>
                    )}
                    {!live && upcoming && <span className="tag">UPCOMING</span>}
                    {!live && !upcoming && (
                      <span className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
                        COMPLETED
                      </span>
                    )}
                    <a
                      href={s.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono"
                      style={{
                        fontSize: '0.7rem',
                        color: 'var(--accent)',
                        textDecoration: 'none',
                        letterSpacing: '0.05em',
                        border: '1px solid rgba(255,69,0,0.3)',
                        padding: '0.25rem 0.6rem',
                        transition: 'background 0.15s'
                      }}
                    >
                      WATCH →
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '2rem 1.5rem',
        maxWidth: 900, margin: '2rem auto 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
      }}>
        <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
          SCARY BABOON // ENVER STUDIO
        </div>
        <Link href="/register">
          <button className="sb-btn" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>
            Register as Streamer
          </button>
        </Link>
      </footer>
    </main>
  )
}
