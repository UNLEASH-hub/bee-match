import { useState } from 'react'
import type { User, Tab } from '../types'
import { mockUsers } from '../data/mockUsers'
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
  const [isVip, setIsVip] = useState(false)
  const [monthlyMessageCount, setMonthlyMessageCount] = useState(7)
  const [favoriteUsers, setFavoriteUsers] = useState<User[]>([mockUsers[0], mockUsers[2]])

  function handleFavoriteUser(user: User) {
    setFavoriteUsers(prev => prev.some(u => u.id === user.id) ? prev : [...prev, user])
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-gray-950 relative overflow-hidden">
      <TopBar />

      <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {activeTab === 'map'           && (
          <MapSection
            onNavigateToMessages={(user) => { setMessageTarget(user); setActiveTab('messages') }}
            onFavoriteUser={handleFavoriteUser}
          />
        )}
        {activeTab === 'messages'      && (
          <MessagesScreen
            initialUser={messageTarget}
            isVip={isVip}
            monthlyMessageCount={monthlyMessageCount}
            onMessageSent={() => setMonthlyMessageCount(c => c + 1)}
          />
        )}
        {activeTab === 'notifications' && <NotificationsScreen isVip={isVip} favoriteUsers={favoriteUsers} />}
        {activeTab === 'events'        && (
          <EventsScreen isVip={isVip} onNavigateToSettings={() => setActiveTab('settings')} />
        )}
        {activeTab === 'settings'      && (
          <SettingsScreen isVip={isVip} onToggleVip={() => setIsVip(v => !v)} />
        )}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
