import { useState } from 'react'
import type { BeeEvent, EventCategory, ApprovalMode } from '../../types'
import { currentUser } from '../../data/mockUsers'
import { CATEGORY_EMOJI, CATEGORY_LABEL, CATEGORY_COLOR } from './EventListScreen'

const CATEGORIES: EventCategory[] = ['drinking', 'cafe', 'meal', 'play', 'activity', 'night']

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

  // Step 1: 基本情報
  const [category, setCategory] = useState<EventCategory | ''>('')
  const [title, setTitle] = useState('')
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('19:00')
  const [endTime, setEndTime] = useState('22:00')
  const [description, setDescription] = useState('')
  const [capacity, setCapacity] = useState(8)

  // Step 2: 場所・詳細
  const [locationType, setLocationType] = useState<'venue' | 'area'>('venue')
  const [locationName, setLocationName] = useState('')
  const [locationAddress, setLocationAddress] = useState('')
  const [approvalMode, setApprovalMode] = useState<ApprovalMode>('approval')
  const [notes, setNotes] = useState('')

  // Step 3: カバー画像
  const [coverImage, setCoverImage] = useState('')

  const today   = new Date().toISOString().slice(0, 10)
  const maxDate = new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10)

  function canNext() {
    if (step === 1) {
      if (!category || !title.trim()) return false
      if (!startDate || startDate < today || startDate > maxDate) return false
      if (description.trim().length < 10) return false
      if (capacity < 2) return false
      return true
    }
    if (step === 2) return locationName.trim().length >= 1
    if (step === 3) return true
    return false
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
        address: locationAddress.trim() || undefined,
        lat: 35.6762, lng: 139.6580,
      },
      startAt, endAt, capacity,
      host: currentUser,
      approvalMode, conditions: [], tags: [],
      status: 'published',
      interestedCount: 0,
      participants: [currentUser],
      applications: [],
      notes: notes.trim() || undefined,
      coverImage: coverImage.trim() || undefined,
      visibility: 'public',
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
          <p className="text-amber-400 text-xs font-medium">STEP {step} / 3</p>
          <h1 className="text-white font-bold text-sm">イベント作成</h1>
        </div>
        <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden mr-2">
          <div className="h-full bg-amber-400 rounded-full transition-all"
            style={{ width: `${(step / 3) * 100}%` }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">

        {/* ── Step 1: 基本情報 ─────────────────────────────── */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-white font-bold text-base">基本情報</h2>

            {/* カテゴリ */}
            <div>
              <p className="text-gray-500 text-xs mb-3">カテゴリ *</p>
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

            {/* タイトル */}
            <div>
              <p className="text-gray-500 text-xs mb-2">タイトル * ({title.length}/30)</p>
              <input
                type="text" value={title} onChange={e => setTitle(e.target.value.slice(0, 30))}
                placeholder="例: 金曜の二丁目飲み@AiBar"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400"
              />
            </div>

            {/* 日付 */}
            <div>
              <p className="text-gray-500 text-xs mb-2">開催日 *</p>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                min={today} max={maxDate}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-3 text-sm outline-none focus:border-amber-400" />
              <p className="text-gray-600 text-xs mt-1">今日から7日以内で設定してください</p>
            </div>

            {/* 時間 */}
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

            {/* 説明 */}
            <div>
              <p className="text-gray-500 text-xs mb-2">説明 * ({description.length}/500、最低10文字)</p>
              <textarea
                value={description} onChange={e => setDescription(e.target.value.slice(0, 500))}
                rows={5} placeholder="イベントの雰囲気、参加者に期待すること、当日の流れなどを書いてください。"
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-amber-400 resize-none"
              />
            </div>

            {/* 定員 */}
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

        {/* ── Step 2: 場所・詳細 ──────────────────────────── */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-white font-bold text-base">場所・詳細</h2>

            {/* 申請方式 */}
            <div>
              <p className="text-gray-500 text-xs mb-2">申請方式 *</p>
              {([
                ['open', '自由参加（誰でも即参加）'],
                ['approval', '承認制（主催者が判断）'],
              ] as [ApprovalMode, string][]).map(([val, label]) => (
                <label key={val} className="flex items-center gap-3 py-2 cursor-pointer">
                  <input type="radio" checked={approvalMode === val} onChange={() => setApprovalMode(val)}
                    className="accent-amber-400" />
                  <span className="text-gray-300 text-sm">{label}</span>
                  {val === 'approval' && <span className="text-xs text-amber-400">推奨</span>}
                </label>
              ))}
            </div>

            {/* 場所の種類 */}
            <div>
              <p className="text-gray-500 text-xs mb-2">場所の種類 *</p>
              {(['venue', 'area'] as const).map(t => (
                <label key={t} className="flex items-center gap-3 py-2 cursor-pointer">
                  <input type="radio" checked={locationType === t} onChange={() => setLocationType(t)}
                    className="accent-amber-400" />
                  <span className="text-gray-300 text-sm">
                    {t === 'venue' ? '店舗・施設（住所公開）' : 'エリアのみ（詳細は承認後）'}
                  </span>
                </label>
              ))}
            </div>

            {/* エリア名 / 店舗名 */}
            <div>
              <p className="text-gray-500 text-xs mb-2">{locationType === 'venue' ? '店舗名' : 'エリア名'} *</p>
              <input type="text" value={locationName} onChange={e => setLocationName(e.target.value)}
                placeholder={locationType === 'venue' ? '例: AiBar 新宿' : '例: 渋谷駅周辺'}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400" />
            </div>

            {/* 住所 */}
            <div>
              <p className="text-gray-500 text-xs mb-2">住所</p>
              <input type="text" value={locationAddress} onChange={e => setLocationAddress(e.target.value)}
                placeholder="例: 東京都渋谷区〇〇1-2-3"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400" />
              {locationType !== 'venue' && (
                <p className="text-amber-400/80 text-xs mt-1">🔒 参加承認後のメンバーのみに表示されます</p>
              )}
            </div>

            {/* 持ち物・注意事項・備考（承認後公開） */}
            <div>
              <p className="text-gray-500 text-xs mb-2">持ち物・注意事項・備考（任意）</p>
              <textarea
                value={notes} onChange={e => setNotes(e.target.value.slice(0, 200))}
                rows={3} maxLength={200}
                placeholder="持ち物、ドレスコード、注意事項など"
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-amber-400 resize-none"
              />
              <p className="text-amber-400/80 text-xs mt-1">🔒 参加承認後のメンバーのみに表示されます</p>
            </div>
          </div>
        )}

        {/* ── Step 3: カバー画像 ───────────────────────────── */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-white font-bold text-base">カバー画像（任意）</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              イベントのカバー画像を設定できます。<br />
              設定しなくてもカテゴリアイコンが自動で表示されるのでOKです。
            </p>

            <div>
              <p className="text-gray-500 text-xs mb-2">画像URL</p>
              <input
                type="url" value={coverImage} onChange={e => setCoverImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400"
              />
            </div>

            {coverImage.trim() ? (
              <img
                src={coverImage.trim()}
                alt="カバー画像プレビュー"
                className="w-full h-36 object-cover rounded-xl"
                onError={e => (e.currentTarget.style.display = 'none')}
              />
            ) : (
              <div
                className="w-full h-36 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: category ? CATEGORY_COLOR[category as EventCategory] + '33' : '#1f2937' }}
              >
                <span className="text-6xl">{category ? CATEGORY_EMOJI[category as EventCategory] : '📅'}</span>
              </div>
            )}

            <p className="text-gray-600 text-xs text-center">↑ 画像なしの場合のデフォルト表示</p>
          </div>
        )}
      </div>

      {/* 下部ボタン */}
      <div className="px-5 py-4 border-t border-gray-800 flex-shrink-0"
        style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
        {step < 3 ? (
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
            className="w-full py-3.5 rounded-xl bg-amber-400 text-black font-bold text-sm"
          >
            公開する 🎉
          </button>
        )}
      </div>
    </div>
  )
}
