import { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus, X, Check, Upload, Image, Search, Package, Sparkles } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { adminGetProducts, adminGetCategories, adminCreateProduct, adminUpdateProduct, adminDeleteProduct, adminUpload, adminSuggestSEO } from '@/lib/admin'
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
  images: [] as string[] ,
  seo_title: '',
  seo_description: ''
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
  seo_title?: string | null
  seo_description?: string | null
}

export default function Products() {
  const [searchParams]          = useSearchParams()
  const catParam               = searchParams.get('category_id')
  
  const [products, setProducts]   = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm]           = useState(EMPTY_FORM)
  const [editId, setEditId]       = useState<number | null>(null)
  const [showForm, setShowForm]   = useState(false)
  const [error, setError]         = useState('')
  const [uploading, setUploading] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)

  const [query, setQuery]         = useState('')
  const [filterCat, setFilterCat] = useState('')

  useEffect(() => {
    if (catParam) setFilterCat(catParam)
  }, [catParam])

  const load = async () => {
    const [p, c] = await Promise.all([adminGetProducts(), adminGetCategories()])
    setProducts(p); setCategories(c)
  }
  useEffect(() => { load() }, [])

  const filtered = products.filter(p => {
    const mSearch = p.name.toLowerCase().includes(query.toLowerCase())
    const mCat    = !filterCat || p.categoryId?.toString() === filterCat
    return mSearch && mCat
  })

  const autoSlug = (name: string) => name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
  const openNew = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); setError('') }
  const openEdit = async (p: Product) => {
    setForm({
      name: p.name, slug: p.slug, price: p.price,
      categoryId: p.categoryId ?? '',
      condition: p.condition || 'excellent',
      conditionScore: p.conditionScore,
      specs: p.specs || '', description: p.description || '',
      status: p.status,
      images: p.gallery || [],
      seo_title: p.seo_title || '',
      seo_description: p.seo_description || '',
    })
    setEditId(p.id); setShowForm(true); setError('')
  }

  const handleSuggestSEO = async () => {
    if (!form.name) return alert("Veuillez d'abord saisir un nom de produit.")
    try {
      const res = await adminSuggestSEO({ 
        name: form.name, 
        description: form.description, 
        categoryId: form.categoryId ? parseInt(form.categoryId.toString()) : null 
      })
      setForm(f => ({ 
        ...f, 
        seo_title: res.seo_title, 
        seo_description: res.seo_description 
      }))
    } catch {
      alert("Échec de la suggestion SEO")
    }
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
    if (!confirm('Déplacer ce produit dans la corbeille ?')) return
    await adminDeleteProduct(id).then(load).catch(() => {})
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Catalogue</h1>
            <p className="text-zinc-500 text-sm mt-1">Gérez vos {products.length} produits et leur visibilité.</p>
          </div>
          <Button onClick={openNew} className="rounded-xl h-11 px-6 shadow-lg shadow-[hsl(357,83%,37%)]/20">
            <Plus size={18} className="mr-2" /> 
            <span>Nouveau produit</span>
          </Button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[hsl(357,83%,37%)] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher un produit..." 
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(357,83%,37%)]/10 focus:border-[hsl(357,83%,37%)] transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-4">
            <select 
              value={filterCat}
              onChange={e => setFilterCat(e.target.value)}
              className="bg-white border border-zinc-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[hsl(357,83%,37%)] shadow-sm min-w-[160px]"
            >
              <option value="">Toutes catégories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {showForm && (
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 mb-10 shadow-xl shadow-zinc-200/50 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-50">
              <h2 className="text-xl font-bold">{editId ? 'Modifier le produit' : 'Nouveau produit'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                <X size={20} className="text-zinc-400" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <div className="sm:col-span-1">
                <label className="text-xs font-bold text-zinc-400 mb-2 block uppercase tracking-wider">Identification</label>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Nom du produit</label>
                    <input className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:border-[hsl(357,83%,37%)] focus:ring-0 outline-none transition-colors" value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: autoSlug(e.target.value) }))} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 mb-1.5 block">URL Simplifiée (Slug)</label>
                    <input className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:border-[hsl(357,83%,37%)] focus:ring-0 outline-none transition-colors" value={form.slug}
                      onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-1">
                <label className="text-xs font-bold text-zinc-400 mb-2 block uppercase tracking-wider">Tarification & Catégorie</label>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Prix (€)</label>
                      <input className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:border-[hsl(357,83%,37%)]" value={form.price}
                        onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Catégorie</label>
                      <select className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:border-[hsl(357,83%,37%)] cursor-pointer" value={form.categoryId}
                        onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}>
                        <option value="">— Sélectionner —</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Statut de visibilité</label>
                    <select className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:border-[hsl(357,83%,37%)] cursor-pointer" value={form.status}
                      onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                      {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-1">
                <label className="text-xs font-bold text-zinc-400 mb-2 block uppercase tracking-wider">État du produit</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Qualité</label>
                    <select className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:border-[hsl(357,83%,37%)] cursor-pointer" value={form.condition}
                      onChange={e => setForm(f => ({ ...f, condition: e.target.value }))}>
                      {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Note /100</label>
                    <input type="number" min={0} max={100} className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm" value={form.conditionScore}
                      onChange={e => setForm(f => ({ ...f, conditionScore: parseInt(e.target.value) || 0 }))} />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-1">
                <label className="text-xs font-bold text-zinc-400 mb-2 block uppercase tracking-wider">Détails techniques</label>
                <div>
                  <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Spécifications rapides</label>
                  <input className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:border-[hsl(357,83%,37%)]" value={form.specs}
                    onChange={e => setForm(f => ({ ...f, specs: e.target.value }))} placeholder="Ex: 256GB · 120Hz · Face ID" />
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2">
                <label className="text-xs font-medium text-zinc-500 mb-1.5 block uppercase tracking-wider font-bold text-zinc-400">Description détaillée</label>
                <textarea rows={4} className="w-full border border-zinc-200 rounded-2xl px-4 py-3 text-sm focus:border-[hsl(357,83%,37%)] outline-none" value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Galerie Photos ({form.images.length}/{MAX_IMAGES})</label>
                  <button type="button" onClick={() => setPickerOpen(true)}
                    disabled={form.images.length >= MAX_IMAGES}
                    className="flex items-center gap-2 text-xs font-bold text-[hsl(357,83%,37%)] hover:bg-[hsl(357,83%,37%)]/5 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-30">
                    <Image size={14} /> Médiathèque
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {Array.from({ length: MAX_IMAGES }).map((_, i) => {
                    const url = form.images[i]
                    return url ? (
                      <div key={i} className="relative group aspect-square rounded-2xl overflow-hidden border border-zinc-100 shadow-sm">
                        {i === 0 && <span className="absolute top-2 left-2 z-10 bg-black/70 text-white text-[9px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">Affiche</span>}
                        <img src={resolveUrl(url)} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <button type="button" onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                          className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-zinc-500 hover:text-red-600 p-1.5 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <label key={i} className="aspect-square border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[hsl(357,83%,37%)] hover:bg-[hsl(357,83%,37%)]/[0.02] transition-all group">
                        <Upload size={20} className="text-zinc-300 group-hover:text-[hsl(357,83%,37%)] mb-2 transition-colors" />
                        <span className="text-[10px] font-bold text-zinc-400 group-hover:text-[hsl(357,83%,37%)] uppercase tracking-widest">{uploading && i === form.images.length ? '...' : 'Ajouter'}</span>
                        <input type="file" accept="image/*" multiple className="hidden" onChange={e => e.target.files && handleImageUpload(e.target.files)} />
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* SEO SECTION */}
              <div className="col-span-1 sm:col-span-2 pt-6 border-t border-zinc-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">SEO & Visibilité</label>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Optimisez l'affichage sur Google et les réseaux sociaux.</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleSuggestSEO}
                    className="flex items-center gap-2 text-[11px] font-bold text-[hsl(357,83%,37%)] hover:bg-[hsl(357,83%,37%)]/5 px-4 py-2 rounded-xl border border-[hsl(357,83%,37%)]/20 transition-all active:scale-95"
                  >
                    <Sparkles size={14} className="fill-[hsl(357,83%,37%)]/10" /> Suggérer par IA
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-medium text-zinc-500 block">Meta Titre</label>
                      <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded", (form.seo_title?.length || 0) > 60 ? "bg-orange-100 text-orange-600" : "bg-zinc-100 text-zinc-400")}>
                        {form.seo_title?.length || 0}/60
                      </span>
                    </div>
                    <input 
                      placeholder="Ex: Appareil Photo Sony Alpha 7 IV - Neuf | ProMedias"
                      className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:border-[hsl(357,83%,37%)] outline-none" 
                      value={form.seo_title || ''}
                      onChange={e => setForm(f => ({ ...f, seo_title: e.target.value }))} 
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-medium text-zinc-500 block">Meta Description</label>
                      <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded", (form.seo_description?.length || 0) > 160 ? "bg-orange-100 text-orange-600" : "bg-zinc-100 text-zinc-400")}>
                        {form.seo_description?.length || 0}/160
                      </span>
                    </div>
                    <textarea 
                      rows={2} 
                      placeholder="Une brève description accrocheuse pour les résultats de recherche..."
                      className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-[hsl(357,83%,37%)] outline-none resize-none" 
                      value={form.seo_description || ''}
                      onChange={e => setForm(f => ({ ...f, seo_description: e.target.value }))} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100">{error}</div>}
            
            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              <Button onClick={save} className="rounded-xl h-12 px-8 flex-1 sm:flex-none shadow-lg shadow-[hsl(357,83%,37%)]/20"><Check size={18} className="mr-2" />Enregistrer</Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="rounded-xl h-12 px-8 flex-1 sm:flex-none">Annuler</Button>
            </div>
          </div>
        )}

        {/* Product Cards Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(p => (
              <div key={p.id} className="group bg-white border border-zinc-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-zinc-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-50">
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    <StatusBadge status={p.status} />
                    {p.condition && (
                      <span className="bg-white/90 backdrop-blur-sm text-[9px] font-black uppercase text-zinc-900 px-2 py-1 rounded-full shadow-sm w-fit border border-white">
                        {p.condition} · {p.conditionScore}%
                      </span>
                    )}
                  </div>
                  {p.image ? (
                    <img src={resolveUrl(p.image)} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={40} className="text-zinc-200" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-bold text-zinc-900 line-clamp-1 group-hover:text-[hsl(357,83%,37%)] transition-colors">{p.name}</h3>
                      <span className="text-sm font-black text-zinc-900 shrink-0">{p.price}</span>
                    </div>
                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-4">
                      {categories.find(c => c.id.toString() === p.categoryId?.toString())?.name || 'Sans catégorie'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-2 pt-4 border-t border-zinc-50">
                    <button 
                      onClick={() => openEdit(p)}
                      className="flex-1 flex items-center justify-center gap-2 bg-zinc-50 hover:bg-[hsl(357,83%,37%)]/10 text-zinc-600 hover:text-[hsl(357,83%,37%)] font-bold text-[11px] uppercase tracking-wider py-2.5 rounded-xl transition-all"
                    >
                      <Pencil size={12} /> Modifier
                    </button>
                    <button 
                      onClick={() => del(p.id)}
                      className="p-2.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-zinc-50/50 border-2 border-dashed border-zinc-100 rounded-[2rem] py-20 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Search size={24} className="text-zinc-200" />
            </div>
            <h3 className="text-zinc-900 font-bold">Aucun produit trouvé</h3>
            <p className="text-zinc-400 text-sm mt-1">Essayez d'ajuster votre recherche ou vos filtres.</p>
            {query || filterCat ? (
              <button onClick={() => { setQuery(''); setFilterCat('') }} className="mt-6 text-sm font-bold text-[hsl(357,83%,37%)] hover:underline decoration-2 underline-offset-4">
                Effacer les filtres
              </button>
            ) : null}
          </div>
        )}
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
