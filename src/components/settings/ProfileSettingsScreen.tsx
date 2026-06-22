import { useState, useRef, useEffect } from 'react'
import type { User } from '../../types'
import { currentUser } from '../../data/mockUsers'
import DrumRollPicker from '../ui/DrumRollPicker'

interface Props {
  onBack: () => void
}

type Sexuality = NonNullable<User['sexuality']>
type Position  = NonNullable<User['position']>
type LookingFor = NonNullable<User['lookingFor']>[number]

const sexualityOptions: { value: Sexuality; label: string }[] = [
  { value: 'gay',             label: 'ゲイ' },
  { value: 'bi',              label: 'バイ' },
  { value: 'straight-leaning', label: 'ノンケ寄り' },
  { value: 'trans',           label: 'トランス' },
]

const positionOptions: { value: Position; label: string }[] = [
  { value: 'tachi',   label: 'タチ' },
  { value: 'uke',     label: 'ウケ' },
  { value: 'riba',    label: 'リバ' },
  { value: 'vanilla', label: 'バニラ' },
  { value: 'unknown', label: 'ポジション不明' },
]

const lookingForOptions: { value: LookingFor; label: string }[] = [
  { value: 'friends', label: '友だち募集' },
  { value: 'romance', label: '恋人募集' },
  { value: 'other',   label: 'その他募集' },
]

const HEIGHTS = Array.from({ length: 81 },  (_, i) => 140 + i)
const WEIGHTS = Array.from({ length: 111 }, (_, i) => 40 + i)
const AGES    = Array.from({ length: 63 },  (_, i) => 18 + i)

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function SectionLabel({ label }: { label: string }) {
  return <p className="text-gray-500 text-xs font-medium px-4 pt-6 pb-2">{label}</p>
}

export default function ProfileSettingsScreen({ onBack }: Props) {
  const [photos, setPhotos]       = useState<string[]>(currentUser.photos.slice(0, 4).concat(Array(4).fill('')).slice(0, 4))
  const [name, setName]           = useState(currentUser.name)
  const [height, setHeight]       = useState(currentUser.height ?? 170)
  const [weight, setWeight]       = useState(currentUser.weight ?? 65)
  const [age, setAge]             = useState(currentUser.age)
  const [bio, setBio]             = useState(currentUser.bio)
  const [sexuality, setSexuality] = useState<Sexuality | ''>(currentUser.sexuality ?? '')
  const [position, setPosition]   = useState<Position | ''>(currentUser.position ?? '')
  const [lookingFor, setLookingFor] = useState<LookingFor[]>((currentUser.lookingFor ?? []) as LookingFor[])
  const [saved, setSaved]         = useState(false)

  const fileRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  function handlePhotoChange(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const url = ev.target?.result as string
      setPhotos(prev => {
        const next = [...prev]
        next[index] = url
        return next
      })
    }
    reader.readAsDataURL(file)
  }

  function toggleLookingFor(val: LookingFor) {
    setLookingFor(prev =>
      prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
    )
  }

  function handleSave() {
    setSaved(true)
  }

  useEffect(() => {
    if (!saved) return
    const t = setTimeout(() => setSaved(false), 2000)
    return () => clearTimeout(t)
  }, [saved])

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-gray-950">
      {/* ヘッダー */}
      <div className="flex items-center gap-2 px-2 h-14 border-b border-gray-800 flex-shrink-0">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center text-gray-400">
          <ChevronLeft />
        </button>
        <h1 className="text-white font-bold text-base">プロフィール設定</h1>
      </div>

      {/* スクロールコンテンツ */}
      <div className="flex-1 overflow-y-auto pb-28">

        {/* 写真設定 */}
        <SectionLabel label="写真設定" />
        <div className="border-t border-gray-800 px-4 py-4">
          <div className="flex gap-3 items-end">
            {/* メイン写真（大） */}
            <button
              onClick={() => fileRefs[0].current?.click()}
              className="w-24 h-24 rounded-xl bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden flex-shrink-0 active:opacity-70"
            >
              {photos[0] ? (
                <img src={photos[0]} alt="main" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl">📷</span>
              )}
            </button>
            {/* サブ写真 3枚（小） */}
            <div className="flex gap-2">
              {[1, 2, 3].map(i => (
                <button
                  key={i}
                  onClick={() => fileRefs[i].current?.click()}
                  className="w-16 h-16 rounded-xl bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden active:opacity-70"
                >
                  {photos[i] ? (
                    <img src={photos[i]} alt={`photo-${i}`} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg">📷</span>
                  )}
                </button>
              ))}
            </div>
          </div>
          <p className="text-gray-600 text-xs mt-2">タップして写真を変更</p>
          {fileRefs.map((ref, i) => (
            <input key={i} ref={ref} type="file" accept="image/*" className="hidden"
              onChange={e => handlePhotoChange(i, e)} />
          ))}
        </div>

        {/* アカウント名 */}
        <SectionLabel label="アカウント名" />
        <div className="border-t border-gray-800 px-4 py-4">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="表示名を入力"
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        {/* 基本情報 */}
        <SectionLabel label="基本情報" />
        <div className="border-t border-gray-800 px-4 py-2">
          <div className="grid grid-cols-3 text-center mb-1">
            <span className="text-gray-400 text-xs">身長</span>
            <span className="text-gray-400 text-xs">体重</span>
            <span className="text-gray-400 text-xs">年齢</span>
          </div>
          <div className="bg-gray-800 rounded-2xl overflow-hidden grid grid-cols-3 divide-x divide-gray-700">
            <DrumRollPicker values={HEIGHTS} selected={height} onChange={setHeight} unit="cm" />
            <DrumRollPicker values={WEIGHTS} selected={weight} onChange={setWeight} unit="kg" />
            <DrumRollPicker values={AGES}    selected={age}    onChange={setAge}    unit="歳" />
          </div>
        </div>

        {/* 自己紹介文 */}
        <SectionLabel label="自己紹介文" />
        <div className="border-t border-gray-800 px-4 py-4">
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            maxLength={200}
            rows={4}
            placeholder="自分についてを書いてみよう"
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors resize-none"
          />
          <p className="text-gray-600 text-xs text-right mt-1">{bio.length} / 200</p>
        </div>

        {/* セクシュアリティ */}
        <SectionLabel label="セクシュアリティ" />
        <div className="border-t border-gray-800 px-4 py-4">
          <div className="flex flex-wrap gap-2">
            {sexualityOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setSexuality(opt.value)}
                className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                  sexuality === opt.value
                    ? 'bg-amber-400 text-black border-amber-400 font-medium'
                    : 'bg-gray-800 text-gray-300 border-gray-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ポジション */}
        <SectionLabel label="ポジション" />
        <div className="border-t border-gray-800 px-4 py-4">
          <div className="flex flex-wrap gap-2">
            {positionOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setPosition(opt.value)}
                className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                  position === opt.value
                    ? 'bg-amber-400 text-black border-amber-400 font-medium'
                    : 'bg-gray-800 text-gray-300 border-gray-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 目的 */}
        <SectionLabel label="目的（複数選択可）" />
        <div className="border-t border-gray-800 px-4 py-4">
          <div className="flex flex-wrap gap-2">
            {lookingForOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => toggleLookingFor(opt.value)}
                className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                  lookingFor.includes(opt.value)
                    ? 'bg-amber-400 text-black border-amber-400 font-medium'
                    : 'bg-gray-800 text-gray-300 border-gray-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 保存ボタン（sticky bottom） */}
      <div className="sticky bottom-0 bg-gray-950 border-t border-gray-800 px-4 py-4"
        style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
      >
        {saved && (
          <p className="text-green-400 text-sm text-center mb-2 font-medium">保存しました！</p>
        )}
        <button
          onClick={handleSave}
          className="w-full bg-amber-400 text-black font-bold rounded-xl py-3 text-sm active:opacity-80 transition-opacity"
        >
          保存する
        </button>
      </div>
    </div>
  )
}
