import { useState } from 'react'
import type { User, Tab } from '../types'
import TopBar from './navigation/TopBar'
import BottomNav from './navigation/BottomNav'
import MapSection from './map/MapSection'
import MessagesScreen from './messages/MessagesScreen'
import NotificationsScreen from './notifications/NotificationsScreen'

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

export default function MainLayout() {
  const [activeTab, setActiveTab] = useState<Tab>('map')
  const [messageTarget, setMessageTarget] = useState<User | null>(null)

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-gray-950 relative overflow-hidden">
      <TopBar />

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
    </div>
  )
}
