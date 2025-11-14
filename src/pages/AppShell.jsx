import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'

export default function AppShell() {
  const { user, logout } = useAuth()
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-4 border-b bg-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/app" className="text-lg font-bold text-indigo-700">SkillSwap</Link>
          <nav className="hidden sm:flex items-center gap-4 text-sm text-gray-700">
            <NavLink to="/app/match" className={({isActive}) => isActive ? 'text-indigo-700' : ''}>Match</NavLink>
            <NavLink to="/app/chat" className={({isActive}) => isActive ? 'text-indigo-700' : ''}>Chat</NavLink>
            <NavLink to="/app/sessions" className={({isActive}) => isActive ? 'text-indigo-700' : ''}>Sessions</NavLink>
            <NavLink to="/app/dashboard" className={({isActive}) => isActive ? 'text-indigo-700' : ''}>Dashboard</NavLink>
            <NavLink to="/app/admin" className={({isActive}) => isActive ? 'text-indigo-700' : ''}>Admin</NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <img src={user?.avatar || 'https://i.pravatar.cc/40'} alt="avatar" className="h-8 w-8 rounded-full" />
          <span className="hidden sm:block text-sm text-gray-700">{user?.name}</span>
          <button onClick={logout} className="px-3 py-1.5 text-sm rounded-lg bg-gray-100">Logout</button>
        </div>
      </header>
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
    </div>
  )
}
