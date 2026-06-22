import { useState } from 'react'
import type { RegisterData } from '../../types'

interface Props {
  data: RegisterData
  onChange: (data: Partial<RegisterData>) => void
  onNext: () => void
  onBack: () => void
}

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 82 }, (_, i) => currentYear - 18 - i)
const months = Array.from({ length: 12 }, (_, i) => i + 1)
const days = Array.from({ length: 31 }, (_, i) => i + 1)

function calcAge(birthday: string): number | null {
  if (!birthday) return null
  const birth = new Date(birthday)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

export default function RegisterStep1({ data, onChange, onNext, onBack }: Props) {
  const [email, setEmail] = useState(data.email)
  const [emailConfirm, setEmailConfirm] = useState('')
  const [password, setPassword] = useState(data.password)
  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')
  const [ageCheck, setAgeCheck] = useState(false)
  const [error, setError] = useState('')

  function handleNext() {
    setError('')

    if (!email) return setError('メールアドレスを入力してください')
    if (email !== emailConfirm) return setError('メールアドレスが一致しません')
    if (!year || !month || !day) return setError('生年月日を入力してください')

    const birthday = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const age = calcAge(birthday)
    if (age === null || age < 18) return setError('18歳以上の方のみご利用いただけます')
    if (!ageCheck) return setError('「18歳以上です」にチェックを入れてください')

    onChange({ email, password, birthday })
    onNext()
  }

  return (
    <div className="flex-1 min-h-0 bg-gray-950 flex flex-col px-6 py-8 overflow-y-auto">
      <div className="w-full max-w-sm mx-auto">

        {/* ヘッダー */}
        <button onClick={onBack} className="text-gray-400 text-sm mb-6">← 戻る</button>
        <div className="mb-6">
          <div className="text-xs text-amber-400 font-medium mb-1">STEP 1 / 3</div>
          <h2 className="text-2xl font-bold text-white">アカウント作成</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">メールアドレス（確認）</label>
            <input
              type="email"
              value={emailConfirm}
              onChange={e => setEmailConfirm(e.target.value)}
              placeholder="もう一度入力してください"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">パスワード（任意）</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="6文字以上"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">生年月日</label>
            <div className="flex gap-2">
              <select
                value={year}
                onChange={e => setYear(e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-3 text-sm outline-none focus:border-amber-400"
              >
                <option value="">年</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <select
                value={month}
                onChange={e => setMonth(e.target.value)}
                className="w-20 bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-3 text-sm outline-none focus:border-amber-400"
              >
                <option value="">月</option>
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select
                value={day}
                onChange={e => setDay(e.target.value)}
                className="w-20 bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-3 text-sm outline-none focus:border-amber-400"
              >
                <option value="">日</option>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setAgeCheck(!ageCheck)}
              className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                ageCheck ? 'bg-amber-400 border-amber-400' : 'border-gray-600'
              }`}
            >
              {ageCheck && <span className="text-black text-sm font-bold">✓</span>}
            </div>
            <span className="text-gray-300 text-sm">私は18歳以上です</span>
          </label>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 rounded-xl px-4 py-3">{error}</p>
          )}

          <button
            onClick={handleNext}
            className="w-full bg-amber-400 text-black font-bold rounded-xl py-3 text-sm mt-2 active:opacity-80 transition-opacity"
          >
            次へ
          </button>
        </div>
      </div>
    </div>
  )
}
