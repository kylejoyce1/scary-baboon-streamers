'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ youtube_url: '', meta_quest_username: '', stream_time: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (!form.youtube_url || !form.meta_quest_username || !form.stream_time) {
      setErrorMsg('All fields are required.')
      setStatus('error')
      return
    }

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/streamers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, stream_time: new Date(form.stream_time).toISOString() })
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong.')
        setStatus('error')
      } else {
        setStatus('success')
        setTimeout(() => router.push('/'), 2500)
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid var(--border)', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🐒</span>
          <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
            ← BACK TO HUB
          </span>
        </Link>
        <span className="tag">Registration Open</span>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
        <div style={{ width: '100%', maxWidth: 520 }}>

          {/* Title block */}
          <div className="fade-up" style={{ marginBottom: '2.5rem' }}>
            <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>
              // STREAMER REGISTRATION
            </div>
            <h1 className="font-display" style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', lineHeight: 1.05, marginBottom: '0.75rem' }}>
              JOIN THE<br />
              <span style={{ color: 'var(--accent)' }}>HORDE</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              Register your stream for the Scary Baboon weekend event. Show up, play hard, make content.
            </p>
          </div>

          {/* Success state */}
          {status === 'success' ? (
            <div className="fade-up" style={{
              background: 'var(--green-dim)',
              border: '1px solid rgba(57,255,20,0.3)',
              padding: '2.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🐒✅</div>
              <div className="font-display" style={{ fontSize: '1.8rem', color: 'var(--green)', marginBottom: '0.5rem' }}>
                YOU&apos;RE IN
              </div>
              <p className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                Redirecting to the hub...
              </p>
            </div>
          ) : (
            <div className="fade-up fade-up-delay-1" style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              padding: '2rem'
            }}>
              {/* YouTube URL */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="font-mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>
                  YOUTUBE CHANNEL LINK
                </label>
                <input
                  className="sb-input"
                  type="url"
                  name="youtube_url"
                  placeholder="https://youtube.com/@yourchannel"
                  value={form.youtube_url}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                />
                <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '0.4rem' }}>
                  e.g. youtube.com/@KJ1VR or youtube.com/c/channelname
                </div>
              </div>

              {/* Meta Quest Username */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="font-mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>
                  META QUEST USERNAME
                </label>
                <input
                  className="sb-input"
                  type="text"
                  name="meta_quest_username"
                  placeholder="YourQuestUsername"
                  value={form.meta_quest_username}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                />
              </div>

              {/* Stream Time */}
              <div style={{ marginBottom: '2rem' }}>
                <label className="font-mono" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>
                  STREAM DATE & TIME
                </label>
                <input
                  className="sb-input"
                  type="datetime-local"
                  name="stream_time"
                  value={form.stream_time}
                  onChange={handleChange}
                  disabled={status === 'loading'}
                  style={{ colorScheme: 'dark' }}
                />
                <div className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '0.4rem' }}>
                  Your local time — we&apos;ll display it for everyone
                </div>
              </div>

              {/* Error */}
              {status === 'error' && (
                <div style={{
                  background: 'rgba(255,69,0,0.1)',
                  border: '1px solid rgba(255,69,0,0.3)',
                  padding: '0.75rem 1rem',
                  marginBottom: '1.25rem'
                }}>
                  <span className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--accent)' }}>
                    ⚠ {errorMsg}
                  </span>
                </div>
              )}

              {/* Submit */}
              <button
                className="sb-btn"
                onClick={handleSubmit}
                disabled={status === 'loading'}
                style={{ width: '100%', textAlign: 'center' }}
              >
                {status === 'loading' ? 'REGISTERING...' : 'JOIN THE HORDE →'}
              </button>
            </div>
          )}

          <div className="fade-up fade-up-delay-2" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
              Questions? Hit us up in the Discord.
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}
