const CONSUMER_KEY    = import.meta.env.VITE_WC_CONSUMER_KEY    as string;
const CONSUMER_SECRET = import.meta.env.VITE_WC_CONSUMER_SECRET as string;

// Base URL of the WordPress install.
const WP_BASE = import.meta.env.VITE_WC_URL as string || 'http://localhost/promedias-cms';

// In dev, Vite proxies /wp-json and /wp-content to WP_BASE, so use relative paths.
// In production, no proxy exists — use absolute URLs pointing directly at the CMS.
const IS_DEV  = import.meta.env.DEV;
const WC_URL  = IS_DEV ? '/wp-json/wc/v3'  : `${WP_BASE}/wp-json/wc/v3`;
const WP_URL  = IS_DEV ? '/wp-json/wp/v2'  : `${WP_BASE}/wp-json/wp/v2`;

/**
 * In dev: strip WP_BASE so the Vite proxy (/wp-content) serves images locally.
 * In prod: keep the full absolute URL — images are served directly from the CMS domain.
 */
const rewriteUrl = (url: string): string => {
  if (!url) return url;
  return IS_DEV ? url.replace(WP_BASE, '') : url;
};

/** Safely extract an image URL from an ACF field (string URL or ACF image array/object). */
const acfImageUrl = (field: unknown): string | undefined => {
  if (!field) return undefined;
  if (typeof field === 'string') return rewriteUrl(field);
  if (typeof field === 'object' && field !== null && 'url' in field)
    return rewriteUrl((field as { url: string }).url);
  return undefined;
};

// ---------------------------------------------------------------------------
// WooCommerce auth — use query params, not Basic header.
// WooCommerce requires HTTPS for the Authorization header; on HTTP/localhost
// query params are the reliable fallback.
// ---------------------------------------------------------------------------
const wcParams = (extra?: Record<string, string>): string => {
  const p = new URLSearchParams({
    consumer_key:    CONSUMER_KEY,
    consumer_secret: CONSUMER_SECRET,
    ...extra,
  });
  return p.toString();
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WCProduct {
  id: number;
  name: string;
  price: string;
  description: string;
  short_description: string;
  images: { src: string }[];
  categories: { id: number; name: string }[];
  attributes: { name: string; options: string[] }[];
  status: string;
  stock_status: string;
}

export interface WCCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  acf?: {
    hero_description?: string;
  };
}

export interface PageData {
  title: string;
  content: string;
  // ACF fields can be strings, numbers, booleans, or image objects
  acf: Record<string, unknown>;
}

/** Global site options controlled from WordPress (logo, hero images, etc.) */
export interface SiteOptions {
  /** Main logo (dark bg) */
  logo?: string;
  /** White/inverted logo (light bg or footer) */
  logo_white?: string;
  /** Home page hero background image */
  home_hero_bg?: string;
  /** Any other arbitrary ACF fields */
  [key: string]: string | undefined;
}

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------

export const fetchCategories = async (): Promise<WCCategory[]> => {
  try {
    const res = await fetch(`${WC_URL}/products/categories?per_page=100&${wcParams()}`);
    if (!res.ok) throw new Error(`Categories ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('WooCommerce Categories Error:', err);
    return [];
  }
};

export const fetchProducts = async () => {
  try {
    const res = await fetch(
      `${WC_URL}/products?${wcParams({ per_page: '100', status: 'publish' })}`
    );
    if (!res.ok) throw new Error(`Products ${res.status}: ${await res.text()}`);

    const data: WCProduct[] = await res.json();

    return data.map(product => {
      const findAttr = (name: string) =>
        product.attributes.find(a => a.name.toLowerCase() === name.toLowerCase())
          ?.options[0] || '';

      const specs     = findAttr('Specs') || findAttr('Spécifications');
      const condition = findAttr('Condition') || 'Excellent';
      const score     = parseInt(findAttr('Score')) || 100;

      const categoryNames = product.categories.map(c => c.name);
      let mainCat: 'Téléphonie' | 'Informatique' | 'Accessoires' = 'Téléphonie';
      if (categoryNames.includes('Informatique')) mainCat = 'Informatique';
      else if (categoryNames.includes('Accessoires')) mainCat = 'Accessoires';

      return {
        id:            product.id,
        name:          product.name,
        price:         product.price + ' €',
        specs:         specs || product.short_description.replace(/<[^>]*>?/gm, '').substring(0, 60),
        image:         rewriteUrl(product.images[0]?.src || ''),
        gallery:       product.images.map(img => rewriteUrl(img.src)),
        mainCategory:  mainCat,
        category:      product.categories[0]?.name || 'Général',
        condition,
        conditionScore: score,
      };
    });
  } catch (err) {
    console.error('WooCommerce Products Error:', err);
    return [];
  }
};

// SEO-friendly slug mapping (code slug → WordPress French slug)
const PAGE_SLUGS: Record<string, string> = {
  about:    'a-propos',
  home:     'accueil',
  services: 'services',
  shop:     'boutique',
  options:  'reglages',     // ACF Options page (site-wide settings)
};

export const fetchPage = async (slug: string): Promise<PageData | null> => {
  const finalSlug = PAGE_SLUGS[slug] || slug;
  try {
    const res = await fetch(`${WP_URL}/pages?slug=${finalSlug}`);
    if (!res.ok) throw new Error(`Page "${finalSlug}" ${res.status}`);

    const data = await res.json();
    if (!data.length) return null;

    const page = data[0];
    return {
      title:   page.title.rendered,
      content: page.content.rendered,
      acf:     page.acf || {},
    };
  } catch (err) {
    console.error('WordPress Page Error:', err);
    return null;
  }
};

/**
 * Fetch site-wide options from a dedicated WordPress page called "reglages"
 * (slug: reglages). Create this page in WP admin and attach an ACF group to it
 * with these field names:
 *
 *   site_logo        — Image field (logo on dark background)
 *   site_logo_white  — Image field (white/inverted logo for footer)
 *   home_hero_bg     — Image field (hero background on Home page)
 *
 * All image fields should use "Image URL" as the return format, or "Image Array"
 * (both are handled automatically).
 */
export const fetchSiteOptions = async (): Promise<SiteOptions> => {
  const page = await fetchPage('options');
  if (!page?.acf) return {};

  const result: SiteOptions = {};
  for (const [key, value] of Object.entries(page.acf)) {
    const url = acfImageUrl(value);
    if (url) result[key] = url;
  }
  return result;
};
