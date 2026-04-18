import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { login, register, isLoggedIn } from '@/lib/admin'
import logo from '@/assets/logo.png'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode]         = useState<'login' | 'setup'>('login')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPwd, setShowPwd]   = useState(false)

  if (isLoggedIn()) { navigate('/admin'); return null }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'setup') {
        await register(email, password)
        await login(email, password)
      } else {
        await login(email, password)
      }
      navigate('/admin')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-[Manrope,sans-serif]">
      {/* Background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(160,24,42,0.15),transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src={logo}
            alt="ProMedias"
            className="h-20 w-auto object-contain brightness-0 invert"
          />
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Red accent bar */}
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[hsl(357,83%,37%)] to-transparent" />

          <div className="px-8 py-8">
            <p className="text-base font-bold text-white mb-1">
              {mode === 'setup' ? 'Créer un compte admin' : 'Espace Administration'}
            </p>
            <p className="text-sm text-zinc-500 mb-7">
              {mode === 'setup'
                ? 'Premier lancement — configurez votre accès.'
                : 'Connectez-vous pour gérer le site.'}
            </p>

            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="admin@promedias.be"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 transition focus:outline-none focus:border-[hsl(357,83%,45%)] focus:ring-1 focus:ring-[hsl(357,83%,45%)]/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-zinc-600 transition focus:outline-none focus:border-[hsl(357,83%,45%)] focus:ring-1 focus:ring-[hsl(357,83%,45%)]/40"
                  />
                  <button type="button" onClick={() => setShowPwd(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 transition-colors">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-950/50 border border-red-800/60 rounded-xl px-4 py-3">
                  <span className="text-red-400 text-xs font-medium">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-[hsl(357,83%,37%)] hover:bg-[hsl(357,83%,43%)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-4 py-3 text-sm transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Connexion…
                  </>
                ) : mode === 'setup' ? 'Créer le compte' : 'Se connecter'}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-zinc-800 text-center">
              <button
                type="button"
                onClick={() => { setMode(m => m === 'login' ? 'setup' : 'login'); setError('') }}
                className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
              >
                {mode === 'login'
                  ? 'Premier lancement ? Créer un compte admin →'
                  : '← Retour à la connexion'}
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-zinc-700 text-[11px] mt-6 tracking-widest uppercase">
          Interface privée · ProMedias Liège
        </p>
      </div>
    </div>
  )
}
