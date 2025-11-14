import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './components/AuthProvider'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import AppShell from './pages/AppShell'
import Match from './pages/Match'
import Chat from './pages/Chat'
import Sessions from './pages/Sessions'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'

export default function AppRouter() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="match" element={<Match />} />
          <Route path="chat" element={<Chat />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="admin" element={<Admin />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
