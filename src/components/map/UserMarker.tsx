import type { User } from '../../types'

interface Props {
  user: User
  isSelf?: boolean
  isSelected?: boolean
  onClick?: () => void
}

function MegaphoneBadge() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  )
}

function AntennaBadge() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <circle cx="12" cy="20" r="1" fill="white" />
    </svg>
  )
}

function AirplaneBadge() {
  return (
    <svg viewBox="0 0 24 24" fill="white" className="w-2.5 h-2.5">
      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
  )
}

export default function UserMarker({ user, isSelf, isSelected, onClick }: Props) {
  const SIZE = isSelf ? 60 : 56

  const modeColor =
    user.locationMode === 'shouting'  ? '#ef4444' :
    user.locationMode === 'gps'       ? '#f97316' :
    user.locationMode === 'arbitrary' ? '#22c55e' :
    null

  const borderColor = isSelf
    ? '#f59e0b'
    : isSelected
    ? '#60a5fa'
    : modeColor ?? (user.isOnline ? '#ffffff' : '#6b7280')

  return (
    <div
      onClick={onClick}
      style={{ width: SIZE, height: SIZE }}
      className="relative"
    >
      {/* グロー */}
      {user.isOnline && (
        <div
          className="absolute inset-0 rounded-full animate-pulse"
          style={{ boxShadow: `0 0 0 3px ${borderColor}40`, borderRadius: '50%' }}
        />
      )}

      {/* ボーダーリング */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ border: `3px solid ${borderColor}` }}
      />

      {/* アバター */}
      <img
        src={user.avatarUrl}
        alt={user.name}
        className="absolute inset-0 w-full h-full rounded-full object-cover"
        style={{ padding: 3 }}
        draggable={false}
      />

      {/* locationMode バッジ（右上） */}
      {!isSelf && user.locationMode && (
        <div
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border border-gray-900"
          style={{
            backgroundColor:
              user.locationMode === 'shouting'  ? '#ef4444' :
              user.locationMode === 'gps'       ? '#f97316' :
              '#22c55e',
          }}
        >
          {user.locationMode === 'shouting'  && <MegaphoneBadge />}
          {user.locationMode === 'gps'       && <AntennaBadge />}
          {user.locationMode === 'arbitrary' && <AirplaneBadge />}
        </div>
      )}

      {/* 自分ラベル */}
      {isSelf && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-amber-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow">
          自分
        </div>
      )}

      {/* オフラインバッジ */}
      {!user.isOnline && !isSelf && (
        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-gray-600 rounded-full border-2 border-gray-900" />
      )}

      {/* オンラインバッジ */}
      {user.isOnline && !isSelf && !user.locationMode && (
        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-gray-900" />
      )}
    </div>
  )
}
