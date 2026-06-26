import type { User } from '../../types'

interface Props {
  users: User[]
  onMessage?: (user: User) => void
}

export default function FavoritesPanel({ users, onMessage }: Props) {
  if (users.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8 py-16">
        <span className="text-gray-600 text-5xl">♡</span>
        <p className="text-gray-500 text-sm">まだお気に入りはいません</p>
        <p className="text-gray-600 text-xs">地図でユーザーのプロフィールを開き<br />★ボタンでお気に入りに追加できます</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {users.map(u => (
        <div key={u.id} className="flex items-center gap-4 px-4 py-4 border-b border-gray-800">
          <img
            src={u.avatarUrl}
            alt={u.name}
            className="w-14 h-14 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm">{u.name}</p>
            <p className="text-gray-500 text-xs mt-0.5">
              {u.age}歳
              {u.height && ` · ${u.height}cm`}
              {u.weight && ` · ${u.weight}kg`}
            </p>
          </div>
          <button
            onClick={() => onMessage?.(u)}
            className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0 active:opacity-70"
            aria-label="メッセージ"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
