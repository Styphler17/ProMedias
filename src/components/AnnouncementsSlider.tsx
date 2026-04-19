import { useEffect, useState, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { fetchAnnouncements, fetchContact, type Announcement } from '@/lib/woocommerce'
import { resolveUrl } from '@/lib/woocommerce'

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

export default function AnnouncementsSlider() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [waNumber, setWaNumber]           = useState('32466058793')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    onSelect()
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi])

  useEffect(() => {
    fetchAnnouncements().then(setAnnouncements)
    fetchContact().then(c => {
      const raw = c.contact_whatsapp ?? ''
      setWaNumber(raw.replace(/\D/g, '') || '32466058793')
    })
  }, [])

  if (announcements.length === 0) return null

  const buildWaUrl = (msg?: string | null) => {
    const text = msg ?? 'Bonjour PROMEDIAS ! Je souhaite obtenir des informations sur ce produit.'
    return `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`
  }

  return (
    <section className="relative w-full overflow-hidden bg-zinc-950">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {announcements.map(a => (
            <div key={a.id} className="relative flex-none w-full flex flex-col md:block">
              {/* Image */}
              <div className="relative w-full aspect-[4/3] md:aspect-[16/6] overflow-hidden bg-zinc-900 md:bg-zinc-950">
                <img
                  src={resolveUrl(a.image_url)}
                  alt={a.title}
                  className="absolute inset-0 w-full h-full object-contain"
                />
                {/* Gradient overlay — only on desktop since text is below on mobile */}
                <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-zinc-950/85 via-zinc-950/40 to-transparent" />
              </div>

              {/* Content */}
              <div className="px-8 py-10 md:py-0 md:absolute md:inset-0 md:flex md:flex-col md:justify-center md:px-16 md:max-w-xl">
                {a.subtitle && (
                  <p className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-[hsl(357,83%,60%)] mb-2">
                    {a.subtitle}
                  </p>
                )}
                <p className="text-xl md:text-4xl font-bold text-white leading-tight mb-6 md:mb-5">
                  {a.title}
                </p>
                <a
                  href={buildWaUrl(a.whatsapp_message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold text-sm px-6 py-3 md:px-5 md:py-2.5 rounded-xl transition-all w-fit shadow-lg active:scale-95"
                >
                  <WhatsAppIcon />
                  Demander sur WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prev / Next */}
      {announcements.length > 1 && (
        <>
          <button onClick={scrollPrev}
            className="absolute left-4 top-[28%] md:top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white flex items-center justify-center transition-colors">
            <ChevronLeft size={18} />
          </button>
          <button onClick={scrollNext}
            className="absolute right-4 top-[28%] md:top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white flex items-center justify-center transition-colors">
            <ChevronRight size={18} />
          </button>
 
          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {announcements.map((_, i) => (
              <button key={i} onClick={() => emblaApi?.scrollTo(i)}
                className={`h-1.5 rounded-full transition-all ${i === selectedIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
