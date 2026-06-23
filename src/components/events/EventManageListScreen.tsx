import { useState } from 'react'
import type { BeeEvent } from '../../types'
import { formatEventDate } from '../../lib/utils/format'
import { CATEGORY_EMOJI } from './EventListScreen'

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

type ManageTab = 'upcoming' | 'past' | 'draft'

export default function EventManageListScreen({
  events,
  onBack,
  onOpenManage,
  onCreate,
}: {
  events: BeeEvent[]
  onBack: () => void
  onOpenManage: (id: string) => void
  onCreate: () => void
}) {
  const [tab, setTab] = useState<ManageTab>('upcoming')

  const now = new Date()
  const filtered = events.filter(ev => {
    if (tab === 'upcoming') return ev.status === 'published' && new Date(ev.endAt) >= now
    if (tab === 'past')     return ev.status === 'ended' || (ev.status === 'published' && new Date(ev.endAt) < now)
    return ev.status === 'draft'
  })

  const tabs: { key: ManageTab; label: string }[] = [
    { key: 'upcoming', label: '予定中' },
    { key: 'past',     label: '過去' },
    { key: 'draft',    label: '下書き' },
  ]

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-gray-950">
      <div className="flex items-center gap-2 px-2 h-14 border-b border-gray-800 flex-shrink-0">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center text-gray-400">
          <ChevronLeft />
        </button>
        <h1 className="text-white font-bold text-base">主催イベント管理</h1>
      </div>

      <div className="flex border-b border-gray-800 flex-shrink-0">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key ? 'text-amber-400 border-amber-400' : 'text-gray-500 border-transparent'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="text-5xl text-gray-700">📅</span>
            <p className="text-gray-500 text-sm">イベントがありません</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 p-4">
            {filtered.map(ev => {
              const pendingCount = ev.applications.filter(a => a.status === 'pending').length
              return (
                <div key={ev.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">{CATEGORY_EMOJI[ev.category]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm">{ev.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">📅 {formatEventDate(ev.startAt)}</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        👥 {ev.participants.length}/{ev.capacity}人
                        {pendingCount > 0 && (
                          <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                            申請 {pendingCount}件
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenManage(ev.id)}
                    className="w-full py-2.5 rounded-xl bg-amber-400/10 text-amber-400 text-sm font-medium"
                  >
                    管理画面を開く
                  </button>
                </div>
              )
            })}
          </div>
        )}

        <div className="px-4 pb-6">
          <button onClick={onCreate}
            className="w-full py-3 rounded-xl bg-amber-400 text-black font-bold text-sm">
            + 新しいイベントを作成
          </button>
        </div>
      </div>
    </div>
  )
}
