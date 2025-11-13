import { useEffect, useMemo, useState } from 'react'
import Spline from '@splinetool/react-spline'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Landing() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-blue-50">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/hGDm7Foxug7C6E8s/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="relative z-10">
        <header className="px-6 py-5 flex items-center justify-between">
          <div className="text-xl font-bold text-indigo-700">SkillSwap</div>
          <nav className="flex items-center gap-4">
            <a href="#match" className="text-sm text-gray-700 hover:text-indigo-700">Find Mentors</a>
            <a href="#create" className="text-sm text-gray-700 hover:text-indigo-700">Join</a>
          </nav>
        </header>

        <section className="px-6 pt-16 pb-24 sm:pt-24 sm:pb-32 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Learn, teach, and grow with a token economy
            </h1>
            <p className="mt-5 text-lg text-gray-600 max-w-xl">
              Earn Skill Tokens by teaching. Spend them to learn. Real-time chat, scheduling, and live sessions — all in one place.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#match" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow">Start Matching</a>
              <a href="#create" className="bg-white hover:bg-gray-50 text-indigo-700 border border-indigo-200 px-5 py-2.5 rounded-lg shadow-sm">Create Profile</a>
            </div>
            <p className="mt-3 text-sm text-gray-500">Powered by FastAPI, WebSockets, and MongoDB</p>
          </div>

          <div className="relative h-[380px] md:h-[520px] rounded-2xl overflow-hidden border border-indigo-100/60 bg-white/70 backdrop-blur-sm"></div>
        </section>
      </div>
    </div>
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
    // prefill with some items if available
    search()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section id="match" className="px-6 py-12 bg-white">
      <h2 className="text-2xl font-bold">Smart Matching</h2>
      <p className="text-gray-600 mt-1">Shows users who teach what you want to learn.</p>
      <div className="mt-5 flex gap-3 items-center">
        <input value={wanted} onChange={(e) => setWanted(e.target.value)} placeholder="e.g., React, UX, Node.js" className="w-full max-w-md border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-200" />
        <button onClick={search} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">Search</button>
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
    <section id="create" className="px-6 py-12 bg-gradient-to-b from-indigo-50 to-blue-50">
      <h2 className="text-2xl font-bold">Create a Demo Profile</h2>
      <p className="text-gray-600 mt-1">Quickly seed a user to test matching.</p>

      <div className="mt-4 grid sm:grid-cols-2 gap-5 max-w-3xl">
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
    </section>
  )
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Landing />
      <MatchDemo />
      <CreateUserDemo />
      <footer className="px-6 py-10 text-center text-sm text-gray-500">SkillSwap – Peer-to-Peer Learning • Token Economy • Real-time</footer>
    </div>
  )
}
