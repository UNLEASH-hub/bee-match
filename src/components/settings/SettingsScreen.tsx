import { useState } from 'react'
import AccountSettingsScreen from './AccountSettingsScreen'
import SupportScreen from './SupportScreen'
import ReferralScreen from './ReferralScreen'
import ProfileSettingsScreen from './ProfileSettingsScreen'

type SubScreen = 'profile' | 'account' | 'support' | 'referral'

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-600">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-amber-400' : 'bg-gray-700'}`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${enabled ? 'left-6' : 'left-0.5'}`}
      />
    </button>
  )
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="px-4 pt-6 pb-2">
      <p className="text-gray-500 text-xs font-medium">{label}</p>
    </div>
  )
}

function SettingsRow({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <button
      onClick={onPress}
      className="w-full flex items-center justify-between px-4 py-4 border-b border-gray-800 active:bg-gray-900 transition-colors"
    >
      <span className="text-white text-sm">{label}</span>
      <ChevronRight />
    </button>
  )
}

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [openScreen, setOpenScreen] = useState<SubScreen | null>(null)

  if (openScreen === 'profile') return <ProfileSettingsScreen onBack={() => setOpenScreen(null)} />
  if (openScreen === 'account') return <AccountSettingsScreen onBack={() => setOpenScreen(null)} />
  if (openScreen === 'support') return <SupportScreen onBack={() => setOpenScreen(null)} />
  if (openScreen === 'referral') return <ReferralScreen onBack={() => setOpenScreen(null)} />

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-gray-950 overflow-y-auto">
      <div className="px-4 pt-5 pb-4 flex-shrink-0">
        <h1 className="text-white text-xl font-bold">設定</h1>
      </div>

      {/* VIPパスバナー */}
      <div className="px-4 mb-2">
        <button className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-2xl px-5 py-4 flex items-center justify-between active:opacity-90 transition-opacity">
          <div className="flex items-center gap-3">
            <span className="text-2xl leading-none">👑</span>
            <div className="text-left">
              <p className="text-black font-bold text-sm">VIPパス</p>
              <p className="text-black/70 text-xs mt-0.5">プレミアム機能をすべて解放</p>
            </div>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 opacity-60">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* アカウント */}
      <SectionHeader label="アカウント" />
      <div className="border-t border-gray-800">
        <SettingsRow label="プロフィール設定" onPress={() => setOpenScreen('profile')} />
        <SettingsRow label="アカウント設定" onPress={() => setOpenScreen('account')} />
      </div>

      {/* 通知 */}
      <SectionHeader label="通知" />
      <div className="border-t border-gray-800">
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
          <span className="text-white text-sm">通知設定</span>
          <Toggle
            enabled={notificationsEnabled}
            onToggle={() => setNotificationsEnabled(v => !v)}
          />
        </div>
      </div>

      {/* 友だち紹介コード */}
      <SectionHeader label="友だち紹介コード" />
      <div className="border-t border-gray-800">
        <SettingsRow label="友だち紹介コード" onPress={() => setOpenScreen('referral')} />
      </div>

      {/* その他 */}
      <SectionHeader label="その他" />
      <div className="border-t border-gray-800">
        <SettingsRow label="サポート" onPress={() => setOpenScreen('support')} />
      </div>

      {/* ログアウト */}
      <div className="mt-6 border-t border-gray-800">
        <button className="w-full px-4 py-4 text-left active:bg-gray-900 transition-colors">
          <span className="text-red-400 text-sm font-medium">ログアウト</span>
        </button>
      </div>

      <div className="h-8" />
    </div>
  )
}
