import { useRef, useEffect } from 'react'

interface Props {
  values: number[]
  selected: number
  onChange: (value: number) => void
  unit?: string
}

const ITEM_H = 44
const VISIBLE = 5
const PAD = Math.floor(VISIBLE / 2) * ITEM_H  // 88px — centers first/last items

export default function DrumRollPicker({ values, selected, onChange, unit }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Scroll to initial selected value on mount only
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const idx = values.indexOf(selected)
    if (idx >= 0) {
      el.scrollTop = idx * ITEM_H
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleScroll() {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const el = scrollRef.current
      if (!el) return
      const idx = Math.round(el.scrollTop / ITEM_H)
      const clamped = Math.max(0, Math.min(idx, values.length - 1))
      if (values[clamped] !== selected) {
        onChange(values[clamped])
      }
    }, 80)
  }

  return (
    <div className="relative overflow-hidden" style={{ height: VISIBLE * ITEM_H }}>

      {/* 選択ゾーンのハイライト */}
      <div
        className="absolute inset-x-0 pointer-events-none border-t border-b border-amber-400/40 bg-amber-400/10 z-10"
        style={{ top: PAD, height: ITEM_H }}
      />

      {/* スクロール本体 */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-full overflow-y-scroll scrollbar-hide"
        style={{ scrollSnapType: 'y mandatory', scrollbarWidth: 'none' } as React.CSSProperties}
      >
        <div style={{ height: PAD }} />

        {values.map(val => (
          <div
            key={val}
            style={{ height: ITEM_H, scrollSnapAlign: 'center' } as React.CSSProperties}
            className={`flex items-center justify-center select-none transition-colors ${
              val === selected
                ? 'text-white font-semibold text-xl'
                : 'text-gray-500 text-base'
            }`}
          >
            <span>{val}</span>
            {unit && <span className="text-xs ml-0.5 opacity-70">{unit}</span>}
          </div>
        ))}

        <div style={{ height: PAD }} />
      </div>

      {/* 上フェード */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none z-20"
        style={{ height: PAD, background: 'linear-gradient(to bottom, #030712 20%, transparent)' }}
      />
      {/* 下フェード */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none z-20"
        style={{ height: PAD, background: 'linear-gradient(to top, #030712 20%, transparent)' }}
      />
    </div>
  )
}
