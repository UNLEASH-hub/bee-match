import { useState, useRef, useEffect } from 'react'
import type { BeeEvent, EventMessage } from '../../types'
import { currentUser } from '../../data/mockUsers'
import { mockEventMessages } from '../../data/mockEvents'
import { formatEventDate } from '../../lib/utils/format'

export default function EventChatScreen({
  event,
  onBack,
}: {
  event: BeeEvent
  onBack: () => void
}) {
  const [messages, setMessages] = useState<EventMessage[]>(
    mockEventMessages[event.id] ?? []
  )
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend() {
    const text = input.trim()
    if (!text) return
    const msg: EventMessage = {
      id: `em-${Date.now()}`,
      sender: currentUser,
      content: text,
      messageType: 'user',
      createdAt: new Date().toISOString(),
    }
    setMessages(prev => [...prev, msg])
    setInput('')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const onlineCount = event.participants.filter(p => p.isOnline).length

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-gray-950">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800 flex-shrink-0">
        <button onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-full active:bg-gray-800 flex-shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-300">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">{event.title}</p>
          <p className="text-gray-500 text-xs">
            参加者 {event.participants.length}人 · {onlineCount}人オンライン
            　📅 {formatEventDate(event.startAt)}
          </p>
        </div>
      </div>

      {/* メッセージエリア */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col gap-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <span className="text-4xl">💬</span>
            <p className="text-gray-600 text-sm">まだメッセージがありません</p>
          </div>
        )}
        {messages.map(msg => {
          if (msg.messageType === 'system' || msg.messageType === 'announcement') {
            return (
              <div key={msg.id} className="flex justify-center">
                <span className="text-xs text-gray-600 bg-gray-900 px-3 py-1 rounded-full">
                  {msg.messageType === 'announcement' ? '📢 ' : ''}{msg.content}
                </span>
              </div>
            )
          }
          const isMine = msg.sender?.id === currentUser.id
          const isHost = msg.sender?.id === event.host.id
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} gap-2`}>
              {!isMine && msg.sender && (
                <div className="flex flex-col items-center flex-shrink-0">
                  <img src={msg.sender.avatarUrl} alt={msg.sender.name}
                    className="w-7 h-7 rounded-full object-cover" />
                  {isHost && (
                    <span className="text-[9px] text-amber-400 mt-0.5 font-medium">主催</span>
                  )}
                </div>
              )}
              <div className="max-w-[75%]">
                {!isMine && msg.sender && (
                  <p className="text-gray-500 text-xs mb-0.5 ml-1">{msg.sender.name}</p>
                )}
                <div className={`px-4 py-2.5 text-sm leading-relaxed ${
                  isMine
                    ? 'bg-amber-400 text-black rounded-2xl rounded-br-sm'
                    : isHost
                    ? 'bg-amber-400/10 text-white border border-amber-400/30 rounded-2xl rounded-bl-sm'
                    : 'bg-gray-800 text-white rounded-2xl rounded-bl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* 入力エリア */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-800 flex-shrink-0"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="メッセージを入力..."
          className="flex-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-full px-4 py-2.5 outline-none focus:border-amber-400 placeholder-gray-500"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40 active:opacity-80"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  )
}
