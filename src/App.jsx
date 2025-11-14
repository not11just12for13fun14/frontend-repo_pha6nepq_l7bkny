import { useEffect, useMemo, useRef, useState } from 'react'
import Spline from '@splinetool/react-spline'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

// Small utilities
function useMouseTilt() {
  const ref = useRef(null)
  const [style, setStyle] = useState({})
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = (e.clientY - r.top) / r.height
      const rx = (y - 0.5) * -8
      const ry = (x - 0.5) * 8
      setStyle({ transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)` })
    }
    const onLeave = () => setStyle({ transform: 'perspective(900px) rotateX(0deg) rotateY(0deg)' })
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])
  return { ref, style }
}

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

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  return (
    <motion.div style={{ scaleX }} className="fixed left-0 right-0 top-0 h-1 origin-left bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-sky-400 z-50" />
  )
}

// Magnetic button + micro-sparkles
function MagneticButton({ children, className = '', onClick, as = 'button', href }) {
  const ref = useRef(null)
  const [btnStyle, setBtnStyle] = useState({})
  const [sparks, setSparks] = useState([])

  const createSpark = (x, y) => {
    const id = Math.random().toString(36).slice(2)
    const colorPool = ['#ffffff', '#f0abfc', '#93c5fd', '#c7d2fe', '#a7f3d0']
    const color = colorPool[Math.floor(Math.random()*colorPool.length)]
    const size = Math.random()*6 + 4
    const dx = (Math.random()-0.5) * 40
    const dy = (Math.random()-0.5) * 40
    const life = 600 + Math.random()*400
    const spark = { id, x, y, dx, dy, size, color }
    setSparks(prev => [...prev, spark])
    setTimeout(() => {
      setSparks(prev => prev.filter(s => s.id !== id))
    }, life)
  }

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const relX = e.clientX - r.left
    const relY = e.clientY - r.top
    const mx = (relX - r.width/2) / (r.width/2)
    const my = (relY - r.height/2) / (r.height/2)
    setBtnStyle({ transform: `translate(${mx*6}px, ${my*6}px)` })
    if (Math.random() < 0.3) createSpark(relX, relY)
  }
  const onLeave = () => setBtnStyle({ transform: 'translate(0px, 0px)' })

  const Common = ({ children }) => (
    <motion.span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileTap={{ scale: 0.98 }}
      className={`relative inline-flex items-center justify-center overflow-hidden ${className}`}
      style={btnStyle}
    >
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/10 to-white/0" />
      {sparks.map(s => (
        <span key={s.id} className="pointer-events-none absolute rounded-full"
          style={{
            left: s.x, top: s.y, width: s.size, height: s.size,
            background: s.color, filter: 'blur(0.5px)',
            transform: `translate(${s.dx}px, ${s.dy}px)`,
            opacity: 0.85, transition: 'transform 700ms ease-out, opacity 700ms ease-out'
          }}
        />
      ))}
      <span className="relative z-10">{children}</span>
    </motion.span>
  )

  if (as === 'a') {
    return (
      <a href={href} onClick={onClick} className="inline-block">
        <Common>{children}</Common>
      </a>
    )
  }
  return (
    <button onClick={onClick} className="inline-block">
      <Common>{children}</Common>
    </button>
  )
}

function Landing({ onStartStory, onStartMatch }) {
  const { scrollYProgress } = useScroll()
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -60])

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-blue-50">
      <motion.div className="absolute inset-0" style={{ y: y1 }}>
        <Spline scene="https://prod.spline.design/hGDm7Foxug7C6E8s/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </motion.div>
      <Glow />

      <div className="relative z-10">
        <header className="px-6 py-5 flex items-center justify-between">
          <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-xl font-bold text-indigo-700">SkillSwap</motion.div>
          <nav className="flex items-center gap-4">
            <a href="#story" className="text-sm text-gray-700 hover:text-indigo-700">Story</a>
            <a href="#match" className="text-sm text-gray-700 hover:text-indigo-700">Find Mentors</a>
            <a href="#create" className="text-sm text-gray-700 hover:text-indigo-700">Join</a>
          </nav>
        </header>

        <section className="px-6 pt-16 pb-24 sm:pt-24 sm:pb-32 grid md:grid-cols-2 gap-8 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
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
              <MagneticButton as="a" href="#story" onClick={onStartStory} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow">See the Story</MagneticButton>
              <MagneticButton as="a" href="#match" onClick={onStartMatch} className="bg-white hover:bg-gray-50 text-indigo-700 border border-indigo-200 px-5 py-2.5 rounded-lg shadow-sm">Start Matching</MagneticButton>
            </div>
            <p className="mt-3 text-sm text-gray-500">Powered by FastAPI, WebSockets, and MongoDB</p>
          </motion.div>

          <motion.div className="relative h-[420px] md:h-[560px] rounded-2xl overflow-hidden border border-indigo-100/60 bg-white/70 backdrop-blur-sm" style={{ y: y2 }}>
            <InteractiveHeroCards />
          </motion.div>
        </section>
      </div>
    </div>
  )
}

function InteractiveHeroCards() {
  const cards = [
    { t: 'Alex learns', s: 'React • UX • AI', q: '“I spent 1 token for a 30min session.”', color: 'from-white to-indigo-50/60', accent: 'text-indigo-700' },
    { t: 'Maya teaches', s: 'React • JS', q: '“I earned 1 token by teaching.”', color: 'from-white to-sky-50/60', accent: 'text-sky-700' },
  ]
  return (
    <div className="absolute inset-0 grid grid-cols-2 gap-3 p-3">
      {cards.map((c, i) => (
        <TiltCard key={i} className={`rounded-xl bg-gradient-to-br ${c.color} border border-indigo-100/70 p-4 flex flex-col justify-between`}>
          <div>
            <div className="text-sm font-semibold text-gray-800">{c.t}</div>
            <div className="mt-1 text-xs text-gray-500">{c.s}</div>
          </div>
          <div className={`mt-3 text-[10px] ${c.accent}`}>{c.q}</div>
        </TiltCard>
      ))}
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }} className="col-span-2 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 p-4 text-white">
        <div className="text-sm font-medium">Live Session</div>
        <div className="text-xs opacity-90">Video • Whiteboard • Chat</div>
      </motion.div>
    </div>
  )
}

function TiltCard({ children, className = '' }) {
  const { ref, style } = useMouseTilt()
  return (
    <motion.div ref={ref} style={style} whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className={className}>
      {children}
    </motion.div>
  )
}

function StoryPanel({ step, title, copy, accent, emoji }) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl border bg-white/70 backdrop-blur shadow-sm">
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
    </motion.div>
  )
}

function StoryRail({ idx, setIdx }) {
  const steps = [
    { title: 'Discover your path', emoji: '🧭', accent: 'bg-gradient-to-r from-indigo-200 to-sky-200', copy: 'Tell us what you want to learn, and what you can teach. Our matching shows mentors and peers who fit your goals.' },
    { title: 'Earn and spend tokens', emoji: '🪙', accent: 'bg-gradient-to-r from-amber-200 to-fuchsia-200', copy: 'Teach to earn, learn to spend. The token economy keeps help flowing both ways — fair and simple.' },
    { title: 'Meet in real time', emoji: '🎥', accent: 'bg-gradient-to-r from-violet-200 to-rose-200', copy: 'Hop into a live session with chat, video, and a shared whiteboard. Share ideas, code, sketches, and breakthroughs.' },
    { title: 'AI by your side', emoji: '🤖', accent: 'bg-gradient-to-r from-emerald-200 to-teal-200', copy: 'An AI coach suggests learning plans and practice steps tailored to your goals and schedule.' },
    { title: 'Grow your reputation', emoji: '🌟', accent: 'bg-gradient-to-r from-yellow-200 to-orange-200', copy: 'Collect reviews, build your profile, and unlock advanced topics. Your journey becomes someone else’s roadmap.' }
  ]

  return (
    <section id="story" className="relative px-6 py-20 bg-gradient-to-b from-white to-indigo-50">
      <Glow />
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900">Your SkillSwap Journey</h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">A story-driven path from curiosity to mastery — powered by a community that values your time.</p>
        </div>

        {/* Interactive carousel */}
        <div className="mt-10">
          <div className="relative overflow-hidden rounded-2xl border bg-white/70 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="text-sm text-gray-500">Chapter {idx + 1} of {steps.length}</div>
              <div className="flex gap-2">
                {steps.map((_, i) => (
                  <button key={i} onClick={() => setIdx(i)} className={`h-2 w-6 rounded-full ${i === idx ? 'bg-indigo-600' : 'bg-gray-200'}`} aria-label={`Go to chapter ${i+1}`} />
                ))}
              </div>
            </div>
            <div className="p-6 min-h-[180px]">
              <AnimatePresence mode="wait">
                <motion.div key={idx} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35 }}>
                  <StoryPanel step={idx + 1} title={steps[idx].title} emoji={steps[idx].emoji} accent={steps[idx].accent} copy={steps[idx].copy} />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <MagneticButton onClick={() => setIdx(Math.max(0, idx - 1))} className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200">Prev</MagneticButton>
              <MagneticButton onClick={() => setIdx(Math.min(steps.length - 1, idx + 1))} className="text-sm px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Next</MagneticButton>
            </div>
          </div>
        </div>

        {/* Grid of revealed chapters */}
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.slice(0,3).map((s, i) => (
            <StoryPanel key={i} step={i + 1} title={s.title} emoji={s.emoji} accent={s.accent} copy={s.copy} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Feature({ title, copy, icon, accent }) {
  return (
    <TiltCard className="relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm">
      <div className={`absolute -top-10 -right-10 h-24 w-24 rounded-full blur-2xl ${accent}`} />
      <div className="relative">
        <div className="text-2xl">{icon}</div>
        <h4 className="mt-3 font-semibold text-gray-900">{title}</h4>
        <p className="mt-1 text-sm text-gray-600">{copy}</p>
      </div>
    </TiltCard>
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Smart Matching</h2>
            <p className="text-gray-600 mt-1">Shows users who teach what you want to learn.</p>
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="hidden md:block text-sm text-gray-500">Tip: Hover cards for depth</motion.div>
        </div>
        <div className="mt-5 flex gap-3 items-center">
          <input value={wanted} onChange={(e) => setWanted(e.target.value)} placeholder="e.g., React, UX, Node.js" className="w-full max-w-md border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-200" />
          <MagneticButton onClick={search} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">{loading ? 'Searching...' : 'Search'}</MagneticButton>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((u) => (
            <TiltCard key={u._id} className="border rounded-xl p-4 bg-gradient-to-br from-white to-indigo-50/40">
              <div className="font-semibold text-gray-900">{u.name || 'User'}</div>
              <div className="text-sm text-gray-600">Teaches: {(u.skills_teach || []).join(', ') || '—'}</div>
              {u.overlap?.length > 0 && (
                <div className="mt-2 text-xs text-indigo-700">Matches: {u.overlap.join(', ')}</div>
              )}
            </TiltCard>
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
          <TiltCard className="rounded-xl border p-4 bg-white">
            <div className="text-sm text-gray-600">Tokens start at 1. You can use the matching above to find peers.</div>
            <MagneticButton onClick={createUser} className="mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg" disabled={loading}>
              {loading ? 'Creating...' : 'Create Demo User'}
            </MagneticButton>
            {createdId && <div className="mt-2 text-sm text-green-700">Created user with id: {createdId}</div>}
          </TiltCard>
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="relative px-6 py-20">
      <Glow />
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mx-auto max-w-5xl overflow-hidden rounded-3xl border bg-gradient-to-r from-indigo-600 to-fuchsia-600 p-8 text-white shadow">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-3xl font-extrabold">Ready to swap skills?</h3>
            <p className="mt-2 text-white/90">Create your profile, match with mentors and learners, and jump into your first live session today.</p>
            <div className="mt-6 flex gap-3">
              <MagneticButton as="a" href="#create" className="bg-white text-indigo-700 px-5 py-2.5 rounded-lg shadow">Create your profile</MagneticButton>
              <MagneticButton as="a" href="#match" className="bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-lg border border-white/40">Find mentors</MagneticButton>
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
      </motion.div>
    </section>
  )
}

// Floating Chat Preview (docks bottom-right, toggleable)
function FloatingChat({ open, setOpen }) {
  const [messages, setMessages] = useState([
    { id: 1, from: 'Maya', text: 'Hey! Ready to start the React session?', t: '10:30' },
    { id: 2, from: 'You', text: 'Yes! Let’s go. I’ve got questions about hooks.', t: '10:31' },
  ])
  const [input, setInput] = useState('')

  const send = () => {
    if (!input.trim()) return
    const id = Math.random().toString(36).slice(2)
    setMessages(prev => [...prev, { id, from: 'You', text: input.trim(), t: 'now' }])
    setInput('')
  }

  return (
    <div className="fixed right-4 bottom-4 z-50">
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="w-80 sm:w-96 rounded-2xl border bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white">
              <div className="text-sm font-semibold">Chat Preview</div>
              <button onClick={() => setOpen(false)} className="text-white/90 hover:text-white">✕</button>
            </div>
            <div className="max-h-64 overflow-auto p-3 space-y-2 bg-gradient-to-b from-white to-indigo-50/40">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.from === 'You' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`${m.from === 'You' ? 'bg-indigo-600 text-white' : 'bg-white'} border rounded-xl px-3 py-1.5 text-sm max-w-[75%] shadow-sm`}>
                    <div className="opacity-80 text-xs mb-0.5">{m.from}</div>
                    <div>{m.text}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-2 border-t bg-white">
              <div className="flex gap-2">
                <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Type a message (preview)" className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                <MagneticButton onClick={send} className="px-3 py-2 rounded-lg bg-indigo-600 text-white">Send</MagneticButton>
              </div>
              <div className="text-[11px] text-gray-500 mt-1">This is a UI preview. Real-time chat will connect via WebSockets.</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!open && (
        <MagneticButton onClick={() => setOpen(true)} className="rounded-full bg-indigo-600 text-white px-4 py-3 shadow-lg">
          💬 Chat
        </MagneticButton>
      )}
    </div>
  )
}

// Guided Onboarding Overlay that steps through StoryRail
function OnboardingOverlay({ visible, setVisible, idx, setIdx }) {
  const stepsHints = [
    'Tell us your goals and what you can teach.',
    'Earn when you teach. Spend to learn — simple and fair.',
    'Jump into live video, whiteboard, and chat.',
    'Get a tailored learning plan with AI coaching.',
    'Grow your reputation with reviews and milestones.'
  ]
  if (!visible) return null
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[min(90%,700px)] pointer-events-auto">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="rounded-2xl border bg-white shadow-xl overflow-hidden">
              <div className="px-5 py-4 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white flex items-center justify-between">
                <div className="font-semibold">Guided tour</div>
                <button className="text-white/90 hover:text-white" onClick={() => setVisible(false)}>Skip</button>
              </div>
              <div className="p-5">
                <div className="text-sm text-gray-500">Step {idx+1} of 5</div>
                <h4 className="mt-1 text-xl font-semibold text-gray-900">{stepsHints[idx]}</h4>
                <p className="mt-2 text-sm text-gray-600">Use Next to move through the chapters. We’ll auto-scroll the story.</p>
                <div className="mt-4 flex items-center justify-between">
                  <MagneticButton onClick={() => setIdx(Math.max(0, idx - 1))} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">Back</MagneticButton>
                  {idx < 4 ? (
                    <MagneticButton onClick={() => setIdx(Math.min(4, idx + 1))} className="px-4 py-2 rounded-lg bg-indigo-600 text-white">Next</MagneticButton>
                  ) : (
                    <MagneticButton onClick={() => setVisible(false)} className="px-4 py-2 rounded-lg bg-emerald-600 text-white">Finish</MagneticButton>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  const [storyIdx, setStoryIdx] = useState(0)
  const [tourOpen, setTourOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)

  useEffect(() => {
    const el = document.getElementById('story')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [storyIdx])

  return (
    <div className="min-h-screen flex flex-col scroll-smooth">
      <ScrollProgress />
      <Landing onStartStory={() => setTourOpen(true)} onStartMatch={() => {}} />
      <StoryRail idx={storyIdx} setIdx={setStoryIdx} />
      <Benefits />
      <MatchDemo />
      <CreateUserDemo />
      <CTA />
      <footer className="px-6 py-10 text-center text-sm text-gray-500">SkillSwap – Peer-to-Peer Learning • Token Economy • Real-time</footer>

      <OnboardingOverlay visible={tourOpen} setVisible={setTourOpen} idx={storyIdx} setIdx={setStoryIdx} />
      <FloatingChat open={chatOpen} setOpen={setChatOpen} />

      {/* Quick-access floating actions */}
      <div className="fixed left-4 bottom-4 z-40 hidden sm:flex flex-col gap-2">
        <MagneticButton onClick={() => setTourOpen(true)} className="px-4 py-2 rounded-lg bg-white border text-gray-800 shadow">❔ Tour</MagneticButton>
        <MagneticButton onClick={() => setChatOpen(v => !v)} className="px-4 py-2 rounded-lg bg-indigo-600 text-white shadow">{chatOpen ? 'Hide Chat' : 'Open Chat'}</MagneticButton>
      </div>
    </div>
  )
}
