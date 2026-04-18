/**
 * Payload CMS API client
 * Replaces the former woocommerce.ts.
 *
 * Dev:  Vite proxies /api and /media to http://localhost:3001
 * Prod: Uses VITE_CMS_URL to build absolute URLs
 */

const CMS_BASE = import.meta.env.VITE_CMS_URL || 'http://localhost:3001'
const IS_DEV   = import.meta.env.DEV

const API   = IS_DEV ? '/api'   : `${CMS_BASE}/api`
const MEDIA = IS_DEV ? '/media' : `${CMS_BASE}/media`

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface MediaItem {
  id:  string
  url: string
  alt: string
  filename: string
  sizes?: {
    thumbnail?: { url: string }
    card?:      { url: string }
    hero?:      { url: string }
  }
}

export interface PayloadCategory {
  id:           string
  name:         string
  slug:         string
  mainCategory: 'telephonie' | 'informatique' | 'accessoires'
  description?: string
}

export interface PayloadProduct {
  id:             string
  name:           string
  slug:           string
  price:          string
  condition:      'excellent' | 'tres-bon' | 'bon'
  conditionScore: number
  specs?:         string
  description?:   string
  status:         'published' | 'draft' | 'sold'
  category:       PayloadCategory
  images:         { image: MediaItem }[]
}

export interface SiteSettings {
  logo?:                MediaItem
  logo_white?:          MediaItem
  home_hero_bg?:        MediaItem
  services_hero_bg?:    MediaItem
  shop_hero_bg?:        MediaItem
  diagnostic_hero_bg?:  MediaItem
}

export interface AboutPageData {
  hero_image?:                  MediaItem
  environmental_impact_image?:  MediaItem
  boutique_storefront_image?:   MediaItem
  team_1?: MediaItem
  team_2?: MediaItem
  team_3?: MediaItem
  team_4?: MediaItem
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Return a usable image URL from a Payload MediaItem (handles dev proxy). */
export const mediaUrl = (item?: MediaItem | null): string | undefined => {
  if (!item?.url) return undefined
  // In dev the proxy rewrites /media → CMS; in prod the URL is already absolute.
  if (IS_DEV) return item.url.startsWith('http') ? item.url.replace(CMS_BASE, '') : item.url
  return item.url.startsWith('http') ? item.url : `${CMS_BASE}${item.url}`
}

async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`)
    if (!res.ok) throw new Error(`${res.status} ${path}`)
    return await res.json() as T
  } catch (err) {
    console.error('[Payload]', err)
    return null
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Global fetchers
// ─────────────────────────────────────────────────────────────────────────────

export const fetchSiteSettings = async (): Promise<SiteSettings> => {
  const data = await get<SiteSettings>('/globals/site-settings')
  return data ?? {}
}

export const fetchAboutPage = async (): Promise<AboutPageData> => {
  const data = await get<AboutPageData>('/globals/about-page')
  return data ?? {}
}

// ─────────────────────────────────────────────────────────────────────────────
// Collection fetchers
// ─────────────────────────────────────────────────────────────────────────────

interface PayloadList<T> {
  docs:       T[]
  totalDocs:  number
  page:       number
  totalPages: number
}

export const fetchCategories = async (): Promise<PayloadCategory[]> => {
  const data = await get<PayloadList<PayloadCategory>>('/categories?limit=100&sort=name')
  return data?.docs ?? []
}

export const fetchProducts = async (): Promise<PayloadProduct[]> => {
  const data = await get<PayloadList<PayloadProduct>>(
    '/products?limit=100&where[status][equals]=published&depth=2'
  )
  return data?.docs ?? []
}

export const fetchProductBySlug = async (slug: string): Promise<PayloadProduct | null> => {
  const data = await get<PayloadList<PayloadProduct>>(
    `/products?where[slug][equals]=${encodeURIComponent(slug)}&depth=2&limit=1`
  )
  return data?.docs?.[0] ?? null
}

// ─────────────────────────────────────────────────────────────────────────────
// Shape adapter — maps Payload product to the shape Shop.tsx expects
// ─────────────────────────────────────────────────────────────────────────────

const CONDITION_SCORE: Record<string, number> = {
  'excellent': 100,
  'tres-bon':  80,
  'bon':       60,
}

const MAIN_CAT_LABEL: Record<string, 'Téléphonie' | 'Informatique' | 'Accessoires'> = {
  'telephonie':  'Téléphonie',
  'informatique': 'Informatique',
  'accessoires': 'Accessoires',
}

export interface ShopProduct {
  id:             string
  name:           string
  price:          string
  specs:          string
  image:          string
  gallery:        string[]
  mainCategory:   'Téléphonie' | 'Informatique' | 'Accessoires'
  category:       string
  condition:      string
  conditionScore: number
}

export const adaptProduct = (p: PayloadProduct): ShopProduct => {
  const images = p.images?.map(i => mediaUrl(i.image) ?? '') ?? []
  const mainCat = MAIN_CAT_LABEL[p.category?.mainCategory] ?? 'Téléphonie'

  return {
    id:             p.id,
    name:           p.name,
    price:          p.price,
    specs:          p.specs ?? p.description ?? '',
    image:          images[0] ?? '',
    gallery:        images,
    mainCategory:   mainCat,
    category:       p.category?.name ?? 'Général',
    condition:      p.condition === 'excellent' ? 'Excellent'
                  : p.condition === 'tres-bon'  ? 'Très bon'
                  : 'Bon',
    conditionScore: p.conditionScore ?? CONDITION_SCORE[p.condition] ?? 100,
  }
}
