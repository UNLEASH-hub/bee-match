import { useState } from 'react'
import type { User } from '../../types'

interface Props {
  user: User
  onBack: () => void
  onMessage: () => void
  onShowOnMap: () => void
}

const sexualityLabel: Record<NonNullable<User['sexuality']>, string> = {
  gay: 'ゲイ',
  bi: 'バイ',
  'straight-leaning': 'ストレート寄り',
  trans: 'トランス',
}

const positionLabel: Record<NonNullable<User['position']>, string> = {
  tachi: 'タチ',
  uke: 'ウケ',
  riba: 'リバ',
  vanilla: 'バニラ',
  unknown: '未定',
}

const lookingForLabel: Record<NonNullable<User['lookingFor']>[number], string> = {
  friends: '友達',
  romance: '恋愛',
  other: 'その他',
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"
      fill={filled ? 'currentColor' : 'none'} stroke="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

export default function UserProfileScreen({ user, onBack, onMessage, onShowOnMap }: Props) {
  const [photoIndex, setPhotoIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [confirmFavorite, setConfirmFavorite] = useState(false)

  const photos = user.photos.length > 0 ? user.photos : [user.avatarUrl]

  const thumbnails = photos
    .map((photo, i) => ({ photo, i }))
    .filter(({ i }) => i !== photoIndex)

  const badges: string[] = [
    user.sexuality ? sexualityLabel[user.sexuality] : null,
    user.position ? positionLabel[user.position] : null,
    ...(user.lookingFor ?? []).map(f => lookingForLabel[f]),
  ].filter(Boolean) as string[]

  function handleStarClick() {
    if (isFavorite) {
      setIsFavorite(false)
    } else {
      setConfirmFavorite(true)
    }
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-gray-950 overflow-y-auto relative">
      {/* メイン写真 */}
      <div className="relative w-full flex-shrink-0" style={{ aspectRatio: '4/5' }}>
        <img
          src={photos[photoIndex]}
          alt={user.name}
          className="w-full h-full object-cover"
        />

        {/* グラデーションオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20 pointer-events-none" />

        {/* 戻るボタン */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 w-9 h-9 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
        >
          <BackIcon />
        </button>

        {/* オンラインバッジ */}
        {user.isOnline && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-white text-xs font-medium">オンライン</span>
          </div>
        )}
      </div>

      {/* サムネイル行（他の3枚） */}
      {thumbnails.length > 0 && (
        <div className="flex gap-2 px-4 py-3 bg-gray-950 flex-shrink-0">
          {thumbnails.map(({ photo, i }) => (
            <button
              key={i}
              onClick={() => setPhotoIndex(i)}
              className="flex-1 aspect-square rounded-xl overflow-hidden border-2 border-transparent active:opacity-70 transition-opacity"
            >
              <img src={photo} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* プロフィール本文 */}
      <div className="flex flex-col gap-4 px-5 pt-5 pb-28">
        {/* 名前・基本情報 */}
        <div>
          <h1 className="text-white text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-400 text-sm mt-1">
            {[
              `${user.age}歳`,
              user.height ? `${user.height}cm` : null,
              user.weight ? `${user.weight}kg` : null,
            ].filter(Boolean).join(' · ')}
          </p>
        </div>

        {/* パーソナルバッジ */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {badges.map(badge => (
              <span
                key={badge}
                className="bg-gray-800 text-gray-300 text-xs px-3 py-1.5 rounded-full"
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        {/* 自己紹介文 */}
        {user.bio && (
          <div>
            <p className="text-gray-500 text-xs font-medium mb-2">自己紹介</p>
            <p className="text-gray-300 text-sm leading-relaxed">{user.bio}</p>
          </div>
        )}
      </div>

      {/* フローティングアクションバー */}
      <div className="sticky bottom-0 bg-gray-950/95 backdrop-blur border-t border-gray-800 flex items-center justify-around px-8 py-4"
        style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
      >
        {/* お気に入り */}
        <button onClick={handleStarClick} className="flex flex-col items-center gap-1">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            isFavorite ? 'bg-amber-400/20 text-amber-400' : 'bg-gray-800 text-gray-400'
          }`}>
            <StarIcon filled={isFavorite} />
          </div>
          <span className="text-gray-500 text-[10px]">お気に入り</span>
        </button>

        {/* メッセージ */}
        <button onClick={onMessage} className="flex flex-col items-center gap-1">
          <div className="w-14 h-14 rounded-full bg-amber-400 flex items-center justify-center text-black shadow-lg shadow-amber-400/30">
            <MailIcon />
          </div>
          <span className="text-gray-500 text-[10px]">メッセージ</span>
        </button>

        {/* 地図でズーム */}
        <button onClick={onShowOnMap} className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
            <MapPinIcon />
          </div>
          <span className="text-gray-500 text-[10px]">地図で見る</span>
        </button>
      </div>

      {/* お気に入り確認モーダル */}
      {confirmFavorite && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-gray-950/70 px-8"
          onClick={() => setConfirmFavorite(false)}
        >
          <div
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-6 flex flex-col gap-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-amber-400 text-3xl">★</span>
              <p className="text-white font-semibold text-base">お気に入りに登録しますか？</p>
              <p className="text-gray-400 text-sm">{user.name}さんをお気に入りに追加します</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmFavorite(false)}
                className="flex-1 py-3 rounded-xl bg-gray-800 text-gray-300 text-sm font-medium"
              >
                キャンセル
              </button>
              <button
                onClick={() => { setIsFavorite(true); setConfirmFavorite(false) }}
                className="flex-1 py-3 rounded-xl bg-amber-400 text-black text-sm font-semibold"
              >
                登録する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
