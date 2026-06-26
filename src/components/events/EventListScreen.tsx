import { useState, useCallback } from 'react'
import type { BeeEvent } from '../../types'
import { currentUser } from '../../data/mockUsers'
import { formatEventDate } from '../../lib/utils/format'

export const CATEGORY_EMOJI: Record<BeeEvent['category'], string> = {
  drinking: '🍺', cafe: '☕', meal: '🍴', play: '🎮', activity: '💪', night: '🌙',
}
export const CATEGORY_LABEL: Record<BeeEvent['category'], string> = {
  drinking: '飲み会', cafe: 'カフェ', meal: '食事会', play: '遊び', activity: 'アクティビティ', night: 'ナイト',
}
export const CATEGORY_COLOR: Record<BeeEvent['category'], string> = {
  drinking: '#f97316', cafe: '#84cc16', meal: '#a855f7',
  play: '#3b82f6', activity: '#ef4444', night: '#6366f1',
}

type Period = 'list' | 'mine'

function getParticipantStatus(ev: BeeEvent) {
  if (ev.host.id === currentUser.id) return 'host'
  const app = ev.applications.find(a => a.applicant.id === currentUser.id)
  if (!app) return 'none'
  return app.status
}

function EventCard({
  event,
  onSelect,
  onApply,
}: {
  event: BeeEvent
  onSelect: () => void
  onApply: () => void
}) {
  const status = getParticipantStatus(event)
  const filled = event.participants.length >= event.capacity
  const [copied, setCopied] = useState(false)

  const handleShare = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation()
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: event.title, url }).catch(() => {})
    } else {
      await navigator.clipboard.writeText(url).catch(() => {})
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [event.title])

  return (
    <div
      className="mx-4 mb-3 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden active:opacity-90"
      onClick={onSelect}
    >
      {event.coverImage ? (
        <div className="relative w-full h-28 overflow-hidden">
          <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/70" />
          <span className="absolute bottom-2 left-3 text-2xl drop-shadow">{CATEGORY_EMOJI[event.category]}</span>
        </div>
      ) : (
        <div className="h-1.5" style={{ backgroundColor: CATEGORY_COLOR[event.category] }} />
      )}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {!event.coverImage && (
            <span className="text-3xl leading-none flex-shrink-0 mt-0.5">
              {CATEGORY_EMOJI[event.category]}
            </span>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-snug">{event.title}</p>
            <p className="text-gray-500 text-xs mt-1">📍 {event.location.name}</p>
            <p className="text-gray-500 text-xs mt-0.5">🕘 {formatEventDate(event.startAt)}</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-gray-400 text-xs">👥 {event.participants.length}/{event.capacity}人</p>
            {filled && <p className="text-red-400 text-xs mt-0.5">満員</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <img src={event.host.avatarUrl} alt={event.host.name}
            className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
          <p className="text-gray-500 text-xs">{event.host.name}</p>
        </div>

        <div className="flex gap-2 mt-3 items-center" onClick={e => e.stopPropagation()}>
          {status !== 'host' && (
            <>
              {status === 'none' && !filled && (
                <button onClick={onApply}
                  className="flex-1 py-2 rounded-xl bg-amber-400 text-black text-xs font-semibold active:opacity-70">
                  参加申請
                </button>
              )}
              {status === 'pending' && (
                <button disabled className="flex-1 py-2 rounded-xl bg-gray-700 text-gray-500 text-xs">✓ 申請中</button>
              )}
              {status === 'approved' && (
                <button className="flex-1 py-2 rounded-xl bg-green-500/20 text-green-400 text-xs font-medium">
                  💬 参加確定
                </button>
              )}
            </>
          )}
          {status === 'host' && (
            <button onClick={onSelect}
              className="flex-1 py-2 rounded-xl bg-amber-400/10 text-amber-400 text-xs font-medium">
              ✏️ 主催中
            </button>
          )}
          {/* シェアボタン */}
          <button onClick={handleShare}
            className="w-8 h-8 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400 flex-shrink-0 active:opacity-70">
            {copied
              ? <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>
              : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default function EventListScreen({
  events,
  onSelectEvent,
  onCreate,
  onManageEvent,
  onApply,
  isVip,
  onNavigateToSettings,
}: {
  events: BeeEvent[]
  onSelectEvent: (id: string) => void
  onCreate: () => void
  onManageEvent: (id: string) => void
  onApply: (id: string, msg: string) => void
  isVip: boolean
  onNavigateToSettings: () => void
}) {
  const [period, setPeriod] = useState<Period>('list')
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreeLocation, setAgreeLocation] = useState(false)
  const [showVipUpsell, setShowVipUpsell] = useState(false)

  function handleCreateClick() {
    if (!isVip) { setShowVipUpsell(true); return }
    setAgreeTerms(false)
    setAgreeLocation(false)
    setShowCreateModal(true)
  }

  const tabs: { key: Period; label: string }[] = [
    { key: 'list', label: '一覧' },
    { key: 'mine', label: 'マイイベント' },
  ]

  // 一般リスト用フィルター（mine タブ以外）
  const filtered = events
    .filter(ev => ev.status !== 'cancelled' && period !== 'mine')
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
    .filter(ev => !search || ev.title.includes(search) || ev.location.name.includes(search))

  // マイイベント用
  const myHosted = events.filter(ev =>
    ev.status !== 'cancelled' && ev.host.id === currentUser.id
  )
  const myParticipating = events.filter(ev =>
    ev.status !== 'cancelled' &&
    ev.host.id !== currentUser.id &&
    (
      ev.participants.some(p => p.id === currentUser.id) ||
      ev.applications.some(a => a.applicant.id === currentUser.id && a.status !== 'rejected')
    )
  )

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-gray-950 relative">
      {/* ヘッダー */}
      <div className="px-4 pt-5 pb-3 flex items-center justify-between flex-shrink-0">
        <h1 className="text-white text-xl font-bold">イベント</h1>
        <button
          onClick={handleCreateClick}
          className="text-black text-xs px-3 py-1.5 rounded-xl bg-amber-400 font-semibold active:opacity-70"
        >
          + 新規作成
        </button>
      </div>

      {/* タブ */}
      <div className="flex border-b border-gray-800 flex-shrink-0">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setPeriod(t.key)}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors border-b-2 ${
              period === t.key
                ? 'text-amber-400 border-amber-400'
                : 'text-gray-500 border-transparent'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* マイイベントタブ */}
      {period === 'mine' ? (
        <div className="flex-1 overflow-y-auto pb-4">
          {/* 主催中セクション */}
          <div className="px-4 pt-5 pb-2">
            <p className="text-gray-500 text-xs font-medium">主催中</p>
          </div>
          {myHosted.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-4">主催しているイベントはありません</p>
          ) : (
            myHosted.map(ev => (
              <EventCard
                key={ev.id}
                event={ev}
                onSelect={() => onManageEvent(ev.id)}
                onApply={() => {}}
              />
            ))
          )}

          <div className="px-4 py-3">
            <button onClick={handleCreateClick}
              className="w-full py-2.5 rounded-xl border border-dashed border-gray-700 text-gray-500 text-xs">
              + 新しいイベントを作成
            </button>
          </div>

          {/* 参加予定セクション */}
          <div className="px-4 pt-3 pb-2">
            <p className="text-gray-500 text-xs font-medium">参加予定・申請中</p>
          </div>
          {myParticipating.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-4">参加予定のイベントはありません</p>
          ) : (
            myParticipating.map(ev => (
              <EventCard
                key={ev.id}
                event={ev}
                onSelect={() => onSelectEvent(ev.id)}
                onApply={() => onApply(ev.id, '')}
              />
            ))
          )}
        </div>
      ) : (
        /* 今夜 / 今後 リストビュー */
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-3">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="イベントを検索..."
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 transition-colors placeholder-gray-500"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center px-8">
              <span className="text-gray-600 text-5xl">📅</span>
              <p className="text-gray-500 text-sm">この期間のイベントはありません</p>
              <button onClick={handleCreateClick}
                className="mt-2 px-5 py-2.5 bg-amber-400 text-black text-sm font-semibold rounded-xl">
                + 最初のイベントを作成
              </button>
            </div>
          ) : (
            <div className="pb-4">
              {filtered.map(ev => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  onSelect={() => onSelectEvent(ev.id)}
                  onApply={() => onApply(ev.id, '')}
                  />
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIP 誘導ポップアップ */}
      {showVipUpsell && (
        <div className="absolute inset-0 z-50 bg-black/60 flex items-end"
          onClick={() => setShowVipUpsell(false)}>
          <div className="w-full bg-gray-900 rounded-t-2xl border-t border-gray-700 px-5 py-8"
            onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-400/30">
                <span className="text-3xl leading-none">👑</span>
              </div>
              <h2 className="text-white font-bold text-lg text-center">VIPパス限定機能です</h2>
              <p className="text-gray-400 text-sm text-center leading-relaxed">
                イベントの新規作成はVIPパス加入者のみ利用できます
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl px-4 py-3 mb-6 flex flex-col gap-2">
              {['イベントの新規作成', '目隠し（地図上に非表示）', '無制限いいね', '広告なし'].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <span className="text-amber-400 text-sm">✓</span>
                  <span className="text-gray-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => { setShowVipUpsell(false); onNavigateToSettings() }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold text-sm mb-3"
            >
              設定でVIPパスに加入する 👑
            </button>
            <button
              onClick={() => setShowVipUpsell(false)}
              className="w-full py-2 text-gray-500 text-sm"
            >
              今はしない
            </button>
          </div>
        </div>
      )}

      {/* 新規作成 確認モーダル */}
      {showCreateModal && (
        <div
          className="absolute inset-0 z-50 bg-black/60 flex items-end"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="w-full bg-gray-900 rounded-t-2xl px-5 py-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold text-base">イベントを作成する前に</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 text-xl w-8 h-8 flex items-center justify-center">✕</button>
            </div>

            <div className="flex flex-col gap-4 mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  className="w-5 h-5 accent-amber-400 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-white text-sm font-medium">イベント募集の利用規約に同意します</p>
                  <p className="text-gray-500 text-xs mt-0.5">健全なコミュニティのためのルールを守ります</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeLocation}
                  onChange={e => setAgreeLocation(e.target.checked)}
                  className="w-5 h-5 accent-amber-400 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-white text-sm font-medium">マップへの表示について理解しました</p>
                  <p className="text-gray-500 text-xs mt-0.5">位置情報は多少ズレる場合がありますが、イベントがマップ上に表示されます</p>
                </div>
              </label>
            </div>

            <button
              onClick={() => { setShowCreateModal(false); onCreate() }}
              disabled={!agreeTerms || !agreeLocation}
              className="w-full py-3.5 rounded-xl bg-amber-400 text-black font-bold text-sm disabled:opacity-40 active:opacity-80"
            >
              作成画面へ進む
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
