import { useEffect, useState } from 'react'
import { Check, MapPin, Phone, Clock, Share2, Map, Globe, Instagram, Facebook, Send } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { adminGetSettings, adminUpdateSettings } from '@/lib/admin'
import { cn } from '@/lib/utils'

const INPUT = "w-full bg-white border border-zinc-200 rounded-2xl px-4 py-3 text-sm transition-all focus:ring-4 focus:ring-[hsl(357,83%,37%)]/5 focus:border-[hsl(357,83%,37%)] outline-none font-medium text-zinc-900 group-hover:border-zinc-300"
const LABEL = "text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 block ml-1"

const KEYS = [
  'contact_shop_name','contact_address','contact_phone','contact_email',
  'contact_hours_weekdays','contact_hours_saturday','contact_hours_sunday',
  'contact_facebook','contact_instagram','contact_whatsapp','contact_maps_url','contact_storefront_url',
]

function SectionHeader({ icon: Icon, title, subtitle }: { icon: any, title: string, subtitle: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 bg-[hsl(357,83%,37%)]/5 rounded-2xl flex items-center justify-center shrink-0">
        <Icon size={20} className="text-[hsl(357,83%,37%)]" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-zinc-900 leading-tight">{title}</h2>
        <p className="text-xs text-zinc-400 font-medium">{subtitle}</p>
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
      <div className="max-w-6xl mx-auto p-6 md:p-10 pb-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Coordonnées & Contact</h1>
            <p className="text-zinc-500 font-medium mt-1">Gérez les informations publiques affichées sur tout le site.</p>
          </div>
          <Button 
            onClick={save} 
            disabled={saving}
            className={cn(
              "rounded-2xl h-14 px-8 font-bold text-base transition-all shadow-xl shadow-[hsl(357,83%,37%)]/20",
              saved ? "bg-green-600 hover:bg-green-600 shadow-green-600/20" : ""
            )}
          >
            {saved ? <><Check size={20} className="mr-2" />Enregistré</> : saving ? 'Enregistrement…' : 'Enregistrer les modifications'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Boutique Card */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 shadow-sm flex flex-col group">
              <SectionHeader icon={MapPin} title="Identité & Boutique" subtitle="Informations générales du magasin" />
              <div className="space-y-6">
                <div>
                  <label className={LABEL}>Nom de la boutique</label>
                  <input value={v('contact_shop_name')} onChange={set('contact_shop_name')}
                    placeholder="ProMedias Liège" className={INPUT} />
                </div>
                <div>
                  <label className={LABEL}>Adresse complète</label>
                  <textarea value={v('contact_address')} onChange={set('contact_address')}
                    rows={4} placeholder={"Rue de l'Exemple 12\n4000 Liège"} 
                    className={cn(INPUT, "resize-none")} />
                </div>
              </div>
            </div>

            {/* Direct Contact Card */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 shadow-sm flex flex-col group">
              <SectionHeader icon={Phone} title="Coordonnées Directes" subtitle="Lignes gratuites et e-mails" />
              <div className="space-y-6 text-left">
                <div>
                  <label className={LABEL}>Numéro de Téléphone</label>
                  <div className="relative">
                    <input value={v('contact_phone')} onChange={set('contact_phone')}
                      placeholder="+32 4 123 45 67" className={cn(INPUT, "pl-12")} />
                    <Phone size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300" />
                  </div>
                </div>
                <div>
                  <label className={LABEL}>E-mail de support</label>
                  <div className="relative">
                    <input type="email" value={v('contact_email')} onChange={set('contact_email')}
                      placeholder="info@promedias.be" className={cn(INPUT, "pl-12")} />
                    <Globe size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300" />
                  </div>
                </div>
                <div>
                  <label className={LABEL}>Numéro WhatsApp</label>
                  <div className="relative">
                    <input value={v('contact_whatsapp')} onChange={set('contact_whatsapp')}
                      placeholder="+32 466 05 87 93" className={cn(INPUT, "pl-12")} />
                    <Send size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            {/* Opening Hours */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 shadow-sm group">
              <SectionHeader icon={Clock} title="Heures d'ouverture" subtitle="Ajustez vos plannings hebdomadaires" />
              <div className="space-y-5">
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <label className={LABEL}>Semaine (Lundi – Vendredi)</label>
                  <input value={v('contact_hours_weekdays')} onChange={set('contact_hours_weekdays')}
                    placeholder="9h – 18h" className={cn(INPUT, "bg-white")} />
                </div>
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <label className={LABEL}>Samedi</label>
                  <input value={v('contact_hours_saturday')} onChange={set('contact_hours_saturday')}
                    placeholder="10h – 16h" className={cn(INPUT, "bg-white")} />
                </div>
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <label className={LABEL}>Dimanche & Fériés</label>
                  <input value={v('contact_hours_sunday')} onChange={set('contact_hours_sunday')}
                    placeholder="Fermé" className={cn(INPUT, "bg-white")} />
                </div>
              </div>
            </div>

            {/* Social Networks */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 shadow-sm group">
              <SectionHeader icon={Share2} title="Réseaux Sociaux" subtitle="Boostez votre présence en ligne" />
              <div className="space-y-6">
                <div>
                  <label className={LABEL}>URL Facebook</label>
                  <div className="relative">
                    <input value={v('contact_facebook')} onChange={set('contact_facebook')}
                      placeholder="https://facebook.com/…" className={cn(INPUT, "pl-12")} />
                    <Facebook size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-[hsl(357,83%,37%)]/40" />
                  </div>
                </div>
                <div>
                  <label className={LABEL}>URL Instagram</label>
                  <div className="relative">
                    <input value={v('contact_instagram')} onChange={set('contact_instagram')}
                      placeholder="https://instagram.com/…" className={cn(INPUT, "pl-12")} />
                    <Instagram size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-[hsl(357,83%,37%)]/40" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps Bridge */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[2.5rem] p-8 border border-zinc-100 shadow-sm h-full group">
              <SectionHeader icon={Map} title="Localisation & Maps" subtitle="Visibilité et visites virtuelles" />
              <div className="space-y-6">
                <div>
                  <label className={LABEL}>URL d'Intégration Google Maps (iframe src)</label>
                  <input value={v('contact_maps_url')} onChange={set('contact_maps_url')}
                    placeholder="https://www.google.com/maps/embed?pb=…" className={INPUT} />
                </div>
                <div>
                  <label className={LABEL}>Lien "Voir la Vitrine" (Google 360° View)</label>
                  <input value={v('contact_storefront_url')} onChange={set('contact_storefront_url')}
                    placeholder="https://maps.app.goo.gl/…" className={INPUT} />
                </div>
                
                {v('contact_maps_url') && (
                  <div className="mt-8 relative group/map">
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] opacity-100 pointer-events-none rounded-3xl" />
                    <div className="rounded-3xl overflow-hidden border-4 border-zinc-50 h-72 shadow-inner">
                      <iframe src={v('contact_maps_url')} width="100%" height="100%"
                        style={{ border: 0 }} allowFullScreen loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade" title="Aperçu carte" />
                    </div>
                    <div className="mt-3 flex items-center justify-center gap-2 text-zinc-300 text-[10px] font-bold uppercase tracking-tighter">
                      <Globe size={10} /> Aperçu en temps réel
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  )
}
