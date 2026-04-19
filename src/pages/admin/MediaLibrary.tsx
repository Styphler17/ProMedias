import { useEffect, useState, useRef, useCallback } from 'react'
import { Search, Upload, Trash2, Image, Copy, Check, ChevronDown } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { adminGetMedia, adminDeleteMedia, adminUpdateMediaCategory, adminUpload } from '@/lib/admin'
import { resolveUrl } from '@/lib/woocommerce'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { value: 'all',           label: 'Tous' },
  { value: 'product',       label: 'Produits' },
  { value: 'logo',          label: 'Logos' },
  { value: 'page',          label: 'Pages' },
  { value: 'hero',          label: 'Hero Backgrounds' },
  { value: 'announcement',  label: 'Annonces' },
  { value: 'team',          label: 'Profils Équipe' },
  { value: 'uncategorized', label: 'Non classé' },
]

const CAT_LABELS: Record<string, string> = {
  product: 'Produit', logo: 'Logo', page: 'Page', hero: 'Hero', announcement: 'Annonce', team: 'Équipe', uncategorized: 'Non classé',
}

const CAT_COLORS: Record<string, string> = {
  product:       'bg-blue-50 text-blue-600',
  logo:          'bg-purple-50 text-purple-600',
  page:          'bg-green-50 text-green-600',
  hero:          'bg-orange-50 text-orange-600',
  announcement:  'bg-pink-50 text-pink-600',
  team:          'bg-teal-50 text-teal-600',
  uncategorized: 'bg-zinc-100 text-zinc-500',
}

const SORTS = [
  { value: 'date', label: 'Date' },
  { value: 'name', label: 'Nom' },
  { value: 'size', label: 'Taille' },
]

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

interface MediaItem {
  id: number;
  url: string;
  original_name: string;
  category: string;
  size: number;
  mime_type: string;
}

export default function MediaLibrary() {
  const [media, setMedia]         = useState<MediaItem[]>([])
  const [cat, setCat]             = useState('all')
  const [search, setSearch]       = useState('')
  const [sort, setSort]           = useState('date')
  const [selected, setSelected]   = useState<number | null>(null)
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied]       = useState(false)
  const [catMenu, setCatMenu]     = useState<number | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    const rows = await adminGetMedia({ category: cat === 'all' ? undefined : cat, search: search || undefined, sort })
    setMedia(rows)
    setSelected(s => rows.find((r: MediaItem) => r.id === s) ? s : null)
  }, [cat, search, sort])

  useEffect(() => {
    const id = setTimeout(load, 300)
    return () => clearTimeout(id)
  }, [load])

  const handleUpload = async (files: FileList) => {
    setUploading(true)
    try {
      await Promise.all(Array.from(files).map(f => adminUpload(f, 'uncategorized')))
      await load()
    } catch (e: unknown) { alert(e instanceof Error ? e.message : 'Upload failed') }
    finally { setUploading(false) }
  }

  const del = async (id: number) => {
    if (!confirm('Supprimer ce fichier définitivement ?')) return
    await adminDeleteMedia(id)
    if (selected === id) setSelected(null)
    load()
  }

  const changeCategory = async (id: number, category: string) => {
    await adminUpdateMediaCategory(id, category)
    setCatMenu(null)
    load()
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(resolveUrl(url))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const selectedItem = media.find(m => m.id === selected)

  return (
    <AdminLayout>
      <div className="flex h-[calc(100vh-0px)] overflow-hidden">
        {/* Main panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="px-8 py-5 border-b border-zinc-200 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-2xl font-bold text-zinc-900">Médiathèque</p>
                <p className="text-zinc-500 text-sm">{media.length} fichier{media.length !== 1 ? 's' : ''}</p>
              </div>
              <label className={cn(
                'flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm font-semibold rounded-xl cursor-pointer transition-colors',
                uploading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-zinc-700'
              )}>
                <Upload size={15} />
                {uploading ? 'Importation…' : 'Importer'}
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
                  disabled={uploading}
                  onChange={e => e.target.files && handleUpload(e.target.files)} />
              </label>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-none md:max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher un fichier…"
                  className="w-full pl-8 pr-3 py-2.5 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-400 bg-zinc-50/50 md:bg-white" />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Category filter - Desktop Buttons / Mobile Dropdown */}
                <div className="flex-1 md:flex-none">
                  {/* Mobile Select */}
                  <div className="relative block md:hidden">
                    <select 
                      value={cat} 
                      onChange={e => setCat(e.target.value)}
                      className="w-full pl-4 pr-10 py-2.5 bg-zinc-100 border-none rounded-xl text-sm font-semibold appearance-none focus:ring-2 focus:ring-zinc-200 outline-none"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                  </div>

                  {/* Desktop Buttons */}
                  <div className="hidden md:flex gap-1">
                    {CATEGORIES.map(c => (
                      <button key={c.value} onClick={() => setCat(c.value)}
                        className={cn('px-4 py-2 rounded-xl text-xs font-semibold transition-all border',
                          cat === c.value ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg shadow-zinc-900/10' : 'bg-white border-zinc-100 text-zinc-500 hover:border-zinc-300'
                        )}>
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-1 ml-auto">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mr-2">Trier :</span>
                  <div className="flex bg-zinc-100 p-1 rounded-xl">
                    {SORTS.map(s => (
                      <button key={s.value} onClick={() => setSort(s.value)}
                        className={cn('px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all',
                          sort === s.value ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
                        )}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto p-8 bg-zinc-50">
            {media.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
                <Image size={40} className="mb-3 opacity-30" />
                <p className="text-sm font-medium">Aucun fichier</p>
                <p className="text-xs mt-1">Importez des images pour commencer</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 xl:grid-cols-6 gap-4">
                {media.map(m => (
                  <button key={m.id} onClick={() => setSelected(m.id === selected ? null : m.id)}
                    className={cn(
                      'relative group rounded-xl overflow-hidden border-2 aspect-square transition-all bg-white',
                      selected === m.id ? 'border-zinc-900 shadow-lg' : 'border-transparent hover:border-zinc-300 shadow-sm'
                    )}>
                    <img src={resolveUrl(m.url)} alt={m.original_name} className="w-full h-full object-cover" />

                    {/* Category badge */}
                    <div className="absolute top-1.5 left-1.5">
                      <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide', CAT_COLORS[m.category])}>
                        {CAT_LABELS[m.category]}
                      </span>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-2 translate-y-full group-hover:translate-y-0 transition-transform">
                      <p className="text-white text-[10px] truncate">{m.original_name}</p>
                      <p className="text-white/60 text-[9px]">{formatSize(m.size)}</p>
                    </div>

                    {selected === m.id && (
                      <div className="absolute top-1.5 right-1.5 bg-zinc-900 rounded-full p-0.5">
                        <Check size={10} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detail panel */}
        <div className={cn(
          'w-72 shrink-0 border-l border-zinc-200 bg-white flex flex-col transition-all duration-200 overflow-hidden',
          selectedItem ? 'translate-x-0' : 'translate-x-full w-0 border-0'
        )}>
          {selectedItem && (
            <>
              {/* Preview */}
              <div className="aspect-square bg-zinc-50 border-b border-zinc-100 flex items-center justify-center p-4">
                <img src={resolveUrl(selectedItem.url)} alt={selectedItem.original_name}
                  className="max-w-full max-h-full object-contain rounded-lg" />
              </div>

              {/* Info */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Nom du fichier</p>
                  <p className="text-sm text-zinc-800 break-all">{selectedItem.original_name}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Taille</p>
                  <p className="text-sm text-zinc-800">{formatSize(selectedItem.size)}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Type</p>
                  <p className="text-sm text-zinc-800">{selectedItem.mime_type}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Catégorie</p>
                  <div className="relative">
                    <button onClick={() => setCatMenu(catMenu === selectedItem.id ? null : selectedItem.id)}
                      className="w-full flex items-center justify-between px-3 py-2 border border-zinc-200 rounded-xl text-sm hover:border-zinc-400 transition-colors">
                      <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-md uppercase tracking-wide', CAT_COLORS[selectedItem.category])}>
                        {CAT_LABELS[selectedItem.category]}
                      </span>
                      <ChevronDown size={14} className="text-zinc-400" />
                    </button>
                    {catMenu === selectedItem.id && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-xl shadow-lg z-10 overflow-hidden">
                        {CATEGORIES.filter(c => c.value !== 'all').map(c => (
                          <button key={c.value} onClick={() => changeCategory(selectedItem.id, c.value)}
                            className={cn('w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 transition-colors',
                              selectedItem.category === c.value ? 'font-semibold text-zinc-900' : 'text-zinc-600'
                            )}>
                            {c.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">URL</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-[10px] text-zinc-600 bg-zinc-50 border border-zinc-100 rounded-lg px-2 py-1.5 truncate">
                      {selectedItem.url}
                    </code>
                    <button onClick={() => copyUrl(selectedItem.url)}
                      className="shrink-0 p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors">
                      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-5 border-t border-zinc-100">
                <button onClick={() => del(selectedItem.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold rounded-xl transition-colors">
                  <Trash2 size={14} />
                  Supprimer définitivement
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
