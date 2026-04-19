import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, X, Eye, EyeOff, Image as ImageIcon, Send, Megaphone, ChevronRight } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import {
  adminGetAnnouncements, adminCreateAnnouncement, adminUpdateAnnouncement,
  adminToggleAnnouncement, adminDeleteAnnouncement, adminUpload,
} from '@/lib/admin'
import { resolveUrl } from '@/lib/woocommerce'
import MediaPicker from '@/components/admin/MediaPicker'
import { cn } from '@/lib/utils'

interface Announcement {
  id: number
  title: string
  subtitle?: string
  image_url: string
  whatsapp_message?: string
  sort_order: number
  active: number
}

interface AnnouncementFormData {
  title: string
  subtitle: string
  image_url: string
  whatsapp_message: string
  sort_order: number
  active: number
}

const EMPTY_FORM: AnnouncementFormData = { 
  title: '', 
  subtitle: '', 
  image_url: '', 
  whatsapp_message: '', 
  sort_order: 0, 
  active: 1 
}

const INPUT = "w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-sm transition-all focus:bg-white focus:ring-4 focus:ring-[hsl(357,83%,37%)]/5 focus:border-[hsl(357,83%,37%)] outline-none font-medium text-zinc-900"
const LABEL = "text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 block ml-1"

export default function Announcements() {
  const [items, setItems]       = useState<Announcement[]>([])
  const [form, setForm]         = useState<AnnouncementFormData>(EMPTY_FORM)
  const [editId, setEditId]     = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError]       = useState('')
  const [uploading, setUploading] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)

  const load = useCallback(async () => {
    try {
      const rows = await adminGetAnnouncements()
      setItems(rows.sort((a, b) => a.sort_order - b.sort_order))
    } catch { /* silence */ }
  }, [])

  useEffect(() => { load() }, [load])

  const openNew  = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); setError(''); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const openEdit = (a: Announcement) => {
    setForm({
      title: a.title, 
      subtitle: a.subtitle ?? '', 
      image_url: a.image_url,
      whatsapp_message: a.whatsapp_message ?? '', 
      sort_order: a.sort_order, 
      active: a.active,
    })
    setEditId(a.id); 
    setShowForm(true); 
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const save = async () => {
    setError('')
    if (!form.title.trim())     { setError('Le titre est requis.'); return }
    if (!form.image_url.trim()) { setError('Une image est requise.'); return }
    try {
      const payload = { ...form, subtitle: form.subtitle || null, whatsapp_message: form.whatsapp_message || null }
      if (editId) await adminUpdateAnnouncement(editId, payload)
      else        await adminCreateAnnouncement(payload)
      setShowForm(false); load()
    } catch (e: unknown) { 
      setError(e instanceof Error ? e.message : 'Une erreur est survenue') 
    }
  }

  const toggle = async (id: number) => { 
    try {
      await adminToggleAnnouncement(id)
      load() 
    } catch { /* silence */ }
  }

  const del = async (id: number) => {
    if (!confirm('Supprimer cette annonce ?')) return
    try {
      await adminDeleteAnnouncement(id)
      load()
    } catch { /* silence */ }
  }

  const handleUpload = async (files: FileList) => {
    if (!files[0]) return
    setUploading(true)
    try {
      const url = await adminUpload(files[0], 'product')
      setForm(f => ({ ...f, image_url: url }))
    } catch (e: unknown) { 
      alert(e instanceof Error ? e.message : 'Upload failed') 
    } finally { setUploading(false) }
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-6 md:p-10 pb-32">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-[hsl(357,83%,37%)]/10 rounded-full flex items-center justify-center">
                <Megaphone size={18} className="text-[hsl(357,83%,37%)]" />
              </div>
              <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Annonces Slider</h1>
            </div>
            <p className="text-zinc-500 font-medium">Gérez les bannières publicitaires qui défilent sur l'accueil.</p>
          </div>
          <Button 
            onClick={openNew} 
            className="rounded-2xl h-14 px-8 font-bold text-base shadow-xl shadow-[hsl(357,83%,37%)]/20"
          >
            <Plus size={20} className="mr-2" /> Créer une annonce
          </Button>
        </div>

        {/* Global Form (Card representation) */}
        {showForm && (
          <div className="bg-white border-2 border-[hsl(357,83%,37%)]/10 rounded-[2.5rem] p-8 mb-12 shadow-2xl shadow-[hsl(357,83%,37%)]/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
              <button onClick={() => setShowForm(false)} className="text-zinc-400 hover:text-zinc-900 p-2 bg-zinc-50 rounded-full transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-8">
               <div className="w-8 h-8 bg-[hsl(357,83%,37%)] rounded-lg flex items-center justify-center">
                 {editId ? <Pencil size={14} className="text-white" /> : <Plus size={14} className="text-white" />}
               </div>
               <h2 className="text-xl font-bold text-zinc-900">
                 {editId ? 'Modifier l\'élément' : 'Nouvelle promotion'}
               </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-3">
                    <label className={LABEL}>Titre principal</label>
                    <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="Ex: iPhone 16 Pro Max" className={INPUT} />
                  </div>
                  <div className="md:col-span-1">
                    <label className={LABEL}>Position</label>
                    <input type="number" value={form.sort_order}
                      onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                      className={cn(INPUT, "text-center")} />
                  </div>
                </div>

                <div>
                  <label className={LABEL}>Badge / Sous-titre</label>
                  <input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                    placeholder="Ex: Arrivage exceptionnel" className={INPUT} />
                </div>

                <div>
                  <label className={LABEL}>Message Action WhatsApp</label>
                  <div className="relative">
                    <textarea rows={3} value={form.whatsapp_message}
                      onChange={e => setForm(f => ({ ...f, whatsapp_message: e.target.value }))}
                      placeholder="Bonjour, je suis intéressé par cette promotion..."
                      className={cn(INPUT, "pl-12 resize-none")} />
                    <Send size={16} className="absolute left-5 top-5 text-zinc-300" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <label className={LABEL}>Visuel de l'annonce</label>
                {form.image_url ? (
                  <div className="relative w-full aspect-[16/7] rounded-3xl overflow-hidden border-2 border-zinc-100 group">
                    <img src={resolveUrl(form.image_url)} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                       <button onClick={() => setPickerOpen(true)} className="bg-white/90 backdrop-blur text-zinc-900 rounded-xl px-4 py-2 font-bold text-xs flex items-center gap-2">
                         <ImageIcon size={14} /> Changer l'image
                       </button>
                    </div>
                    <button type="button" onClick={() => setForm(f => ({ ...f, image_url: '' }))}
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full p-2 shadow-lg hover:bg-red-50 transition-colors">
                      <X size={16} className="text-red-500" />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => setPickerOpen(true)}
                    className="flex flex-col items-center justify-center w-full aspect-[16/7] border-4 border-dashed border-zinc-100 rounded-[2.5rem] cursor-pointer hover:border-[hsl(357,83%,37%)]/30 hover:bg-zinc-50 transition-all"
                  >
                    <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4 border border-zinc-100">
                      <ImageIcon size={24} className="text-zinc-300" />
                    </div>
                    <span className="text-sm font-bold text-zinc-400">Cliquez pour ajouter une image</span>
                    <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-300 mt-1">1600 × 700 recommandé</span>
                  </div>
                )}
                
                <div className="mt-auto pt-6 flex items-center gap-4">
                  <div
                    onClick={() => setForm(f => ({ ...f, active: f.active ? 0 : 1 }))}
                    className={cn(
                      "w-14 h-8 rounded-full transition-all relative cursor-pointer",
                      form.active ? 'bg-green-500 shadow-lg shadow-green-500/20' : 'bg-zinc-200'
                    )}>
                    <span className={cn(
                      "absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform",
                      form.active ? 'translate-x-7' : 'translate-x-1'
                    )} />
                  </div>
                  <span className="text-sm font-bold text-zinc-500">Visible sur le site</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-8 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-2 text-sm font-bold">
                <X size={16} /> {error}
              </div>
            )}

            <div className="flex gap-4 mt-10">
              <Button onClick={save} className="rounded-2xl px-10 h-14 font-black">
                {editId ? 'Confirmer les modifications' : 'Publier l\'annonce'}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="rounded-2xl px-8 h-14 font-bold border-zinc-200 text-zinc-500">
                Annuler
              </Button>
            </div>
          </div>
        )}

        {/* List Grid */}
        {items.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-20 border border-zinc-100 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6 border border-zinc-100">
              <Megaphone size={32} className="text-zinc-200" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">Aucune annonce programmée</h3>
            <p className="text-zinc-400 max-w-xs mx-auto">Créez votre première annonce pour dynamiser votre page d'accueil avec des offres exceptionnelles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {items.map(a => (
              <div 
                key={a.id} 
                className={cn(
                  "bg-white rounded-[2.5rem] overflow-hidden border border-zinc-100 shadow-sm hover:shadow-xl transition-all group",
                  !a.active && "opacity-60"
                )}
              >
                <div className="relative aspect-[16/7]">
                  <img src={resolveUrl(a.image_url)} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <div className="bg-white/90 backdrop-blur h-10 px-4 rounded-xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-zinc-900 shadow-lg">
                      Ordre : {a.sort_order}
                    </div>
                  </div>
                  {!a.active && (
                    <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-[2px] flex items-center justify-center">
                       <div className="bg-zinc-900 text-white rounded-full px-4 py-1.5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                         <EyeOff size={12} /> Hors ligne
                       </div>
                    </div>
                  )}
                </div>

                <div className="p-8">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      {a.subtitle && (
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[hsl(357,83%,37%)] mb-2 block">
                           {a.subtitle}
                        </span>
                      )}
                      <h3 className="text-xl font-bold text-zinc-900 truncate group-hover:text-[hsl(357,83%,37%)] transition-colors">
                        {a.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-4">
                         <button 
                           onClick={() => toggle(a.id)}
                           className={cn(
                             "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all",
                             a.active 
                               ? "border-green-100 bg-green-50 text-green-700" 
                               : "border-zinc-200 bg-zinc-50 text-zinc-500"
                           )}
                         >
                           {a.active ? <><Eye size={12} /> Actif</> : <><EyeOff size={12} /> Masqué</>}
                         </button>
                      </div>
                    </div>

                    <div className="flex gap-2 shrink-0">
                       <button 
                         onClick={() => openEdit(a)} 
                         className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 hover:bg-[hsl(357,83%,37%)] hover:text-white transition-all shadow-inner"
                       >
                         <Pencil size={16} />
                       </button>
                       <button 
                         onClick={() => del(a.id)} 
                         className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400 hover:bg-red-500 hover:text-white transition-all shadow-inner"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={urls => { if (urls[0]) setForm(f => ({ ...f, image_url: urls[0] })) }}
        already={form.image_url ? [form.image_url] : []}
      />
    </AdminLayout>
  )
}
