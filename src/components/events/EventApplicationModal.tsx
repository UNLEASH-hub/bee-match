import { useState } from 'react'
import type { BeeEvent } from '../../types'

export default function EventApplicationModal({
  event,
  onClose,
  onApply,
}: {
  event: BeeEvent
  onClose: () => void
  onApply: (message: string) => void
}) {
  const [message, setMessage] = useState('')
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [submitted, setSubmitted] = useState(false)

  const allChecked = event.conditions.length === 0
    || event.conditions.every(c => checked[c])

  function handleApply() {
    if (!allChecked) return
    onApply(message)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-8">
        <div className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-8 flex flex-col items-center gap-4 text-center">
          <span className="text-5xl">✅</span>
          <h3 className="text-white font-bold text-lg">申請しました！</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            主催者が承認すると、<br />参加確定の通知が届きます。<br />通常24時間以内に返事があります。
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-amber-400 text-black font-bold text-sm mt-2"
          >
            閉じる
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-end"
      onClick={onClose}
    >
      <div
        className="w-full bg-gray-900 rounded-t-2xl px-5 py-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-base">参加申請</h3>
          <button onClick={onClose} className="text-gray-500 text-xl w-8 h-8 flex items-center justify-center">✕</button>
        </div>

        <div className="bg-gray-800 rounded-xl px-4 py-3 mb-4">
          <p className="text-white text-sm font-medium">{event.title}</p>
          <p className="text-gray-500 text-xs mt-0.5">主催: {event.host.name}</p>
        </div>

        {/* メッセージ入力 */}
        <div className="mb-4">
          <p className="text-gray-500 text-xs mb-2">主催者へのメッセージ（任意）</p>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            maxLength={200}
            rows={3}
            placeholder="主催者へのメッセージ（任意）"
            className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-amber-400 resize-none placeholder-gray-600"
          />
          <p className="text-gray-600 text-xs text-right mt-1">{message.length}/200</p>
        </div>

        {/* 参加条件チェック */}
        {event.conditions.length > 0 && (
          <div className="mb-4">
            <p className="text-gray-500 text-xs mb-2">参加条件の確認（全てチェック必須）</p>
            {event.conditions.map(c => (
              <label key={c} className="flex items-center gap-3 py-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!checked[c]}
                  onChange={e => setChecked(prev => ({ ...prev, [c]: e.target.checked }))}
                  className="w-5 h-5 accent-amber-400 flex-shrink-0"
                />
                <span className="text-gray-300 text-sm">{c}</span>
              </label>
            ))}
          </div>
        )}

        {/* 注意事項 */}
        <div className="bg-gray-800/50 rounded-xl px-4 py-3 mb-5 space-y-1">
          {['主催者が承認すると参加確定です', 'キャンセルは24時間前まで可能です'].map(t => (
            <p key={t} className="text-gray-600 text-xs">• {t}</p>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-gray-800 text-gray-300 text-sm font-medium"
          >
            キャンセル
          </button>
          <button
            onClick={handleApply}
            disabled={!allChecked}
            className="flex-1 py-3 rounded-xl bg-amber-400 text-black text-sm font-bold disabled:opacity-40"
          >
            申請する
          </button>
        </div>
      </div>
    </div>
  )
}
