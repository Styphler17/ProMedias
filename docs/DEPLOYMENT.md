# Deployment Guide — ProMedias (Hostinger)

This document covers deploying both the WordPress CMS and the React frontend to Hostinger shared hosting.

---

## Architecture

```
promedias-liege.be          → React frontend  (Hostinger public_html/)
cms.promedias-liege.be      → WordPress CMS   (Hostinger subdomain folder)
```

---

## Prerequisites

- Hostinger account with at least one shared hosting plan
- FTP client (FileZilla) or access to Hostinger hPanel File Manager
- phpMyAdmin access (available in hPanel)
- Node.js installed locally (for building the frontend)

---

## Part 1 — Deploy the WordPress CMS

### 1.1 Export the local database

1. Open **phpMyAdmin** at `http://localhost/phpMyAdmin`
2. Select the `promedias-cms` database in the left sidebar
3. Click **Export** → Format: **SQL** → click **Go**
4. Save the `.sql` file locally

### 1.2 Update URLs in the SQL dump

Open the `.sql` file in a text editor and do a find & replace:

| Find | Replace with |
|---|---|
| `http://localhost/promedias-cms` | `https://cms.promedias-liege.be` |

Save the file.

### 1.3 Create a database on Hostinger

1. Go to **hPanel → Databases → MySQL Databases**
2. Create a new database, user, and password
3. Note down: `DB_NAME`, `DB_USER`, `DB_PASSWORD`

### 1.4 Import the database

1. In hPanel → **phpMyAdmin** → select your new database
2. Click **Import** → choose your modified `.sql` file → Go

### 1.5 Upload WordPress files

1. In hPanel → **Subdomains** → create `cms.promedias-liege.be`
   - Set document root to something like `public_html/cms/`
2. Upload the entire contents of `C:\MAMP\htdocs\promedias-cms\` to that folder
   - You can use **File Manager** or **FTP** (FileZilla)
   - Skip: `wp-config.php` (you'll create a clean one)

### 1.6 Configure wp-config.php

Create (or edit) `wp-config.php` on the server with your Hostinger DB credentials:

```php
define( 'DB_NAME',     'your_db_name' );
define( 'DB_USER',     'your_db_user' );
define( 'DB_PASSWORD', 'your_db_password' );
define( 'DB_HOST',     'localhost' );
define( 'DB_CHARSET',  'utf8' );

// Tells functions.php where the React frontend lives (CORS + headless redirect)
define( 'PROMEDIAS_FRONTEND_URL', 'https://promedias-liege.be' );

// Keep the rest of wp-config.php as-is (salts, table prefix, etc.)
```

### 1.7 Verify the CMS

- Visit `https://cms.promedias-liege.be/wp-admin` — you should see the WP login
- Visit `https://cms.promedias-liege.be/wp-json/wp/v2/pages` — should return JSON
- Check **Custom Fields → Field Groups** — all 3 groups should be visible

---

## Part 2 — Deploy the React Frontend

### 2.1 Create production environment file

In `C:\MAMP\htdocs\ProMedias\`, copy the example env file:

```bash
cp .env.production.example .env.production
```

Edit `.env.production`:

```env
VITE_WC_URL=https://cms.promedias-liege.be
VITE_WC_CONSUMER_KEY=ck_your_production_key
VITE_WC_CONSUMER_SECRET=cs_your_production_secret
```

> **Note:** Generate production WooCommerce API keys in the live WP Admin:
> WooCommerce → Settings → Advanced → REST API → Add key (Read permission)

### 2.2 Build the frontend

```bash
cd C:\MAMP\htdocs\ProMedias
npm run build
```

This produces a `dist/` folder with all static assets.

### 2.3 Upload to Hostinger

1. In hPanel → **File Manager** → navigate to `public_html/`
2. Upload the **contents** of the `dist/` folder (not the folder itself)
   - `index.html` should be at the root of `public_html/`
   - `.htaccess` is included automatically (copied from `public/`)

### 2.4 Verify the frontend

- Visit `https://promedias-liege.be` — React app loads
- Check that product images, logos, and hero backgrounds load from the CMS
- Test all routes: `/services`, `/shop`, `/diagnostic`, `/about`

---

## Part 3 — Post-deployment checklist

- [ ] WP Admin accessible at `cms.promedias-liege.be/wp-admin`
- [ ] REST API returns data at `cms.promedias-liege.be/wp-json/wp/v2/pages`
- [ ] Frontend loads at `promedias-liege.be`
- [ ] Logo loads from ACF (Réglages page)
- [ ] Home hero background loads from ACF
- [ ] Shop products load with images
- [ ] All page routes work (no 404 on refresh)
- [ ] Diagnostic form submits correctly
- [ ] Mobile menu opens/closes correctly
- [ ] SSL certificate active on both domains (Hostinger provides free SSL)

---

## Updating the site after deployment

### Update frontend content (text, layout, etc.)

```bash
# Make your changes locally, then:
npm run build
# Re-upload dist/ contents to public_html/
```

### Update CMS content (images, descriptions)

Just edit in **WP Admin** — changes are live instantly via the REST API.

### Update WordPress files / theme

Upload the changed files via FTP to the CMS subdomain folder. For `functions.php` changes, upload to:
```
cms.promedias-liege.be/wp-content/themes/twentytwentyfive/functions.php
```

---

## Troubleshooting

| Problem | Likely cause | Fix |
|---|---|---|
| Blank page on frontend | Missing `.htaccess` or wrong build upload | Re-upload `dist/` contents, verify `.htaccess` is present |
| 404 on page refresh | `.htaccess` not active | Enable `mod_rewrite` in hPanel or contact Hostinger support |
| Images not loading | Wrong `VITE_WC_URL` in `.env.production` | Rebuild with correct URL |
| API returns 401 | Wrong WooCommerce keys | Regenerate keys in WP Admin → WooCommerce → REST API |
| CORS error in browser | `PROMEDIAS_FRONTEND_URL` not set in `wp-config.php` | Add the `define()` line with your frontend domain |
| WP admin redirects to frontend | Expected — the headless redirect is active for non-admin visitors | Log in at `/wp-login.php` directly |
