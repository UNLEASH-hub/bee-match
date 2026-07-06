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

interface Props {
  isVip: boolean
  onToggleVip: () => void
}

type InstallPlatform = 'ios' | 'android'

const IOS_STEPS = [
  {
    text: '画面下部の共有ボタンをタップ',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
      </svg>
    ),
  },
  {
    text: '「ホーム画面に追加」を選択',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    ),
  },
  {
    text: '右上の「追加」をタップ',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
]

const ANDROID_STEPS = [
  {
    text: 'ブラウザ右上の「⋮」をタップ',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
      </svg>
    ),
  },
  {
    text: '「ホーム画面に追加」を選択',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    text: '「追加」をタップ',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
]

export default function SettingsScreen({ isVip, onToggleVip }: Props) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [openScreen, setOpenScreen] = useState<SubScreen | null>(null)
  const [showInstallModal, setShowInstallModal] = useState(false)
  const [installPlatform, setInstallPlatform] = useState<InstallPlatform>('ios')
  const [showNotificationHint, setShowNotificationHint] = useState(false)

  function handleNotificationToggle() {
    const next = !notificationsEnabled
    setNotificationsEnabled(next)
    if (next) setShowNotificationHint(true)
  }

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
        {isVip ? (
          <div className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-2xl px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl leading-none">👑</span>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-black font-bold text-sm">VIPパス加入中</p>
                    <span className="text-xs bg-black/20 text-black px-2 py-0.5 rounded-full font-medium">✓ 有効</span>
                  </div>
                  <p className="text-black/70 text-xs mt-0.5">プレミアム機能が使用できます</p>
                </div>
              </div>
            </div>
            <button
              onClick={onToggleVip}
              className="mt-3 w-full py-2 rounded-xl bg-black/20 text-black text-xs font-medium active:opacity-70"
            >
              解除する（デモ用）
            </button>
          </div>
        ) : (
          <button
            onClick={onToggleVip}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-2xl px-5 py-4 flex items-center justify-between active:opacity-90 transition-opacity"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl leading-none">👑</span>
              <div className="text-left">
                <p className="text-black font-bold text-sm">VIPパス</p>
                <p className="text-black/70 text-xs mt-0.5">タップして加入する（デモ用）</p>
              </div>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 opacity-60">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>

      {/* アカウント */}
      <SectionHeader label="アカウント" />
      <div className="border-t border-gray-800">
        <SettingsRow label="プロフィール設定" onPress={() => setOpenScreen('profile')} />
        <SettingsRow label="アカウント設定" onPress={() => setOpenScreen('account')} />
      </div>

      {/* アプリを入手する */}
      <SectionHeader label="アプリ" />
      <div className="border-t border-gray-800">
        <button
          onClick={() => setShowInstallModal(true)}
          className="w-full flex items-center justify-between px-4 py-4 border-b border-gray-800 active:bg-gray-900 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400/10 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /><path d="M8 12l4 4 4-4"/><line x1="12" y1="8" x2="12" y2="16"/>
              </svg>
            </div>
            <div className="text-left">
              <p className="text-white text-sm">アプリを入手する</p>
              <p className="text-gray-500 text-xs mt-0.5">ホーム画面に追加してアプリとして使う</p>
            </div>
          </div>
          <ChevronRight />
        </button>
      </div>

      {/* 通知 */}
      <SectionHeader label="通知" />
      <div className="border-t border-gray-800">
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
          <span className="text-white text-sm">通知設定</span>
          <Toggle
            enabled={notificationsEnabled}
            onToggle={handleNotificationToggle}
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

      {/* 通知ON時のホーム画面追加ヒント */}
      {showNotificationHint && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
          onClick={() => setShowNotificationHint(false)}
        >
          <div
            className="w-full max-w-[390px] mx-4 bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-4xl">🔔</span>
              <h3 className="text-white font-bold text-base">通知を受け取るには</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                BeeMatchをホーム画面に追加すると、メッセージやイベントの通知をアプリと同じように受け取れます。
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl px-4 py-3 flex items-start gap-3">
              <span className="text-amber-400 text-lg leading-none mt-0.5">⚠️</span>
              <p className="text-gray-400 text-xs leading-relaxed">
                ブラウザで開いている場合、ホーム画面に追加しないと通知が届かない場合があります。
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { setShowNotificationHint(false); setShowInstallModal(true) }}
                className="w-full py-3 rounded-xl bg-amber-400 text-black text-sm font-bold active:opacity-80"
              >
                ホーム画面への追加方法を見る
              </button>
              <button
                onClick={() => setShowNotificationHint(false)}
                className="w-full py-2.5 rounded-xl bg-gray-800 text-gray-400 text-sm"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* アプリインストール案内モーダル */}
      {showInstallModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-end"
          onClick={() => setShowInstallModal(false)}
        >
          <div
            className="w-full max-w-[430px] mx-auto bg-gray-900 rounded-t-3xl px-5 pt-6 pb-8"
            onClick={e => e.stopPropagation()}
          >
            {/* ハンドル */}
            <div className="w-10 h-1 bg-gray-700 rounded-full mx-auto mb-5" />

            {/* ヘッダー */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">BeeMatchを<br />ホーム画面に追加</h3>
                <p className="text-amber-400 text-xs mt-2">🔔 通知もアプリと同じように受け取れます</p>
              </div>
              <button
                onClick={() => setShowInstallModal(false)}
                className="text-gray-500 text-xl w-8 h-8 flex items-center justify-center flex-shrink-0"
              >✕</button>
            </div>

            {/* プラットフォームタブ */}
            <div className="flex gap-2 mb-5">
              {(['ios', 'android'] as InstallPlatform[]).map(p => (
                <button
                  key={p}
                  onClick={() => setInstallPlatform(p)}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${
                    installPlatform === p
                      ? 'bg-amber-400 text-black'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {p === 'ios' ? '🍎 iPhone / iPad' : '🤖 Android'}
                </button>
              ))}
            </div>

            {/* ステップ */}
            <div className="bg-gray-800 rounded-2xl px-4 py-4 flex flex-col gap-0">
              {(installPlatform === 'ios' ? IOS_STEPS : ANDROID_STEPS).map((s, i, arr) => (
                <div key={i}>
                  <div className="flex items-center gap-4 py-3">
                    <div className="w-8 h-8 rounded-full bg-amber-400/15 border border-amber-400/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-amber-400 text-xs font-bold">{i + 1}</span>
                    </div>
                    <p className="text-gray-200 text-sm flex-1 leading-snug">{s.text}</p>
                    <div className="text-gray-400 flex-shrink-0">{s.icon}</div>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="ml-4 w-px h-3 bg-gray-700" />
                  )}
                </div>
              ))}
            </div>

            <p className="text-gray-600 text-xs text-center mt-4">
              インストール不要・ブラウザから追加するだけ
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
