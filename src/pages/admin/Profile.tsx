import { useEffect, useState, useRef } from 'react'
import { Camera, Check, AlertCircle, User, Mail, Lock, Eye, EyeOff, CalendarDays } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { adminGetProfile, adminUpdateProfile, adminUpload } from '@/lib/admin'
import { resolveUrl } from '@/lib/woocommerce'

const INPUT = 'w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors bg-white'

function Feedback({ msg }: { msg: { type: 'ok' | 'err'; text: string } | null }) {
  if (!msg) return null
  return (
    <div className={`flex items-center gap-2 mt-4 px-3 py-2.5 rounded-xl text-sm ${msg.type === 'ok' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
      {msg.type === 'ok' ? <Check size={14} /> : <AlertCircle size={14} />}
      {msg.text}
    </div>
  )
}

function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-100">
        <p className="text-sm font-semibold text-zinc-900">{title}</p>
        {subtitle && <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}

export default function Profile() {
  const [profile, setProfile]         = useState<{ email?: string; avatar?: string | null; created_at?: string } | null>(null)
  const [email, setEmail]             = useState('')
  const [currentPwd, setCurrentPwd]   = useState('')
  const [newPwd, setNewPwd]           = useState('')
  const [confirmPwd, setConfirmPwd]   = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew]         = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [savingInfo, setSavingInfo]   = useState(false)
  const [savingPwd, setSavingPwd]     = useState(false)
  const [infoMsg, setInfoMsg]         = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [pwdMsg, setPwdMsg]           = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [errorMsg, setErrorMsg]       = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    try {
      const p = await adminGetProfile()
      setProfile(p ?? {})
      setEmail(p?.email ?? '')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erreur de chargement')
    }
  }
  useEffect(() => { load() }, [])

  const handleAvatarUpload = async (file: File) => {
    setAvatarUploading(true)
    try {
      const url = await adminUpload(file, 'logo')
      const updated = await adminUpdateProfile({ avatar: url })
      setProfile(updated)
    } catch (e) { alert(e instanceof Error ? e.message : String(e)) }
    finally { setAvatarUploading(false) }
  }

  const saveInfo = async () => {
    setSavingInfo(true); setInfoMsg(null)
    try {
      const updated = await adminUpdateProfile({ email })
      setProfile(updated)
      setInfoMsg({ type: 'ok', text: 'Adresse e-mail mise à jour.' })
    } catch (e) { setInfoMsg({ type: 'err', text: e instanceof Error ? e.message : String(e) }) }
    finally { setSavingInfo(false) }
  }

  const savePassword = async () => {
    setPwdMsg(null)
    if (newPwd !== confirmPwd) { setPwdMsg({ type: 'err', text: 'Les mots de passe ne correspondent pas.' }); return }
    if (newPwd.length < 8)     { setPwdMsg({ type: 'err', text: 'Minimum 8 caractères requis.' }); return }
    setSavingPwd(true)
    try {
      await adminUpdateProfile({ currentPassword: currentPwd, newPassword: newPwd })
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('')
      setPwdMsg({ type: 'ok', text: 'Mot de passe modifié avec succès.' })
    } catch (e) { setPwdMsg({ type: 'err', text: e instanceof Error ? e.message : String(e) }) }
    finally { setSavingPwd(false) }
  }

  if (errorMsg) return (
    <AdminLayout>
      <div className="p-10 text-red-500 text-sm">{errorMsg}</div>
    </AdminLayout>
  )

  if (!profile) return (
    <AdminLayout>
      <div className="p-10 text-zinc-400 text-sm">Chargement…</div>
    </AdminLayout>
  )

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="grid grid-cols-[280px_1fr] gap-6 items-start">

          {/* Left: avatar card */}
          <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden sticky top-8">
            {/* Colour band at top */}
            <div className="h-20 bg-gradient-to-br from-zinc-800 to-zinc-950" />
            <div className="px-6 pb-6 -mt-10">
              {/* Avatar */}
              <div className="relative w-20 h-20 mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-zinc-200 border-4 border-white shadow flex items-center justify-center">
                  {profile.avatar
                    ? <img src={resolveUrl(profile.avatar)} alt="Avatar" className="w-full h-full object-cover" />
                    : <User size={28} className="text-zinc-400" />
                  }
                </div>
                <button onClick={() => fileRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-zinc-900 hover:bg-zinc-700 text-white rounded-full p-1.5 transition-colors shadow border-2 border-white">
                  <Camera size={12} />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={e => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])} />
              </div>

              <p className="text-sm font-semibold text-zinc-900 truncate">{profile.email}</p>
              <p className="text-xs text-zinc-400 mt-0.5">Administrateur</p>

              {profile.created_at && (
                <div className="flex items-center gap-1.5 mt-3 text-xs text-zinc-400">
                  <CalendarDays size={12} />
                  Depuis le {new Date(profile.created_at).toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              )}

              <div className="mt-4 space-y-2">
                <button onClick={() => fileRef.current?.click()}
                  disabled={avatarUploading}
                  className="w-full text-xs text-zinc-600 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-400 rounded-lg px-3 py-2 transition-colors text-center disabled:opacity-50">
                  {avatarUploading ? 'Importation…' : 'Changer la photo'}
                </button>
                {profile.avatar && (
                  <button onClick={async () => setProfile(await adminUpdateProfile({ avatar: null }))}
                    className="w-full text-xs text-red-500 hover:text-red-700 border border-red-100 hover:border-red-300 rounded-lg px-3 py-2 transition-colors text-center">
                    Supprimer la photo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right: edit forms */}
          <div className="space-y-5">

            {/* Email */}
            <SectionCard title="Adresse e-mail" subtitle="Identifiant de connexion au panneau d'administration">
              <div>
                <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Adresse e-mail</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className={INPUT + ' pl-9'} />
                </div>
              </div>
              <Feedback msg={infoMsg} />
              <div className="mt-4">
                <Button onClick={saveInfo} disabled={savingInfo || email === profile.email}>
                  {savingInfo ? 'Enregistrement…' : 'Mettre à jour l\'e-mail'}
                </Button>
              </div>
            </SectionCard>

            {/* Password */}
            <SectionCard title="Mot de passe" subtitle="Minimum 8 caractères">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Mot de passe actuel</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input type={showCurrent ? 'text' : 'password'} value={currentPwd}
                      onChange={e => setCurrentPwd(e.target.value)}
                      placeholder="••••••••" className={INPUT + ' pl-9 pr-10'} />
                    <button type="button" onClick={() => setShowCurrent(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700">
                      {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Nouveau mot de passe</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input type={showNew ? 'text' : 'password'} value={newPwd}
                        onChange={e => setNewPwd(e.target.value)}
                        placeholder="Min. 8 caractères" className={INPUT + ' pl-9 pr-10'} />
                      <button type="button" onClick={() => setShowNew(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700">
                        {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Confirmer</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input type={showConfirm ? 'text' : 'password'} value={confirmPwd}
                        onChange={e => setConfirmPwd(e.target.value)}
                        placeholder="••••••••" className={INPUT + ' pl-9 pr-10'} />
                      <button type="button" onClick={() => setShowConfirm(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700">
                        {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <Feedback msg={pwdMsg} />
              <div className="mt-4">
                <Button onClick={savePassword} disabled={savingPwd || !currentPwd || !newPwd || !confirmPwd}>
                  {savingPwd ? 'Mise à jour…' : 'Changer le mot de passe'}
                </Button>
              </div>
            </SectionCard>

          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
