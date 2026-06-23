import { useState } from 'react'
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

type Period = 'tonight' | 'future' | 'mine'

function isTonight(iso: string) {
  const d = new Date(iso), now = new Date()
  const end = new Date(now); end.setHours(23, 59, 59, 999)
  return d >= now && d <= end
}
function isFuture(iso: string) {
  return new Date(iso) > new Date() && !isTonight(iso)
}

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
  onInterest,
}: {
  event: BeeEvent
  onSelect: () => void
  onApply: () => void
  onInterest: () => void
}) {
  const status = getParticipantStatus(event)
  const filled = event.participants.length >= event.capacity

  return (
    <div
      className="mx-4 mb-3 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden active:opacity-90"
      onClick={onSelect}
    >
      <div className="h-1.5" style={{ backgroundColor: CATEGORY_COLOR[event.category] }} />
      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-3xl leading-none flex-shrink-0 mt-0.5">
            {CATEGORY_EMOJI[event.category]}
          </span>
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
          <div className="flex gap-1 flex-1 overflow-hidden">
            {event.tags.slice(0, 2).map(t => (
              <span key={t} className="text-xs text-gray-600 truncate">{t}</span>
            ))}
          </div>
        </div>

        {status !== 'host' && (
          <div className="flex gap-2 mt-3" onClick={e => e.stopPropagation()}>
            <button onClick={onInterest}
              className="flex-1 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs font-medium active:opacity-70">
              ♡ 気になる
            </button>
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
          </div>
        )}
        {status === 'host' && (
          <div className="mt-3" onClick={e => e.stopPropagation()}>
            <button onClick={onSelect}
              className="w-full py-2 rounded-xl bg-amber-400/10 text-amber-400 text-xs font-medium">
              ✏️ 主催中
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function EventListScreen({
  events,
  onSelectEvent,
  onCreate,
  onManage,
  onInterest,
  onApply,
}: {
  events: BeeEvent[]
  onSelectEvent: (id: string) => void
  onCreate: () => void
  onManage: () => void
  onInterest: (id: string) => void
  onApply: (id: string, msg: string) => void
}) {
  const [period, setPeriod] = useState<Period>('tonight')
  const [search, setSearch] = useState('')

  const tabs: { key: Period; label: string }[] = [
    { key: 'tonight', label: '今夜' },
    { key: 'future',  label: '今後' },
    { key: 'mine',    label: 'マイイベント' },
  ]

  // 一般リスト用フィルター（mine タブ以外）
  const filtered = events.filter(ev => {
    if (ev.status === 'cancelled') return false
    if (period === 'mine')    return false
    if (period === 'tonight') return isTonight(ev.startAt)
    if (period === 'future')  return isFuture(ev.startAt)
    return true
  }).filter(ev =>
    !search || ev.title.includes(search) || ev.location.name.includes(search)
  )

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
    <div className="flex-1 min-h-0 flex flex-col bg-gray-950">
      {/* ヘッダー */}
      <div className="px-4 pt-5 pb-3 flex items-center justify-between flex-shrink-0">
        <h1 className="text-white text-xl font-bold">イベント</h1>
        <button
          onClick={onCreate}
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
          <div className="px-4 pt-5 pb-2 flex items-center justify-between">
            <p className="text-gray-500 text-xs font-medium">主催中</p>
            <button onClick={onManage} className="text-amber-400 text-xs">管理画面 ›</button>
          </div>
          {myHosted.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-4">主催しているイベントはありません</p>
          ) : (
            myHosted.map(ev => (
              <EventCard
                key={ev.id}
                event={ev}
                onSelect={() => onManage()}
                onApply={() => {}}
                onInterest={() => {}}
              />
            ))
          )}

          <div className="px-4 py-3">
            <button onClick={onCreate}
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
                onInterest={() => onInterest(ev.id)}
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
              <button onClick={onCreate}
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
                  onInterest={() => onInterest(ev.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
