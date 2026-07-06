import { useState } from 'react'
import { mockShouts } from '../../data/mockUsers'
import { formatTime } from '../../lib/utils/format'
import type { Shout, User } from '../../types'

interface ShoutScreenProps {
  onShowOnMap?: (user: User) => void
}

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


function ShoutCard({ shout, onShowOnMap }: { shout: Shout; onShowOnMap?: (user: User) => void }) {
  const [liked, setLiked] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const u = shout.user

  function handleHeartClick() {
    if (liked) {
      setLiked(false)
    } else {
      setShowConfirm(true)
    }
  }

  return (
    <>
      <div className="flex items-start gap-3 px-4 py-4 border-b border-gray-800">
        <div className="relative flex-shrink-0">
          <img src={u.avatarUrl} alt={u.name} className="w-12 h-12 rounded-full object-cover" />
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
            onClick={handleHeartClick}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors active:scale-90 ${
              liked ? 'bg-rose-500/20' : 'bg-gray-800'
            }`}
            aria-label="会いたい"
          >
            <HeartIcon filled={liked} />
          </button>
          <button
            onClick={() => onShowOnMap?.(u)}
            className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 active:bg-gray-700 transition-colors"
            aria-label="位置を確認"
          >
            <ReticleIcon />
          </button>
        </div>
      </div>

      {/* 「会いたい」確認モーダル */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="w-full max-w-[390px] mx-4 bg-gray-900 border border-gray-700 rounded-2xl p-6 flex flex-col gap-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-3xl">❤️</span>
              <p className="text-white font-semibold text-base">「会いたい」を送りますか？</p>
              <p className="text-gray-400 text-sm">{u.name}さんに「会いたい」を送ります</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-gray-800 text-gray-300 text-sm font-medium"
              >
                キャンセル
              </button>
              <button
                onClick={() => { setLiked(true); setShowConfirm(false) }}
                className="flex-1 py-3 rounded-xl bg-rose-500 text-white text-sm font-semibold"
              >
                送る ❤️
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function ShoutScreen({ onShowOnMap }: ShoutScreenProps) {
  const [shouts] = useState<Shout[]>(mockShouts)

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-gray-950 overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pt-5 pb-3">
          <h1 className="text-white text-xl font-bold">シャウト</h1>
        </div>
        {shouts.map(shout => (
          <ShoutCard key={shout.id} shout={shout} onShowOnMap={onShowOnMap} />
        ))}
      </div>
    </div>
  )
}
