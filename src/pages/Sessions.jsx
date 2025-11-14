import { useEffect, useState } from 'react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Sessions() {
  const [items, setItems] = useState([])

  const load = async () => {
    const res = await fetch(`${BACKEND}/sessions`)
    setItems(await res.json())
  }

  useEffect(()=>{ load() },[])

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h2 className="text-2xl font-semibold">Sessions</h2>
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(s => (
          <div key={s._id} className="rounded-xl border p-4 bg-white">
            <div className="font-semibold">{s.skill}</div>
            <div className="text-sm text-gray-600">{s.status}</div>
            <div className="text-xs text-gray-500">Teacher: {s.teacher_id}</div>
            <div className="text-xs text-gray-500">Learner: {s.learner_id}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
