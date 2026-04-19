import { useEffect, useState, useRef } from 'react'
import { Search, Upload, X, Check, Image, ChevronDown } from 'lucide-react'
import { adminGetMedia, adminUpload } from '@/lib/admin'
import { resolveUrl } from '@/lib/woocommerce'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { value: 'all',            label: 'Tous' },
  { value: 'product',        label: 'Produits' },
  { value: 'logo',           label: 'Logos' },
  { value: 'page',           label: 'Pages' },
  { value: 'hero',           label: 'Hero Backgrounds' },
  { value: 'announcement',   label: 'Annonces' },
  { value: 'team',           label: 'Profils Équipe' },
  { value: 'uncategorized',  label: 'Non classé' },
]

interface Props {
  open: boolean
  onClose: () => void
  onSelect: (urls: string[]) => void
  multiple?: boolean
  already?: string[]
}

export default function MediaPicker({ open, onClose, onSelect, multiple = false, already = [] }: Props) {
  const [media, setMedia]         = useState<any[]>([])
  const [search, setSearch]       = useState('')
  const [cat, setCat]             = useState('all')
  const [selected, setSelected]   = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [tab, setTab]             = useState<'library' | 'upload'>('library')
  const fileRef                   = useRef<HTMLInputElement>(null)

  const load = async () => {
    const rows = await adminGetMedia({ category: cat === 'all' ? undefined : cat, search: search || undefined })
    setMedia(rows)
  }

  useEffect(() => { if (open) { setSelected([]); load() } }, [open, cat])
  useEffect(() => {
    const id = setTimeout(load, 300)
    return () => clearTimeout(id)
  }, [search])

  const toggle = (url: string) => {
    if (multiple) {
      setSelected(s => s.includes(url) ? s.filter(u => u !== url) : [...s, url])
    } else {
      setSelected([url])
    }
  }

  const confirm = () => { onSelect(selected); onClose() }

  const handleUpload = async (files: FileList) => {
    setUploading(true)
    try {
      const urls = await Promise.all(Array.from(files).map(f => adminUpload(f, 'product')))
      await load()
      if (!multiple) {
        onSelect([urls[0]]); onClose(); return
      }
      setSelected(s => [...s, ...urls])
      setTab('library')
    } catch (e: any) { alert(e.message) }
    finally { setUploading(false) }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <Image size={18} className="text-zinc-400" />
            <span className="font-semibold text-sm">Médiathèque</span>
            {selected.length > 0 && (
              <span className="text-xs bg-red-50 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                {selected.length} sélectionné{selected.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-3">
          {(['library', 'upload'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={cn('px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                tab === t ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900'
              )}>
              {t === 'library' ? 'Bibliothèque' : 'Importer'}
            </button>
          ))}
        </div>

        {tab === 'library' ? (
          <>
            {/* Filters */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 px-6 py-3 border-b border-zinc-100">
              <div className="relative flex-1 max-w-none md:max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher…"
                  className="w-full pl-8 pr-3 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-400 bg-zinc-50/50 md:bg-white"
                />
              </div>

              {/* Mobile Select */}
              <div className="relative block md:hidden">
                <select
                  value={cat}
                  onChange={e => setCat(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 bg-zinc-100 border-none rounded-xl text-sm font-semibold appearance-none outline-none"
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
                    className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                      cat === c.value ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:bg-zinc-100'
                    )}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {media.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-zinc-400">
                  <Image size={32} className="mb-2 opacity-40" />
                  <p className="text-sm">Aucun fichier trouvé</p>
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-3">
                  {media.map(m => {
                    const isSelected = selected.includes(m.url)
                    const isAlready  = already.includes(m.url)
                    return (
                      <button key={m.id} onClick={() => !isAlready && toggle(m.url)}
                        className={cn(
                          'relative group rounded-xl overflow-hidden border-2 aspect-square transition-all',
                          isSelected  ? 'border-red-500 ring-2 ring-red-200' :
                          isAlready   ? 'border-zinc-300 opacity-50 cursor-default' :
                                        'border-transparent hover:border-zinc-300'
                        )}>
                        <img src={resolveUrl(m.url)} alt={m.original_name}
                          className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                            <div className="bg-red-500 rounded-full p-1">
                              <Check size={12} className="text-white" />
                            </div>
                          </div>
                        )}
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-[10px] truncate">{m.original_name}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Upload tab */
          <div className="flex-1 flex items-center justify-center p-10">
            <label className="w-full max-w-md border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center py-16 cursor-pointer hover:border-zinc-400 transition-colors">
              <Upload size={32} className="text-zinc-300 mb-3" />
              <p className="text-sm font-medium text-zinc-500 mb-1">
                {uploading ? 'Importation…' : 'Cliquez ou glissez des images ici'}
              </p>
              <p className="text-xs text-zinc-400">PNG, JPG, WebP · max 10 MB</p>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
                onChange={e => e.target.files && handleUpload(e.target.files)} />
            </label>
          </div>
        )}

        {/* Footer */}
        {tab === 'library' && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 bg-zinc-50/50">
            <p className="text-xs text-zinc-400">{media.length} fichier{media.length !== 1 ? 's' : ''}</p>
            <div className="flex gap-2">
              <button onClick={onClose}
                className="px-4 py-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
                Annuler
              </button>
              <button onClick={confirm} disabled={selected.length === 0}
                className="px-4 py-2 bg-zinc-900 text-white text-sm font-semibold rounded-xl disabled:opacity-40 hover:bg-zinc-700 transition-colors">
                Insérer {selected.length > 0 ? `(${selected.length})` : ''}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
