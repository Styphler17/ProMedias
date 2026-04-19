import { useEffect, useState, useRef, useCallback } from 'react'
import { Camera, Check, AlertCircle, User, Mail, Lock, Eye, EyeOff, CalendarDays, ShieldCheck, Trash2, CameraIcon } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { adminGetProfile, adminUpdateProfile, adminUpload } from '@/lib/admin'
import { resolveUrl } from '@/lib/woocommerce'
import { cn } from '@/lib/utils'

interface ProfileData {
  email: string
  avatar: string | null
  created_at: string
}

interface FeedbackMessage {
  type: 'ok' | 'err'
  text: string
}

const INPUT = "w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-sm transition-all focus:bg-white focus:ring-4 focus:ring-[hsl(357,83%,37%)]/5 focus:border-[hsl(357,83%,37%)] outline-none font-medium text-zinc-900 group-hover:border-zinc-300"
const LABEL = "text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 block ml-1"

function Feedback({ msg }: { msg: FeedbackMessage | null }) {
  if (!msg) return null
  return (
    <div className={cn(
      "flex items-center gap-2 mt-6 px-4 py-3 rounded-2xl text-xs font-bold transition-all animate-in fade-in slide-in-from-top-2",
      msg.type === 'ok' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
    )}>
      {msg.type === 'ok' ? <Check size={14} strokeWidth={3} /> : <AlertCircle size={14} strokeWidth={3} />}
      {msg.text}
    </div>
  )
}

function SectionCard({ title, subtitle, icon: Icon, children }: { title: string; subtitle?: string; icon: React.ElementType, children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-zinc-100 p-8 shadow-sm group">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-100 group-hover:border-[hsl(357,83%,37%)]/20 transition-colors">
          <Icon size={20} className="text-[hsl(357,83%,37%)]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-zinc-900 leading-tight">{title}</h2>
          {subtitle && <p className="text-xs text-zinc-400 font-medium">{subtitle}</p>}
        </div>
      </div>
      <div>{children}</div>
    </div>
  )
}

export default function Profile() {
  const [profile, setProfile]         = useState<ProfileData | null>(null)
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
  const [infoMsg, setInfoMsg]         = useState<FeedbackMessage | null>(null)
  const [pwdMsg, setPwdMsg]           = useState<FeedbackMessage | null>(null)
  const [errorMsg, setErrorMsg]       = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    try {
      const p = await adminGetProfile()
      if (p) {
        setProfile(p)
        setEmail(p.email)
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erreur de chargement')
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleAvatarUpload = async (file: File) => {
    setAvatarUploading(true)
    try {
      const url = await adminUpload(file, 'logo')
      const updated = await adminUpdateProfile({ avatar: url })
      if (updated) setProfile(updated)
    } catch (e: unknown) { 
      const msg = e instanceof Error ? e.message : 'Upload failed'
      alert(msg)
    } finally { setAvatarUploading(false) }
  }

  const removeAvatar = async () => {
    if (!confirm('Supprimer votre photo ?')) return
    try {
      const updated = await adminUpdateProfile({ avatar: null })
      if (updated) setProfile(updated)
    } catch { /* silence */ }
  }

  const saveInfo = async () => {
    setSavingInfo(true); setInfoMsg(null)
    try {
      const updated = await adminUpdateProfile({ email })
      if (updated) {
        setProfile(updated)
        setInfoMsg({ type: 'ok', text: 'Adresse e-mail mise à jour.' })
      }
    } catch (e: unknown) { 
      setInfoMsg({ type: 'err', text: e instanceof Error ? e.message : 'Une erreur est survenue' }) 
    } finally { setSavingInfo(false) }
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
    } catch (e: unknown) { 
      setPwdMsg({ type: 'err', text: e instanceof Error ? e.message : 'Mot de passe actuel incorrect' }) 
    } finally { setSavingPwd(false) }
  }

  if (errorMsg) return (
    <AdminLayout>
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle size={32} className="text-red-500" />
        </div>
        <p className="text-red-500 font-bold">{errorMsg}</p>
        <Button onClick={load} variant="outline" className="mt-4 rounded-xl">Réessayer</Button>
      </div>
    </AdminLayout>
  )

  if (!profile) return (
    <AdminLayout>
      <div className="p-20 flex flex-col items-center gap-4 text-center">
        <div className="w-12 h-12 border-4 border-zinc-100 border-t-[hsl(357,83%,37%)] rounded-full animate-spin" />
        <p className="text-zinc-400 font-bold tracking-widest text-[10px] uppercase">Chargement de votre compte...</p>
      </div>
    </AdminLayout>
  )

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-6 md:p-10 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left: Premium Avatar Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-10 z-10">
            <div className="bg-white rounded-[2.5rem] border border-zinc-100 overflow-hidden shadow-xl shadow-zinc-200/50">
              <div className="h-32 bg-gradient-to-br from-zinc-800 to-zinc-950 px-8 flex items-end justify-center">
                <div className="mb-[-40px] relative group/avatar">
                  <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden bg-white p-1.5 shadow-2xl">
                    <div className="w-full h-full rounded-[2rem] overflow-hidden bg-zinc-100 flex items-center justify-center border-4 border-white shadow-inner">
                      {profile.avatar
                        ? <img src={resolveUrl(profile.avatar)} alt="Avatar" className="w-full h-full object-cover" />
                        : <User size={48} className="text-zinc-200" />
                      }
                    </div>
                  </div>
                  <button 
                    onClick={() => fileRef.current?.click()}
                    className="absolute bottom-2 right-2 w-10 h-10 bg-[hsl(357,83%,37%)] text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all outline-none border-4 border-white"
                  >
                    <CameraIcon size={16} />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden"
                    onChange={e => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])} />
                </div>
              </div>

              <div className="p-8 pt-16 text-center">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-zinc-900 truncate">{profile.email.split('@')[0]}</h3>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <ShieldCheck size={12} className="text-[hsl(357,83%,37%)] font-bold" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Admin Privilégié</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 py-3 px-4 bg-zinc-50 rounded-2xl mb-8 border border-zinc-100">
                  <CalendarDays size={14} className="text-zinc-300" />
                  <span className="text-xs text-zinc-500 font-medium">
                    Actif depuis le {new Date(profile.created_at).toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>

                <div className="space-y-3">
                  <button onClick={() => fileRef.current?.click()}
                    disabled={avatarUploading}
                    className="w-full h-12 flex items-center justify-center gap-2 text-xs font-bold text-zinc-600 bg-white border-2 border-zinc-100 hover:border-zinc-300 rounded-2xl transition-all disabled:opacity-50"
                  >
                    <Camera size={14} /> {avatarUploading ? 'Importation…' : 'Changer la photo'}
                  </button>
                  {profile.avatar && (
                    <button onClick={removeAvatar}
                      className="w-full h-12 flex items-center justify-center gap-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                    >
                      <Trash2 size={14} /> Supprimer l'image
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Security & Personal Info */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Account Info */}
            <SectionCard 
              title="Paramètres du Compte" 
              subtitle="Gérez vos informations de connexion"
              icon={Mail}
            >
              <div className="max-w-md">
                <label className={LABEL}>Adresse e-mail unique</label>
                <div className="relative group/input">
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className={cn(INPUT, "pl-12")} />
                  <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within/input:text-[hsl(357,83%,37%)]/50 transition-colors" />
                </div>
                
                <Feedback msg={infoMsg} />
                
                <div className="mt-8">
                  <Button 
                    onClick={saveInfo} 
                    disabled={savingInfo || email === profile.email}
                    className="rounded-2xl h-12 px-8 font-bold shadow-lg shadow-[hsl(357,83%,37%)]/10"
                  >
                    {savingInfo ? 'Enregistrement…' : 'Mettre à jour l\'e-mail'}
                  </Button>
                </div>
              </div>
            </SectionCard>

            {/* Security */}
            <SectionCard 
              title="Sécurité du Compte" 
              subtitle="Mise à jour périodique recommandée"
              icon={Lock}
            >
              <div className="space-y-6">
                <div className="max-w-md">
                  <label className={LABEL}>Mot de passe actuel</label>
                  <div className="relative group/input">
                    <input type={showCurrent ? 'text' : 'password'} value={currentPwd}
                      onChange={e => setCurrentPwd(e.target.value)}
                      placeholder="••••••••" className={cn(INPUT, "pl-12 pr-12")} />
                    <Lock size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300" />
                    <button type="button" onClick={() => setShowCurrent(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-600 transition-colors">
                      {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={LABEL}>Nouveau mot de passe</label>
                    <div className="relative">
                      <input type={showNew ? 'text' : 'password'} value={newPwd}
                        onChange={e => setNewPwd(e.target.value)}
                        placeholder="Min. 8 caractères" className={cn(INPUT, "pl-12 pr-12")} />
                      <ShieldCheck size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300" />
                      <button type="button" onClick={() => setShowNew(v => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-600 transition-colors">
                        {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={LABEL}>Confirmation</label>
                    <div className="relative">
                      <input type={showConfirm ? 'text' : 'password'} value={confirmPwd}
                        onChange={e => setConfirmPwd(e.target.value)}
                        placeholder="Même mot de passe" className={cn(INPUT, "pl-12 pr-12")} />
                      <Check size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300" />
                      <button type="button" onClick={() => setShowConfirm(v => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-600 transition-colors">
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <Feedback msg={pwdMsg} />

              <div className="mt-10">
                <Button 
                  onClick={savePassword} 
                  disabled={savingPwd || !currentPwd || !newPwd || !confirmPwd}
                  className="rounded-2xl h-12 px-8 font-bold shadow-lg shadow-[hsl(357,83%,37%)]/10"
                >
                  {savingPwd ? 'Modification en cours…' : 'Changer mon mot de passe'}
                </Button>
              </div>
            </SectionCard>

          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
