import { useState, useRef, useEffect } from 'react'
import type { Conversation, Message } from '../../types'

interface Props {
  conv: Conversation
  onBack: () => void
}

export default function ChatView({ conv, onBack }: Props) {
  const u = conv.participant
  const [messages, setMessages] = useState<Message[]>(conv.messages)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  // 新しいメッセージが追加されたら最下部へスクロール
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend() {
    const text = input.trim()
    if (!text) return
    const msg: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      text,
      createdAt: new Date().toISOString(),
    }
    setMessages(prev => [...prev, msg])
    setInput('')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-gray-950">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800 flex-shrink-0">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-full active:bg-gray-800 transition-colors flex-shrink-0"
          aria-label="戻る"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-300">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <img src={u.avatarUrl} alt={u.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-white font-semibold text-sm">{u.name}</p>
            {u.isOnline && <span className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" />}
          </div>
          <p className="text-gray-500 text-xs">
            {u.height && `${u.height}cm`}{u.weight && ` · ${u.weight}kg`}{` · ${u.age}歳`}
          </p>
        </div>
      </div>

      {/* メッセージエリア */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col gap-2">
        {messages.map(msg => {
          const isMine = msg.senderId === 'me'
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              {!isMine && (
                <img src={u.avatarUrl} alt={u.name} className="w-7 h-7 rounded-full object-cover flex-shrink-0 mr-2 mt-0.5" />
              )}
              <div
                className={`max-w-[75%] px-4 py-2.5 text-sm leading-relaxed ${
                  isMine
                    ? 'bg-amber-400 text-black rounded-2xl rounded-br-sm'
                    : 'bg-gray-800 text-white rounded-2xl rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* 入力エリア */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-800 flex-shrink-0">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="メッセージを入力..."
          className="flex-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-full px-4 py-2.5 outline-none focus:border-amber-400 transition-colors placeholder-gray-500"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40 active:opacity-80 transition-opacity"
          aria-label="送信"
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
