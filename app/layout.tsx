import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Scary Baboon // Streamer Hub',
  description: 'Register and watch streamers for the Scary Baboon VR event',
  openGraph: {
    title: 'Scary Baboon // Streamer Hub',
    description: 'Join the horde. Stream the chaos.',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
