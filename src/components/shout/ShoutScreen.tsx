import { useState, useRef, useEffect } from 'react'
import { mockShouts, currentUser } from '../../data/mockUsers'
import { formatTime } from '../../lib/utils/format'
import type { Shout } from '../../types'

function HeartIcon({ filled }: { filled: boolean }) {
  return filled ? (
    <svg viewBox="0 0 24 24" fill="#f43f5e" stroke="#f43f5e" strokeWidth={1.5} className="w-5 h-5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function ReticleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2"  x2="12" y2="6"  />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="2"  y1="12" x2="6"  y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
    </svg>
  )
}

function MegaphoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  )
}

function ShoutCard({ shout }: { shout: Shout }) {
  const [liked, setLiked] = useState(false)
  const u = shout.user

  return (
    <div className="flex items-start gap-3 px-4 py-4 border-b border-gray-800">
      <div className="relative flex-shrink-0">
        <img src={u.avatarUrl} alt={u.name} className="w-12 h-12 rounded-full object-cover" />
        {u.isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-950" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-white text-sm leading-relaxed">{shout.message}</p>
        <p className="text-gray-500 text-xs mt-1.5">
          {u.name}
          {u.height && ` · ${u.height}cm`}
          {u.weight && ` · ${u.weight}kg`}
          {` · ${u.age}歳`}
          <span className="ml-2 text-gray-600">{formatTime(shout.createdAt)}</span>
        </p>
      </div>

      <div className="flex flex-col gap-2.5 flex-shrink-0 pt-0.5">
        <button
          onClick={() => setLiked(v => !v)}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors active:scale-90 ${
            liked ? 'bg-rose-500/20' : 'bg-gray-800'
          }`}
          aria-label="会いたい"
        >
          <HeartIcon filled={liked} />
        </button>
        <button
          className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 active:bg-gray-700 transition-colors"
          aria-label="位置を確認"
        >
          <ReticleIcon />
        </button>
      </div>
    </div>
  )
}

export default function ShoutScreen() {
  const [shouts, setShouts] = useState<Shout[]>(mockShouts)
  const [modalOpen, setModalOpen] = useState(false)
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (modalOpen) {
      setTimeout(() => textareaRef.current?.focus(), 100)
    }
  }, [modalOpen])

  function handleShout() {
    const text = message.trim()
    if (!text) return
    const newShout: Shout = {
      id: `s-${Date.now()}`,
      user: currentUser,
      message: text,
      createdAt: new Date().toISOString(),
    }
    setShouts(prev => [newShout, ...prev])
    setMessage('')
    setModalOpen(false)
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-gray-950 relative overflow-hidden">
      {/* リスト */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pt-5 pb-3">
          <h1 className="text-white text-xl font-bold">シャウト</h1>
        </div>
        {shouts.map(shout => (
          <ShoutCard key={shout.id} shout={shout} />
        ))}
      </div>

      {/* FAB: メガホンボタン */}
      <button
        onClick={() => setModalOpen(true)}
        className="absolute bottom-5 right-4 w-14 h-14 bg-amber-400 rounded-full flex items-center justify-center text-black shadow-lg active:scale-95 transition-transform z-10"
        aria-label="シャウトする"
      >
        <MegaphoneIcon />
      </button>

      {/* シャウト投稿モーダル */}
      {modalOpen && (
        <div
          className="absolute inset-0 z-20 bg-black/60 flex items-end"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full bg-gray-900 rounded-t-2xl p-5 pb-8"
            onClick={e => e.stopPropagation()}
          >
            {/* ヘッダー */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-base">シャウトする</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-500 text-xl leading-none w-8 h-8 flex items-center justify-center rounded-full active:bg-gray-800"
              >
                ✕
              </button>
            </div>

            {/* 入力欄 */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="周りの人に伝えたいことを叫ぼう！"
              rows={4}
              maxLength={200}
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-amber-400 transition-colors resize-none placeholder-gray-500"
            />
            <div className="text-right text-gray-600 text-xs mt-1 mb-4">
              {message.length} / 200
            </div>

            {/* 叫ぶボタン */}
            <button
              onClick={handleShout}
              disabled={!message.trim()}
              className="w-full bg-amber-400 text-black font-bold rounded-xl py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-40 active:opacity-80 transition-opacity"
            >
              <MegaphoneIcon />
              叫ぶ！
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
