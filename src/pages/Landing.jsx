import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../components/AuthProvider'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Section({ title, subtitle, children }) {
  return (
    <section className="px-6 py-16 border-b bg-white">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        <div className="mt-6 space-y-3 text-gray-700">{children}</div>
      </div>
    </section>
  )
}

export default function Landing() {
  const { user, loginWithGoogle, logout, loading } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-blue-50">
      <header className="px-6 py-5 flex items-center justify-between">
        <div className="text-xl font-bold text-indigo-700">SkillSwap</div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-700">Hi, {user.name}</span>
              <button onClick={logout} className="px-3 py-1.5 text-sm rounded-lg bg-gray-100">Logout</button>
              <a href="/app" className="px-3 py-1.5 text-sm rounded-lg bg-indigo-600 text-white">Open App</a>
            </>
          ) : (
            <button onClick={loginWithGoogle} disabled={loading} className="px-4 py-2 rounded-lg bg-indigo-600 text-white">{loading ? 'Signing in...' : 'Login with Google'}</button>
          )}
        </div>
      </header>

      <main>
        <section className="px-6 pt-10 pb-16">
          <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">Peer-to-Peer Learning, Powered by Tokens</h1>
              <p className="mt-5 text-gray-600">Teach to earn. Learn to spend. Real-time chat, sessions, AI coach, and an admin panel keep everything smooth and fair.</p>
              {!user && (
                <button onClick={loginWithGoogle} disabled={loading} className="mt-6 px-5 py-2.5 rounded-lg bg-indigo-600 text-white">{loading ? 'Signing in...' : 'Start with Google'}</button>
              )}
            </div>
            <div className="rounded-2xl border bg-white p-4">
              <ul className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                <li className="p-3 rounded-lg border">Google Auth</li>
                <li className="p-3 rounded-lg border">Profiles</li>
                <li className="p-3 rounded-lg border">Token Ledger</li>
                <li className="p-3 rounded-lg border">Matching</li>
                <li className="p-3 rounded-lg border">Connections</li>
                <li className="p-3 rounded-lg border">Notifications</li>
                <li className="p-3 rounded-lg border">Real-time Chat</li>
                <li className="p-3 rounded-lg border">Sessions + Whiteboard</li>
                <li className="p-3 rounded-lg border">AI Coach</li>
                <li className="p-3 rounded-lg border">Admin Panel</li>
              </ul>
            </div>
          </div>
        </section>

        <Section title="1. Google Authentication" subtitle="Fast sign-in with Google via Firebase (stubbed here; ready to integrate)">
          <p>Click the Login button above to simulate Google login. We’ll swap in Firebase and JWT to secure backend calls.</p>
        </Section>
        <Section title="2. User Profiles" subtitle="Show your skills to teach and learn">
          <p>Profiles include name, photo, bio, teaching and learning skills, and token balance.</p>
        </Section>
        <Section title="3. Token Economy" subtitle="Earn by teaching, spend to learn">
          <p>Every accepted session costs 1 token to the learner. Completing a session gives 1 token to the teacher. All transactions are recorded for transparency.</p>
        </Section>
        <Section title="4. Skill Matching" subtitle="Find peers and mentors quickly">
          <p>Search by skills you want to learn. Results prioritize overlap with mentors’ teaching skills.</p>
        </Section>
        <Section title="5. Connections" subtitle="Build your learning network">
          <p>Send and accept connection requests to keep in touch and collaborate later.</p>
        </Section>
        <Section title="6. Notifications" subtitle="Never miss important actions">
          <p>See updates on connection requests, session proposals, and status changes.</p>
        </Section>
        <Section title="7. Real-Time Chat" subtitle="Talk instantly with your peers">
          <p>WebSocket chat enables instant messaging with delivery to all devices online.</p>
        </Section>
        <Section title="8. Session Scheduling" subtitle="Propose, accept, and schedule sessions">
          <p>Suggest dates and topics directly in chat; mentors can accept or decline in real-time.</p>
        </Section>
        <Section title="9. User Dashboard" subtitle="Your activity in one place">
          <p>See token balance, upcoming and completed sessions, and recent activity.</p>
        </Section>
        <Section title="10. Admin Panel" subtitle="Keep the community healthy">
          <p>Admins can review users, update roles, deactivate or remove accounts when needed.</p>
        </Section>
        <Section title="11. Responsive Design" subtitle="Built with Tailwind CSS">
          <p>Looks great and performs smoothly on phones, tablets, and desktops.</p>
        </Section>
        <Section title="12. Collaborative Whiteboard" subtitle="Draw together during live sessions">
          <p>Shared strokes, eraser, and zoom/pan synchronized over WebSockets for a classroom feel.</p>
        </Section>
        <Section title="13. Session History & Feedback" subtitle="Reflect and grow">
          <p>After sessions, leave ratings and feedback to help others find great mentors.</p>
        </Section>
        <Section title="14. Secure Token Transactions" subtitle="Every move recorded">
          <p>Token debits and credits are logged with references to their sessions.</p>
        </Section>
        <Section title="15. Logout & Session Management" subtitle="Your data stays safe">
          <p>Sign out on shared devices with one click.</p>
        </Section>
      </main>

      <footer className="px-6 py-10 text-center text-sm text-gray-500">SkillSwap – Learn by teaching. Teach by learning.</footer>
    </div>
  )
}
