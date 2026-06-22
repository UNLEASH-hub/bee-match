import { useState, useCallback, useEffect } from 'react'
import Map, { Marker, type ViewStateChangeEvent, type MarkerEvent } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { User } from '../../types'
import { mockUsers, currentUser } from '../../data/mockUsers'
import UserMarker from './UserMarker'

interface FlyToTarget {
  lat: number
  lng: number
  zoom: number
}

interface Props {
  onUserSelect?: (user: User) => void
  flyToTarget?: FlyToTarget | null
}

// CARTO Dark Matter — 完全無料・登録不要
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'

function CrosshairIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="2" x2="12" y2="7" />
      <line x1="12" y1="17" x2="12" y2="22" />
      <line x1="2" y1="12" x2="7" y2="12" />
      <line x1="17" y1="12" x2="22" y2="12" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export default function MapView({ onUserSelect, flyToTarget }: Props) {
  const [viewState, setViewState] = useState({
    latitude: 35.6762,
    longitude: 139.6580,
    zoom: 13,
  })

  useEffect(() => {
    if (flyToTarget) {
      setViewState(v => ({
        ...v,
        latitude: flyToTarget.lat,
        longitude: flyToTarget.lng,
        zoom: flyToTarget.zoom,
      }))
    }
  }, [flyToTarget])

  const goToCurrentLocation = useCallback(() => {
    setViewState(v => ({
      ...v,
      latitude: currentUser.location.lat,
      longitude: currentUser.location.lng,
      zoom: 14,
    }))
  }, [])

  return (
    <div className="flex-1 min-h-0 relative">
      <Map
        {...viewState}
        onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
        mapStyle={MAP_STYLE}
        style={{ width: '100%', height: '100%' }}
      >
        {/* 自分のマーカー */}
        <Marker
          latitude={currentUser.location.lat}
          longitude={currentUser.location.lng}
          anchor="center"
        >
          <UserMarker user={currentUser} isSelf />
        </Marker>

        {/* 他ユーザーのマーカー */}
        {mockUsers.map(user => (
          <Marker
            key={user.id}
            latitude={user.location.lat}
            longitude={user.location.lng}
            anchor="center"
            onClick={(e: MarkerEvent<MouseEvent>) => {
              e.originalEvent.stopPropagation()
              onUserSelect?.(user)
            }}
          >
            <UserMarker
              user={user}
              isSelected={false}
            />
          </Marker>
        ))}
      </Map>

      {/* 右側コントロールボタン */}
      <div className="absolute right-4 bottom-28 flex flex-col gap-3 z-10">
        <button
          className="w-11 h-11 bg-gray-900/90 border border-gray-700 rounded-full flex items-center justify-center text-gray-300 shadow-lg active:opacity-70"
          aria-label="フィルター"
        >
          <EyeIcon />
        </button>
        <button
          onClick={goToCurrentLocation}
          className="w-11 h-11 bg-gray-900/90 border border-gray-700 rounded-full flex items-center justify-center text-gray-300 shadow-lg active:opacity-70"
          aria-label="現在地"
        >
          <CrosshairIcon />
        </button>
      </div>

      {/* 下部: 近くのユーザーストリップ */}
      <div className="absolute bottom-4 left-0 right-0 px-4 z-10">
        <div className="flex items-center">
          <div className="flex">
            {mockUsers.slice(0, 5).map((user, i) => (
              <button
                key={user.id}
                onClick={() => onUserSelect?.(user)}
                style={{ marginLeft: i === 0 ? 0 : -10, zIndex: 5 - i }}
                className="relative w-10 h-10 rounded-full border-2 border-gray-900 overflow-hidden flex-shrink-0"
              >
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          {mockUsers.length > 5 && (
            <div
              className="w-10 h-10 rounded-full bg-gray-800 border-2 border-gray-900 flex items-center justify-center text-gray-300 text-xs font-medium flex-shrink-0"
              style={{ marginLeft: -10 }}
            >
              +{mockUsers.length - 5}
            </div>
          )}
          <div className="ml-3 bg-gray-900/90 border border-gray-700 rounded-full px-3 py-1.5 flex-shrink-0">
            <span className="text-gray-300 text-xs font-medium">
              {mockUsers.filter(u => u.isOnline).length}人オンライン
            </span>
          </div>
        </div>
      </div>

    </div>
  )
}
