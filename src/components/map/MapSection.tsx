import { useState } from 'react'
import type { User } from '../../types'
import MapView from './MapView'
import ShoutScreen from '../shout/ShoutScreen'
import UserProfileScreen from '../user/UserProfileScreen'

type MapSubTab = 'map' | 'shout'

interface Props {
  onNavigateToMessages?: (user: User) => void
}

export default function MapSection({ onNavigateToMessages }: Props) {
  const [subTab, setSubTab] = useState<MapSubTab>('map')
  const [profileUser, setProfileUser] = useState<User | null>(null)
  const [flyToTarget, setFlyToTarget] = useState<{ lat: number; lng: number; zoom: number } | null>(null)

  if (profileUser) {
    return (
      <UserProfileScreen
        user={profileUser}
        onBack={() => setProfileUser(null)}
        onMessage={() => {
          const u = profileUser
          setProfileUser(null)
          onNavigateToMessages?.(u)
        }}
        onShowOnMap={() => {
          setFlyToTarget({ lat: profileUser.location.lat, lng: profileUser.location.lng, zoom: 16 })
          setProfileUser(null)
        }}
      />
    )
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="flex bg-gray-950 border-b border-gray-800 flex-shrink-0">
        {(['map', 'shout'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setSubTab(tab)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              subTab === tab
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'text-gray-500'
            }`}
          >
            {tab === 'map' ? '地図' : 'シャウト'}
          </button>
        ))}
      </div>

      {subTab === 'map' && <MapView onUserSelect={setProfileUser} flyToTarget={flyToTarget} />}
      {subTab === 'shout' && (
        <ShoutScreen
          onShowOnMap={(user) => {
            setFlyToTarget({ lat: user.location.lat, lng: user.location.lng, zoom: 16 })
            setSubTab('map')
          }}
        />
      )}
    </div>
  )
}
