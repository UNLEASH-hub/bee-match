import { useState, useEffect } from 'react'
import type { Conversation, User } from '../../types'
import { mockConversations } from '../../data/mockUsers'
import MessageList from './MessageList'
import ChatView from './ChatView'

interface Props {
  initialUser?: User | null
}

export default function MessagesScreen({ initialUser }: Props) {
  const [openConv, setOpenConv] = useState<Conversation | null>(null)

  useEffect(() => {
    if (!initialUser) return
    const conv = mockConversations.find(c => c.participant.id === initialUser.id) ?? null
    setOpenConv(conv)
  }, [initialUser])

  return openConv
    ? <ChatView conv={openConv} onBack={() => setOpenConv(null)} />
    : <MessageList onOpen={setOpenConv} />
}
