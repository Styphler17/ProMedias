import { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus, X, Check } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { adminGetCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from '@/lib/admin'

const MAIN_CATS = [
  { value: 'telephonie',   label: 'Téléphonie'  },
  { value: 'informatique', label: 'Informatique' },
  { value: 'accessoires',  label: 'Accessoires'  },
]

const EMPTY = { name: '', slug: '', mainCategory: 'telephonie', description: '' }

export default function Categories() {
  const [cats, setCats]       = useState<any[]>([])
  const [form, setForm]       = useState(EMPTY)
  const [editId, setEditId]   = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError]     = useState('')

  const load = () => adminGetCategories().then(setCats).catch(() => {})
  useEffect(() => { load() }, [])

  const openNew  = () => { setForm(EMPTY); setEditId(null); setShowForm(true); setError('') }
  const openEdit = (c: any) => { setForm({ name: c.name, slug: c.slug, mainCategory: c.mainCategory || 'telephonie', description: c.description || '' }); setEditId(c.id); setShowForm(true); setError('') }

  const save = async () => {
    setError('')
    try {
      if (editId) await adminUpdateCategory(editId, form)
      else await adminCreateCategory(form)
      setShowForm(false); load()
    } catch (e: any) { setError(e.message) }
  }

  const del = async (id: number) => {
    if (!confirm('Supprimer cette catégorie ?')) return
    await adminDeleteCategory(id).then(load).catch(() => {})
  }

  const autoSlug = (name: string) => name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')

  return (
    <AdminLayout>
      <div className="p-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Catégories</h1>
            <p className="text-zinc-500 text-sm">{cats.length} catégorie{cats.length !== 1 ? 's' : ''}</p>
          </div>
          <Button onClick={openNew}><Plus size={16} className="mr-2" />Nouvelle catégorie</Button>
        </div>

        {showForm && (
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 mb-8 shadow-sm">
            <h2 className="font-semibold mb-4">{editId ? 'Modifier' : 'Nouvelle catégorie'}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-zinc-500 mb-1 block">Nom</label>
                <input className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: autoSlug(e.target.value) }))} />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500 mb-1 block">Slug</label>
                <input className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm" value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500 mb-1 block">Catégorie principale</label>
                <select className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm" value={form.mainCategory}
                  onChange={e => setForm(f => ({ ...f, mainCategory: e.target.value }))}>
                  {MAIN_CATS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500 mb-1 block">Description</label>
                <input className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm" value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            <div className="flex gap-2 mt-4">
              <Button onClick={save}><Check size={14} className="mr-1" />Enregistrer</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}><X size={14} className="mr-1" />Annuler</Button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-100">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-zinc-500">Nom</th>
                <th className="text-left px-6 py-3 font-medium text-zinc-500">Slug</th>
                <th className="text-left px-6 py-3 font-medium text-zinc-500">Type</th>
                <th className="text-right px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {cats.map(c => (
                <tr key={c.id} className="hover:bg-zinc-50/50">
                  <td className="px-6 py-3 font-medium">{c.name}</td>
                  <td className="px-6 py-3 text-zinc-400 font-mono text-xs">{c.slug}</td>
                  <td className="px-6 py-3 text-zinc-500">{MAIN_CATS.find(m => m.value === c.mainCategory)?.label || c.mainCategory}</td>
                  <td className="px-6 py-3 text-right">
                    <button onClick={() => openEdit(c)} className="text-zinc-400 hover:text-zinc-900 mr-3"><Pencil size={14} /></button>
                    <button onClick={() => del(c.id)} className="text-zinc-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
              {cats.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-zinc-400">Aucune catégorie</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
