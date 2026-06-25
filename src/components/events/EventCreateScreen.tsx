import { useState } from 'react'
import type { BeeEvent, EventCategory, ApprovalMode } from '../../types'
import { currentUser } from '../../data/mockUsers'
import { CATEGORY_EMOJI, CATEGORY_LABEL, CATEGORY_COLOR } from './EventListScreen'

const CATEGORIES: EventCategory[] = ['drinking', 'cafe', 'meal', 'play', 'activity', 'night']
const CONDITION_OPTIONS = ['お酒OK', '割り勘', '初参加歓迎', '既婚者OK']

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

export default function EventCreateScreen({
  onBack,
  onPublish,
}: {
  onBack: () => void
  onPublish: (ev: BeeEvent) => void
}) {
  const [step, setStep] = useState(1)
  const [published, setPublished] = useState(false)

  // Step 1
  const [category, setCategory] = useState<EventCategory | ''>('')
  const [title, setTitle] = useState('')

  // Step 2
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('19:00')
  const [endTime, setEndTime] = useState('22:00')
  const [locationType, setLocationType] = useState<'venue' | 'area' | 'host_place'>('venue')
  const [locationName, setLocationName] = useState('')
  const [locationAddress, setLocationAddress] = useState('')
  const [capacity, setCapacity] = useState(8)

  // Step 3
  const [approvalMode, setApprovalMode] = useState<ApprovalMode>('approval')
  const [conditions, setConditions] = useState<string[]>([])

  // Step 4
  const [description, setDescription] = useState('')
  const [notes, setNotes] = useState('')

  // Step 5
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreeContent, setAgreeContent] = useState(false)
  const [visibility, setVisibility] = useState<'public' | 'limited'>('public')

  const today   = new Date().toISOString().slice(0, 10)
  const maxDate = new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10)

  function canNext() {
    if (step === 1) return category !== '' && title.trim().length >= 1
    if (step === 2) {
      if (!startDate || !locationName.trim() || capacity < 2) return false
      if (startDate < today || startDate > maxDate) return false
      return true
    }
    if (step === 3) return true
    if (step === 4) return description.trim().length >= 10
    if (step === 5) return agreeTerms && agreeContent
    return false
  }

  function toggleCondition(c: string) {
    setConditions(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
  }

function handlePublish() {
    const startAt = new Date(`${startDate}T${startTime}:00`).toISOString()
    const endAt   = new Date(`${startDate}T${endTime}:00`).toISOString()
    const newEvent: BeeEvent = {
      id: `evt-${Date.now()}`,
      category: category as EventCategory,
      title: title.trim(),
      description: description.trim(),
      location: {
        type: locationType,
        name: locationName.trim(),
        address: locationType === 'venue' ? locationAddress.trim() : undefined,
        lat: 35.6762, lng: 139.6580,
      },
      startAt, endAt, capacity,
      host: currentUser,
      approvalMode, conditions, tags: [],
      status: 'published',
      interestedCount: 0,
      participants: [currentUser],
      applications: [],
      notes: notes.trim() || undefined,
      visibility,
      createdAt: new Date().toISOString(),
    }
    onPublish(newEvent)
    setPublished(true)
  }

  if (published) {
    return (
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center bg-gray-950 px-8 text-center gap-4">
        <span className="text-6xl">🎉</span>
        <h2 className="text-white font-bold text-xl">イベントを公開しました！</h2>
        <p className="text-gray-400 text-sm">申請が届くと通知でお知らせします。</p>
        <button onClick={onBack} className="mt-4 w-full py-3 rounded-xl bg-amber-400 text-black font-bold text-sm">
          一覧に戻る
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-gray-950">
      {/* ヘッダー */}
      <div className="flex items-center gap-2 px-2 h-14 border-b border-gray-800 flex-shrink-0">
        <button onClick={step === 1 ? onBack : () => setStep(s => s - 1)}
          className="w-10 h-10 flex items-center justify-center text-gray-400">
          <ChevronLeft />
        </button>
        <div className="flex-1">
          <p className="text-amber-400 text-xs font-medium">STEP {step} / 5</p>
          <h1 className="text-white font-bold text-sm">イベント作成</h1>
        </div>
        {/* プログレスバー */}
        <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden mr-2">
          <div className="h-full bg-amber-400 rounded-full transition-all"
            style={{ width: `${(step / 5) * 100}%` }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">

        {/* ── Step 1 ─────────────────────────────────────── */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-white font-bold text-base">カテゴリとタイトル</h2>
            <div>
              <p className="text-gray-500 text-xs mb-3">カテゴリを選択 *</p>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`py-3 rounded-xl flex flex-col items-center gap-1 border-2 transition-colors ${
                      category === cat
                        ? 'border-amber-400 bg-amber-400/10'
                        : 'border-gray-800 bg-gray-900'
                    }`}
                  >
                    <span className="text-2xl">{CATEGORY_EMOJI[cat]}</span>
                    <span className="text-xs text-gray-300">{CATEGORY_LABEL[cat]}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-2">イベント名 * ({title.length}/30)</p>
              <input
                type="text" value={title} onChange={e => setTitle(e.target.value.slice(0, 30))}
                placeholder="例: 金曜の二丁目飲み@AiBar"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400"
              />
            </div>
          </div>
        )}

        {/* ── Step 2 ─────────────────────────────────────── */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-white font-bold text-base">日時・場所・定員</h2>
            <div className="flex gap-3">
              <div className="flex-1">
                <p className="text-gray-500 text-xs mb-2">開催日 *</p>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                  min={today} max={maxDate}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-3 text-sm outline-none focus:border-amber-400" />
                <p className="text-gray-600 text-xs mt-1">今日から7日以内で設定してください</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <p className="text-gray-500 text-xs mb-2">開始時刻</p>
                <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-3 text-sm outline-none focus:border-amber-400" />
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-xs mb-2">終了時刻</p>
                <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-3 text-sm outline-none focus:border-amber-400" />
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-2">場所の種類 *</p>
              {(['venue', 'area', 'host_place'] as const).map(t => (
                <label key={t} className="flex items-center gap-3 py-2 cursor-pointer">
                  <input type="radio" checked={locationType === t} onChange={() => setLocationType(t)}
                    className="accent-amber-400" />
                  <span className="text-gray-300 text-sm">
                    {t === 'venue' ? '店舗・施設（住所公開）' : t === 'area' ? 'エリアのみ（詳細は承認後）' : '主催者宅（承認後に共有）'}
                  </span>
                </label>
              ))}
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-2">{locationType === 'venue' ? '店舗名' : 'エリア名'} *</p>
              <input type="text" value={locationName} onChange={e => setLocationName(e.target.value)}
                placeholder={locationType === 'venue' ? '例: AiBar 新宿' : '例: 渋谷駅周辺'}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400" />
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-2">
                {locationType === 'venue' ? '住所' : '詳細住所'}
              </p>
              <input type="text" value={locationAddress} onChange={e => setLocationAddress(e.target.value)}
                placeholder="例: 東京都渋谷区〇〇1-2-3"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400" />
              {locationType !== 'venue' && (
                <p className="text-amber-400/80 text-xs mt-1">🔒 参加メンバーのみに表示されます</p>
              )}
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-2">定員: {capacity}人</p>
              <input type="range" min={2} max={50} value={capacity} onChange={e => setCapacity(Number(e.target.value))}
                className="w-full accent-amber-400" />
              <div className="flex justify-between text-gray-600 text-xs mt-1">
                <span>2人</span><span>50人</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3 ─────────────────────────────────────── */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-white font-bold text-base">参加条件・申請方式</h2>
            <div>
              <p className="text-gray-500 text-xs mb-2">申請方式 *</p>
              {([
                ['open', '自由参加（誰でも即参加）'],
                ['approval', '承認制（主催者が判断）'],
                ['invite', '招待制'],
              ] as [ApprovalMode, string][]).map(([val, label]) => (
                <label key={val} className="flex items-center gap-3 py-2 cursor-pointer">
                  <input type="radio" checked={approvalMode === val} onChange={() => setApprovalMode(val)}
                    className="accent-amber-400" />
                  <span className="text-gray-300 text-sm">{label}</span>
                  {val === 'approval' && <span className="text-xs text-amber-400">推奨</span>}
                </label>
              ))}
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-2">参加条件（任意、複数選択可）</p>
              <div className="flex flex-wrap gap-2">
                {CONDITION_OPTIONS.map(c => (
                  <button key={c} onClick={() => toggleCondition(c)}
                    className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                      conditions.includes(c)
                        ? 'bg-amber-400 text-black border-amber-400 font-medium'
                        : 'bg-gray-800 text-gray-300 border-gray-600'
                    }`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4 ─────────────────────────────────────── */}
        {step === 4 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-white font-bold text-base">詳細説明</h2>
            <div>
              <p className="text-gray-500 text-xs mb-2">イベント詳細 * ({description.length}/500, 最低10文字)</p>
              <textarea
                value={description} onChange={e => setDescription(e.target.value.slice(0, 500))}
                rows={6} placeholder="イベントの雰囲気、参加者に期待すること、当日の流れなどを書いてください。"
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-amber-400 resize-none"
              />
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-2">カバー画像（任意）</p>
              <div className="w-full h-28 bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl mb-1">📸</p>
                  <p className="text-gray-500 text-xs">実装予定（タップして選択）</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-2">持ち物・注意事項（任意）</p>
              <textarea
                value={notes} onChange={e => setNotes(e.target.value.slice(0, 200))}
                rows={3} maxLength={200}
                placeholder="持ち物、ドレスコード、注意事項など"
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-amber-400 resize-none"
              />
            </div>
          </div>
        )}

        {/* ── Step 5 ─────────────────────────────────────── */}
        {step === 5 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-white font-bold text-base">確認・公開</h2>
            {/* プレビューカード */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="h-1.5" style={{ backgroundColor: category ? CATEGORY_COLOR[category as EventCategory] : '#6b7280' }} />
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{category ? CATEGORY_EMOJI[category as EventCategory] : '📅'}</span>
                  <div>
                    <p className="text-white font-semibold text-sm">{title || 'イベント名未入力'}</p>
                    <p className="text-gray-500 text-xs mt-0.5">📍 {locationName || '場所未設定'}</p>
                    <p className="text-gray-500 text-xs mt-0.5">🕘 {startDate ? `${startDate} ${startTime}〜${endTime}` : '日時未設定'}</p>
                    <p className="text-gray-400 text-xs mt-0.5">👥 定員{capacity}人</p>
                  </div>
                </div>
                {description && (
                  <p className="text-gray-400 text-xs mt-3 line-clamp-2">{description}</p>
                )}
              </div>
            </div>

            <div>
              <p className="text-gray-500 text-xs mb-2">公開設定</p>
              {([['public', '公開（全員に表示）'], ['limited', '限定公開']] as const).map(([val, label]) => (
                <label key={val} className="flex items-center gap-3 py-2 cursor-pointer">
                  <input type="radio" checked={visibility === val} onChange={() => setVisibility(val)}
                    className="accent-amber-400" />
                  <span className="text-gray-300 text-sm">{label}</span>
                </label>
              ))}
            </div>

            <div className="bg-gray-900 rounded-xl px-4 py-4 flex flex-col gap-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)}
                  className="w-5 h-5 accent-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">利用規約に同意します</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={agreeContent} onChange={e => setAgreeContent(e.target.checked)}
                  className="w-5 h-5 accent-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">違法行為・公序良俗に反するイベントではないことを誓約します</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 下部ボタン */}
      <div className="px-5 py-4 border-t border-gray-800 flex-shrink-0"
        style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
        {step < 5 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canNext()}
            className="w-full py-3.5 rounded-xl bg-amber-400 text-black font-bold text-sm disabled:opacity-40"
          >
            次へ →
          </button>
        ) : (
          <button
            onClick={handlePublish}
            disabled={!canNext()}
            className="w-full py-3.5 rounded-xl bg-amber-400 text-black font-bold text-sm disabled:opacity-40"
          >
            公開する 🎉
          </button>
        )}
      </div>
    </div>
  )
}
