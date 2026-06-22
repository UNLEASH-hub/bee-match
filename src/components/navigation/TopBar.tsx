interface Props {
  onMenuOpen: () => void
}

export default function TopBar({ onMenuOpen }: Props) {
  return (
    <header className="h-14 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-4 flex-shrink-0">
      {/* ロゴ */}
      <div className="flex items-center gap-2">
        <span className="text-2xl leading-none">🐝</span>
        <span className="text-white font-bold text-lg tracking-tight">BeeMatch</span>
      </div>

      {/* ハンバーガーメニュー */}
      <button
        onClick={onMenuOpen}
        className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl active:bg-gray-800 transition-colors"
        aria-label="メニューを開く"
      >
        <span className="w-5 h-0.5 bg-gray-300 rounded-full block" />
        <span className="w-5 h-0.5 bg-gray-300 rounded-full block" />
        <span className="w-5 h-0.5 bg-gray-300 rounded-full block" />
      </button>
    </header>
  )
}
