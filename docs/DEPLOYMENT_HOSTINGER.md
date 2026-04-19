# Deployment Guide — Hostinger (React + PHP MVC + MariaDB)

This guide provides step-by-step instructions for deploying the **ProMedias** storefront to any standard Hostinger Shared Hosting plan using the professional PHP MVC backend.

---

## 🏗️ Architecture Overview

The app is divided into three main parts:
1.  **Frontend**: Static assets build from React (Vite).
2.  **Backend (MVC)**: Professional PHP 8.x Bridge (`api/` folder) handling routing and Database.
3.  **Database**: MariaDB/MySQL instance managed via Hostinger hPanel.

**Recommended Plan**: Standard Shared Hosting (Node.js is NOT required).

---

## 🛠️ Step 1 — Database Setup

1.  Log in to your **Hostinger hPanel**.
2.  Navigate to **Databases → MySQL Databases**.
3.  Create a new database and user:
    *   **MySQL Database**: `u123456789_promedias`
    *   **MySQL Username**: `u123456789_admin`
    *   **Password**: *[Create a strong password]*
4.  Open **phpMyAdmin** for this database.
5.  Click **Import** and upload the latest schema/data export.
    *   *Tip: Ensure your `admin_users` table has at least one account.*

---

## 🚀 Step 2 — Preparing the Build

1.  Run the build command locally:
    ```bash
    npm run build
    ```
    *This generates a `dist/` folder.*
2.  Your production API URL is set to `/api` by default, which matches the folder structure below.

---

## 📦 Step 3 — Uploading to Hostinger

Using Hostinger **File Manager** or FTP, upload your files to the **`public_html`** folder as follows:

```text
public_html/
├── api/                <-- Copy the ENTIRE api/ folder from project root
│   ├── Controllers/
│   ├── Core/
│   ├── Models/
│   ├── .htaccess
│   ├── config.php      <-- EDIT THIS ON SERVER
│   └── index.php
├── uploads/            <-- Copy your local uploads/ folder
├── index.html          <-- From your local dist/ folder
├── assets/             <-- From your local dist/ folder
└── .htaccess           <-- Create this for React routing
```

---

## ⚙️ Step 4 — Final Configuration

### 1. Update Database Credentials
Open **`api/config.php`** on the server and update the `db_config` array:

```php
$db_config = [
    'host' => 'localhost',
    'user' => 'u123456789_admin',    // Your Hostinger User
    'pass' => 'your_strong_password', // Your Hostinger Pass
    'name' => 'u123456789_promedias'  // Your Hostinger DB Name
];
```

### 2. Configure Root `.htaccess` (React Routing)
Create a `.htaccess` file in the **root** of `public_html` (not inside `api/`) to handle React navigation:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### 3. Permissions
Ensure the **`uploads/`** folder has **755** permissions so the backend can read/write images if needed.

---

## ✅ Deployment Checklist

- [ ] MariaDB tables imported.
- [ ] `api/config.php` updated with Hostinger credentials.
- [ ] `dist/` contents uploaded to root.
- [ ] `api/` folder uploaded to root.
- [ ] `uploads/` folder uploaded to root.
- [ ] Test the API: Visit `yoursite.com/api/ping` (Should return JSON).
- [ ] Test the App: Visit `yoursite.com` and verify products load.
- [ ] Test Admin: Visit `yoursite.com/admin` and try to login.
