import { useEffect, useState } from 'react'
import { UserPlus, Trash2, ShieldCheck, Shield, User, Mail, Calendar, X, ShieldAlert, Key, MoreVertical } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { adminGetUsers, adminCreateUser, adminUpdateUser, adminDeleteUser, type AdminUser, adminGetProfile } from '@/lib/admin'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const ROLE_LABELS = {
  super_admin:   'Super Admin',
  administrator: 'Administrateur',
  editor:        'Éditeur'
}

const ROLE_COLORS = {
  super_admin:   'bg-red-50 text-red-600 border-red-100',
  administrator: 'bg-zinc-900 text-white border-zinc-900',
  editor:        'bg-white text-zinc-600 border-zinc-200'
}

export default function Users() {
  const [users, setUsers]       = useState<AdminUser[]>([])
  const [loading, setLoading]   = useState(true)
  const [showAdd, setShowAdd]   = useState(false)
  const [myProfile, setMyProfile] = useState<any>(null)
  
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [role, setRole]         = useState<'administrator' | 'editor'>('editor')

  useEffect(() => {
    load()
    adminGetProfile().then(setMyProfile).catch(() => {})
  }, [])

  async function load() {
    try {
      const data = await adminGetUsers()
      setUsers(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    try {
      await adminCreateUser({ email, password, display_name: displayName, role })
      setShowAdd(false)
      setEmail(''); setPassword(''); setDisplayName('');
      load()
    } catch (e: any) {
      alert(e.message)
    }
  }

  async function handleDelete(id: number) {
    if (id === myProfile?.id) return alert("Vous ne pouvez pas vous supprimer vous-même.")
    if (!confirm("Supprimer cet utilisateur ?")) return
    try {
      await adminDeleteUser(id)
      load()
    } catch (e: any) {
      alert(e.message)
    }
  }

  async function toggleRole(u: AdminUser) {
    if (u.role === 'super_admin') return
    const nextRole = u.role === 'administrator' ? 'editor' : 'administrator'
    try {
      await adminUpdateUser(u.id, { role: nextRole })
      load()
    } catch (e: any) {
      alert(e.message)
    }
  }

  const isSuper = myProfile?.role === 'super_admin'

  return (
    <AdminLayout>
      <div className="bg-zinc-50 min-h-screen">
        {/* Simplified Header Section */}
        <div className="bg-white border-b border-zinc-200">
          <div className="max-w-6xl mx-auto px-8 py-10">
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">Gestion des Utilisateurs</h1>
            <p className="text-zinc-500 font-medium mb-8">Administrez les accès et rôles de votre équipe technique.</p>
            
            {isSuper && (
              <button 
                onClick={() => setShowAdd(true)} 
                className="flex items-center gap-2 px-6 py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-zinc-900/10"
              >
                <UserPlus size={18} />
                Nouvel Utilisateur
              </button>
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 py-12">
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map(u => (
                <div key={u.id} className="group relative bg-white border border-zinc-200 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-zinc-300 transition-all duration-300 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 shrink-0 uppercase font-black text-xl shadow-inner">
                      {u.avatar ? <img src={u.avatar} className="w-full h-full object-cover rounded-2xl" /> : u.email[0]}
                    </div>
                    
                    <span className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm', 
                      ROLE_COLORS[u.role]
                    )}>
                      {u.role === 'super_admin' ? <ShieldCheck size={12} /> : u.role === 'administrator' ? <Shield size={12} /> : <User size={12} />}
                      {ROLE_LABELS[u.role]}
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-black text-zinc-900 truncate">
                        {u.display_name || 'Collaborateur'}
                      </h3>
                      {u.id === myProfile?.id && (
                        <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-lg italic">Moi</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-zinc-400 text-sm mb-4">
                      <Mail size={14} />
                      <span className="truncate">{u.email}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 uppercase tracking-tighter">
                      <Calendar size={12} />
                      Depuis le {new Date(u.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-zinc-50 flex items-center justify-between">
                    {isSuper && u.role !== 'super_admin' ? (
                      <>
                        <button 
                          onClick={() => toggleRole(u)}
                          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-900 hover:text-zinc-500 transition-colors"
                        >
                          <ShieldAlert size={14} />
                          Changer Rôle
                        </button>
                        <button 
                          onClick={() => handleDelete(u.id)}
                          className="p-3 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-zinc-300 text-[10px] font-black uppercase tracking-widest w-full justify-center py-2">
                        <Key size={12} />
                        Profil Protégé
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="px-10 py-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/30">
              <div>
                <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Accès</h2>
                <p className="text-zinc-500 text-sm font-medium">Inviter un nouveau membre</p>
              </div>
              <button 
                onClick={() => setShowAdd(false)} 
                className="w-10 h-10 flex items-center justify-center bg-white border border-zinc-200 rounded-2xl text-zinc-400 hover:text-zinc-900 transition-all hover:scale-110 shadow-sm"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAdd} className="p-10 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2 ml-1">E-mail Professionnel</label>
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="equipe@promedias.fr"
                    className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-zinc-100 focus:border-zinc-900 focus:bg-white transition-all text-sm font-medium" />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2 ml-1">Mot de Passe Temporaire</label>
                  <input required type="password" value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-zinc-100 focus:border-zinc-900 focus:bg-white transition-all text-sm font-medium" />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2 ml-1">Prénom & Nom</label>
                  <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
                    placeholder="Marc Morel"
                    className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-zinc-100 focus:border-zinc-900 focus:bg-white transition-all text-sm font-medium" />
                </div>

                <div className="pt-2">
                  <label className="block text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-3 ml-1">Niveau d'Accès</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setRole('administrator')}
                      className={cn('px-4 py-4 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all',
                        role === 'administrator' ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl shadow-zinc-900/20 scale-105' : 'bg-white border-zinc-200 text-zinc-400 hover:border-zinc-400'
                      )}>Admin</button>
                    <button type="button" onClick={() => setRole('editor')}
                      className={cn('px-4 py-4 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all',
                        role === 'editor' ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl shadow-zinc-900/20 scale-105' : 'bg-white border-zinc-200 text-zinc-400 hover:border-zinc-400'
                      )}>Éditeur</button>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button type="submit" className="w-full h-16 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-zinc-900/20 transition-all hover:-translate-y-1">
                  Confirmer l'Invitation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
