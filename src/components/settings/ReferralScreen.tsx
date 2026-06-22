function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

interface Props {
  onBack: () => void
}

export default function ReferralScreen({ onBack }: Props) {
  return (
    <div className="flex-1 min-h-0 flex flex-col bg-gray-950">
      <div className="flex items-center gap-2 px-2 h-14 border-b border-gray-800 flex-shrink-0">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center text-gray-400">
          <ChevronLeft />
        </button>
        <h1 className="text-white font-bold text-base">友だち紹介コード</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <span className="text-gray-600 text-5xl">🎁</span>
        <p className="text-gray-400 font-medium">友だち紹介コード</p>
        <p className="text-gray-600 text-sm">近日実装予定</p>
      </div>
    </div>
  )
}
