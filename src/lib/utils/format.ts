export function formatTime(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60)    return 'たった今'
  if (diff < 3600)  return `${Math.floor(diff / 60)}分前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}時間前`
  return `${Math.floor(diff / 86400)}日前`
}

export function formatEventDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1)
  const isTomorrow = d.toDateString() === tomorrow.toDateString()
  const mm = d.getMonth() + 1
  const dd = d.getDate()
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  const day = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()]
  if (isToday)    return `今夜 ${hh}:${min}`
  if (isTomorrow) return `明日(${day}) ${hh}:${min}`
  return `${mm}/${dd}(${day}) ${hh}:${min}`
}

export function formatEventDateRange(startIso: string, endIso: string): string {
  const e = new Date(endIso)
  const startStr = formatEventDate(startIso)
  const endHH = String(e.getHours()).padStart(2, '0')
  const endMin = String(e.getMinutes()).padStart(2, '0')
  return `${startStr} 〜 ${endHH}:${endMin}`
}
