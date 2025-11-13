import { useEffect, useMemo, useState } from 'react'
import Spline from '@splinetool/react-spline'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Glow() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-tr from-indigo-300/40 via-fuchsia-200/40 to-sky-200/40 blur-3xl" />
      <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-gradient-to-tr from-sky-300/40 via-indigo-200/40 to-purple-200/40 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(at_top,_theme(colors.indigo.200),_transparent_60%)] blur-3xl opacity-60" />
    </div>
  )
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-white/70 px-3 py-1 text-xs text-indigo-700 shadow-sm backdrop-blur">
      {children}
    </span>
  )
}

function Landing() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-blue-50">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/hGDm7Foxug7C6E8s/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <Glow />

      <div className="relative z-10">
        <header className="px-6 py-5 flex items-center justify-between">
          <div className="text-xl font-bold text-indigo-700">SkillSwap</div>
          <nav className="flex items-center gap-4">
            <a href="#story" className="text-sm text-gray-700 hover:text-indigo-700">Story</a>
            <a href="#match" className="text-sm text-gray-700 hover:text-indigo-700">Find Mentors</a>
            <a href="#create" className="text-sm text-gray-700 hover:text-indigo-700">Join</a>
          </nav>
        </header>

        <section className="px-6 pt-16 pb-24 sm:pt-24 sm:pb-32 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge>Peer-to-Peer Learning</Badge>
              <Badge>Token Economy</Badge>
              <Badge>Real-time</Badge>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Learn, teach, and grow together
            </h1>
            <p className="mt-5 text-lg text-gray-600 max-w-xl">
              Earn Skill Tokens by teaching. Spend them to learn. Real-time chat, scheduling, and live sessions — all in one place.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#story" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow">See the Story</a>
              <a href="#match" className="bg-white hover:bg-gray-50 text-indigo-700 border border-indigo-200 px-5 py-2.5 rounded-lg shadow-sm">Start Matching</a>
            </div>
            <p className="mt-3 text-sm text-gray-500">Powered by FastAPI, WebSockets, and MongoDB</p>
          </div>

          <div className="relative h-[380px] md:h-[520px] rounded-2xl overflow-hidden border border-indigo-100/60 bg-white/70 backdrop-blur-sm">
            <div className="absolute inset-0 grid grid-cols-2 gap-3 p-3">
              <div className="rounded-xl bg-gradient-to-br from-white to-indigo-50/60 border border-indigo-100/70 p-4 flex flex-col justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-800">Alex learns</div>
                  <div className="mt-1 text-xs text-gray-500">React • UX • AI</div>
                </div>
                <div className="mt-3 text-[10px] text-indigo-700">“I spent 1 token for a 30min session.”</div>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-white to-sky-50/60 border border-sky-100/70 p-4 flex flex-col justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-800">Maya teaches</div>
                  <div className="mt-1 text-xs text-gray-500">React • JS</div>
                </div>
                <div className="mt-3 text-[10px] text-sky-700">“I earned 1 token by teaching.”</div>
              </div>
              <div className="col-span-2 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 p-4 text-white">
                <div className="text-sm font-medium">Live Session</div>
                <div className="text-xs opacity-90">Video • Whiteboard • Chat</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function StoryPanel({ step, title, copy, accent, emoji }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-white/70 backdrop-blur shadow-sm">
      <div className={`absolute inset-x-0 -top-20 h-40 ${accent} blur-3xl opacity-30`} />
      <div className="relative p-6">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white font-semibold">{step}</span>
          <span>Chapter {step}</span>
        </div>
        <div className="mt-3 flex items-start gap-3">
          <div className="text-2xl" aria-hidden>{emoji}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-gray-600 text-sm leading-relaxed">{copy}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StoryRail() {
  return (
    <section id="story" className="relative px-6 py-20 bg-gradient-to-b from-white to-indigo-50">
      <Glow />
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900">Your SkillSwap Journey</h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">A story-driven path from curiosity to mastery — powered by a community that values your time.</p>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <StoryPanel
            step={1}
            title="Discover your path"
            emoji="🧭"
            accent="bg-gradient-to-r from-indigo-200 to-sky-200"
            copy="Tell us what you want to learn, and what you can teach. Our matching shows mentors and peers who fit your goals."/>
          <StoryPanel
            step={2}
            title="Earn and spend tokens"
            emoji="🪙"
            accent="bg-gradient-to-r from-amber-200 to-fuchsia-200"
            copy="Teach to earn, learn to spend. The token economy keeps help flowing both ways — fair and simple."/>
          <StoryPanel
            step={3}
            title="Meet in real time"
            emoji="🎥"
            accent="bg-gradient-to-r from-violet-200 to-rose-200"
            copy="Hop into a live session with chat, video, and a shared whiteboard. Share ideas, code, sketches, and breakthroughs."/>
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <StoryPanel
            step={4}
            title="AI by your side"
            emoji="🤖"
            accent="bg-gradient-to-r from-emerald-200 to-teal-200"
            copy="An AI coach suggests learning plans and practice steps tailored to your goals and schedule."/>
          <StoryPanel
            step={5}
            title="Grow your reputation"
            emoji="🌟"
            accent="bg-gradient-to-r from-yellow-200 to-orange-200"
            copy="Collect reviews, build your profile, and unlock advanced topics. Your journey becomes someone else’s roadmap."/>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="#match" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow">Start Matching</a>
          <a href="#create" className="bg-white hover:bg-gray-50 text-indigo-700 border border-indigo-200 px-6 py-3 rounded-xl shadow-sm">Create a Profile</a>
        </div>
      </div>
    </section>
  )
}

function Feature({ title, copy, icon, accent }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm">
      <div className={`absolute -top-10 -right-10 h-24 w-24 rounded-full blur-2xl ${accent}`} />
      <div className="relative">
        <div className="text-2xl">{icon}</div>
        <h4 className="mt-3 font-semibold text-gray-900">{title}</h4>
        <p className="mt-1 text-sm text-gray-600">{copy}</p>
      </div>
    </div>
  )
}

function Benefits() {
  return (
    <section className="px-6 py-16 bg-gradient-to-b from-indigo-50 to-white">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h3 className="text-2xl sm:text-4xl font-extrabold text-gray-900">Why people love SkillSwap</h3>
          <p className="mt-2 text-gray-600">Designed for momentum — everything you need to go from question to insight.</p>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Feature title="Instant Matches" icon="✨" accent="bg-indigo-200/70" copy="See top mentors and peers for your goals in seconds." />
          <Feature title="Fair Value" icon="🪙" accent="bg-amber-200/70" copy="Tokens reward teaching and fuel your learning." />
          <Feature title="Real-time Tools" icon="⚡" accent="bg-fuchsia-200/70" copy="Chat, video, and whiteboard — no context switching." />
          <Feature title="AI Guidance" icon="🤝" accent="bg-emerald-200/70" copy="Personalized plans and nudges to keep you moving." />
        </div>
      </div>
    </section>
  )
}

function MatchDemo() {
  const [wanted, setWanted] = useState('React, Python')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const skillsWanted = useMemo(() => wanted.split(',').map(s => s.trim()).filter(Boolean), [wanted])

  const search = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND}/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills_wanted: skillsWanted })
      })
      const data = await res.json()
      setResults(data.results || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    search()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section id="match" className="px-6 py-16 bg-white">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold">Smart Matching</h2>
        <p className="text-gray-600 mt-1">Shows users who teach what you want to learn.</p>
        <div className="mt-5 flex gap-3 items-center">
          <input value={wanted} onChange={(e) => setWanted(e.target.value)} placeholder="e.g., React, UX, Node.js" className="w-full max-w-md border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-200" />
          <button onClick={search} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">{loading ? 'Searching...' : 'Search'}</button>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((u) => (
            <div key={u._id} className="border rounded-xl p-4 bg-gradient-to-br from-white to-indigo-50/40">
              <div className="font-semibold text-gray-900">{u.name || 'User'}</div>
              <div className="text-sm text-gray-600">Teaches: {(u.skills_teach || []).join(', ') || '—'}</div>
              {u.overlap?.length > 0 && (
                <div className="mt-2 text-xs text-indigo-700">Matches: {u.overlap.join(', ')}</div>
              )}
            </div>
          ))}
          {results.length === 0 && !loading && (
            <div className="text-gray-500">No matches yet. Try adding demo users below.</div>
          )}
        </div>
      </div>
    </section>
  )
}

function CreateUserDemo() {
  const [name, setName] = useState('Alex Mentor')
  const [email, setEmail] = useState('alex@example.com')
  const [teach, setTeach] = useState('React, Python')
  const [learn, setLearn] = useState('AI, Node.js')
  const [createdId, setCreatedId] = useState('')
  const [loading, setLoading] = useState(false)

  const createUser = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          skills_teach: teach.split(',').map(s => s.trim()).filter(Boolean),
          skills_learn: learn.split(',').map(s => s.trim()).filter(Boolean)
        })
      })
      const data = await res.json()
      setCreatedId(data.id)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="create" className="px-6 py-16 bg-gradient-to-b from-indigo-50 to-blue-50">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold">Create a Demo Profile</h2>
        <p className="text-gray-600 mt-1">Quickly seed a user to test matching.</p>

        <div className="mt-6 grid md:grid-cols-2 gap-6 max-w-4xl">
          <div className="space-y-3">
            <input className="w-full border border-gray-200 rounded-lg px-4 py-2" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" />
            <input className="w-full border border-gray-200 rounded-lg px-4 py-2" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" />
            <input className="w-full border border-gray-200 rounded-lg px-4 py-2" value={teach} onChange={(e)=>setTeach(e.target.value)} placeholder="Skills to teach (comma separated)" />
            <input className="w-full border border-gray-200 rounded-lg px-4 py-2" value={learn} onChange={(e)=>setLearn(e.target.value)} placeholder="Skills to learn (comma separated)" />
          </div>
          <div className="rounded-xl border p-4 bg-white">
            <div className="text-sm text-gray-600">Tokens start at 1. You can use the matching above to find peers.</div>
            <button onClick={createUser} disabled={loading} className="mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg">
              {loading ? 'Creating...' : 'Create Demo User'}
            </button>
            {createdId && <div className="mt-2 text-sm text-green-700">Created user with id: {createdId}</div>}
          </div>
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="relative px-6 py-20">
      <Glow />
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border bg-gradient-to-r from-indigo-600 to-fuchsia-600 p-8 text-white shadow">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-3xl font-extrabold">Ready to swap skills?</h3>
            <p className="mt-2 text-white/90">Create your profile, match with mentors and learners, and jump into your first live session today.</p>
            <div className="mt-6 flex gap-3">
              <a href="#create" className="bg-white text-indigo-700 px-5 py-2.5 rounded-lg shadow">Create your profile</a>
              <a href="#match" className="bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-lg border border-white/40">Find mentors</a>
            </div>
          </div>
          <div className="relative h-48 md:h-56 rounded-2xl bg-white/10 border border-white/20 backdrop-blur flex items-center justify-center">
            <div className="text-center">
              <div className="text-sm uppercase tracking-widest text-white/80">Live Toolkit</div>
              <div className="mt-2 text-2xl">🎥 + 📝 + 💬</div>
              <div className="mt-2 text-white/80 text-sm">Video • Whiteboard • Chat</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col scroll-smooth">
      <Landing />
      <StoryRail />
      <Benefits />
      <MatchDemo />
      <CreateUserDemo />
      <CTA />
      <footer className="px-6 py-10 text-center text-sm text-gray-500">SkillSwap – Peer-to-Peer Learning • Token Economy • Real-time</footer>
    </div>
  )
}
