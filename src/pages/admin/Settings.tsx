import { useEffect, useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { adminGetSettings, adminUpdateSettings, adminUpload } from '@/lib/admin'
import { resolveUrl } from '@/lib/woocommerce'
import MediaPicker from '@/components/admin/MediaPicker'

const SITE_FIELDS = [
  { key: 'logo',             label: 'Logo principal (navbar)' },
  { key: 'logo_white',       label: 'Logo blanc (footer)' },
  { key: 'home_hero_bg',     label: 'Hero — Accueil' },
  { key: 'services_hero_bg', label: 'Hero — Services' },
  { key: 'shop_hero_bg',     label: 'Hero — Boutique' },
  { key: 'diagnostic_hero_bg', label: 'Hero — Diagnostic' },
]

const ABOUT_FIELDS = [
  { key: 'hero_image',                 label: 'À Propos — Hero' },
  { key: 'environmental_impact_image', label: 'À Propos — Impact écologique' },
  { key: 'boutique_storefront_image',  label: 'À Propos — Vitrine' },
  { key: 'team_1', label: 'Équipe — Expert 1' },
  { key: 'team_2', label: 'Équipe — Expert 2' },
  { key: 'team_3', label: 'Équipe — Expert 3' },
  { key: 'team_4', label: 'Équipe — Expert 4' },
]

function ImageField({ label, value, onChange }: { label: string; value: string | null; onChange: (url: string | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [showPicker, setShowPicker] = useState(false)

  const handleFile = async (file: File) => {
    setUploading(true)
    try {
      const url = await adminUpload(file)
      onChange(url)
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="text-xs font-medium text-zinc-500 mb-2 block">{label}</label>
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        {value ? (
          <div className="relative shrink-0">
            <img src={resolveUrl(value)} alt={label} className="h-24 sm:h-20 w-full sm:w-32 object-cover rounded-xl border border-zinc-200" />
            <button onClick={() => onChange(null)} className="absolute -top-2 -right-2 bg-white border border-zinc-200 rounded-full p-0.5 hover:bg-red-50 hover:border-red-200">
              <X size={12} className="text-zinc-500" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2 w-full sm:w-auto">
            <div
              onClick={() => inputRef.current?.click()}
              className="h-24 sm:h-20 w-1/2 sm:w-28 border-2 border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-zinc-400 transition-colors"
            >
              <Upload size={16} className="text-zinc-400 mb-1" />
              <span className="text-[10px] text-zinc-400">{uploading ? 'Upload…' : 'Importer'}</span>
            </div>
            <div
              onClick={() => setShowPicker(true)}
              className="h-24 sm:h-20 w-1/2 sm:w-28 border-2 border-zinc-100 bg-zinc-50/50 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-zinc-300 hover:bg-zinc-50 transition-all"
            >
              <ImageIcon size={16} className="text-zinc-400 mb-1" />
              <span className="text-[10px] text-zinc-400">Bibliothèque</span>
            </div>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        
        {value && (
          <div className="flex flex-row sm:flex-col gap-3">
            <button onClick={() => inputRef.current?.click()} className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-700">
              <Upload size={12} /> {uploading ? 'Upload…' : 'Importer'}
            </button>
            <button onClick={() => setShowPicker(true)} className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-700">
              <ImageIcon size={12} /> Bibliothèque
            </button>
          </div>
        )}

        {showPicker && (
          <MediaPicker
            open={showPicker}
            onClose={() => setShowPicker(false)}
            onSelect={urls => onChange(urls[0])}
          />
        )}
      </div>
    </div>
  )
}

export default function Settings() {
  const [settings, setSettings] = useState<Record<string, string | null>>({})
  const [saved, setSaved]       = useState(false)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    adminGetSettings().then(s => { setSettings(s); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const save = async () => {
    await adminUpdateSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <AdminLayout><div className="p-10 text-zinc-400">Chargement…</div></AdminLayout>

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Réglages</h1>
            <p className="text-zinc-500 text-sm">Logos et images hero du site</p>
          </div>
          <Button onClick={save} className="w-full sm:w-auto">{saved ? '✓ Enregistré' : 'Enregistrer'}</Button>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <div className="bg-white rounded-2xl border border-zinc-100 p-4 sm:p-6">
            <h2 className="font-semibold mb-6">Site global</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {SITE_FIELDS.map(({ key, label }) => (
                <ImageField key={key} label={label} value={settings[key] ?? null}
                  onChange={url => setSettings(s => ({ ...s, [key]: url }))} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-100 p-4 sm:p-6">
            <h2 className="font-semibold mb-6">Page À Propos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {ABOUT_FIELDS.map(({ key, label }) => (
                <ImageField key={key} label={label} value={settings[key] ?? null}
                  onChange={url => setSettings(s => ({ ...s, [key]: url }))} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
