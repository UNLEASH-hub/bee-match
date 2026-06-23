import { useState } from 'react'
import type { BeeEvent, EventApplication } from '../../types'
import { mockEvents } from '../../data/mockEvents'
import { currentUser } from '../../data/mockUsers'
import EventListScreen from './EventListScreen'
import EventDetailScreen from './EventDetailScreen'
import EventCreateScreen from './EventCreateScreen'
import EventManageDetailScreen from './EventManageDetailScreen'

type SubScreen =
  | { type: 'list' }
  | { type: 'detail'; eventId: string }
  | { type: 'create' }
  | { type: 'manage-detail'; eventId: string }

export default function EventsScreen() {
  const [events, setEvents] = useState<BeeEvent[]>(mockEvents)
  const [sub, setSub] = useState<SubScreen>({ type: 'list' })

  function getEvent(id: string) {
    return events.find(e => e.id === id)!
  }

  function applyToEvent(eventId: string, message: string) {
    setEvents(prev => prev.map(ev => {
      if (ev.id !== eventId) return ev
      const app: EventApplication = {
        id: `app-${Date.now()}`, eventId,
        applicant: currentUser, message,
        status: ev.approvalMode === 'open' ? 'approved' : 'pending',
        appliedAt: new Date().toISOString(),
      }
      const participants = ev.approvalMode === 'open'
        ? [...ev.participants, currentUser]
        : ev.participants
      return { ...ev, applications: [...ev.applications, app], participants }
    }))
  }

  function toggleInterest(eventId: string) {
    setEvents(prev => prev.map(ev =>
      ev.id === eventId ? { ...ev, interestedCount: ev.interestedCount + 1 } : ev
    ))
  }

  function approveApplication(eventId: string, applicationId: string) {
    setEvents(prev => prev.map(ev => {
      if (ev.id !== eventId) return ev
      const app = ev.applications.find(a => a.id === applicationId)
      if (!app) return ev
      return {
        ...ev,
        participants: [...ev.participants, app.applicant],
        applications: ev.applications.map(a =>
          a.id === applicationId ? { ...a, status: 'approved' as const, respondedAt: new Date().toISOString() } : a
        ),
      }
    }))
  }

  function rejectApplication(eventId: string, applicationId: string) {
    setEvents(prev => prev.map(ev => {
      if (ev.id !== eventId) return ev
      return {
        ...ev,
        applications: ev.applications.map(a =>
          a.id === applicationId
            ? { ...a, status: 'rejected' as const, respondedAt: new Date().toISOString() }
            : a
        ),
      }
    }))
  }

  function addEvent(ev: BeeEvent) {
    setEvents(prev => [ev, ...prev])
  }

  function cancelEvent(eventId: string) {
    setEvents(prev => prev.map(ev =>
      ev.id === eventId ? { ...ev, status: 'cancelled' as const } : ev
    ))
  }

  const nav = {
    toList:         () => setSub({ type: 'list' }),
    toDetail:       (id: string) => setSub({ type: 'detail', eventId: id }),
    toCreate:       () => setSub({ type: 'create' }),
    toManageDetail: (id: string) => setSub({ type: 'manage-detail', eventId: id }),
  }

  if (sub.type === 'detail') {
    const ev = getEvent(sub.eventId)
    return (
      <EventDetailScreen
        event={ev}
        onBack={nav.toList}
        onApply={(msg) => applyToEvent(ev.id, msg)}
        onInterest={() => toggleInterest(ev.id)}
        onManage={() => nav.toManageDetail(ev.id)}
      />
    )
  }

  if (sub.type === 'create') {
    return (
      <EventCreateScreen
        onBack={nav.toList}
        onPublish={(ev) => { addEvent(ev); nav.toDetail(ev.id) }}
      />
    )
  }

  if (sub.type === 'manage-detail') {
    const ev = getEvent(sub.eventId)
    return (
      <EventManageDetailScreen
        event={ev}
        onBack={nav.toList}
        onCancel={() => { cancelEvent(ev.id); nav.toList() }}
        onApprove={(appId) => approveApplication(ev.id, appId)}
        onReject={(appId) => rejectApplication(ev.id, appId)}
      />
    )
  }

  return (
    <EventListScreen
      events={events}
      onSelectEvent={nav.toDetail}
      onCreate={nav.toCreate}
      onManageEvent={nav.toManageDetail}
      onInterest={toggleInterest}
      onApply={applyToEvent}
    />
  )
}
