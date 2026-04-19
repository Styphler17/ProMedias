-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Apr 19, 2026 at 10:58 PM
-- Server version: 5.7.24
-- PHP Version: 8.2.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `promedias`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_activities`
--

CREATE TABLE `admin_activities` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `action_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_id` int(11) NOT NULL,
  `details` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin_activities`
--

INSERT INTO `admin_activities` (`id`, `user_id`, `action_type`, `entity_type`, `entity_id`, `details`, `created_at`) VALUES
(1, 1, 'update', 'product', 1, 'Updated product: ASUS TUF Gaming FX505DT', '2026-04-19 22:48:21');

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL,
  `display_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `avatar` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'administrator'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `display_name`, `email`, `password_hash`, `created_at`, `avatar`, `role`) VALUES
(1, 'styph', '4testing17@gmail.com', '$2b$12$YU8Kz.qSovE0uM.X3.M.seQbWHDGAJwpfpqLqzIuywzIFm5o0tgR6', '2026-04-18 17:54:40', NULL, 'super_admin');

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` int(11) NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `whatsapp_message` text COLLATE utf8mb4_unicode_ci,
  `sort_order` int(11) DEFAULT '0',
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `title`, `subtitle`, `image_url`, `whatsapp_message`, `sort_order`, `active`, `created_at`) VALUES
(1, 'ASUS TUF Gaming FX505DT — 489€', 'PC Portable Comme Neuf · Ryzen 7 · SSD 512Go · RAM 16Go · GTX 1650 · 15.6\" Full HD', '/uploads/announcement_asus_tuf.jpg', 'Bonjour PROMEDIAS ! Je suis intéressé(e) par le PC Portable ASUS TUF Gaming FX505DT à 489€. Est-il encore disponible ?', 1, 1, '2026-04-19 00:56:10'),
(2, 'MSI Katana GF76 — 759€', 'PC Portable Comme Neuf · Intel Core i7 11e Gén · SSD 512Go · RAM 16Go · RTX 3050 · 17.3\" Full HD', '/uploads/announcement_msi_katana.jpg', 'Bonjour PROMEDIAS ! Je suis intéressé(e) par le PC Portable MSI Katana GF76 à 759€. Est-il encore disponible ?', 2, 1, '2026-04-19 00:59:01');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `main_category` enum('telephonie','informatique','accessoires') COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `main_category`, `description`, `created_at`, `updated_at`) VALUES
(1, 'iPhones', 'iphones', 'telephonie', 'La puissance de l\'écosystème Apple, reconditionnée avec soin et garantie 12 mois.', '2026-04-18 19:02:26', '2026-04-18 19:02:26'),
(2, 'Androids', 'androids', 'telephonie', 'Une large gamme de smartphones performants, testés sur plus de 50 points de contrôle.', '2026-04-18 19:02:26', '2026-04-18 19:02:26'),
(3, 'Tablettes', 'tablettes', 'telephonie', 'iPad et tablettes polyvalentes pour le dessin, le travail ou les loisirs.', '2026-04-18 19:02:26', '2026-04-18 19:02:26'),
(4, 'Laptops', 'laptops', 'informatique', 'Des ordinateurs portables comme neufs, idéaux pour la productivité et le divertissement.', '2026-04-18 19:02:26', '2026-04-18 19:02:26'),
(5, 'Écrans', 'ecrans', 'informatique', 'Améliorez votre espace de travail avec nos moniteurs haute performance.', '2026-04-18 19:02:26', '2026-04-18 19:02:26'),
(6, 'Systèmes fixes', 'systemes-fixes', 'informatique', 'La puissance brute au meilleur prix pour vos projets créatifs ou bureautiques.', '2026-04-18 19:02:26', '2026-04-18 19:02:26'),
(7, 'Chargeurs', 'chargeurs', 'accessoires', 'Alimentation certifiée et sécurisée pour la longévité de vos batteries.', '2026-04-18 19:02:26', '2026-04-18 19:02:26'),
(8, 'Coques', 'coques', 'accessoires', 'Protection élégante et robuste pour sécuriser votre smartphone au quotidien.', '2026-04-18 19:02:26', '2026-04-18 19:02:26'),
(9, 'Verres Trempés', 'verres-trempes', 'accessoires', 'La protection ultime contre les chocs et les rayures pour votre écran.', '2026-04-18 19:02:26', '2026-04-18 19:02:26'),
(10, 'Casques', 'casques', 'accessoires', 'L\'excellence sonore reconditionnée pour une immersion totale.', '2026-04-18 19:02:26', '2026-04-18 19:02:26'),
(11, 'Souris', 'souris', 'accessoires', 'Précision et ergonomie pour votre setup informatique.', '2026-04-18 19:02:26', '2026-04-18 19:02:26'),
(12, 'Claviers', 'claviers', 'accessoires', 'Confort de frappe et durabilité pour tous vos supports.', '2026-04-18 19:02:26', '2026-04-18 19:02:26');

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

CREATE TABLE `media` (
  `id` int(11) NOT NULL,
  `filename` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `original_name` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` int(11) NOT NULL DEFAULT '0',
  `mime_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'image/jpeg',
  `category` enum('product','logo','page','hero','announcement','team','uncategorized') COLLATE utf8mb4_unicode_ci DEFAULT 'uncategorized',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `media`
--

INSERT INTO `media` (`id`, `filename`, `url`, `original_name`, `size`, `mime_type`, `category`, `created_at`, `deleted_at`, `type`) VALUES
(1, 'hero-bg.png', '/uploads/hero-bg.png', 'hero-bg.png', 636467, 'image/png', 'hero', '2026-04-18 23:35:43', NULL, ''),
(2, 'logo.png', '/uploads/logo.png', 'logo.png', 344734, 'image/png', 'logo', '2026-04-18 23:35:43', NULL, ''),
(27, 'services_hero_bg.png', '/uploads/services_hero_bg.png', 'services_hero_bg.png', 721929, 'image/png', 'hero', '2026-04-18 23:50:33', NULL, ''),
(49, 'promedias-og-image-1776557045407.png', '/uploads/promedias-og-image-1776557045407.png', 'promedias-og-image.png', 2057631, 'image/png', 'page', '2026-04-19 00:04:05', NULL, ''),
(50, 'about_hero_bg.png', '/uploads/about_hero_bg.png', 'about_hero_bg.png', 675521, 'image/png', 'hero', '2026-04-19 00:06:24', NULL, ''),
(51, 'diagnostic_hero_bg.png', '/uploads/diagnostic_hero_bg.png', 'diagnostic_hero_bg.png', 800343, 'image/png', 'hero', '2026-04-19 00:06:24', NULL, ''),
(52, 'environmental_impact_bg.png', '/uploads/environmental_impact_bg.png', 'environmental_impact_bg.png', 737527, 'image/png', 'page', '2026-04-19 00:06:24', NULL, ''),
(57, 'shop_hero_bg.png', '/uploads/shop_hero_bg.png', 'shop_hero_bg.png', 622292, 'image/png', 'hero', '2026-04-19 00:06:24', NULL, ''),
(434, 'team_1_placeholder.png', '/uploads/team_1_placeholder.png', 'team_1_placeholder.png', 505252, 'image/png', 'team', '2026-04-19 00:28:19', NULL, ''),
(444, 'team_2_placeholder.png', '/uploads/team_2_placeholder.png', 'team_2_placeholder.png', 505252, 'image/png', 'team', '2026-04-19 00:46:58', NULL, ''),
(445, 'team_3_placeholder.png', '/uploads/team_3_placeholder.png', 'team_3_placeholder.png', 505252, 'image/png', 'team', '2026-04-19 00:46:58', NULL, ''),
(446, 'team_4_placeholder.png', '/uploads/team_4_placeholder.png', 'team_4_placeholder.png', 505252, 'image/png', 'team', '2026-04-19 00:46:58', NULL, ''),
(532, 'announcement_asus_tuf.jpg', '/uploads/announcement_asus_tuf.jpg', 'announcement_asus_tuf.jpg', 76291, 'image/jpeg', 'uncategorized', '2026-04-19 00:58:42', NULL, ''),
(546, 'announcement_msi_katana.jpg', '/uploads/announcement_msi_katana.jpg', 'announcement_msi_katana.jpg', 79863, 'image/jpeg', 'uncategorized', '2026-04-19 01:02:01', NULL, '');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `condition_state` enum('excellent','tres-bon','bon') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'excellent',
  `condition_score` int(11) NOT NULL DEFAULT '100',
  `specs` text COLLATE utf8mb4_unicode_ci,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('published','draft','sold') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'published',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  `seo_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seo_description` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `slug`, `price`, `category_id`, `condition_state`, `condition_score`, `specs`, `description`, `status`, `created_at`, `updated_at`, `deleted_at`, `seo_title`, `seo_description`) VALUES
(1, 'ASUS TUF Gaming FX505DT', 'asus-tuf-gaming-fx505dt', '489', 4, 'excellent', 95, 'AMD Ryzen 7 | SSD 512Go | RAM 16Go | NVIDIA GeForce GTX 1650 | 15.6\" Full HD 1080p | Bluetooth | WiFi | Windows 11 | HDMI | USB Type-C | USB | Webcam', 'PC Portable Gaming Comme Neuf. Puissant processeur AMD Ryzen 7 couplé à une carte graphique GTX 1650 pour une expérience gaming fluide. Stockage rapide SSD 512Go et 16Go de RAM pour des performances optimales.', 'published', '2026-04-19 01:02:51', '2026-04-19 22:48:21', NULL, 'ASUS TUF Gaming FX505DT - Laptops | ProMedias', 'Découvrez ASUS TUF Gaming FX505DT chez ProMedias. PC Portable Gaming Comme Neuf. Puissant processeur AMD Ryzen 7 couplé à une carte graphique GTX 1650... Sol...'),
(2, 'MSI Katana GF76', 'msi-katana-gf76', '759', 4, 'excellent', 96, 'Intel Core i7 11e Génération | SSD 512Go | RAM 16Go | NVIDIA GeForce RTX 3050 | 17.3\" Full HD 1080p | Bluetooth | WiFi | Windows 11 | HDMI | USB Type-C | USB | Webcam', 'PC Portable Gaming Comme Neuf. Processeur Intel Core i7 de 11e génération et carte graphique RTX 3050 pour des performances gaming et créatives de haut niveau. Grand écran 17.3\" Full HD pour une immersion totale.', 'published', '2026-04-19 01:02:51', '2026-04-19 01:02:51', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `url`, `sort_order`) VALUES
(2, 2, '/uploads/announcement_msi_katana.jpg', 0),
(3, 1, '/uploads/announcement_asus_tuf.jpg', 0);

-- --------------------------------------------------------

--
-- Table structure for table `site_settings`
--

CREATE TABLE `site_settings` (
  `setting_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `site_settings`
--

INSERT INTO `site_settings` (`setting_key`, `setting_value`) VALUES
('about_hero_bg', '/uploads/about_hero_bg.png'),
('boutique_storefront_image', 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=awRRmECzGmtnHHzk42XHQw&cb_client=lu.gallery.gps&w=1600&h=900&yaw=301.9327&pitch=0&thumbfov=100'),
('contact_address', '141 Rue St-Léonard, 4000 Liège'),
('contact_email', 'promedias.liege@gmail.com'),
('contact_facebook', 'https://www.facebook.com/people/Promedias-Liege/61555319957302/'),
('contact_hours_saturday', 'Samedi: 10h00 - 17h00'),
('contact_hours_sunday', 'Dimanche: Fermé'),
('contact_hours_weekdays', 'Lun - Ven: 09h00 - 18h30'),
('contact_instagram', NULL),
('contact_maps_url', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2530.0768461741517!2d5.5947761!3d50.6442654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c0fa3e595e595b%3A0xc3f1406e23730e70!2sRue%20Saint-L%C3%A9onard%20141%2C%204000%20Li%C3%A8ge!5e0!3m2!1sfr!2sbe!4v1700000000000!5m2!1sfr!2sbe'),
('contact_phone', '+32 466 05 87 93'),
('contact_shop_name', 'ProMedias Liège'),
('contact_storefront_url', 'https://maps.app.goo.gl/hqZzndPS1J5E5r6h9'),
('contact_whatsapp', '+32 466 05 87 93'),
('diagnostic_hero_bg', '/uploads/diagnostic_hero_bg.png'),
('environmental_impact_image', '/uploads/environmental_impact_bg.png'),
('hero_image', 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1600'),
('home_hero_bg', '/uploads/hero-bg.png'),
('logo', '/uploads/logo.png'),
('logo_white', '/uploads/logo.png'),
('services_hero_bg', '/uploads/services_hero_bg.png'),
('shop_hero_bg', '/uploads/shop_hero_bg.png'),
('team_1', '/uploads/team_1_placeholder.png'),
('team_2', '/uploads/team_2_placeholder.png'),
('team_3', '/uploads/team_3_placeholder.png'),
('team_4', '/uploads/team_4_placeholder.png');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_activities`
--
ALTER TABLE `admin_activities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `filename` (`filename`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`setting_key`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_activities`
--
ALTER TABLE `admin_activities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `media`
--
ALTER TABLE `media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=547;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
