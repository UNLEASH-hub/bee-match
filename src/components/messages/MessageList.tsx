import type { Conversation } from '../../types'
import { mockConversations } from '../../data/mockUsers'
import { formatTime } from '../../lib/utils/format'

interface Props {
  onOpen: (conv: Conversation) => void
}

export default function MessageList({ onOpen }: Props) {
  return (
    <div className="flex-1 min-h-0 flex flex-col bg-gray-950 overflow-y-auto">
      {/* ヘッダー */}
      <div className="px-4 pt-5 pb-3 flex-shrink-0">
        <h1 className="text-white text-xl font-bold">メッセージ</h1>
      </div>

      {/* 会話カード一覧 */}
      <div className="flex-1">
        {mockConversations.map(conv => {
          const u = conv.participant
          const hasUnread = (conv.unreadCount ?? 0) > 0

          return (
            <button
              key={conv.id}
              onClick={() => onOpen(conv)}
              className="w-full flex items-center gap-4 px-4 py-4 border-b border-gray-800 active:bg-gray-900 transition-colors text-left"
            >
              {/* アバター + 未読バッジ */}
              <div className="relative flex-shrink-0">
                <img
                  src={u.avatarUrl}
                  alt={u.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                {u.isOnline && (
                  <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-950" />
                )}
              </div>

              {/* ユーザー情報 */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${hasUnread ? 'text-white' : 'text-gray-300'}`}>
                  {u.name}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {u.height ? `${u.height}cm` : '—'}
                  {' · '}
                  {u.weight ? `${u.weight}kg` : '—'}
                  {' · '}
                  {u.age}歳
                </p>
              </div>

              {/* 時刻 + 未読バッジ */}
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span className="text-gray-500 text-xs">
                  {conv.lastMessage ? formatTime(conv.lastMessage.createdAt) : ''}
                </span>
                {hasUnread && (
                  <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {conv.unreadCount! > 9 ? '9+' : conv.unreadCount}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
