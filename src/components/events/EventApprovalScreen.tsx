import { useState } from 'react'
import type { BeeEvent, EventApplication } from '../../types'

const REJECTION_REASONS = ['定員が近いため', '条件に合わないため', 'その他']

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

export default function EventApprovalScreen({
  event,
  application,
  onBack,
  onApprove,
  onReject,
}: {
  event: BeeEvent
  application: EventApplication
  onBack: () => void
  onApprove: () => void
  onReject: (reason: string, message: string) => void
}) {
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState(REJECTION_REASONS[0])
  const [rejectMessage, setRejectMessage] = useState('')
  const [done, setDone] = useState<'approved' | 'rejected' | null>(null)

  const u = application.applicant

  if (done === 'approved') {
    return (
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center bg-gray-950 gap-4 px-8 text-center">
        <span className="text-6xl">✅</span>
        <h2 className="text-white font-bold text-lg">{u.name}さんの申請を承認しました</h2>
        <p className="text-gray-400 text-sm">グループチャットに参加されます</p>
        <button onClick={onBack} className="mt-4 w-full py-3 rounded-xl bg-amber-400 text-black font-bold text-sm">
          管理画面に戻る
        </button>
      </div>
    )
  }

  if (done === 'rejected') {
    return (
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center bg-gray-950 gap-4 px-8 text-center">
        <span className="text-5xl text-gray-600">✗</span>
        <h2 className="text-white font-bold text-lg">申請を拒否しました</h2>
        <button onClick={onBack} className="mt-4 w-full py-3 rounded-xl bg-gray-800 text-gray-300 text-sm">
          管理画面に戻る
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-gray-950">
      <div className="flex items-center gap-2 px-2 h-14 border-b border-gray-800 flex-shrink-0">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center text-gray-400">
          <ChevronLeft />
        </button>
        <h1 className="text-white font-bold text-sm">申請を確認</h1>
      </div>
      <p className="text-gray-600 text-xs px-4 py-2 border-b border-gray-800">{event.title}</p>

      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
        {/* 申請者情報 */}
        <div className="flex items-center gap-4">
          <img src={u.avatarUrl} alt={u.name} className="w-16 h-16 rounded-full object-cover border-2 border-gray-700" />
          <div>
            <p className="text-white font-bold text-base">{u.name}</p>
            <p className="text-gray-400 text-sm">
              {u.age}歳
              {u.height && ` · ${u.height}cm`}
              {u.weight && ` · ${u.weight}kg`}
            </p>
            {u.isOnline && (
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-green-400 text-xs">オンライン</span>
              </div>
            )}
          </div>
        </div>

        {/* メッセージ */}
        {application.message ? (
          <div>
            <p className="text-gray-500 text-xs font-medium mb-2">メッセージ</p>
            <div className="bg-gray-900 rounded-xl px-4 py-3">
              <p className="text-gray-300 text-sm leading-relaxed">{application.message}</p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl px-4 py-3">
            <p className="text-gray-600 text-sm">メッセージなし</p>
          </div>
        )}
      </div>

      {/* アクションバー */}
      <div className="px-5 py-4 border-t border-gray-800 flex gap-3"
        style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
        <button
          onClick={() => setShowRejectModal(true)}
          className="flex-1 py-3 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium"
        >
          ✗ 拒否
        </button>
        <button
          onClick={() => { onApprove(); setDone('approved') }}
          className="flex-1 py-3 rounded-xl bg-green-500 text-white text-sm font-semibold"
        >
          ✓ 承認
        </button>
      </div>

      {/* 拒否モーダル */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end"
          onClick={() => setShowRejectModal(false)}>
          <div className="w-full bg-gray-900 rounded-t-2xl px-5 py-6"
            onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-bold text-base mb-4">申請を拒否</h3>
            <p className="text-gray-500 text-xs mb-2">拒否理由（申請者に送信）</p>
            {REJECTION_REASONS.map(r => (
              <label key={r} className="flex items-center gap-3 py-2 cursor-pointer">
                <input type="radio" checked={rejectReason === r} onChange={() => setRejectReason(r)}
                  className="accent-red-500" />
                <span className="text-gray-300 text-sm">{r}</span>
              </label>
            ))}
            <div className="mt-3">
              <textarea
                value={rejectMessage} onChange={e => setRejectMessage(e.target.value)}
                rows={3} placeholder="メッセージ（任意）"
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-red-400 resize-none"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowRejectModal(false)}
                className="flex-1 py-3 rounded-xl bg-gray-800 text-gray-300 text-sm">キャンセル</button>
              <button
                onClick={() => { onReject(rejectReason, rejectMessage); setShowRejectModal(false); setDone('rejected') }}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-semibold">拒否を確定</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
