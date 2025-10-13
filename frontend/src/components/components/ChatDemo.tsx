"use client"
import { useState } from "react"

const ChatDemo = () => {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<{ from: "user" | "bot", text: string }[]>([])
  const [input, setInput] = useState("")
  const [count, setCount] = useState(0)
  const maxMessages = 5

  const sendMessage = async () => {
    if (!input.trim() || count >= maxMessages) return

    const userMsg = input
    setMessages([...messages, { from: "user", text: userMsg }])
    setInput("")
    setCount(prev => prev + 1)

    const res = await fetch("https://your-backend.vercel.app/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMsg,
        tenantId: "YOUR_TENANT_ID",
        language: "en"
      })
    })

    const data = await res.json()
    setMessages(prev => [...prev, { from: "bot", text: data.response }])
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="bg-white shadow-xl w-80 rounded-lg border border-gray-200 p-4">
          <div className="flex justify-between mb-2">
            <h2 className="font-bold text-lg">AI Assistant</h2>
            <button onClick={() => setOpen(false)}>✖️</button>
          </div>
          <div className="h-64 overflow-y-auto flex flex-col gap-2 mb-2">
            {messages.map((msg, i) => (
              <div key={i} className={`text-sm p-2 rounded ${msg.from === "user" ? "bg-blue-100 text-right" : "bg-gray-100"}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              className="flex-1 border rounded px-2 py-1 text-sm"
              placeholder="Type a message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              disabled={count >= maxMessages}
            />
            <button className="ml-2 text-sm bg-blue-600 text-white px-3 py-1 rounded" onClick={sendMessage} disabled={count >= maxMessages}>
              Send
            </button>
          </div>
          {count >= maxMessages && <p className="text-xs text-center mt-1 text-red-500">Max 5 messages in demo.</p>}
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="bg-blue-600 text-white rounded-full w-16 h-16 text-2xl shadow-lg">
          💬
        </button>
      )}
    </div>
  )
}

export default ChatDemo
