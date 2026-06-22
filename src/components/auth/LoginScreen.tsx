import { useState } from 'react'
interface Props {
  onLogin: () => void
  onGoRegister: () => void
}

export default function LoginScreen({ onLogin, onGoRegister }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) return
    onLogin()
  }

  return (
    <div className="flex-1 min-h-0 bg-gray-950 flex flex-col items-center justify-center px-6 overflow-y-auto">
      <div className="w-full max-w-sm">

        {/* ロゴ */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-2">🐝</div>
          <h1 className="text-3xl font-bold text-white tracking-tight">BeeMatch</h1>
          <p className="text-gray-400 text-sm mt-1">あなたに合う人を見つけよう</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
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
            <label className="block text-gray-400 text-sm mb-1">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-400 text-black font-bold rounded-xl py-3 text-sm mt-2 active:opacity-80 transition-opacity"
          >
            ログイン
          </button>
        </form>

        <div className="text-center mt-6">
          <span className="text-gray-500 text-sm">アカウントをお持ちでない方は</span>
          <button
            onClick={onGoRegister}
            className="text-amber-400 text-sm font-medium ml-1 underline"
          >
            新規登録
          </button>
        </div>
      </div>
    </div>
  )
}
