import { useEffect, useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { adminGetSettings, adminUpdateSettings, adminUpload } from '@/lib/admin'
import { resolveUrl } from '@/lib/woocommerce'

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

  const handleFile = async (file: File) => {
    setUploading(true)
    try {
      const url = await adminUpload(file)
      onChange(url)
    } catch (e: any) {
      alert(e.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="text-xs font-medium text-zinc-500 mb-2 block">{label}</label>
      <div className="flex gap-3 items-start">
        {value ? (
          <div className="relative">
            <img src={resolveUrl(value)} alt={label} className="h-20 w-32 object-cover rounded-xl border border-zinc-200" />
            <button onClick={() => onChange(null)} className="absolute -top-2 -right-2 bg-white border border-zinc-200 rounded-full p-0.5 hover:bg-red-50 hover:border-red-200">
              <X size={12} className="text-zinc-500" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => inputRef.current?.click()}
            className="h-20 w-32 border-2 border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-zinc-400 transition-colors"
          >
            <Upload size={16} className="text-zinc-400 mb-1" />
            <span className="text-[10px] text-zinc-400">{uploading ? 'Upload…' : 'Choisir'}</span>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        {value && (
          <button onClick={() => inputRef.current?.click()} className="text-xs text-zinc-400 hover:text-zinc-700 mt-1">
            {uploading ? 'Upload…' : 'Changer'}
          </button>
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
      <div className="p-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Réglages</h1>
            <p className="text-zinc-500 text-sm">Logos et images hero du site</p>
          </div>
          <Button onClick={save}>{saved ? '✓ Enregistré' : 'Enregistrer'}</Button>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-zinc-100 p-6">
            <h2 className="font-semibold mb-6">Site global</h2>
            <div className="grid grid-cols-2 gap-6">
              {SITE_FIELDS.map(({ key, label }) => (
                <ImageField key={key} label={label} value={settings[key] ?? null}
                  onChange={url => setSettings(s => ({ ...s, [key]: url }))} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-100 p-6">
            <h2 className="font-semibold mb-6">Page À Propos</h2>
            <div className="grid grid-cols-2 gap-6">
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
