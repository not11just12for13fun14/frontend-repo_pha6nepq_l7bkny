import { useEffect, useRef, useState } from 'react'

export default function Chat() {
  const [room, setRoom] = useState('public-demo')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const wsRef = useRef(null)
  const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    if (!room) return
    const wsUrl = BACKEND.replace('http', 'ws') + `/ws/chat/${room}`
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws
    ws.onmessage = (ev) => {
      try { const data = JSON.parse(ev.data); setMessages(m => [...m, data]) } catch {}
    }
    return () => ws.close()
  }, [room])

  const send = () => {
    const ws = wsRef.current
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ text: input, sender_id: 'me' }))
      setInput('')
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h2 className="text-2xl font-semibold">Real-time Chat</h2>
      <div className="mt-2 flex gap-2">
        <input className="flex-1 border rounded-lg px-3 py-2" value={room} onChange={e=>setRoom(e.target.value)} />
        <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white" onClick={send}>Send</button>
      </div>
      <div className="mt-4 h-72 overflow-auto rounded-lg border bg-white p-3 space-y-2">
        {messages.map((m,i)=>(
          <div key={i} className={`flex ${m.sender_id==='me'?'justify-end':'justify-start'}`}>
            <div className={`px-3 py-1.5 rounded-xl border ${m.sender_id==='me'?'bg-indigo-600 text-white':'bg-white'}`}>
              <div className="text-xs opacity-70">{m.sender_id}</div>
              <div>{m.text}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input className="flex-1 border rounded-lg px-3 py-2" value={input} onChange={e=>setInput(e.target.value)} />
        <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white" onClick={send}>Send</button>
      </div>
    </div>
  )
}
