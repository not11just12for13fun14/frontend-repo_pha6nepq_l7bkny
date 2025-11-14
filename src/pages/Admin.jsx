import { useEffect, useState } from 'react'
import { useAuth } from '../components/AuthProvider'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Admin(){
  const { user } = useAuth()
  const [items, setItems] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('ss_jwt')
    fetch(`${BACKEND}/admin/users`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then(r=>r.json()).then(setItems).catch(()=>setItems([]))
  }, [])

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h2 className="text-2xl font-semibold">Admin Panel</h2>
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(u => (
          <div key={u._id} className="rounded-xl border p-4 bg-white">
            <div className="font-semibold">{u.name}</div>
            <div className="text-sm text-gray-600">{u.email}</div>
            <div className="text-xs text-gray-500">role: {u.role} • active: {String(u.active)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
