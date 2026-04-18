# CLAUDE.md — ProMedias Frontend

React + Vite + TypeScript headless frontend for the ProMedias Liège website.
Backend: WordPress + WooCommerce + ACF at `C:\MAMP\htdocs\promedias-cms`.

---

## Stack

- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router v6
- **Animation**: Framer Motion
- **Carousel**: Embla Carousel

---

## Project Structure

```
src/
  components/
    Layout.tsx       — Header (logo, nav, mobile menu) + Footer + FAB
    PageHero.tsx     — Reusable dark hero banner used by Services, Shop, Diagnostic, About
    SEO.tsx          — React Helmet wrapper
    ScrollSequence.tsx — Scroll-driven iPhone exploded view
    ui/              — shadcn/ui primitives + custom components
  pages/
    Home.tsx         — Landing page
    About.tsx        — About / team / store
    Services.tsx     — Service catalogue
    Shop.tsx         — WooCommerce product browser
    Diagnostic.tsx   — Diagnostic request form
  lib/
    woocommerce.ts   — All WordPress / WooCommerce / ACF API calls
```

---

## WordPress / ACF Image Loading Pattern

All CMS-controlled images flow through `src/lib/woocommerce.ts`.

### How it works

1. **ACF fields** are defined in `functions.php` of the WordPress theme.
2. **`fetchSiteOptions()`** fetches the `reglages` WP page and returns all its ACF image fields as `SiteOptions` (a flat `Record<string, string | undefined>`).
3. **`fetchPage(slug)`** fetches a specific WP page and returns its `acf` object (typed as `Record<string, unknown>`).
4. **`acfImageUrl(field)`** (internal helper) accepts either a string URL or an ACF image array and normalises to a string URL.
5. **`rewriteUrl(url)`** (internal helper) strips the WP base URL so the Vite dev proxy (`/wp-content`) can serve images locally.

### Global site images (on the `reglages` WP page)

| ACF field name         | Used in          | Description                        |
|------------------------|------------------|------------------------------------|
| `site_logo`            | `Layout.tsx`     | Navbar logo (dark background)      |
| `site_logo_white`      | `Layout.tsx`     | Footer logo (light-on-dark)        |
| `home_hero_bg`         | `Home.tsx`       | Full-screen hero background        |
| `services_hero_bg`     | `Services.tsx`   | PageHero background image          |
| `shop_hero_bg`         | `Shop.tsx`       | PageHero background image          |
| `diagnostic_hero_bg`   | `Diagnostic.tsx` | PageHero background image          |

**All global images are optional** — pages fall back gracefully (gradient or local asset).

### Per-page images (on their own WP pages)

| ACF field name                 | WP page   | Used in      |
|--------------------------------|-----------|--------------|
| `hero_image`                   | a-propos  | `About.tsx`  |
| `environmental_impact_image`   | a-propos  | `About.tsx`  |
| `team_1` … `team_4`           | a-propos  | `About.tsx`  |
| `boutique_storefront_image`    | a-propos  | `About.tsx`  |

### Adding a new ACF image to a page

1. **Backend** (`functions.php`): add a new `array(...)` entry inside the relevant `acf_add_local_field_group`. Set `'return_format' => 'url'`. Add it to the `reglages` group for global images, or the page-specific group for per-page images.
2. **Frontend** (`woocommerce.ts`): if it's a global image, add its key to the `SiteOptions` interface (optional, for IDE autocomplete).
3. **Frontend** (page component): consume it:
   - Global: `const img = siteOptions.your_field_name ?? '/fallback.png'`
   - Per-page: `const img = typeof pageData?.acf?.your_field_name === 'string' ? pageData.acf.your_field_name : '/fallback.png'`

### PageHero `bgImage` prop

`PageHero` accepts an optional `bgImage?: string` prop. When provided, the image is rendered at 30% opacity behind the gradient. When omitted, the component falls back to a pure dark gradient — so all existing usages are unchanged.

---

## Vite Proxy (dev)

`vite.config.ts` proxies `/wp-json` and `/wp-content` to `http://localhost/promedias-cms` so all WordPress API calls and image URLs work without CORS issues in development.

---

## Environment Variables (`.env.local`)

```
VITE_WC_URL=http://localhost/promedias-cms
VITE_WC_CONSUMER_KEY=ck_...
VITE_WC_CONSUMER_SECRET=cs_...
```

---

## WP Page Slugs

The frontend maps its own slug names to French WordPress slugs:

| Code slug  | WP slug    |
|------------|------------|
| `about`    | `a-propos` |
| `home`     | `accueil`  |
| `services` | `services` |
| `shop`     | `boutique` |
| `options`  | `reglages` |

---

## Mobile Menu

`Layout.tsx` uses a `useRef` on the `<header>` element. A `mousedown` listener (active only when the menu is open) closes the menu when the user clicks outside the header.
