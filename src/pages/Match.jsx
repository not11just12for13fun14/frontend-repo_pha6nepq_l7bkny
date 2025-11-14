import { useEffect, useMemo, useState } from 'react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Match() {
  const [q, setQ] = useState('React, Python')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const skills = useMemo(() => q.split(',').map(s => s.trim()).filter(Boolean), [q])

  const search = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND}/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills_wanted: skills })
      })
      const data = await res.json()
      setResults(data.results || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { search() }, [])

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h2 className="text-2xl font-semibold">Find Mentors & Peers</h2>
      <div className="mt-4 flex gap-2">
        <input className="flex-1 border rounded-lg px-3 py-2" value={q} onChange={e=>setQ(e.target.value)} />
        <button onClick={search} className="px-4 py-2 rounded-lg bg-indigo-600 text-white">{loading ? 'Searching...' : 'Search'}</button>
      </div>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map(u => (
          <div key={u._id} className="rounded-xl border p-4 bg-white">
            <div className="font-semibold">{u.name}</div>
            <div className="text-sm text-gray-600">Teaches: {(u.skills_teach||[]).join(', ')}</div>
            {u.overlap?.length>0 && <div className="mt-1 text-xs text-indigo-700">Matches: {u.overlap.join(', ')}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
