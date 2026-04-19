// ---------------------------------------------------------------------------
// ProMedias API client — Express + MariaDB backend
// Dev: Vite proxies /api and /uploads → localhost:3001
// Prod: absolute URLs from VITE_CMS_URL
// ---------------------------------------------------------------------------

const CMS_URL  = (import.meta.env.VITE_CMS_URL as string) || 'http://localhost:3001'
const IS_DEV   = import.meta.env.DEV
const API_BASE = IS_DEV ? '/api' : `${CMS_URL}/api`

// Images stored locally resolve to /uploads/... in dev (proxied), full URL in prod
export const resolveUrl = (url: string | null | undefined): string => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return IS_DEV ? url : `${CMS_URL}${url}`
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SiteOptions {
  site_logo?:          string
  site_logo_white?:    string
  home_hero_bg?:       string
  services_hero_bg?:   string
  shop_hero_bg?:       string
  diagnostic_hero_bg?: string
  about_hero_bg?:      string
  [key: string]: string | undefined
}

export interface PageData {
  title:   string
  content: string
  acf: Record<string, unknown>
}

export interface WCCategory {
  id:           number
  name:         string
  slug:         string
  description:  string
  mainCategory?: string
}

export interface Product {
  id: string | number;
  name: string;
  price: string;
  specs: string;
  tag?: string;
  image: string;
  gallery: string[];
  mainCategory: "Téléphonie" | "Informatique" | "Accessoires";
  category: string;
  condition: string;
  conditionScore: number;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// fetchSiteOptions
// ---------------------------------------------------------------------------

export const fetchSiteOptions = async (): Promise<SiteOptions> => {
  try {
    const res = await fetch(`${API_BASE}/settings/site`)
    if (!res.ok) throw new Error(`settings/site ${res.status}`)
    const data = await res.json()
    return {
      site_logo:          resolveUrl(data.logo),
      site_logo_white:    resolveUrl(data.logo_white),
      home_hero_bg:       resolveUrl(data.home_hero_bg),
      services_hero_bg:   resolveUrl(data.services_hero_bg),
      shop_hero_bg:       resolveUrl(data.shop_hero_bg),
      diagnostic_hero_bg: resolveUrl(data.diagnostic_hero_bg),
      about_hero_bg:      resolveUrl(data.about_hero_bg),
    }
  } catch (err) {
    console.error('fetchSiteOptions:', err)
    return {}
  }
}

// ---------------------------------------------------------------------------
// fetchPage — only 'about' is used
// ---------------------------------------------------------------------------

export const fetchPage = async (slug: string): Promise<PageData | null> => {
  if (slug !== 'about') return null
  try {
    const res = await fetch(`${API_BASE}/settings/about`)
    if (!res.ok) throw new Error(`settings/about ${res.status}`)
    const data = await res.json()

    const acf: Record<string, string> = {}
    for (const [key, val] of Object.entries(data)) {
      const url = resolveUrl(val as string)
      if (url) acf[key] = url
    }
    return { title: 'À Propos', content: '', acf }
  } catch (err) {
    console.error('fetchPage about:', err)
    return null
  }
}

// ---------------------------------------------------------------------------
// fetchContact
// ---------------------------------------------------------------------------

export interface ContactInfo {
  contact_shop_name?:      string | null
  contact_address?:        string | null
  contact_phone?:          string | null
  contact_email?:          string | null
  contact_hours_weekdays?: string | null
  contact_hours_saturday?: string | null
  contact_hours_sunday?:   string | null
  contact_facebook?:       string | null
  contact_instagram?:      string | null
  contact_whatsapp?:       string | null
  contact_maps_url?:       string | null
  contact_storefront_url?: string | null
}

export const fetchContact = async (): Promise<ContactInfo> => {
  try {
    const res = await fetch(`${API_BASE}/settings/contact`)
    if (!res.ok) throw new Error(`settings/contact ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error('fetchContact:', err)
    return {}
  }
}

// ---------------------------------------------------------------------------
// fetchAnnouncements

export interface Announcement {
  id: number
  title: string
  subtitle?: string | null
  image_url: string
  whatsapp_message?: string | null
}

export const fetchAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const res = await fetch(`${API_BASE}/announcements`)
    if (!res.ok) return []
    return await res.json()
  } catch { return [] }
}

// ---------------------------------------------------------------------------
// fetchCategories
// ---------------------------------------------------------------------------

export const fetchCategories = async (): Promise<WCCategory[]> => {
  try {
    const res = await fetch(`${API_BASE}/categories`)
    if (!res.ok) throw new Error(`categories ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error('fetchCategories:', err)
    return []
  }
}

// ---------------------------------------------------------------------------
// fetchProducts
// ---------------------------------------------------------------------------

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const res = await fetch(`${API_BASE}/products?status=published`)
    if (!res.ok) throw new Error(`products ${res.status}`)
    const data = await res.json()
    return (data as Product[]).map((p) => ({
      ...p,
      image:   resolveUrl(p.image),
      gallery: (p.gallery || []).map(resolveUrl),
    }))
  } catch (err) {
    console.error('fetchProducts:', err)
    return []
  }
}
