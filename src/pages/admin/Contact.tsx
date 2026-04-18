import { useEffect, useState } from 'react'
import { Check, MapPin, Phone, Clock, Share2, Map } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { adminGetSettings, adminUpdateSettings } from '@/lib/admin'

const INPUT    = 'w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors bg-white'
const TEXTAREA = INPUT + ' resize-none'

const KEYS = [
  'contact_shop_name','contact_address','contact_phone','contact_email',
  'contact_hours_weekdays','contact_hours_saturday','contact_hours_sunday',
  'contact_facebook','contact_instagram','contact_whatsapp','contact_maps_url','contact_storefront_url',
]

function Field({ label, children, span = 1 }: { label: string; children: React.ReactNode; span?: number }) {
  return (
    <div className={span === 2 ? 'col-span-2' : ''}>
      <label className="text-xs font-medium text-zinc-500 mb-1.5 block">{label}</label>
      {children}
    </div>
  )
}

function Section({ icon: Icon, title, cols = 2, children }: {
  icon: React.ElementType; title: string; cols?: number; children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-6">
      <div className="flex items-center gap-2 mb-5">
        <Icon size={15} className="text-zinc-400" />
        <span className="text-sm font-semibold text-zinc-800">{title}</span>
      </div>
      <div className={`grid gap-4 ${cols === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {children}
      </div>
    </div>
  )
}

export default function Contact() {
  const [form, setForm] = useState<Record<string, string>>(
    Object.fromEntries(KEYS.map(k => [k, '']))
  )
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  useEffect(() => {
    adminGetSettings().then(all => {
      const patch: Record<string, string> = {}
      for (const k of KEYS) patch[k] = all[k] ?? ''
      setForm(patch)
    })
  }, [])

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  const save = async () => {
    setSaving(true)
    try {
      const payload: Record<string, string | null> = {}
      for (const k of KEYS) payload[k] = form[k] || null
      await adminUpdateSettings(payload)
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    } finally { setSaving(false) }
  }

  const v = (key: string) => form[key] ?? ''

  return (
    <AdminLayout>
      <div className="p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-2xl font-bold text-zinc-900">Contact</p>
            <p className="text-zinc-500 text-sm">Informations affichées sur le site public.</p>
          </div>
          <Button onClick={save} disabled={saving}>
            {saved ? <><Check size={14} className="mr-1.5" />Enregistré</> : saving ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
        </div>

        <div className="space-y-6">

          {/* Boutique */}
          <Section icon={MapPin} title="Boutique">
            <Field label="Nom de la boutique">
              <input value={v('contact_shop_name')} onChange={set('contact_shop_name')}
                placeholder="ProMedias Liège" className={INPUT} />
            </Field>
            <Field label="Adresse">
              <textarea value={v('contact_address')} onChange={set('contact_address')}
                rows={3} placeholder={"Rue de l'exemple 12\n4000 Liège"} className={TEXTAREA} />
            </Field>
          </Section>

          {/* Coordonnées */}
          <Section icon={Phone} title="Coordonnées">
            <Field label="Téléphone">
              <input value={v('contact_phone')} onChange={set('contact_phone')}
                placeholder="+32 4 123 45 67" className={INPUT} />
            </Field>
            <Field label="E-mail de contact">
              <input type="email" value={v('contact_email')} onChange={set('contact_email')}
                placeholder="info@promedias.be" className={INPUT} />
            </Field>
            <Field label="WhatsApp">
              <input value={v('contact_whatsapp')} onChange={set('contact_whatsapp')}
                placeholder="+32 4 123 45 67" className={INPUT} />
            </Field>
          </Section>

          {/* Heures */}
          <Section icon={Clock} title="Heures d'ouverture" cols={3}>
            <Field label="Lundi – Vendredi">
              <input value={v('contact_hours_weekdays')} onChange={set('contact_hours_weekdays')}
                placeholder="9h – 18h" className={INPUT} />
            </Field>
            <Field label="Samedi">
              <input value={v('contact_hours_saturday')} onChange={set('contact_hours_saturday')}
                placeholder="10h – 16h" className={INPUT} />
            </Field>
            <Field label="Dimanche">
              <input value={v('contact_hours_sunday')} onChange={set('contact_hours_sunday')}
                placeholder="Fermé" className={INPUT} />
            </Field>
          </Section>

          {/* Réseaux sociaux */}
          <Section icon={Share2} title="Réseaux sociaux">
            <Field label="Facebook">
              <input value={v('contact_facebook')} onChange={set('contact_facebook')}
                placeholder="https://facebook.com/promedias" className={INPUT} />
            </Field>
            <Field label="Instagram">
              <input value={v('contact_instagram')} onChange={set('contact_instagram')}
                placeholder="https://instagram.com/promedias" className={INPUT} />
            </Field>
          </Section>

          {/* Google Maps */}
          <div className="bg-white rounded-2xl border border-zinc-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Map size={15} className="text-zinc-400" />
              <span className="text-sm font-semibold text-zinc-800">Google Maps</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="URL d'intégration (iframe embed src)" span={2}>
                <input value={v('contact_maps_url')} onChange={set('contact_maps_url')}
                  placeholder="https://www.google.com/maps/embed?pb=…" className={INPUT} />
              </Field>
              <Field label='Lien "Voir la Vitrine (360°)"' span={2}>
                <input value={v('contact_storefront_url')} onChange={set('contact_storefront_url')}
                  placeholder="https://maps.app.goo.gl/…" className={INPUT} />
              </Field>
            </div>
            {v('contact_maps_url') && (
              <div className="mt-4 rounded-xl overflow-hidden border border-zinc-200 h-56">
                <iframe src={v('contact_maps_url')} width="100%" height="100%"
                  style={{ border: 0 }} allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade" title="Aperçu carte" />
              </div>
            )}
          </div>

        </div>
      </div>
    </AdminLayout>
  )
}
