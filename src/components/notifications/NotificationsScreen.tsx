import { useState } from 'react'
import ActionList from './ActionList'
import FootprintPanel from './FootprintPanel'

type MainTab = 'action' | 'footprint'

export default function NotificationsScreen({ isVip = false }: { isVip?: boolean }) {
  const [tab, setTab] = useState<MainTab>('action')

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-gray-950">
      {/* ヘッダー + タブ */}
      <div className="px-4 pt-5 pb-0 flex-shrink-0">
        <h1 className="text-white text-xl font-bold mb-4">通知</h1>

        <div className="flex border-b border-gray-800">
          {([['action', 'アクション'], ['footprint', '足あと']] as [MainTab, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 ${
                tab === key
                  ? 'text-white border-amber-400'
                  : 'text-gray-500 border-transparent'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* コンテンツ */}
      {tab === 'action'    && <ActionList isVip={isVip} />}
      {tab === 'footprint' && <FootprintPanel />}
    </div>
  )
}
