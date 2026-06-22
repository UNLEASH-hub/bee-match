import { useState } from 'react'
import type { User, Tab } from '../types'
import TopBar from './navigation/TopBar'
import BottomNav from './navigation/BottomNav'
import MapSection from './map/MapSection'
import MessagesScreen from './messages/MessagesScreen'
import NotificationsScreen from './notifications/NotificationsScreen'

interface Props {
  currentUser: User | null
}

const tabLabels: Record<Tab, string> = {
  notifications: '通知',
  events: 'イベント',
  map: '地図',
  messages: 'メッセージ',
  settings: '設定',
}

function PlaceholderContent({ tab }: { tab: Tab }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
      <span className="text-gray-600 text-6xl">
        {tab === 'notifications' && '🔔'}
        {tab === 'events'        && '📅'}
        {tab === 'map'           && '🗺️'}
        {tab === 'messages'      && '💬'}
        {tab === 'settings'      && '⚙️'}
      </span>
      <p className="text-gray-400 font-medium">{tabLabels[tab]}</p>
      <p className="text-gray-600 text-sm">近日実装予定</p>
    </div>
  )
}

export default function MainLayout({ currentUser }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('map')
  const [menuOpen, setMenuOpen] = useState(false)
  const [messageTarget, setMessageTarget] = useState<User | null>(null)

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-gray-950 relative overflow-hidden">
      <TopBar onMenuOpen={() => setMenuOpen(true)} />

      <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {activeTab === 'map'           && (
          <MapSection onNavigateToMessages={(user) => { setMessageTarget(user); setActiveTab('messages') }} />
        )}
        {activeTab === 'messages'      && <MessagesScreen initialUser={messageTarget} />}
        {activeTab === 'notifications' && <NotificationsScreen />}
        {activeTab === 'events'        && <PlaceholderContent tab={activeTab} />}
        {activeTab === 'settings'      && <PlaceholderContent tab={activeTab} />}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ハンバーガーメニュー（仮実装: 半透明オーバーレイ＋閉じるボタン） */}
      {menuOpen && (
        <div
          className="absolute inset-0 z-50 bg-black/60 flex justify-end"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="w-64 h-full bg-gray-900 border-l border-gray-800 flex flex-col p-6 pt-14"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <span className="text-white font-bold text-lg">メニュー</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-gray-400 text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            {currentUser && (
              <div className="flex items-center gap-3 mb-8 p-3 bg-gray-800 rounded-xl">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-white font-medium text-sm">{currentUser.name}</p>
                  <p className="text-gray-400 text-xs">{currentUser.age}歳</p>
                </div>
              </div>
            )}

            <nav className="space-y-1">
              {(['プロフィール編集', '設定', 'ヘルプ', 'ログアウト'] as const).map(item => (
                <button
                  key={item}
                  className="w-full text-left text-gray-300 text-sm py-3 px-3 rounded-xl hover:bg-gray-800 transition-colors"
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}
