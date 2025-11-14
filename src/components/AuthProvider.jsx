import { createContext, useContext, useEffect, useMemo, useState } from 'react'

// Lightweight client-only auth placeholder compatible with Firebase later
// Exposes user, loginWithGoogle, loginWithPassword, logout

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // On mount, hydrate from localStorage
  useEffect(() => {
    const raw = localStorage.getItem('ss_user')
    if (raw) {
      try { setUser(JSON.parse(raw)) } catch {}
    }
  }, [])

  const loginWithGoogle = async () => {
    // Placeholder: simulate Google auth; integrate Firebase SDK later
    setLoading(true)
    setError(null)
    try {
      const demoUser = {
        uid: crypto.randomUUID(),
        name: 'Guest Learner',
        email: `guest${Math.floor(Math.random()*9999)}@skillswap.dev`,
        avatar: 'https://i.pravatar.cc/100',
        tokens: 1,
      }
      setUser(demoUser)
      localStorage.setItem('ss_user', JSON.stringify(demoUser))
    } finally {
      setLoading(false)
    }
  }

  const loginWithPassword = async (email, password) => {
    // Development-only demo account
    // Valid creds: demo@skillswap.dev / demo123
    setLoading(true)
    setError(null)
    try {
      await new Promise(r => setTimeout(r, 500))
      const validEmail = 'demo@skillswap.dev'
      const validPass = 'demo123'
      if (email?.toLowerCase() === validEmail && password === validPass) {
        const demoUser = {
          uid: 'demo-user-1',
          name: 'Demo User',
          email: validEmail,
          avatar: 'https://i.pravatar.cc/100?u=demo-user',
          tokens: 42,
        }
        setUser(demoUser)
        localStorage.setItem('ss_user', JSON.stringify(demoUser))
        return { ok: true }
      } else {
        setError('Invalid email or password (try demo@skillswap.dev / demo123)')
        return { ok: false, error: 'Invalid credentials' }
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ss_user')
  }

  const value = useMemo(() => ({ user, loading, error, loginWithGoogle, loginWithPassword, logout }), [user, loading, error])

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
