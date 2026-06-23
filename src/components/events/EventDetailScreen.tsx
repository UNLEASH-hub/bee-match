import { useState } from 'react'
import type { BeeEvent } from '../../types'
import { currentUser } from '../../data/mockUsers'
import { formatEventDateRange } from '../../lib/utils/format'
import { CATEGORY_EMOJI, CATEGORY_LABEL, CATEGORY_COLOR } from './EventListScreen'
import EventApplicationModal from './EventApplicationModal'

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function getStatus(ev: BeeEvent) {
  if (ev.host.id === currentUser.id) return 'host'
  const app = ev.applications.find(a => a.applicant.id === currentUser.id)
  if (!app) return 'none'
  return app.status
}

export default function EventDetailScreen({
  event,
  onBack,
  onApply,
  onInterest,
  onManage,
}: {
  event: BeeEvent
  onBack: () => void
  onApply: (msg: string) => void
  onInterest: () => void
  onManage: () => void
}) {
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [interested, setInterested] = useState(false)
  const status = getStatus(event)
  const filled = event.participants.length >= event.capacity

  function handleInterest() {
    setInterested(v => !v)
    onInterest()
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-gray-950">
      {/* ヘッダー */}
      <div className="flex items-center gap-2 px-2 h-14 border-b border-gray-800 flex-shrink-0">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center text-gray-400">
          <ChevronLeft />
        </button>
        <h1 className="text-white font-bold text-base flex-1 truncate">{event.title}</h1>
      </div>

      {/* スクロールコンテンツ */}
      <div className="flex-1 overflow-y-auto pb-28">
        {/* カバー画像 or カテゴリプレースホルダー */}
        <div
          className="w-full h-36 flex items-center justify-center"
          style={{ backgroundColor: CATEGORY_COLOR[event.category] + '33' }}
        >
          <span className="text-7xl">{CATEGORY_EMOJI[event.category]}</span>
        </div>

        <div className="px-5 pt-5 flex flex-col gap-5">
          {/* タイトル・カテゴリ */}
          <div>
            <span className="text-xs px-2.5 py-1 rounded-full text-black font-medium"
              style={{ backgroundColor: CATEGORY_COLOR[event.category] }}>
              {CATEGORY_LABEL[event.category]}
            </span>
            <h2 className="text-white text-xl font-bold mt-2">{event.title}</h2>
          </div>

          {/* 基本情報 */}
          <div className="bg-gray-900 rounded-2xl px-4 py-4 flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <span className="text-gray-500 text-sm w-4">📍</span>
              <div>
                <p className="text-white text-sm font-medium">{event.location.name}</p>
                {event.location.type === 'venue' && event.location.address && (
                  <p className="text-gray-500 text-xs mt-0.5">{event.location.address}</p>
                )}
                {event.location.type === 'area' && (
                  <p className="text-gray-500 text-xs mt-0.5">詳細住所は参加承認後に開示</p>
                )}
                {event.location.type === 'host_place' && (
                  <p className="text-gray-500 text-xs mt-0.5">主催者宅（承認後に共有）</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-500 text-sm w-4">🕘</span>
              <p className="text-white text-sm">{formatEventDateRange(event.startAt, event.endAt)}</p>
            </div>
            <button
              onClick={() => setShowParticipants(true)}
              className="flex items-center gap-3 active:opacity-70"
            >
              <span className="text-gray-500 text-sm w-4">👥</span>
              <p className="text-white text-sm">参加者: {event.participants.length}/{event.capacity}人</p>
              <span className="text-amber-400 text-xs ml-auto">▶ 見る</span>
            </button>
            {event.approvalMode === 'open' && (
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-sm w-4">✅</span>
                <p className="text-white text-sm">自由参加（即参加可）</p>
              </div>
            )}
            {event.approvalMode === 'approval' && (
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-sm w-4">✋</span>
                <p className="text-white text-sm">承認制</p>
              </div>
            )}
          </div>

          {/* タグ */}
          {event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {event.tags.map(t => (
                <span key={t} className="bg-gray-800 text-gray-300 text-xs px-3 py-1.5 rounded-full">{t}</span>
              ))}
              {event.conditions.map(c => (
                <span key={c} className="bg-gray-800 text-amber-400 text-xs px-3 py-1.5 rounded-full">✓ {c}</span>
              ))}
            </div>
          )}

          {/* 主催者 */}
          <div>
            <p className="text-gray-500 text-xs font-medium mb-2">主催者</p>
            <div className="flex items-center gap-3">
              <img src={event.host.avatarUrl} alt={event.host.name}
                className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="text-white text-sm font-medium">{event.host.name}</p>
                <p className="text-gray-500 text-xs">{event.host.age}歳</p>
              </div>
            </div>
          </div>

          {/* 説明文 */}
          <div>
            <p className="text-gray-500 text-xs font-medium mb-2">イベント詳細</p>
            <p className="text-gray-300 text-sm leading-relaxed">{event.description}</p>
          </div>

          {/* 参加条件 */}
          {(event.ageMin || event.ageMax || event.conditions.length > 0) && (
            <div>
              <p className="text-gray-500 text-xs font-medium mb-2">参加条件</p>
              <div className="flex flex-col gap-1.5">
                {(event.ageMin || event.ageMax) && (
                  <p className="text-gray-300 text-sm">
                    年齢: {event.ageMin ?? 20}〜{event.ageMax ?? 99}歳
                  </p>
                )}
                {event.conditions.map(c => (
                  <p key={c} className="text-gray-300 text-sm">✓ {c}</p>
                ))}
              </div>
            </div>
          )}

          {/* 注意事項 */}
          {event.notes && (
            <div>
              <p className="text-gray-500 text-xs font-medium mb-2">持ち物・注意事項</p>
              <p className="text-gray-300 text-sm leading-relaxed">{event.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* sticky bottom アクションバー */}
      <div className="sticky bottom-0 bg-gray-950 border-t border-gray-800 px-4 py-4"
        style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
        {status === 'none' && !filled && (
          <div className="flex gap-3">
            <button
              onClick={handleInterest}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                interested ? 'bg-rose-500/20 text-rose-400' : 'bg-gray-800 text-gray-300'
              }`}
            >
              {interested ? '♡ 気になる解除' : '♡ 気になる'}
            </button>
            <button
              onClick={() => setShowApplyModal(true)}
              className="flex-1 py-3 rounded-xl bg-amber-400 text-black text-sm font-bold"
            >
              参加申請
            </button>
          </div>
        )}
        {status === 'none' && filled && (
          <button disabled className="w-full py-3 rounded-xl bg-gray-700 text-gray-500 text-sm">
            満員です
          </button>
        )}
        {status === 'pending' && (
          <button disabled className="w-full py-3 rounded-xl bg-gray-700 text-gray-400 text-sm">
            ✓ 申請中（承認待ち）
          </button>
        )}
        {status === 'approved' && (
          <div className="flex gap-3">
            <button className="flex-1 py-3 rounded-xl bg-green-500/20 text-green-400 text-sm font-medium" disabled>
              ✅ 参加確定
            </button>
            <button className="flex-1 py-3 rounded-xl bg-gray-800 text-gray-300 text-sm">
              参加をキャンセル
            </button>
          </div>
        )}
        {status === 'rejected' && (
          <button disabled className="w-full py-3 rounded-xl bg-gray-700 text-gray-500 text-sm">
            申請が拒否されました
          </button>
        )}
        {status === 'host' && (
          <button
            onClick={onManage}
            className="w-full py-3 rounded-xl bg-amber-400 text-black text-sm font-bold"
          >
            イベントを管理
          </button>
        )}
      </div>

      {/* 参加者リストモーダル */}
      {showParticipants && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-end"
          onClick={() => setShowParticipants(false)}
        >
          <div
            className="w-full bg-gray-900 rounded-t-2xl px-5 py-6 max-h-[70vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold text-base">参加者 ({event.participants.length}/{event.capacity})</h3>
              <button onClick={() => setShowParticipants(false)} className="text-gray-500 text-xl">✕</button>
            </div>
            <p className="text-gray-500 text-xs font-medium mb-2">主催</p>
            <div className="flex items-center gap-3 mb-4">
              <img src={event.host.avatarUrl} alt={event.host.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="text-white text-sm">{event.host.name}</p>
                <p className="text-gray-500 text-xs">{event.host.age}歳</p>
              </div>
              <span className="ml-auto text-xs bg-amber-400/20 text-amber-400 px-2 py-0.5 rounded-full">主催</span>
            </div>
            {event.participants.filter(p => p.id !== event.host.id).length > 0 && (
              <>
                <p className="text-gray-500 text-xs font-medium mb-2">参加確定</p>
                {event.participants.filter(p => p.id !== event.host.id).map(p => (
                  <div key={p.id} className="flex items-center gap-3 mb-3">
                    <img src={p.avatarUrl} alt={p.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="text-white text-sm">{p.name}</p>
                      <p className="text-gray-500 text-xs">{p.age}歳</p>
                    </div>
                  </div>
                ))}
              </>
            )}
            {event.interestedCount > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-800">
                <p className="text-gray-500 text-sm">💗 気になる: {event.interestedCount}人</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 参加申請モーダル */}
      {showApplyModal && (
        <EventApplicationModal
          event={event}
          onClose={() => setShowApplyModal(false)}
          onApply={(msg) => { onApply(msg); setShowApplyModal(false) }}
        />
      )}
    </div>
  )
}
