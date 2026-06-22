import { useState } from 'react'
import type { RegisterData } from '../../types'

interface Props {
  data: RegisterData
  onChange: (data: Partial<RegisterData>) => void
  onNext: () => void
  onBack: () => void
}

const DEMO_CODE = '123456'

export default function RegisterStep2({ data, onChange, onNext, onBack }: Props) {
  const [phone, setPhone] = useState(data.phone)
  const [codeSent, setCodeSent] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  function handleSendCode() {
    setError('')
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      return setError('正しい電話番号を入力してください')
    }
    setCodeSent(true)
  }

  function handleVerify() {
    setError('')
    if (code !== DEMO_CODE) {
      return setError('認証コードが正しくありません')
    }
    onChange({ phone })
    onNext()
  }

  return (
    <div className="flex-1 min-h-0 bg-gray-950 flex flex-col px-6 py-8 overflow-y-auto">
      <div className="w-full max-w-sm mx-auto">

        <button onClick={onBack} className="text-gray-400 text-sm mb-6">← 戻る</button>
        <div className="mb-6">
          <div className="text-xs text-amber-400 font-medium mb-1">STEP 2 / 3</div>
          <h2 className="text-2xl font-bold text-white">電話番号認証</h2>
          <p className="text-gray-400 text-sm mt-1">重複登録防止のため、電話番号での認証が必要です</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">電話番号</label>
            <div className="flex gap-2">
              <div className="bg-gray-800 border border-gray-700 text-gray-400 rounded-xl px-4 py-3 text-sm flex-shrink-0">
                +81
              </div>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="09012345678"
                disabled={codeSent}
                className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          {!codeSent ? (
            <button
              onClick={handleSendCode}
              className="w-full bg-amber-400 text-black font-bold rounded-xl py-3 text-sm active:opacity-80 transition-opacity"
            >
              認証コードを送る
            </button>
          ) : (
            <>
              <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl px-4 py-3">
                <p className="text-amber-400 text-xs font-medium">デモ用</p>
                <p className="text-amber-300 text-sm mt-0.5">認証コード: <strong>123456</strong> を入力してください</p>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">認証コード（6桁）</label>
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors text-center text-lg tracking-widest"
                />
              </div>

              <button
                onClick={handleVerify}
                className="w-full bg-amber-400 text-black font-bold rounded-xl py-3 text-sm active:opacity-80 transition-opacity"
              >
                認証する
              </button>

              <button
                onClick={() => { setCodeSent(false); setCode('') }}
                className="w-full text-gray-400 text-sm py-2"
              >
                電話番号を変更する
              </button>
            </>
          )}

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 rounded-xl px-4 py-3">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
}
