import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Check, Eye, EyeOff, GripVertical, Image } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import {
  adminGetAnnouncements, adminCreateAnnouncement, adminUpdateAnnouncement,
  adminToggleAnnouncement, adminDeleteAnnouncement, adminUpload,
} from '@/lib/admin'
import { resolveUrl } from '@/lib/woocommerce'
import MediaPicker from '@/components/admin/MediaPicker'

const INPUT    = 'w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors bg-white'
const TEXTAREA = INPUT + ' resize-none'

const EMPTY = { title: '', subtitle: '', image_url: '', whatsapp_message: '', sort_order: 0, active: 1 }

export default function Announcements() {
  const [items, setItems]       = useState<any[]>([])
  const [form, setForm]         = useState(EMPTY)
  const [editId, setEditId]     = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError]       = useState('')
  const [uploading, setUploading] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)

  const load = () => adminGetAnnouncements().then(setItems).catch(() => {})
  useEffect(() => { load() }, [])

  const openNew  = () => { setForm(EMPTY); setEditId(null); setShowForm(true); setError('') }
  const openEdit = (a: any) => {
    setForm({
      title: a.title, subtitle: a.subtitle ?? '', image_url: a.image_url,
      whatsapp_message: a.whatsapp_message ?? '', sort_order: a.sort_order, active: a.active,
    })
    setEditId(a.id); setShowForm(true); setError('')
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
    } catch (e: any) { setError(e.message) }
  }

  const toggle = async (id: number) => { await adminToggleAnnouncement(id); load() }
  const del    = async (id: number) => {
    if (!confirm('Supprimer cette annonce ?')) return
    await adminDeleteAnnouncement(id).then(load).catch(() => {})
  }

  const handleUpload = async (files: FileList) => {
    setUploading(true)
    try {
      const url = await adminUpload(files[0], 'product')
      setForm(f => ({ ...f, image_url: url }))
    } catch (e: any) { alert(e.message) }
    finally { setUploading(false) }
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-2xl font-bold text-zinc-900">Annonces</p>
            <p className="text-zinc-500 text-sm">{items.length} annonce{items.length !== 1 ? 's' : ''} · affichées en slider sur le site</p>
          </div>
          <Button onClick={openNew} className="w-full sm:w-auto"><Plus size={15} className="mr-1.5" />Nouvelle annonce</Button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-6 mb-8 shadow-sm">
            <p className="font-semibold text-zinc-900 mb-5">{editId ? 'Modifier l\'annonce' : 'Nouvelle annonce'}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-1">
                <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Titre *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Ex: iPhone 14 Pro — 128 Go" className={INPUT} />
              </div>
              <div className="sm:col-span-1">
                <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Sous-titre / étiquette</label>
                <input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                  placeholder="Ex: Nouveau stock" className={INPUT} />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Message WhatsApp</label>
                <textarea rows={2} value={form.whatsapp_message}
                  onChange={e => setForm(f => ({ ...f, whatsapp_message: e.target.value }))}
                  placeholder="Message pré-rempli quand l'utilisateur clique sur le bouton WhatsApp…"
                  className={TEXTAREA} />
              </div>

              <div className="sm:col-span-1">
                <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Ordre d'affichage</label>
                <input type="number" value={form.sort_order}
                  onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                  className={INPUT} />
              </div>
              <div className="sm:col-span-1 flex items-end pb-3 sm:pb-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    onClick={() => setForm(f => ({ ...f, active: f.active ? 0 : 1 }))}
                    className={`w-10 h-5 rounded-full transition-colors relative ${form.active ? 'bg-green-500' : 'bg-zinc-200'}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.active ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                  <span className="text-sm text-zinc-600">Visible sur le site</span>
                </label>
              </div>

              {/* Image */}
              <div className="col-span-1 sm:col-span-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <label className="text-xs font-medium text-zinc-500">Image de bannière *</label>
                  <button type="button" onClick={() => setPickerOpen(true)}
                    className="flex items-center justify-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-400 rounded-lg px-2.5 py-1.5 sm:py-1 transition-colors">
                    <Image size={12} /> Médiathèque
                  </button>
                </div>
                {form.image_url ? (
                  <div className="relative inline-block w-full sm:w-auto">
                    <img src={resolveUrl(form.image_url)} alt=""
                      className="w-full sm:max-w-md max-h-52 object-cover rounded-xl border border-zinc-200" />
                    <button type="button" onClick={() => setForm(f => ({ ...f, image_url: '' }))}
                      className="absolute -top-2 -right-2 bg-white border border-zinc-200 rounded-full p-0.5 hover:bg-red-50 shadow">
                      <X size={13} className="text-zinc-500" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-zinc-200 rounded-xl cursor-pointer hover:border-zinc-400 hover:bg-zinc-50 transition-colors">
                    <Image size={22} className="text-zinc-300 mb-2" />
                    <span className="text-sm text-zinc-400 text-center px-4">{uploading ? 'Importation…' : 'Glisser ou cliquer pour importer'}</span>
                    <span className="text-xs text-zinc-300 mt-1">Recommandé : 1600 × 600 px</span>
                    <input type="file" accept="image/*" className="hidden"
                      onChange={e => e.target.files?.length && handleUpload(e.target.files)} />
                  </label>
                )}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            <div className="flex flex-col sm:flex-row gap-2 mt-6">
              <Button onClick={save} className="w-full sm:w-auto"><Check size={14} className="mr-1" />Enregistrer</Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="w-full sm:w-auto"><X size={14} className="mr-1" />Annuler</Button>
            </div>
          </div>
        )}

        {/* List */}
        <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm">
          {items.length === 0 ? (
            <div className="px-6 py-12 text-center text-zinc-400 text-sm">
              Aucune annonce — créez-en une pour alimenter le slider du site.
            </div>
          ) : (
            <div className="divide-y divide-zinc-50">
              {items.map(a => (
                <div key={a.id} className="flex flex-col sm:flex-row sm:items-center gap-4 px-4 sm:px-5 py-4 sm:py-3 hover:bg-zinc-50/50 transition-colors">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <GripVertical size={15} className="text-zinc-300 shrink-0 hidden sm:block" />

                    {/* Thumbnail */}
                    <div className="w-20 sm:w-24 h-12 sm:h-14 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                      <img src={resolveUrl(a.image_url)} alt={a.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 truncate">{a.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">#{a.sort_order}</span>
                        {a.subtitle && <span className="text-[10px] text-zinc-400 truncate">• {a.subtitle}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-zinc-100">
                    <button onClick={() => toggle(a.id)}
                      className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg border transition-colors ${
                        a.active
                          ? 'border-green-200 bg-green-50 text-green-700'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-400'
                      }`}>
                      {a.active ? <><Eye size={12} />Visible</> : <><EyeOff size={12} />Masqué</>}
                    </button>

                    <div className="flex gap-4 sm:gap-2">
                      <button onClick={() => openEdit(a)} className="p-1 text-zinc-400 hover:text-zinc-900 transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => del(a.id)} className="p-1 text-zinc-400 hover:text-red-500 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
