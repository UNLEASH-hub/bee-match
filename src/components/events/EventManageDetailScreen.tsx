import { useState } from 'react'
import type { BeeEvent, EventApplication } from '../../types'

interface Props {
  event: BeeEvent
  onBack: () => void
  onCancel: () => void
  onApprove: (appId: string) => void
  onReject: (appId: string) => void
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

type ConfirmAction =
  | { type: 'approve'; app: EventApplication }
  | { type: 'reject';  app: EventApplication }
  | { type: 'cancel' }
  | null

export default function EventManageDetailScreen({ event, onBack, onCancel, onApprove, onReject }: Props) {
  const [confirm, setConfirm] = useState<ConfirmAction>(null)

  const pending = event.applications.filter(a => a.status === 'pending')

  function handleConfirm() {
    if (!confirm) return
    if (confirm.type === 'approve') onApprove(confirm.app.id)
    if (confirm.type === 'reject')  onReject(confirm.app.id)
    if (confirm.type === 'cancel')  onCancel()
    setConfirm(null)
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-gray-950">
      {/* ヘッダー */}
      <div className="flex items-center gap-2 px-2 h-14 border-b border-gray-800 flex-shrink-0">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center text-gray-400">
          <ChevronLeft />
        </button>
        <h1 className="text-white font-bold text-sm flex-1 truncate">{event.title}</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        {/* 統計バー */}
        <div className="flex items-center justify-around px-4 py-4 border-b border-gray-800">
          {[
            { label: '参加', value: event.participants.length, max: event.capacity },
            { label: '申請', value: event.applications.filter(a => a.status === 'pending').length },
            { label: '気になる', value: event.interestedCount },
          ].map(stat => (
            <div key={stat.label} className="flex flex-col items-center">
              <p className="text-white font-bold text-xl">
                {stat.value}{stat.max !== undefined ? `/${stat.max}` : ''}
              </p>
              <p className="text-gray-500 text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* 申請セクション */}
        <div className="px-4 pt-5 pb-2">
          <p className="text-gray-500 text-xs font-medium">
            申請{pending.length > 0 ? `（${pending.length}件・未対応）` : ''}
          </p>
        </div>
        {pending.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-4">未対応の申請はありません</p>
        ) : (
          <div className="flex flex-col">
            {pending.map(app => (
              <div key={app.id} className="flex items-start gap-3 px-4 py-3 border-b border-gray-800">
                <img src={app.applicant.avatarUrl} alt={app.applicant.name}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{app.applicant.name}（{app.applicant.age}歳）</p>
                  {app.message && (
                    <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{app.message}</p>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => setConfirm({ type: 'reject', app })}
                    className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 text-xs"
                  >拒否</button>
                  <button
                    onClick={() => setConfirm({ type: 'approve', app })}
                    className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 text-xs font-medium"
                  >承認</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 参加者セクション */}
        <div className="px-4 pt-5 pb-2">
          <p className="text-gray-500 text-xs font-medium">参加者（{event.participants.length}人）</p>
        </div>
        {event.participants.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-4">参加者がいません</p>
        ) : (
          <div className="flex flex-col">
            {event.participants.map(p => (
              <div key={p.id} className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
                <img src={p.avatarUrl} alt={p.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="text-white text-sm">{p.name}</p>
                  <p className="text-gray-500 text-xs">{p.age}歳</p>
                </div>
                {p.id === event.host.id && (
                  <span className="text-xs bg-amber-400/20 text-amber-400 px-2 py-0.5 rounded-full">主催</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* アクション */}
        <div className="flex flex-col gap-3 px-4 pt-6">
          <button onClick={() => setConfirm({ type: 'cancel' })}
            className="w-full py-3 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium">
            ⚠️ イベントをキャンセル
          </button>
        </div>
      </div>

      {/* 確認ダイアログ */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-8"
          onClick={() => setConfirm(null)}>
          <div className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-6 flex flex-col gap-5"
            onClick={e => e.stopPropagation()}>
            <p className="text-white font-semibold text-base text-center">
              {confirm.type === 'approve' && `${confirm.app.applicant.name}さんを承認しますか？`}
              {confirm.type === 'reject'  && `${confirm.app.applicant.name}さんの申請を拒否しますか？`}
              {confirm.type === 'cancel'  && 'イベントをキャンセルしますか？'}
            </p>
            {confirm.type === 'cancel' && (
              <p className="text-gray-400 text-sm text-center">参加者全員に通知が送られます</p>
            )}
            <div className="flex gap-3">
              <button onClick={() => setConfirm(null)}
                className="flex-1 py-3 rounded-xl bg-gray-800 text-gray-300 text-sm">
                キャンセル
              </button>
              <button onClick={handleConfirm}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold ${
                  confirm.type === 'approve' ? 'bg-green-500 text-white'
                  : confirm.type === 'reject' ? 'bg-gray-700 text-gray-300'
                  : 'bg-red-500 text-white'
                }`}>
                {confirm.type === 'approve' ? '承認する'
                 : confirm.type === 'reject' ? '拒否する'
                 : 'キャンセルする'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
