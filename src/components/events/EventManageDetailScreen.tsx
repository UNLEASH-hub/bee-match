import { useState } from 'react'
import type { BeeEvent } from '../../types'
import { formatTime } from '../../lib/utils/format'

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

type Mtab = 'overview' | 'applications' | 'participants'

export default function EventManageDetailScreen({
  event,
  onBack,
  onApproval,
  onChat,
  onCancel,
  onApprove,
  onReject,
}: {
  event: BeeEvent
  onBack: () => void
  onApproval: (appId: string) => void
  onChat: () => void
  onCancel: () => void
  onApprove: (appId: string) => void
  onReject: (appId: string) => void
}) {
  const [tab, setTab] = useState<Mtab>('overview')
  const [showCancelModal, setShowCancelModal] = useState(false)

  const pending = event.applications.filter(a => a.status === 'pending')
  const approved = event.applications.filter(a => a.status === 'approved')

  const tabs = [
    { key: 'overview' as const, label: '📊 概要' },
    { key: 'applications' as const, label: `✋ 申請${pending.length > 0 ? `(${pending.length})` : ''}` },
    { key: 'participants' as const, label: '👥 参加者' },
  ]

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-gray-950">
      <div className="flex items-center gap-2 px-2 h-14 border-b border-gray-800 flex-shrink-0">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center text-gray-400">
          <ChevronLeft />
        </button>
        <h1 className="text-white font-bold text-sm flex-1 truncate">{event.title}</h1>
      </div>

      <div className="flex border-b border-gray-800 flex-shrink-0">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 py-2.5 text-xs font-medium border-b-2 transition-colors ${
              tab === t.key ? 'text-amber-400 border-amber-400' : 'text-gray-500 border-transparent'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* 概要タブ */}
        {tab === 'overview' && (
          <div className="p-5 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '気になる', value: event.interestedCount, emoji: '♡' },
                { label: '申請', value: event.applications.length, emoji: '✋' },
                { label: '承認済み', value: approved.length, emoji: '✅' },
                { label: '参加確定', value: event.participants.length, emoji: '👥' },
              ].map(stat => (
                <div key={stat.label} className="bg-gray-900 rounded-xl p-4 text-center">
                  <p className="text-2xl mb-1">{stat.emoji}</p>
                  <p className="text-white font-bold text-xl">{stat.value}</p>
                  <p className="text-gray-500 text-xs">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button onClick={onChat}
                className="w-full py-3 rounded-xl bg-amber-400/10 text-amber-400 text-sm font-medium">
                💬 グループチャット
              </button>
              <button
                onClick={() => setShowCancelModal(true)}
                className="w-full py-3 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium">
                ⚠️ イベントをキャンセル
              </button>
            </div>
          </div>
        )}

        {/* 申請タブ */}
        {tab === 'applications' && (
          <div>
            {pending.length === 0 ? (
              <div className="flex flex-col items-center py-16 gap-3">
                <span className="text-5xl text-gray-700">✋</span>
                <p className="text-gray-500 text-sm">未対応の申請はありません</p>
              </div>
            ) : (
              pending.map(app => (
                <div key={app.id} className="flex items-start gap-3 px-4 py-4 border-b border-gray-800">
                  <img src={app.applicant.avatarUrl} alt={app.applicant.name}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{app.applicant.name}（{app.applicant.age}歳）</p>
                    <p className="text-gray-600 text-xs mt-0.5">{formatTime(app.appliedAt)}</p>
                    {app.message && (
                      <p className="text-gray-400 text-xs mt-1 line-clamp-2">{app.message}</p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => onReject(app.id)}
                        className="flex-1 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs">
                        ✗ 拒否
                      </button>
                      <button onClick={() => onApprove(app.id)}
                        className="flex-1 py-2 rounded-xl bg-green-500/20 text-green-400 text-xs font-medium">
                        ✓ 承認
                      </button>
                    </div>
                  </div>
                  <button onClick={() => onApproval(app.id)}
                    className="text-gray-600 text-xs flex-shrink-0 mt-1">詳細›</button>
                </div>
              ))
            )}
          </div>
        )}

        {/* 参加者タブ */}
        {tab === 'participants' && (
          <div>
            {event.participants.length === 0 ? (
              <div className="flex flex-col items-center py-16 gap-3">
                <span className="text-5xl text-gray-700">👥</span>
                <p className="text-gray-500 text-sm">参加者がいません</p>
              </div>
            ) : (
              event.participants.map(p => (
                <div key={p.id} className="flex items-center gap-3 px-4 py-4 border-b border-gray-800">
                  <img src={p.avatarUrl} alt={p.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{p.name}</p>
                    <p className="text-gray-500 text-xs">{p.age}歳</p>
                  </div>
                  {p.id === event.host.id
                    ? <span className="text-xs bg-amber-400/20 text-amber-400 px-2 py-1 rounded-full">主催</span>
                    : <button className="text-xs text-red-400 bg-red-400/10 px-3 py-1 rounded-full active:opacity-70">退出</button>
                  }
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-8"
          onClick={() => setShowCancelModal(false)}>
          <div className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-6 flex flex-col gap-4"
            onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-bold text-base text-center">イベントをキャンセルしますか？</h3>
            <p className="text-gray-400 text-sm text-center">参加者全員にキャンセル通知が送られます</p>
            <div className="flex gap-3">
              <button onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 rounded-xl bg-gray-800 text-gray-300 text-sm">戻る</button>
              <button onClick={() => { setShowCancelModal(false); onCancel() }}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-semibold">キャンセルする</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
