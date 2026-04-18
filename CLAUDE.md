# CLAUDE.md — ProMedias Frontend

React + Vite + TypeScript frontend for the ProMedias Liège website.
Backend: **Express + MariaDB** custom API server in `server/`, running on port 3002.

---

## Stack

- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router v6
- **Animation**: Framer Motion
- **Carousel**: Embla Carousel
- **Backend**: Express 5 + MariaDB (`server/` directory, port 3002 in dev)

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
    admin/
      AdminLayout.tsx — Shared layout for admin pages
  pages/
    Home.tsx         — Landing page
    About.tsx        — About / team / store
    Services.tsx     — Service catalogue
    Shop.tsx         — Product browser
    Diagnostic.tsx   — Diagnostic request form
    admin/
      Login.tsx      — Admin login
      Dashboard.tsx  — Admin dashboard
      Products.tsx   — Manage products
      Categories.tsx — Manage categories
      Settings.tsx   — Manage site settings & images
  lib/
    woocommerce.ts   — Public API client (fetchSiteOptions, fetchPage, fetchProducts, fetchCategories)
    admin.ts         — Admin API client (auth + CRUD for products, categories, settings, upload)

server/
  index.ts           — Express entry point, port 3002
  db.ts              — MariaDB connection pool
  schema.sql         — Database schema
  routes/
    auth.ts          — POST /api/auth/login, /api/auth/register
    products.ts      — CRUD /api/products
    categories.ts    — CRUD /api/categories
    settings.ts      — GET/PUT /api/settings, GET /api/settings/site, GET /api/settings/about
    upload.ts        — POST /api/upload (multer → /uploads)
```

---

## API Layer (`src/lib/woocommerce.ts`)

All public CMS data flows through `src/lib/woocommerce.ts` (kept as-is to avoid renaming imports).

### Endpoints used

| Function             | Express endpoint              | Used in                                  |
|----------------------|-------------------------------|------------------------------------------|
| `fetchSiteOptions()` | `GET /api/settings/site`      | Layout, Home, Services, Shop, Diagnostic |
| `fetchPage('about')` | `GET /api/settings/about`     | About.tsx                                |
| `fetchProducts()`    | `GET /api/products?status=published` | Shop.tsx                          |
| `fetchCategories()`  | `GET /api/categories`         | Shop.tsx                                 |

### SiteOptions keys

| Key                   | DB field (settings table) | Used in          |
|-----------------------|---------------------------|------------------|
| `site_logo`           | `logo`                    | Layout.tsx       |
| `site_logo_white`     | `logo_white`              | Layout.tsx       |
| `home_hero_bg`        | `home_hero_bg`            | Home.tsx         |
| `services_hero_bg`    | `services_hero_bg`        | Services.tsx     |
| `shop_hero_bg`        | `shop_hero_bg`            | Shop.tsx         |
| `diagnostic_hero_bg`  | `diagnostic_hero_bg`      | Diagnostic.tsx   |

All images are optional — pages fall back gracefully.

### About page image keys (`pageData.acf.*`)

`hero_image`, `environmental_impact_image`, `boutique_storefront_image`, `team_1`–`team_4`

### Adding a new CMS image

1. **DB**: add a row to the `settings` table (key/value pair).
2. **`server/routes/settings.ts`**: expose the new key via `/api/settings/site` or `/api/settings/about`.
3. **`woocommerce.ts`**: add to `SiteOptions` interface and map in `fetchSiteOptions()`, or handle in `fetchPage()`.
4. **Component**: consume via `siteOptions.your_field` or `pageData?.acf?.your_field`.

### PageHero `bgImage` prop

Accepts `bgImage?: string`. Renders at 30% opacity behind gradient. Omit for pure dark gradient fallback.

---

## Vite Proxy (dev)

`vite.config.ts` proxies `/api` and `/uploads` → `http://localhost:3002` (Express backend).

---

## Environment Variables

**Frontend (`.env`):**
```
VITE_CMS_URL=http://localhost:3002

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=root
DB_NAME=promedias

JWT_SECRET=dev-jwt-secret-change-me
FRONTEND_URL=http://localhost:5173
```

**Production (`.env.production`):**
```
VITE_CMS_URL=https://api.promedias-liege.be

DB_HOST=your-db-host
DB_PORT=3306
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=promedias

JWT_SECRET=change-me-to-a-long-random-string
FRONTEND_URL=https://promedias-liege.be
```

---

## Admin Panel

Protected routes under `/admin/*`. Auth uses JWT stored in `localStorage`.

- `/admin/login` — public login page
- `/admin` — dashboard
- `/admin/products` — product CRUD + image upload
- `/admin/categories` — category CRUD
- `/admin/settings` — site settings + hero image uploads

---

## Mobile Menu

`Layout.tsx` uses a `useRef` on the `<header>` element. A `mousedown` listener (active only when the menu is open) closes the menu when the user clicks outside the header.
