import { useState } from 'react'
import type { FootprintEntry } from '../../types'
import { mockFootprintsFrom, mockFootprintsTo } from '../../data/mockUsers'
import { formatTime } from '../../lib/utils/format'

type SubTab = 'from' | 'to'

function FootprintCard({ entry }: { entry: FootprintEntry }) {
  const u = entry.user
  return (
    <button className="w-full flex items-center gap-4 px-4 py-4 border-b border-gray-800 active:bg-gray-900 transition-colors text-left">
      <div className="relative flex-shrink-0">
        <img
          src={u.avatarUrl}
          alt={u.name}
          className="w-14 h-14 rounded-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold">{u.name}</p>
        <p className="text-gray-500 text-xs mt-0.5">
          {u.height && `${u.height}cm`}{u.weight && ` · ${u.weight}kg`}{` · ${u.age}歳`}
        </p>
      </div>

      <span className="text-gray-500 text-xs flex-shrink-0">{formatTime(entry.visitedAt)}</span>
    </button>
  )
}

export default function FootprintPanel() {
  const [subTab, setSubTab] = useState<SubTab>('from')
  const entries = subTab === 'from' ? mockFootprintsFrom : mockFootprintsTo

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      {/* サブタブ */}
      <div className="px-4 py-3 flex gap-2 flex-shrink-0">
        {([['from', '相手から'], ['to', '自分から']] as [SubTab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSubTab(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              subTab === key
                ? 'bg-gray-700 text-white'
                : 'text-gray-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* カード一覧 */}
      <div className="flex-1 overflow-y-auto">
        {entries.map(entry => (
          <FootprintCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  )
}
