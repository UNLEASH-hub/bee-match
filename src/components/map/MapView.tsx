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

function LocationEditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
      <path d="M16 19l2-2 2 2" strokeWidth={1.5} />
      <path d="M18 21v-4" strokeWidth={1.5} />
    </svg>
  )
}

function CenterPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-amber-400 drop-shadow-lg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
    </svg>
  )
}

export default function MapView({ onUserSelect, flyToTarget }: Props) {
  const [viewState, setViewState] = useState({
    latitude: 35.6762,
    longitude: 139.6580,
    zoom: 13,
  })
  const [currentUserLocation, setCurrentUserLocation] = useState(currentUser.location)
  const [showLocationSheet, setShowLocationSheet] = useState(false)
  const [isPickingLocation, setIsPickingLocation] = useState(false)
  const [gpsError, setGpsError] = useState('')
  const [showVipSheet, setShowVipSheet] = useState(false)
  const [selfLocationMode, setSelfLocationMode] = useState<'gps' | 'arbitrary' | undefined>(undefined)

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
      latitude: currentUserLocation.lat,
      longitude: currentUserLocation.lng,
      zoom: 14,
    }))
  }, [currentUserLocation])

  function handleUseGPS() {
    setGpsError('')
    if (!navigator.geolocation) {
      setGpsError('このブラウザは位置情報に対応していません')
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setCurrentUserLocation(loc)
        setViewState(v => ({ ...v, latitude: loc.lat, longitude: loc.lng, zoom: 15 }))
        setSelfLocationMode('gps')
        setShowLocationSheet(false)
        setGpsError('')
      },
      () => {
        setGpsError('位置情報の取得に失敗しました')
        setTimeout(() => setGpsError(''), 3000)
      }
    )
  }

  function handlePickOnMap() {
    setShowLocationSheet(false)
    setIsPickingLocation(true)
  }

  function handleConfirmPickedLocation() {
    setCurrentUserLocation({ lat: viewState.latitude, lng: viewState.longitude })
    setSelfLocationMode('arbitrary')
    setIsPickingLocation(false)
  }

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
          latitude={currentUserLocation.lat}
          longitude={currentUserLocation.lng}
          anchor="center"
        >
          <UserMarker user={{ ...currentUser, locationMode: selfLocationMode }} isSelf />
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
            <UserMarker user={user} isSelected={false} />
          </Marker>
        ))}
      </Map>

      {/* 右側コントロールボタン */}
      <div className="absolute right-4 bottom-28 flex flex-col gap-3 z-10">
        <button
          onClick={() => setShowVipSheet(true)}
          className="w-11 h-11 bg-gray-900/90 border border-gray-700 rounded-full flex items-center justify-center text-gray-300 shadow-lg active:opacity-70"
          aria-label="目隠し"
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
        <button
          onClick={() => setShowLocationSheet(true)}
          className="w-11 h-11 bg-gray-900/90 border border-gray-700 rounded-full flex items-center justify-center text-gray-300 shadow-lg active:opacity-70"
          aria-label="位置情報変更"
        >
          <LocationEditIcon />
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

      {/* ピン設置モード */}
      {isPickingLocation && (
        <>
          {/* 中央ピン */}
          <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
            <div style={{ marginBottom: 40 }}>
              <CenterPinIcon />
            </div>
          </div>

          {/* 上部ガイド */}
          <div className="absolute top-3 left-4 right-4 z-20 pointer-events-none">
            <div className="bg-gray-900/90 rounded-xl px-4 py-2 text-center">
              <p className="text-white text-sm">地図を動かして位置を合わせてください</p>
            </div>
          </div>

          {/* 下部確定バー */}
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-gray-950 border-t border-gray-800 px-4 py-4 flex gap-3"
            style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
          >
            <button
              onClick={() => setIsPickingLocation(false)}
              className="flex-1 py-3 rounded-xl bg-gray-800 text-gray-300 text-sm font-medium"
            >
              キャンセル
            </button>
            <button
              onClick={handleConfirmPickedLocation}
              className="flex-1 py-3 rounded-xl bg-amber-400 text-black text-sm font-bold"
            >
              この位置に設定
            </button>
          </div>
        </>
      )}

      {/* VIP 誘導ポップアップ */}
      {showVipSheet && (
        <>
          <div
            className="absolute inset-0 z-20 bg-black/60"
            onClick={() => setShowVipSheet(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 z-30 bg-gray-900 rounded-t-2xl border-t border-gray-700 px-5 py-8">
            {/* VIP バナー */}
            <div className="flex flex-col items-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-400/30">
                <span className="text-3xl leading-none">👑</span>
              </div>
              <h2 className="text-white font-bold text-lg text-center">VIPパスで目隠し機能を使おう</h2>
              <p className="text-gray-400 text-sm text-center leading-relaxed">
                目隠し機能はVIPパス限定です。{'\n'}
                地図上に表示されず、こっそりアプリを楽しめます。
              </p>
            </div>

            {/* 特典リスト */}
            <div className="bg-gray-800 rounded-xl px-4 py-3 mb-6 flex flex-col gap-2">
              {['目隠し（地図上に非表示）', '無制限いいね', '広告なし', '特別バッジ表示'].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <span className="text-amber-400 text-sm">✓</span>
                  <span className="text-gray-300 text-sm">{item}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowVipSheet(false)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold text-sm mb-3"
            >
              VIPパスを見る 👑
            </button>
            <button
              onClick={() => setShowVipSheet(false)}
              className="w-full py-2 text-gray-500 text-sm"
            >
              今はしない
            </button>
          </div>
        </>
      )}

      {/* 位置情報変更ボトムシート */}
      {showLocationSheet && (
        <>
          {/* 背景オーバーレイ */}
          <div
            className="absolute inset-0 z-20 bg-black/50"
            onClick={() => setShowLocationSheet(false)}
          />
          {/* シート */}
          <div className="absolute bottom-0 left-0 right-0 z-30 bg-gray-900 rounded-t-2xl border-t border-gray-700 px-5 py-6">
            <p className="text-white font-bold text-base mb-5 text-center">📍 位置情報の変更</p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleUseGPS}
                className="w-full flex items-center gap-4 px-4 py-4 bg-gray-800 rounded-xl active:opacity-70 transition-opacity"
              >
                <span className="text-2xl">📡</span>
                <div className="text-left">
                  <p className="text-white text-sm font-medium">GPSを利用した現在位置</p>
                  <p className="text-gray-500 text-xs mt-0.5">デバイスの位置情報を使用</p>
                </div>
              </button>

              <button
                onClick={handlePickOnMap}
                className="w-full flex items-center gap-4 px-4 py-4 bg-gray-800 rounded-xl active:opacity-70 transition-opacity"
              >
                <span className="text-2xl">🗺️</span>
                <div className="text-left">
                  <p className="text-white text-sm font-medium">地図上の任意の位置</p>
                  <p className="text-gray-500 text-xs mt-0.5">地図をドラッグして場所を選ぶ</p>
                </div>
              </button>
            </div>

            {gpsError && (
              <p className="text-red-400 text-sm text-center mt-3">{gpsError}</p>
            )}

            <button
              onClick={() => setShowLocationSheet(false)}
              className="w-full mt-4 py-3 text-gray-400 text-sm"
            >
              キャンセル
            </button>
          </div>
        </>
      )}
    </div>
  )
}
