function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-600">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

interface Props {
  onBack: () => void
}

export default function SupportScreen({ onBack }: Props) {
  return (
    <div className="flex-1 min-h-0 flex flex-col bg-gray-950">
      <div className="flex items-center gap-2 px-2 h-14 border-b border-gray-800 flex-shrink-0">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center text-gray-400">
          <ChevronLeft />
        </button>
        <h1 className="text-white font-bold text-base">サポート</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="border-t border-gray-800 mt-4">
          {['お問い合わせ', '利用規約', 'プライバシーポリシー'].map(label => (
            <button
              key={label}
              className="w-full flex items-center justify-between px-4 py-4 border-b border-gray-800 active:bg-gray-900 transition-colors"
            >
              <span className="text-white text-sm">{label}</span>
              <ChevronRight />
            </button>
          ))}
          <button className="w-full flex items-center justify-between px-4 py-4 border-b border-gray-800 active:bg-gray-900 transition-colors">
            <span className="text-red-400 text-sm">退会</span>
          </button>
        </div>
      </div>
    </div>
  )
}
