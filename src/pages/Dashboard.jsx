import { useEffect, useState } from 'react'
import { useAuth } from '../components/AuthProvider'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Dashboard(){
  const { user } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!user) return
    fetch(`${BACKEND}/dashboard/${user.uid || user.id || 'unknown'}`).then(r=>r.json()).then(setData)
  }, [user])

  if (!data) return <div className="p-6">Loading...</div>

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h2 className="text-2xl font-semibold">Your Dashboard</h2>
      <div className="mt-4 grid md:grid-cols-3 gap-4">
        <div className="rounded-xl border p-4 bg-white">
          <div className="text-sm text-gray-600">Token Balance</div>
          <div className="text-3xl font-bold">{data.tokens}</div>
        </div>
        <div className="rounded-xl border p-4 bg-white md:col-span-2">
          <div className="font-semibold">Recent Transactions</div>
          <ul className="mt-2 text-sm list-disc ml-5">
            {data.transactions.map(t => (
              <li key={t._id}>{t.reason} ({t.delta})</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border p-4 bg-white">
          <div className="font-semibold">Upcoming Sessions</div>
          <ul className="mt-2 text-sm space-y-2">
            {data.upcoming.map(s => (
              <li key={s._id} className="border rounded-lg p-2">{s.skill} – {s.status}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border p-4 bg-white">
          <div className="font-semibold">Completed Sessions</div>
          <ul className="mt-2 text-sm space-y-2">
            {data.completed.map(s => (
              <li key={s._id} className="border rounded-lg p-2">{s.skill}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
