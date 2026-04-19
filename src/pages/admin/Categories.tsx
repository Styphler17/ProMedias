import { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus, X, Check, Search, Tag, Package } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { adminGetCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from '@/lib/admin'

const MAIN_CATS = [
  { value: 'telephonie',   label: 'Téléphonie'  },
  { value: 'informatique', label: 'Informatique' },
  { value: 'accessoires',  label: 'Accessoires'  },
]

interface Category {
  id: number
  name: string
  slug: string
  mainCategory: string
  description?: string
  productCount: number
}

const EMPTY = { name: '', slug: '', mainCategory: 'telephonie', description: '' }

export default function Categories() {
  const [cats, setCats]       = useState<Category[]>([])
  const [query, setQuery]     = useState('')
  const [form, setForm]       = useState(EMPTY)
  const [editId, setEditId]   = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError]     = useState('')

  const load = () => adminGetCategories().then(setCats).catch(() => {})
  useEffect(() => { load() }, [])

  const filtered = cats.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.mainCategory.toLowerCase().includes(query.toLowerCase())
  )

  const openNew  = () => { setForm(EMPTY); setEditId(null); setShowForm(true); setError('') }
  const openEdit = (c: Category) => { 
    setForm({ 
      name: c.name, 
      slug: c.slug, 
      mainCategory: c.mainCategory || 'telephonie', 
      description: c.description || '' 
    })
    setEditId(c.id); setShowForm(true); setError('') 
  }

  const save = async () => {
    setError('')
    try {
      if (editId) await adminUpdateCategory(editId, form)
      else await adminCreateCategory(form)
      setShowForm(false); load()
    } catch (e: unknown) { 
      setError(e instanceof Error ? e.message : 'Une erreur est survenue') 
    }
  }

  const del = async (id: number) => {
    if (!confirm('Supprimer cette catégorie ?')) return
    await adminDeleteCategory(id).then(load).catch(() => {})
  }

  const autoSlug = (name: string) => name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Catégories</h1>
            <p className="text-zinc-500 text-sm mt-1">Organisez vos produits par types et sections.</p>
          </div>
          <Button onClick={openNew} className="rounded-xl h-11 px-6 shadow-lg shadow-[hsl(357,83%,37%)]/20">
            <Plus size={18} className="mr-2" /> <span>Ajouter</span>
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative group mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[hsl(357,83%,37%)] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher une catégorie..." 
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-white border border-zinc-200 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(357,83%,37%)]/10 focus:border-[hsl(357,83%,37%)] transition-all shadow-sm"
          />
        </div>

        {showForm && (
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 mb-10 shadow-xl shadow-zinc-200/50 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-50">
              <h2 className="text-xl font-bold">{editId ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                <X size={20} className="text-zinc-400" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-1">
                <label className="text-xs font-medium text-zinc-500 mb-1.5 block uppercase font-bold tracking-wider">Identification</label>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-zinc-400 mb-1 block">Nom</label>
                    <input className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[hsl(357,83%,37%)]" value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: autoSlug(e.target.value) }))} />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-zinc-400 mb-1 block">URL Simplifiée (Slug)</label>
                    <input className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[hsl(357,83%,37%)]" value={form.slug}
                      onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-1">
                <label className="text-xs font-medium text-zinc-500 mb-1.5 block uppercase font-bold tracking-wider">Classification</label>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-zinc-400 mb-1 block">Catégorie parente</label>
                    <select className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm cursor-pointer outline-none focus:border-[hsl(357,83%,37%)]" value={form.mainCategory}
                      onChange={e => setForm(f => ({ ...f, mainCategory: e.target.value }))}>
                      {MAIN_CATS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-zinc-400 mb-1 block">Description</label>
                    <input className="w-full border border-zinc-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[hsl(357,83%,37%)]" value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
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

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(c => (
              <div key={c.id} className="group bg-white border border-zinc-100 rounded-3xl p-6 hover:shadow-2xl hover:shadow-zinc-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-zinc-50 group-hover:bg-[hsl(357,83%,37%)]/5 rounded-2xl flex items-center justify-center transition-colors">
                    <Tag size={20} className="text-zinc-300 group-hover:text-[hsl(357,83%,37%)] transition-colors" />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(c)} className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all"><Pencil size={14} /></button>
                    <button onClick={() => del(c.id)} className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 group-hover:text-[hsl(357,83%,37%)] mb-1 transition-colors">{c.name}</h3>
                  <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">{c.slug}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-zinc-50 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-2.5 py-1 bg-zinc-50 rounded-full border border-zinc-100 flex items-center gap-1.5">
                    <Tag size={10} />
                    {MAIN_CATS.find(m => m.value === c.mainCategory)?.label || c.mainCategory}
                  </span>
                  <span className="font-bold text-[10px] text-[hsl(357,83%,37%)] bg-[hsl(357,83%,37%)]/5 px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-[hsl(357,83%,37%)]/10">
                    <Package size={10} />
                    {c.productCount} {c.productCount > 1 ? 'Produits' : 'Produit'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-zinc-50/50 border-2 border-dashed border-zinc-100 rounded-[2rem] py-20 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Search size={24} className="text-zinc-200" />
            </div>
            <h3 className="text-zinc-900 font-bold">Aucune catégorie</h3>
            <p className="text-zinc-400 text-sm mt-1">Créez votre première catégorie pour organiser le shop.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
