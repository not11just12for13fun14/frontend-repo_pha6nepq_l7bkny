import { createContext, useContext, useEffect, useMemo, useState } from 'react'

// Lightweight client-only auth placeholder compatible with Firebase later
// Exposes user, loginWithGoogle, logout

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

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

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ss_user')
  }

  const value = useMemo(() => ({ user, loading, loginWithGoogle, logout }), [user, loading])

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
