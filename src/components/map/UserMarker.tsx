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

export default function UserMarker({ user, isSelf, isSelected, onClick }: Props) {
  const SIZE = isSelf ? 60 : 56

  const borderColor = isSelf
    ? '#f59e0b'
    : isSelected
    ? '#60a5fa'
    : user.locationMode === 'shouting'
    ? '#ef4444'
    : user.isOnline ? '#ffffff' : '#6b7280'

  return (
    <div
      onClick={onClick}
      style={{ width: SIZE, height: SIZE }}
      className="relative"
    >
      {/* グロー（オンラインユーザーのみ） */}
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

      {/* シャウト中バッジ（右上） */}
      {!isSelf && user.locationMode === 'shouting' && (
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border border-gray-900 bg-red-500">
          <MegaphoneBadge />
        </div>
      )}

      {/* 自分ラベル */}
      {isSelf && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-amber-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow">
          自分
        </div>
      )}

      {/* オフラインバッジ（右下） */}
      {!user.isOnline && !isSelf && (
        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-gray-600 rounded-full border-2 border-gray-900" />
      )}

      {/* オンラインバッジ（右下） */}
      {user.isOnline && !isSelf && (
        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-gray-900" />
      )}
    </div>
  )
}
