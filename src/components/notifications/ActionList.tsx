import type { ActionType } from '../../types'
import { mockActions } from '../../data/mockUsers'
import { formatTime } from '../../lib/utils/format'

const actionConfig: Record<ActionType, { text: string; badge: string; symbol: string }> = {
  'message':      { text: 'メッセージを送りました',    badge: 'bg-amber-400',  symbol: '💬' },
  'favorite':     { text: 'お気に入りしました',         badge: 'bg-pink-500',   symbol: '♥' },
  'want-to-meet': { text: '「会いたい」しました',       badge: 'bg-blue-500',   symbol: '👋' },
  'event-request':{ text: 'イベントに参加申請しました', badge: 'bg-green-500',  symbol: '📅' },
}

export default function ActionList() {
  return (
    <div className="flex-1 overflow-y-auto">
      {mockActions.map(notif => {
        const cfg = actionConfig[notif.type]
        const u = notif.user

        return (
          <button
            key={notif.id}
            className="w-full flex items-center gap-0 border-b border-gray-800 active:bg-gray-900 transition-colors text-left"
          >
            {/* 未読インジケーター */}
            <div className={`w-1 self-stretch flex-shrink-0 rounded-r ${notif.read ? 'bg-transparent' : 'bg-amber-400'}`} />

            <div className="flex items-center gap-4 px-4 py-4 flex-1 min-w-0">
              {/* アバター + タイプバッジ */}
              <div className="relative flex-shrink-0">
                <img
                  src={u.avatarUrl}
                  alt={u.name}
                  className="w-13 h-13 rounded-full object-cover"
                  style={{ width: 52, height: 52 }}
                />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 ${cfg.badge} rounded-full flex items-center justify-center text-[10px] border-2 border-gray-950`}
                >
                  {cfg.symbol}
                </span>
              </div>

              {/* テキスト */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${notif.read ? 'text-gray-300' : 'text-white font-semibold'}`}>
                  <span className="font-semibold">{u.name}</span>
                  {' '}が{cfg.text}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {u.height && `${u.height}cm`}{u.weight && ` · ${u.weight}kg`}{` · ${u.age}歳`}
                </p>
              </div>

              {/* 時刻 */}
              <span className="text-gray-500 text-xs flex-shrink-0">{formatTime(notif.createdAt)}</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
