export interface User {
  id: string
  name: string
  age: number
  bio: string
  avatarUrl: string
  photos: string[]
  location: { lat: number; lng: number }
  isOnline: boolean
  distance?: number
  height?: number
  weight?: number
  sexuality?: 'gay' | 'bi' | 'straight-leaning' | 'trans'
  position?: 'tachi' | 'uke' | 'riba' | 'vanilla' | 'unknown'
  lookingFor?: ('friends' | 'romance' | 'other')[]
  phone?: string
  locationMode?: 'shouting'
}

export interface Message {
  id: string
  senderId: string
  text: string
  createdAt: string
}

export interface Conversation {
  id: string
  participant: User
  messages: Message[]
  lastMessage?: Message
  unreadCount?: number
}

export interface RegisterData {
  email: string
  password: string
  birthday: string
  phone: string
  avatarUrl: string
  name: string
  height: string
  weight: string
  sexuality: string
  position: string
  lookingFor: string[]
  invitationCode?: string
}

export interface Shout {
  id: string
  user: User
  message: string
  createdAt: string
}

export type ActionType = 'message' | 'favorite' | 'want-to-meet' | 'event-request'

export interface ActionNotification {
  id: string
  type: ActionType
  user: User
  createdAt: string
  read: boolean
}

export interface FootprintEntry {
  id: string
  user: User
  visitedAt: string
}

export type View = 'login' | 'register-1' | 'register-2' | 'register-3' | 'main'

export type Tab = 'notifications' | 'events' | 'map' | 'messages' | 'settings'

// ── イベント機能 ──────────────────────────────────────────

export type EventCategory = 'drinking' | 'cafe' | 'meal' | 'play' | 'activity' | 'night'
export type ApprovalMode = 'open' | 'approval' | 'invite'
export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'
export type EventStatus = 'draft' | 'published' | 'ended' | 'cancelled'

export interface EventLocation {
  type: 'venue' | 'area' | 'host_place'
  name: string
  address?: string
  lat: number
  lng: number
}

export interface EventApplication {
  id: string
  eventId: string
  applicant: User
  message?: string
  status: ApplicationStatus
  appliedAt: string
  rejectionReason?: string
  rejectionMessage?: string
}

export interface BeeEvent {
  id: string
  category: EventCategory
  title: string
  description: string
  location: EventLocation
  startAt: string
  endAt: string
  capacity: number
  host: User
  approvalMode: ApprovalMode
  ageMin?: number
  ageMax?: number
  conditions: string[]
  tags: string[]
  coverImage?: string
  status: EventStatus
  interestedCount: number
  participants: User[]
  applications: EventApplication[]
  notes?: string
  visibility: 'public' | 'limited'
  createdAt: string
}

export interface EventMessage {
  id: string
  sender: User | null
  content: string
  messageType: 'user' | 'system' | 'announcement'
  createdAt: string
}
