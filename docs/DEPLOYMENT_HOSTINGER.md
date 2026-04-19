# Deployment Guide — Hostinger (React + Node.js + MariaDB)

This guide provides step-by-step instructions for deploying the **ProMedias** storefront (React frontend, Node.js/Express backend, and MariaDB database) to Hostinger.

---

## 🏗️ Architecture Overview

The app is divided into three main parts:
1.  **Frontend**: Static assets built from React (Vite).
2.  **Backend**: Node.js/Express server handling APIs and Database connections.
3.  **Database**: MariaDB instance managed via Hostinger hPanel.

Recommended Plan: **Node.js Hosting** or **VPS**.

---

## 🛠️ Step 1 — Database Setup

1.  Log in to your **Hostinger hPanel**.
2.  Navigate to **Databases → MySQL Databases**.
3.  Create a new database and user:
    *   **MySQL Database**: `u123456789_promedias`
    *   **MySQL Username**: `u123456789_admin`
    *   **Password**: *[Create a strong password]*
4.  Open **phpMyAdmin** for this database.
5.  Click **Import** and upload the schema file found in:
    `docs/db/schema.sql`
6.  (Optional) If you have local data to migrate, export your local table data and import it here as well.

---

## 🚀 Step 2 — Preparing the Frontend Build

1.  Locally, create (or update) `.env.production`:
    ```env
    VITE_API_URL=/api
    ```
2.  Run the build command:
    ```bash
    npm run build
    ```
    *This generates a `dist/` folder containing your production-ready static files.*

---

## 📦 Step 3 — Uploading to Hostinger

### Using Hostinger Node.js Hosting (hPanel)
1.  Navigate to **Advanced → Node.js**.
2.  Select the app version (Node 20+ recommended).
3.  Upload your project files to the project directory (using File Manager or FTP):
    *   `dist/` contents (Upload to the `public_html` or the static folder defined in your Node.js app).
    *   `server/` folder
    *   `package.json`
    *   `package-lock.json`
4.  **Install Dependencies**: Use the hPanel's Node.js dashboard to run `npm install`.

---

## ⚙️ Step 4 — Environment Configuration

Create a `.env` file in the project root on Hostinger with these production fields:

```env
PORT=3002
DB_HOST=localhost
DB_USER=u123456789_admin
DB_NAME=u123456789_promedias
DB_PASSWORD=your_hostinger_password
JWT_SECRET=your_secret_key
VITE_API_URL=/api
```

---

## 🌐 Step 5 — Routing & Startup

Ensure your Express server (`server/index.ts`) is configured to serve the static files from the `dist` folder in production. 

### Start the Server
If you have SSH access, use **PM2** to keep the app alive:
```bash
npm install -g pm2
pm2 start server/index.ts --name promedias
pm2 save
```

### Routing (.htaccess)
If you need to handle Spa routing on shared hosting, ensure this `.htaccess` is in your static root:

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

---

## ✅ Final Checklist

- [ ] MariaDB tables imported.
- [ ] `.env` file created on server with `PORT=3002`.
- [ ] SSH into server and verify `npm install` was successful.
- [ ] Port 3002 is open or handled via Hostinger's Node.js proxying.
- [ ] WhatsApp redirection works.
- [ ] Modal images load (check `uploads/` folder permissions).
