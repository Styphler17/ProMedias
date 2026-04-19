-- ProMedias CMS schema for MariaDB
-- Run once: mysql -u root -p promedias < server/schema.sql

CREATE DATABASE IF NOT EXISTS promedias CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE promedias;

CREATE TABLE IF NOT EXISTS admin_users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  avatar        VARCHAR(500) NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  slug          VARCHAR(255) NOT NULL UNIQUE,
  main_category ENUM('telephonie','informatique','accessoires') NOT NULL,
  description   TEXT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(255) NOT NULL,
  slug            VARCHAR(255) NOT NULL UNIQUE,
  price           VARCHAR(50)  NOT NULL,
  category_id     INT,
  condition_state ENUM('excellent','tres-bon','bon') NOT NULL DEFAULT 'excellent',
  condition_score INT NOT NULL DEFAULT 100,
  specs           TEXT,
  description     TEXT,
  status          ENUM('published','draft','sold') NOT NULL DEFAULT 'published',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS product_images (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  url        VARCHAR(500) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS site_settings (
  setting_key   VARCHAR(100) PRIMARY KEY,
  setting_value TEXT
);

CREATE TABLE IF NOT EXISTS media (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  filename      VARCHAR(500) NOT NULL UNIQUE,
  url           VARCHAR(500) NOT NULL,
  original_name VARCHAR(500) NOT NULL,
  size          INT NOT NULL DEFAULT 0,
  mime_type     VARCHAR(100) NOT NULL DEFAULT 'image/jpeg',
  category      ENUM('product','logo','page','uncategorized') NOT NULL DEFAULT 'uncategorized',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed default setting keys
INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES
  ('logo',                      NULL),
  ('logo_white',                NULL),
  ('home_hero_bg',              NULL),
  ('services_hero_bg',          NULL),
  ('shop_hero_bg',              NULL),
  ('diagnostic_hero_bg',        NULL),
  ('hero_image',                NULL),
  ('environmental_impact_image',NULL),
  ('boutique_storefront_image', NULL),
  ('team_1',                    NULL),
  ('team_2',                    NULL),
  ('team_3',                    NULL),
  ('team_4',                    NULL),
  ('contact_shop_name',         NULL),
  ('contact_address',           NULL),
  ('contact_phone',             NULL),
  ('contact_email',             NULL),
  ('contact_hours_weekdays',    NULL),
  ('contact_hours_saturday',    NULL),
  ('contact_hours_sunday',      NULL),
  ('contact_facebook',          NULL),
  ('contact_instagram',         NULL),
  ('contact_whatsapp',          NULL),
  ('contact_maps_url',          NULL);
