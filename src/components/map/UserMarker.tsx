import type { User } from '../../types'

interface Props {
  user: User
  isSelf?: boolean
  isSelected?: boolean
  onClick?: () => void
}

export default function UserMarker({ user, isSelf, isSelected, onClick }: Props) {
  const SIZE = isSelf ? 60 : 56
  const borderColor = isSelf
    ? '#f59e0b'           // amber — 自分
    : isSelected
    ? '#60a5fa'           // blue — 選択中
    : user.isOnline
    ? '#ffffff'           // white — オンライン
    : '#6b7280'           // gray — オフライン

  return (
    <div
      onClick={onClick}
      style={{ width: SIZE, height: SIZE }}
      className="relative"
    >
      {/* 外側のグロー（オンラインユーザーのみ） */}
      {user.isOnline && (
        <div
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            boxShadow: `0 0 0 3px ${borderColor}40`,
            borderRadius: '50%',
          }}
        />
      )}

      {/* ボーダーリング */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ border: `3px solid ${borderColor}` }}
      />

      {/* アバター画像 */}
      <img
        src={user.avatarUrl}
        alt={user.name}
        className="absolute inset-0 w-full h-full rounded-full object-cover"
        style={{ padding: 3 }}
        draggable={false}
      />

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
      {user.isOnline && !isSelf && (
        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-gray-900" />
      )}
    </div>
  )
}
