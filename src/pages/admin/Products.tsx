import { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus, X, Check, Upload, Image } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { adminGetProducts, adminGetCategories, adminCreateProduct, adminUpdateProduct, adminDeleteProduct, adminUpload } from '@/lib/admin'
import { resolveUrl } from '@/lib/woocommerce'
import { cn } from '@/lib/utils'
import MediaPicker from '@/components/admin/MediaPicker'

const CONDITIONS = [
  { value: 'excellent',  label: 'Excellent'  },
  { value: 'tres-bon',   label: 'Très bon'   },
  { value: 'bon',        label: 'Bon'        },
]
const STATUSES = [
  { value: 'published', label: 'Publié' },
  { value: 'draft',     label: 'Brouillon' },
  { value: 'sold',      label: 'Vendu' },
]

const MAX_IMAGES = 5
const EMPTY_FORM = { 
  name: '', 
  slug: '', 
  price: '', 
  categoryId: '' as string | number, 
  condition: 'excellent', 
  conditionScore: 100, 
  specs: '', 
  description: '', 
  status: 'published', 
  images: [] as string[] 
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = { published: 'bg-green-100 text-green-700', draft: 'bg-zinc-100 text-zinc-500', sold: 'bg-orange-100 text-orange-700' }
  const labels: Record<string, string> = { published: 'Publié', draft: 'Brouillon', sold: 'Vendu' }
  return <span className={cn('text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide', map[status] || 'bg-zinc-100 text-zinc-500')}>{labels[status] || status}</span>
}

interface Category {
  id: number
  name: string
}

interface Product {
  id: number
  name: string
  slug: string
  price: string
  categoryId?: number | string
  condition: string
  conditionScore: number
  specs?: string
  description?: string
  status: string
  image?: string
  gallery?: string[]
  category?: string
}

export default function Products() {
  const [products, setProducts]   = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm]           = useState(EMPTY_FORM)
  const [editId, setEditId]       = useState<number | null>(null)
  const [showForm, setShowForm]   = useState(false)
  const [error, setError]         = useState('')
  const [uploading, setUploading] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)

  const load = async () => {
    const [p, c] = await Promise.all([adminGetProducts(), adminGetCategories()])
    setProducts(p); setCategories(c)
  }
  useEffect(() => { load() }, [])

  const autoSlug = (name: string) => name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')

  const openNew = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); setError('') }
  const openEdit = async (p: Product) => {
    setForm({
      name: p.name, slug: p.slug, price: p.price,
      categoryId: p.categoryId ?? '',
      condition: ({ 'Excellent': 'excellent', 'Très bon': 'tres-bon', 'Bon': 'bon' } as Record<string, string>)[p.condition] || 'excellent',
      conditionScore: p.conditionScore,
      specs: p.specs || '', description: p.description || '',
      status: p.status,
      images: p.gallery || [],
    })
    setEditId(p.id); setShowForm(true); setError('')
  }

  const handleImageUpload = async (files: FileList) => {
    setUploading(true)
    try {
      const slots = MAX_IMAGES - form.images.length
      const toUpload = Array.from(files).slice(0, slots)
      const urls = await Promise.all(toUpload.map(f => adminUpload(f, 'product')))
      setForm(f => ({ ...f, images: [...f.images, ...urls].slice(0, MAX_IMAGES) }))
    } catch (err: unknown) { 
      alert(err instanceof Error ? err.message : 'Upload failed') 
    }
    finally { setUploading(false) }
  }

  const handlePickerSelect = (urls: string[]) => {
    setForm(f => {
      const next = [...f.images, ...urls.filter(u => !f.images.includes(u))].slice(0, MAX_IMAGES)
      return { ...f, images: next }
    })
  }

  const save = async () => {
    setError('')
    try {
      const payload = { ...form, categoryId: form.categoryId ? parseInt(form.categoryId.toString()) : null }
      if (editId) await adminUpdateProduct(editId, payload)
      else await adminCreateProduct(payload)
      setShowForm(false); load()
    } catch (err: unknown) { 
      setError(err instanceof Error ? err.message : 'Une erreur est survenue') 
    }
  }

  const del = async (id: number) => {
    if (!confirm('Supprimer ce produit ?')) return
    await adminDeleteProduct(id).then(load).catch(() => {})
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Produits</h1>
            <p className="text-zinc-500 text-sm">{products.length} produit{products.length !== 1 ? 's' : ''}</p>
          </div>
          <Button onClick={openNew} className="w-full sm:w-auto"><Plus size={16} className="mr-2" />Nouveau produit</Button>
        </div>

        {showForm && (
          <div className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-6 mb-8 shadow-sm">
            <h2 className="font-semibold mb-4">{editId ? 'Modifier le produit' : 'Nouveau produit'}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-1">
                <label className="text-xs font-medium text-zinc-500 mb-1 block">Nom</label>
                <input className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: autoSlug(e.target.value) }))} />
              </div>
              <div className="sm:col-span-1">
                <label className="text-xs font-medium text-zinc-500 mb-1 block">Slug</label>
                <input className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm" value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
              </div>
              <div className="sm:col-span-1">
                <label className="text-xs font-medium text-zinc-500 mb-1 block">Prix (ex: 599 €)</label>
                <input className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm" value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
              </div>
              <div className="sm:col-span-1">
                <label className="text-xs font-medium text-zinc-500 mb-1 block">Catégorie</label>
                <select className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm" value={form.categoryId}
                  onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}>
                  <option value="">— Aucune —</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="sm:col-span-1">
                <label className="text-xs font-medium text-zinc-500 mb-1 block">État</label>
                <select className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm" value={form.condition}
                  onChange={e => setForm(f => ({ ...f, condition: e.target.value }))}>
                  {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div className="sm:col-span-1">
                <label className="text-xs font-medium text-zinc-500 mb-1 block">Score état (0-100)</label>
                <input type="number" min={0} max={100} className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm" value={form.conditionScore}
                  onChange={e => setForm(f => ({ ...f, conditionScore: parseInt(e.target.value) || 0 }))} />
              </div>
              <div className="sm:col-span-1">
                <label className="text-xs font-medium text-zinc-500 mb-1 block">Statut</label>
                <select className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm" value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div className="sm:col-span-1">
                <label className="text-xs font-medium text-zinc-500 mb-1 block">Spécifications courtes</label>
                <input className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm" value={form.specs}
                  onChange={e => setForm(f => ({ ...f, specs: e.target.value }))} placeholder="Ex: 256GB · Face ID · 5G" />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="text-xs font-medium text-zinc-500 mb-1 block">Description</label>
                <textarea rows={3} className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm" value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              {/* Images — max 5 slots */}
              <div className="col-span-1 sm:col-span-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <label className="text-xs font-medium text-zinc-500">
                    Photos <span className="text-zinc-400 font-normal">({form.images.length}/{MAX_IMAGES})</span>
                  </label>
                  <button type="button" onClick={() => setPickerOpen(true)}
                    disabled={form.images.length >= MAX_IMAGES}
                    className="flex items-center justify-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-400 rounded-lg px-2.5 py-1.5 sm:py-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    <Image size={12} />
                    Depuis la médiathèque
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {Array.from({ length: MAX_IMAGES }).map((_, i) => {
                    const url = form.images[i]
                    return url ? (
                      <div key={i} className="relative group">
                        {i === 0 && (
                          <span className="absolute top-1.5 left-1.5 z-10 bg-zinc-900/70 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-md">
                            Principale
                          </span>
                        )}
                        <img src={resolveUrl(url)} alt="" className="w-full aspect-square object-cover rounded-xl border border-zinc-200" />
                        <button type="button"
                          onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                          className="absolute -top-2 -right-2 bg-white border border-zinc-200 rounded-full p-0.5 hover:bg-red-50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-sm">
                          <X size={12} className="text-zinc-500" />
                        </button>
                      </div>
                    ) : (
                      <label key={i} className="aspect-square border-2 border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-zinc-400 hover:bg-zinc-50 transition-colors">
                        <Upload size={14} className="text-zinc-300 mb-1" />
                        <span className="text-[10px] text-zinc-300 text-center px-1">{uploading && i === form.images.length ? 'Upload…' : 'Ajouter'}</span>
                        <input type="file" accept="image/*" multiple className="hidden"
                          onChange={e => e.target.files && handleImageUpload(e.target.files)} />
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            <div className="flex flex-col sm:flex-row gap-2 mt-6">
              <Button onClick={save} className="w-full sm:w-auto"><Check size={14} className="mr-1" />Enregistrer</Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="w-full sm:w-auto"><X size={14} className="mr-1" />Annuler</Button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px] sm:min-w-full">
              <thead className="bg-zinc-50 border-b border-zinc-100">
                <tr>
                  <th className="text-left px-4 lg:px-6 py-3 font-medium text-zinc-500 w-12"></th>
                  <th className="text-left px-4 lg:px-6 py-3 font-medium text-zinc-500">Nom</th>
                  <th className="text-left px-4 lg:px-6 py-3 font-medium text-zinc-500">Prix</th>
                  <th className="text-left px-4 lg:px-6 py-3 font-medium text-zinc-500">Catégorie</th>
                  <th className="text-left px-4 lg:px-6 py-3 font-medium text-zinc-500">Statut</th>
                  <th className="text-right px-4 lg:px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-zinc-50/50">
                    <td className="px-4 lg:px-6 py-4">
                      {p.image
                        ? <img src={resolveUrl(p.image)} alt="" className="h-10 w-12 object-cover rounded-lg" />
                        : <div className="h-10 w-12 bg-zinc-100 rounded-lg" />}
                    </td>
                    <td className="px-4 lg:px-6 py-4 font-medium max-w-[150px] truncate">{p.name}</td>
                    <td className="px-4 lg:px-6 py-4 text-zinc-600 font-medium">{p.price}</td>
                    <td className="px-4 lg:px-6 py-4 text-zinc-500">{p.category}</td>
                    <td className="px-4 lg:px-6 py-4"><StatusBadge status={p.status} /></td>
                    <td className="px-4 lg:px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => openEdit(p)} className="text-zinc-400 hover:text-zinc-900 transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => del(p.id)} className="text-zinc-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-zinc-400">Aucun produit</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Scroll hint for mobile */}
          <div className="lg:hidden bg-zinc-50 px-4 py-2 text-[10px] text-zinc-400 text-center uppercase tracking-widest border-t border-zinc-100">
            Faites défiler pour voir plus →
          </div>
        </div>
      </div>
      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handlePickerSelect}
        multiple
        already={form.images}
      />
    </AdminLayout>
  )
}
