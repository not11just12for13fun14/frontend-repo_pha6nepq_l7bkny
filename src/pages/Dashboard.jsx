import { useEffect, useState } from 'react'
import { useAuth } from '../components/AuthProvider'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Dashboard(){
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      if (!user) { setLoading(false); return }
      try {
        setLoading(true)
        setError('')
        const res = await fetch(`${BACKEND}/dashboard/${user.uid || user.id || 'unknown'}`)
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
        const json = await res.json()
        setData(json)
      } catch (e) {
        console.error('Dashboard load error:', e)
        setError('Could not load dashboard data. Using demo placeholders for now.')
        setData({ tokens: 0, transactions: [], upcoming: [], completed: [] })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  if (loading) return <div className="p-6">Loading...</div>

  const tokens = data?.tokens ?? 0
  const transactions = Array.isArray(data?.transactions) ? data.transactions : []
  const upcoming = Array.isArray(data?.upcoming) ? data.upcoming : []
  const completed = Array.isArray(data?.completed) ? data.completed : []

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h2 className="text-2xl font-semibold">Your Dashboard</h2>
      {error && (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 px-3 py-2 text-sm">
          {error}
        </div>
      )}
      <div className="mt-4 grid md:grid-cols-3 gap-4">
        <div className="rounded-xl border p-4 bg-white">
          <div className="text-sm text-gray-600">Token Balance</div>
          <div className="text-3xl font-bold">{tokens}</div>
        </div>
        <div className="rounded-xl border p-4 bg-white md:col-span-2">
          <div className="font-semibold">Recent Transactions</div>
          {transactions.length === 0 ? (
            <div className="mt-2 text-sm text-gray-500">No transactions yet.</div>
          ) : (
            <ul className="mt-2 text-sm list-disc ml-5">
              {transactions.map((t, idx) => (
                <li key={t._id || idx}>{t.reason} ({t.delta})</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border p-4 bg-white">
          <div className="font-semibold">Upcoming Sessions</div>
          {upcoming.length === 0 ? (
            <div className="mt-2 text-sm text-gray-500">No upcoming sessions scheduled.</div>
          ) : (
            <ul className="mt-2 text-sm space-y-2">
              {upcoming.map((s, idx) => (
                <li key={s._id || idx} className="border rounded-lg p-2">{s.skill} – {s.status}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-xl border p-4 bg-white">
          <div className="font-semibold">Completed Sessions</div>
          {completed.length === 0 ? (
            <div className="mt-2 text-sm text-gray-500">No completed sessions yet.</div>
          ) : (
            <ul className="mt-2 text-sm space-y-2">
              {completed.map((s, idx) => (
                <li key={s._id || idx} className="border rounded-lg p-2">{s.skill}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
