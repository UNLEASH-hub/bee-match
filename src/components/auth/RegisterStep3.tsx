import { useState, useRef } from 'react'
import type { RegisterData, User } from '../../types'
import DrumRollPicker from '../ui/DrumRollPicker'

interface Props {
  data: RegisterData
  onComplete: (user: User) => void
  onBack: () => void
}

type Sexuality = 'gay' | 'bi' | 'straight-leaning' | 'trans'
type Position = 'tachi' | 'uke' | 'riba' | 'vanilla' | 'unknown'
type LookingFor = 'friends' | 'romance' | 'other'

const sexualityOptions: { value: Sexuality; label: string }[] = [
  { value: 'gay', label: 'ゲイ' },
  { value: 'bi', label: 'バイ' },
  { value: 'straight-leaning', label: 'ノンケ寄り' },
  { value: 'trans', label: 'トランス' },
]

const positionOptions: { value: Position; label: string }[] = [
  { value: 'tachi', label: 'タチ' },
  { value: 'uke', label: 'ウケ' },
  { value: 'riba', label: 'リバ' },
  { value: 'vanilla', label: 'バニラ' },
  { value: 'unknown', label: 'ポジション不明' },
]

const lookingForOptions: { value: LookingFor; label: string }[] = [
  { value: 'friends', label: '友だち募集' },
  { value: 'romance', label: '恋人募集' },
  { value: 'other', label: 'その他募集' },
]

const HEIGHTS = Array.from({ length: 81 }, (_, i) => 140 + i) // 140〜220
const WEIGHTS = Array.from({ length: 111 }, (_, i) => 40 + i)  // 40〜150
const AGES    = Array.from({ length: 63 }, (_, i) => 18 + i)   // 18〜80

function calcAge(birthday: string): number {
  if (!birthday) return 25
  const birth = new Date(birthday)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return Math.max(18, Math.min(age, 80))
}

export default function RegisterStep3({ data, onComplete, onBack }: Props) {
  const [avatarUrl, setAvatarUrl] = useState(data.avatarUrl)
  const [name, setName] = useState(data.name)
  const [height, setHeight] = useState(data.height ? Number(data.height) : 170)
  const [weight, setWeight] = useState(data.weight ? Number(data.weight) : 65)
  const [age, setAge] = useState(calcAge(data.birthday))
  const [sexuality, setSexuality] = useState<Sexuality | ''>(data.sexuality as Sexuality || '')
  const [position, setPosition] = useState<Position | ''>(data.position as Position || '')
  const [lookingFor, setLookingFor] = useState<LookingFor[]>(data.lookingFor as LookingFor[] || [])
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setAvatarUrl(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  function toggleLookingFor(val: LookingFor) {
    setLookingFor(prev =>
      prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
    )
  }

  function handleComplete() {
    setError('')
    if (!name.trim()) return setError('ユーザー名を入力してください')
    if (!sexuality) return setError('セクシャリティを選択してください')
    if (!position) return setError('ポジションを選択してください')
    if (lookingFor.length === 0) return setError('募集内容を1つ以上選択してください')

    const user: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      age,
      bio: '',
      avatarUrl: avatarUrl || `https://i.pravatar.cc/150?u=${data.email}`,
      photos: avatarUrl ? [avatarUrl] : [],
      location: { lat: 35.6812, lng: 139.7671 },
      isOnline: true,
      height,
      weight,
      sexuality,
      position,
      lookingFor,
      phone: data.phone,
    }
    onComplete(user)
  }

  return (
    <div className="flex-1 min-h-0 bg-gray-950 flex flex-col px-6 py-8 overflow-y-auto">
      <div className="w-full max-w-sm mx-auto">

        <button onClick={onBack} className="text-gray-400 text-sm mb-6">← 戻る</button>
        <div className="mb-6">
          <div className="text-xs text-amber-400 font-medium mb-1">STEP 3 / 3</div>
          <h2 className="text-2xl font-bold text-white">プロフィール設定</h2>
        </div>

        <div className="space-y-6">

          {/* プロフィール写真 */}
          <div className="flex flex-col items-center">
            <div
              onClick={() => fileRef.current?.click()}
              className="w-24 h-24 rounded-full bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden cursor-pointer hover:border-amber-400 transition-colors"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">📷</span>
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="text-amber-400 text-sm mt-2"
            >
              写真を選択
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </div>

          {/* ユーザー名 */}
          <div>
            <label className="block text-gray-400 text-sm mb-1">ユーザー名 <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="表示名を入力"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* 身長・体重・年齢 ドラムロール */}
          <div>
            <div className="grid grid-cols-3 text-center mb-1">
              <span className="text-gray-400 text-xs">身長</span>
              <span className="text-gray-400 text-xs">体重</span>
              <span className="text-gray-400 text-xs">年齢</span>
            </div>
            <div className="bg-gray-800 rounded-2xl overflow-hidden grid grid-cols-3 divide-x divide-gray-700">
              <DrumRollPicker values={HEIGHTS} selected={height} onChange={v => setHeight(v)} unit="cm" />
              <DrumRollPicker values={WEIGHTS} selected={weight} onChange={v => setWeight(v)} unit="kg" />
              <DrumRollPicker values={AGES}    selected={age}    onChange={v => setAge(v)}    unit="歳" />
            </div>
          </div>

          {/* セクシャリティ */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">セクシャリティ <span className="text-red-400">*</span></label>
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
          <div>
            <label className="block text-gray-400 text-sm mb-2">ポジション <span className="text-red-400">*</span></label>
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

          {/* 募集内容 */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">募集内容 <span className="text-red-400">*</span>（複数選択可）</label>
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

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 rounded-xl px-4 py-3">{error}</p>
          )}

          <button
            onClick={handleComplete}
            className="w-full bg-amber-400 text-black font-bold rounded-xl py-3 text-sm active:opacity-80 transition-opacity"
          >
            登録完了
          </button>
        </div>
      </div>
    </div>
  )
}
