import { useState, useEffect } from 'react'
import type { Conversation, User } from '../../types'
import { mockConversations } from '../../data/mockUsers'
import MessageList from './MessageList'
import ChatView from './ChatView'

interface Props {
  initialUser?: User | null
  isVip?: boolean
  monthlyMessageCount?: number
  onMessageSent?: () => void
}

export default function MessagesScreen({ initialUser, isVip = false, monthlyMessageCount = 0, onMessageSent }: Props) {
  const [openConv, setOpenConv] = useState<Conversation | null>(null)

  useEffect(() => {
    if (!initialUser) return
    const conv = mockConversations.find(c => c.participant.id === initialUser.id) ?? null
    setOpenConv(conv)
  }, [initialUser])

  const remaining = Math.max(0, 100 - monthlyMessageCount)

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      {/* 残り通数バナー（非VIPのみ） */}
      {!isVip && (
        <div className="px-4 py-2 bg-gray-900 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
          <span className="text-gray-400 text-xs">今月のメッセージ</span>
          <span className={`text-xs font-semibold ${remaining <= 10 ? 'text-red-400' : 'text-amber-400'}`}>
            残り：{remaining}通
          </span>
        </div>
      )}

      {openConv
        ? <ChatView
            conv={openConv}
            onBack={() => setOpenConv(null)}
            isVip={isVip}
            remainingMessages={remaining}
            onMessageSent={onMessageSent}
          />
        : <MessageList onOpen={setOpenConv} />
      }
    </div>
  )
}
