import { useState, useCallback, useEffect } from 'react'
import Map, { Marker, type ViewStateChangeEvent, type MarkerEvent } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { User, BeeEvent } from '../../types'
import { mockUsers, currentUser } from '../../data/mockUsers'
import { mockEvents } from '../../data/mockEvents'
import { formatEventDate } from '../../lib/utils/format'
import UserMarker from './UserMarker'

const EVENT_EMOJI: Record<BeeEvent['category'], string> = {
  drinking: '🍺', cafe: '☕', meal: '🍴', play: '🎮', activity: '💪', night: '🌙',
}
const EVENT_COLOR: Record<BeeEvent['category'], string> = {
  drinking: '#f97316', cafe: '#84cc16', meal: '#a855f7',
  play: '#3b82f6', activity: '#ef4444', night: '#6366f1',
}

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
  const [selectedEvent, setSelectedEvent] = useState<BeeEvent | null>(null)
  const [showFilterSheet, setShowFilterSheet] = useState(false)
  const [eventFilter, setEventFilter] = useState<'today' | 'all'>('today')
  const [showShouting, setShowShouting] = useState(true)
  const [showGpsOnly, setShowGpsOnly] = useState(false)

  const activeFilterCount = [
    eventFilter === 'all',
    !showShouting,
    showGpsOnly,
  ].filter(Boolean).length

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
        onClick={() => setSelectedEvent(null)}
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
        {mockUsers.filter(user => {
          if (showGpsOnly && user.locationMode !== 'gps') return false
          if (!showShouting && user.locationMode === 'shouting') return false
          return true
        }).map(user => (
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

        {/* イベントマーカー */}
        {mockEvents.filter(e => {
          if (e.status === 'cancelled') return false
          if (eventFilter === 'today') {
            const d = new Date(e.startAt), now = new Date()
            const end = new Date(now); end.setHours(23, 59, 59, 999)
            return d >= now && d <= end
          }
          return true
        }).map(ev => (
          <Marker
            key={ev.id}
            latitude={ev.location.lat}
            longitude={ev.location.lng}
            anchor="bottom"
            onClick={(e: MarkerEvent<MouseEvent>) => {
              e.originalEvent.stopPropagation()
              setSelectedEvent(ev)
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-lg shadow-lg border-2 border-white cursor-pointer active:scale-90 transition-transform"
              style={{ backgroundColor: EVENT_COLOR[ev.category] }}
            >
              {EVENT_EMOJI[ev.category]}
            </div>
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

      {/* フィルターボタン */}
      <button
        onClick={() => setShowFilterSheet(true)}
        className="absolute top-3 left-4 z-10 flex items-center gap-1.5 bg-gray-900/90 border border-gray-700 rounded-full px-3 py-2 shadow-lg active:opacity-70"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-300">
          <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
        </svg>
        <span className="text-gray-300 text-xs font-medium">フィルター</span>
        {activeFilterCount > 0 && (
          <span className="w-4 h-4 bg-amber-400 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* イベントミニカード */}
      {selectedEvent && (
        <div className="absolute bottom-16 left-4 right-4 z-20">
          <div className="bg-gray-900/95 border border-gray-700 rounded-2xl p-4 shadow-xl">
            <div className="flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: EVENT_COLOR[selectedEvent.category] + '33' }}
              >
                {EVENT_EMOJI[selectedEvent.category]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-snug">{selectedEvent.title}</p>
                <p className="text-gray-400 text-xs mt-0.5">📍 {selectedEvent.location.name}</p>
                <p className="text-gray-400 text-xs mt-0.5">
                  🕘 {formatEventDate(selectedEvent.startAt)}
                  👥 {selectedEvent.participants.length}/{selectedEvent.capacity}人
                </p>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 text-sm flex-shrink-0"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* フィルターシート */}
      {showFilterSheet && (
        <>
          <div
            className="absolute inset-0 z-20 bg-black/50"
            onClick={() => setShowFilterSheet(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 z-30 bg-gray-900 rounded-t-2xl border-t border-gray-700 px-5 py-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold text-base">フィルター</h3>
              <button onClick={() => setShowFilterSheet(false)} className="text-gray-500 text-xl w-8 h-8 flex items-center justify-center">✕</button>
            </div>

            {/* イベント表示範囲 */}
            <p className="text-gray-500 text-xs font-medium mb-3">📅 イベント表示範囲</p>
            <div className="flex gap-2 mb-5">
              {(['today', 'all'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setEventFilter(f)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                    eventFilter === f
                      ? 'bg-amber-400 text-black border-amber-400'
                      : 'bg-gray-800 text-gray-300 border-gray-700'
                  }`}
                >
                  {f === 'today' ? '今日のみ' : 'すべて表示'}
                </button>
              ))}
            </div>

            {/* ユーザー表示フィルター */}
            <p className="text-gray-500 text-xs font-medium mb-3">👤 ユーザー表示</p>
            <div className="flex flex-col gap-2 mb-6">
              <label className="flex items-center justify-between px-4 py-3 bg-gray-800 rounded-xl cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📢</span>
                  <div>
                    <p className="text-white text-sm font-medium">シャウト中のユーザー</p>
                    <p className="text-gray-500 text-xs">シャウトを発信中のユーザーを表示</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowShouting(v => !v)}
                  className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${showShouting ? 'bg-amber-400' : 'bg-gray-600'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${showShouting ? 'left-6' : 'left-0.5'}`} />
                </button>
              </label>

              <label className="flex items-center justify-between px-4 py-3 bg-gray-800 rounded-xl cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📡</span>
                  <div>
                    <p className="text-white text-sm font-medium">リアル位置のみ</p>
                    <p className="text-gray-500 text-xs">GPS で現在地を共有中のユーザーのみ</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowGpsOnly(v => !v)}
                  className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${showGpsOnly ? 'bg-amber-400' : 'bg-gray-600'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${showGpsOnly ? 'left-6' : 'left-0.5'}`} />
                </button>
              </label>
            </div>

            <button
              onClick={() => {
                setEventFilter('today')
                setShowShouting(true)
                setShowGpsOnly(false)
              }}
              className="w-full py-2.5 rounded-xl bg-gray-800 text-gray-400 text-sm"
            >
              リセット
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
