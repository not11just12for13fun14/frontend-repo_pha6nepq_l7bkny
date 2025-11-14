import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../components/AuthProvider'
import { Link, useNavigate } from 'react-router-dom'
import Spline from '@splinetool/react-spline'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
const SPLINE_SCENE = import.meta.env.VITE_SPLINE_SCENE || ''

function Section({ eyebrow, title, body, align = 'left', cta, index }) {
  const from = align === 'left' ? { x: -24, opacity: 0 } : { x: 24, opacity: 0 }
  return (
    <section className="relative px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={from}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          className={align === 'left' ? 'md:max-w-3xl' : 'md:ml-auto md:max-w-3xl'}
        >
          {eyebrow && (
            <div className="text-sm font-semibold tracking-wide text-indigo-600/90">{eyebrow}</div>
          )}
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            {title}
          </h2>
          <p className="mt-4 text-lg text-gray-600">{body}</p>
          {cta}
        </motion.div>
      </div>
    </section>
  )
}

function DemoLoginModal({ open, onClose }) {
  const { loginWithPassword, loading, error } = useAuth()
  const [email, setEmail] = useState('demo@skillswap.dev')
  const [password, setPassword] = useState('demo123')
  const navigate = useNavigate()

  if (!open) return null

  const onSubmit = async (e) => {
    e.preventDefault()
    const res = await loginWithPassword(email, password)
    if (res?.ok) {
      onClose()
      navigate('/app')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border">
        <div className="p-5 border-b">
          <h3 className="text-lg font-semibold">Demo login</h3>
          <p className="mt-1 text-sm text-gray-600">Use the preset credentials to sign in during development.</p>
        </div>
        <form onSubmit={onSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-sm text-gray-700">Email</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="demo@skillswap.dev" />
          </div>
          <div>
            <label className="text-sm text-gray-700">Password</label>
            <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="demo123" />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div className="flex items-center justify-between">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </div>
        </form>
        <div className="px-5 pb-5 text-xs text-gray-500">Tip: Try demo@skillswap.dev / demo123</div>
      </div>
    </div>
  )
}

export default function Landing() {
  const { user, loginWithGoogle, logout, loading } = useAuth()
  const [demoOpen, setDemoOpen] = useState(false)

  const heroCTA = (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      {!user ? (
        <>
          <button
            onClick={loginWithGoogle}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition"
          >
            {loading ? 'Signing in…' : 'Start with Google'}
          </button>
          <button
            onClick={() => setDemoOpen(true)}
            className="px-6 py-3 rounded-xl bg-white/80 backdrop-blur text-gray-800 border border-gray-200 hover:bg-white transition"
          >
            Use Demo Login
          </button>
        </>
      ) : (
        <>
          <Link
            to="/app"
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition"
          >
            Open App
          </Link>
          <button
            onClick={logout}
            className="px-4 py-3 rounded-xl bg-white/80 backdrop-blur text-gray-800 border border-gray-200 hover:bg-white transition"
          >
            Logout
          </button>
        </>
      )}
    </div>
  )

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-blue-50">
      {/* Top Nav */}
      <header className="relative z-20 px-6 py-5 flex items-center justify-between">
        <div className="text-xl font-bold">
          <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">SkillSwap</span>
        </div>
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <button
                onClick={loginWithGoogle}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
              >
                {loading ? 'Signing in…' : 'Login with Google'}
              </button>
              <button onClick={() => setDemoOpen(true)} className="px-4 py-2 rounded-lg bg-white border">Demo Login</button>
            </>
          ) : (
            <>
              <span className="text-sm text-gray-700 hidden sm:inline">Hi, {user.name}</span>
              <Link to="/app" className="px-3 py-1.5 text-sm rounded-lg bg-indigo-600 text-white">Open App</Link>
              <button onClick={logout} className="px-3 py-1.5 text-sm rounded-lg bg-gray-100">Logout</button>
            </>
          )}
        </div>
      </header>

      {/* 3D Background only on Landing */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {SPLINE_SCENE ? (
          <Spline scene={SPLINE_SCENE} />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(99,102,241,0.25),transparent_60%),radial-gradient(40%_30%_at_80%_20%,rgba(59,130,246,0.18),transparent_60%),linear-gradient(to_bottom,white,rgba(239,246,255,0.6))]" />
        )}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
      </div>

      {/* Hero */}
      <section className="relative z-10 px-6 pt-10 pb-24">
        <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/70 backdrop-blur px-3 py-1 text-xs text-indigo-700">
              Learn by teaching. Teach by learning.
            </div>
            <h1 className="mt-4 text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
              A storytelling journey into peer-to-peer learning
            </h1>
            <p className="mt-5 text-lg text-gray-600 max-w-xl">
              Trade skills with people worldwide. Earn tokens by teaching. Spend them to learn. Real‑time chat, live sessions, and an AI coach guide your growth.
            </p>
            {heroCTA}
            <div className="mt-8 flex items-center gap-6 text-sm text-gray-600">
              <div className="flex -space-x-2">
                <span className="inline-block h-8 w-8 rounded-full bg-indigo-200 border border-white" />
                <span className="inline-block h-8 w-8 rounded-full bg-blue-200 border border-white" />
                <span className="inline-block h-8 w-8 rounded-full bg-violet-200 border border-white" />
              </div>
              <span>Thousands of swaps completed</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
            className="relative"
          >
            <div className="rounded-2xl border bg-white/80 backdrop-blur p-5 shadow-xl shadow-indigo-100">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-gray-700">
                {['Google Auth','Profiles','Token Ledger','Matching','Connections','Notifications','Real-time Chat','Sessions','Whiteboard','AI Coach','Dashboard','Admin Panel'].map((f) => (
                  <div key={f} className="p-3 rounded-lg border bg-white/70 hover:shadow-sm transition">
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story Sections */}
      <Section
        eyebrow="Chapter 1"
        title="The problem: learning that doesn’t fit your life"
        body="Courses are long, tutors are expensive, and forums are noisy. You need quick, focused help from someone who’s done it before."
        align="left"
        cta={null}
      />
      <Section
        eyebrow="Chapter 2"
        title="The spark: a fair exchange of value"
        body="Teach what you know to earn tokens. Spend tokens to learn what you don’t. No invoices. No awkward favors. Just balanced growth."
        align="right"
        cta={null}
      />
      <Section
        eyebrow="Chapter 3"
        title="How it works"
        body="Sign in with Google. Share your skills. Get matched. Chat in real time. Schedule a live session with an interactive whiteboard. Earn or spend tokens automatically."
        align="left"
        cta={heroCTA}
      />
      <Section
        eyebrow="Chapter 4"
        title="Your guide: the AI coach"
        body="Before and after sessions, the AI coach helps you set goals, plan practice, and reflect—so every swap leaves you stronger."
        align="right"
        cta={null}
      />

      {/* Compact Features Grid */}
      <section className="px-6 py-20 bg-gradient-to-b from-white to-indigo-50/60">
        <div className="mx-auto max-w-6xl">
          <h3 className="text-2xl font-bold text-gray-900">Everything you need to learn by teaching</h3>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { t: 'Google Authentication', d: 'Fast sign‑in via Google (Firebase ready).' },
              { t: 'Profiles', d: 'Show skills you teach and learn.' },
              { t: 'Token Economy', d: 'Earn by teaching, spend to learn.' },
              { t: 'Skill Matching', d: 'Find mentors with the skills you need.' },
              { t: 'Connections', d: 'Build your learning network.' },
              { t: 'Notifications', d: 'Stay in the loop on requests and sessions.' },
              { t: 'Real‑Time Chat', d: 'Instant messaging with WebSockets.' },
              { t: 'Sessions + Whiteboard', d: 'Collaborate live with shared canvas.' },
              { t: 'AI Coach', d: 'Personalized prep and reflection.' },
              { t: 'Dashboard', d: 'See tokens, sessions, and activity.' },
              { t: 'Admin Controls', d: 'Keep the community healthy.' },
              { t: 'Secure Transactions', d: 'Transparent token ledger.' },
            ].map(({ t, d }) => (
              <div key={t} className="rounded-xl border bg-white p-4 hover:shadow-sm transition">
                <div className="font-semibold text-gray-900">{t}</div>
                <div className="text-sm text-gray-600 mt-1">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h3 className="text-3xl sm:text-4xl font-bold text-gray-900">Ready to start your next chapter?</h3>
          <p className="mt-3 text-gray-600">
            Sign in to explore matches, chat in real‑time, and book your first session. Your tokens are waiting.
          </p>
          {heroCTA}
        </div>
      </section>

      <footer className="px-6 py-10 text-center text-sm text-gray-500">SkillSwap – Learn by teaching. Teach by learning.</footer>

      <DemoLoginModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  )
}
