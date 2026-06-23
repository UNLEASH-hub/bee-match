import { useState } from 'react'
import type { User, Tab } from '../types'
import TopBar from './navigation/TopBar'
import BottomNav from './navigation/BottomNav'
import MapSection from './map/MapSection'
import MessagesScreen from './messages/MessagesScreen'
import NotificationsScreen from './notifications/NotificationsScreen'
import SettingsScreen from './settings/SettingsScreen'
import EventsScreen from './events/EventsScreen'


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
        {activeTab === 'events'        && <EventsScreen />}
        {activeTab === 'settings'      && <SettingsScreen />}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
