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
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-2xl font-bold text-zinc-900">Annonces</p>
            <p className="text-zinc-500 text-sm">{items.length} annonce{items.length !== 1 ? 's' : ''} · affichées en slider sur le site</p>
          </div>
          <Button onClick={openNew}><Plus size={15} className="mr-1.5" />Nouvelle annonce</Button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 mb-8 shadow-sm">
            <p className="font-semibold text-zinc-900 mb-5">{editId ? 'Modifier l\'annonce' : 'Nouvelle annonce'}</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Titre *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Ex: iPhone 14 Pro — 128 Go" className={INPUT} />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Sous-titre / étiquette</label>
                <input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                  placeholder="Ex: Nouveau stock" className={INPUT} />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Message WhatsApp</label>
                <textarea rows={2} value={form.whatsapp_message}
                  onChange={e => setForm(f => ({ ...f, whatsapp_message: e.target.value }))}
                  placeholder="Message pré-rempli quand l'utilisateur clique sur le bouton WhatsApp…"
                  className={TEXTAREA} />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Ordre d'affichage</label>
                <input type="number" value={form.sort_order}
                  onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                  className={INPUT} />
              </div>
              <div className="flex items-end pb-0.5">
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
              <div className="col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-zinc-500">Image de bannière *</label>
                  <button type="button" onClick={() => setPickerOpen(true)}
                    className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-400 rounded-lg px-2.5 py-1 transition-colors">
                    <Image size={12} /> Médiathèque
                  </button>
                </div>
                {form.image_url ? (
                  <div className="relative inline-block">
                    <img src={resolveUrl(form.image_url)} alt=""
                      className="w-full max-h-52 object-cover rounded-xl border border-zinc-200" />
                    <button type="button" onClick={() => setForm(f => ({ ...f, image_url: '' }))}
                      className="absolute -top-2 -right-2 bg-white border border-zinc-200 rounded-full p-0.5 hover:bg-red-50 shadow">
                      <X size={13} className="text-zinc-500" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-zinc-200 rounded-xl cursor-pointer hover:border-zinc-400 hover:bg-zinc-50 transition-colors">
                    <Image size={22} className="text-zinc-300 mb-2" />
                    <span className="text-sm text-zinc-400">{uploading ? 'Importation…' : 'Glisser ou cliquer pour importer'}</span>
                    <span className="text-xs text-zinc-300 mt-1">Recommandé : 1600 × 600 px</span>
                    <input type="file" accept="image/*" className="hidden"
                      onChange={e => e.target.files?.length && handleUpload(e.target.files)} />
                  </label>
                )}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            <div className="flex gap-2 mt-5">
              <Button onClick={save}><Check size={14} className="mr-1" />Enregistrer</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}><X size={14} className="mr-1" />Annuler</Button>
            </div>
          </div>
        )}

        {/* List */}
        <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
          {items.length === 0 ? (
            <div className="px-6 py-12 text-center text-zinc-400 text-sm">
              Aucune annonce — créez-en une pour alimenter le slider du site.
            </div>
          ) : (
            <div className="divide-y divide-zinc-50">
              {items.map(a => (
                <div key={a.id} className="flex items-center gap-4 px-5 py-3 hover:bg-zinc-50/50 transition-colors">
                  <GripVertical size={15} className="text-zinc-300 shrink-0" />

                  {/* Thumbnail */}
                  <div className="w-24 h-14 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                    <img src={resolveUrl(a.image_url)} alt={a.title} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 truncate">{a.title}</p>
                    {a.subtitle && <p className="text-xs text-zinc-400">{a.subtitle}</p>}
                    {a.whatsapp_message && (
                      <p className="text-xs text-zinc-400 truncate mt-0.5">💬 {a.whatsapp_message}</p>
                    )}
                  </div>

                  <span className="text-xs text-zinc-400 shrink-0">#{a.sort_order}</span>

                  <button onClick={() => toggle(a.id)}
                    className={`shrink-0 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors ${
                      a.active
                        ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-400 hover:bg-zinc-100'
                    }`}>
                    {a.active ? <><Eye size={12} />Visible</> : <><EyeOff size={12} />Masqué</>}
                  </button>

                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => openEdit(a)} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => del(a.id)} className="text-zinc-400 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
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
