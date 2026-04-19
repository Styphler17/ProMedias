<?php
namespace Models;

use Core\Database;
use PDO;

class Product {
    /** @var \PDO */
    private $db;
    private $activity;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
        $this->activity = new Activity();
        $this->checkAndMigrate();
    }

    private function checkAndMigrate() {
        try {
            $check = $this->db->query("SHOW COLUMNS FROM products LIKE 'deleted_at'")->fetch();
            if (!$check) {
                $this->db->exec("ALTER TABLE products ADD COLUMN deleted_at DATETIME DEFAULT NULL");
            }
            
            $checkSeo = $this->db->query("SHOW COLUMNS FROM products LIKE 'seo_title'")->fetch();
            if (!$checkSeo) {
                $this->db->exec("ALTER TABLE products ADD COLUMN seo_title VARCHAR(255) DEFAULT NULL, ADD COLUMN seo_description TEXT DEFAULT NULL");
            }
        } catch (\Exception $e) { /* ignore */ }
    }

    public function getAll($status = 'published') {
        $sql = "
            SELECT 
                p.id, p.name, p.slug, p.price, p.specs, p.description, p.status, p.created_at, p.deleted_at,
                p.category_id as categoryId,
                p.condition_state as `condition`,
                p.condition_score as conditionScore,
                p.seo_title, p.seo_description,
                c.name as category_name,
                c.main_category as mainCategory
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE 1=1
        ";
        
        $params = [];
        
        if ($status === 'trash') {
            $sql .= " AND p.deleted_at IS NOT NULL ";
        } else {
            $sql .= " AND p.deleted_at IS NULL ";
            if ($status !== 'all') {
                $sql .= " AND p.status = ? ";
                $params[] = $status;
            }
        }
        
        $sql .= " ORDER BY p.created_at DESC";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $products = $stmt->fetchAll();
        
        foreach ($products as &$p) {
            $p['gallery'] = $this->getGallery($p['id']);
            $p['image'] = !empty($p['gallery']) ? $p['gallery'][0] : null;
        }
        return $products;
    }

    public function getById($id) {
        $stmt = $this->db->prepare("
            SELECT 
                id, name, slug, price, specs, description, status, created_at, deleted_at,
                category_id as categoryId,
                condition_state as `condition`,
                condition_score as conditionScore,
                seo_title, seo_description
            FROM products 
            WHERE id = ?
        ");
        $stmt->execute([$id]);
        $product = $stmt->fetch();
        if ($product) {
            $product['gallery'] = $this->getGallery($id);
            $product['image'] = !empty($product['gallery']) ? $product['gallery'][0] : null;
        }
        return $product;
    }

    public function create($data) {
        $stmt = $this->db->prepare("
            INSERT INTO products (
                name, slug, price, category_id, condition_state, condition_score, 
                specs, description, status, seo_title, seo_description, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ");
        $stmt->execute([
            $data['name'], $data['slug'], $data['price'], 
            $data['categoryId'] ?? $data['category_id'] ?? null,
            $data['condition'] ?? $data['condition_state'] ?? null,
            $data['conditionScore'] ?? $data['condition_score'] ?? 100,
            $data['specs'] ?? null, $data['description'] ?? null,
            $data['status'] ?? 'published',
            $data['seo_title'] ?? $data['seoTitle'] ?? null,
            $data['seo_description'] ?? $data['seoDescription'] ?? null
        ]);
        
        $productId = $this->db->lastInsertId();
        if (!empty($data['images'])) {
            $this->updateGallery($productId, $data['images']);
        }
        
        $this->activity->log('create', 'product', $productId, "Created product: {$data['name']}");
        return $productId;
    }

    public function update($id, $data) {
        $stmt = $this->db->prepare("
            UPDATE products SET 
                name = ?, slug = ?, price = ?, category_id = ?, 
                condition_state = ?, condition_score = ?, 
                specs = ?, description = ?, status = ?,
                seo_title = ?, seo_description = ?
            WHERE id = ?
        ");
        $res = $stmt->execute([
            $data['name'], $data['slug'], $data['price'], 
            $data['categoryId'] ?? $data['category_id'] ?? null,
            $data['condition'] ?? $data['condition_state'] ?? null,
            $data['conditionScore'] ?? $data['condition_score'] ?? 100,
            $data['specs'] ?? null, $data['description'] ?? null,
            $data['status'] ?? 'published',
            $data['seo_title'] ?? $data['seoTitle'] ?? null,
            $data['seo_description'] ?? $data['seoDescription'] ?? null,
            $id
        ]);
        
        if (isset($data['images'])) {
            $this->updateGallery($id, $data['images']);
        }
        
        if ($res) $this->activity->log('update', 'product', $id, "Updated product: {$data['name']}");
        return $res;
    }

    private function updateGallery($productId, $images) {
        $this->db->prepare("DELETE FROM product_images WHERE product_id = ?")->execute([$productId]);
        $stmt = $this->db->prepare("INSERT INTO product_images (product_id, url, sort_order) VALUES (?, ?, ?)");
        foreach ($images as $index => $url) {
            $stmt->execute([$productId, $url, $index]);
        }
    }

    public function generateSEO($name, $description, $categoryId = null) {
        $categoryName = "";
        if ($categoryId) {
            $stmt = $this->db->prepare("SELECT name FROM categories WHERE id = ?");
            $stmt->execute([$categoryId]);
            $categoryName = $stmt->fetchColumn();
        }

        // 1. Meta Title (Max 60 chars)
        $cleanName = trim(strip_tags($name));
        $title = $cleanName;
        if ($categoryName) $title .= " - " . $categoryName;
        $title .= " | ProMedias";
        
        if (mb_strlen($title) > 60) {
            $title = mb_substr($cleanName, 0, 45) . "... | ProMedias";
        }

        // 2. Meta Description (Max 160 chars)
        $cleanDesc = trim(strip_tags($description));
        $cleanDesc = preg_replace('/\s+/', ' ', $cleanDesc);
        
        if (empty($cleanDesc)) {
            $metaDesc = "Découvrez " . $cleanName . " chez ProMedias. Profitez de notre expertise technique et d'une livraison rapide sur tout notre matériel professionnel.";
        } else {
            $metaDesc = "Découvrez " . $cleanName . " chez ProMedias. " . mb_substr($cleanDesc, 0, 100) . "... Solution professionnelle, livraison rapide et garantie technique.";
        }

        if (mb_strlen($metaDesc) > 157) {
            $metaDesc = mb_substr($metaDesc, 0, 157) . "...";
        }

        return [
            'seo_title' => $title,
            'seo_description' => $metaDesc
        ];
    }

    public function softDelete($id) {
        $stmt = $this->db->prepare("UPDATE products SET deleted_at = NOW() WHERE id = ?");
        $res = $stmt->execute([$id]);
        if ($res) $this->activity->log('delete', 'product', $id, 'Moved to trash');
        return $res;
    }

    public function restore($id) {
        $stmt = $this->db->prepare("UPDATE products SET deleted_at = NULL WHERE id = ?");
        $res = $stmt->execute([$id]);
        if ($res) $this->activity->log('restore', 'product', $id, 'Restored from trash');
        return $res;
    }

    public function deletePermanently($id) {
        $this->db->prepare("DELETE FROM product_images WHERE product_id = ?")->execute([$id]);
        $stmt = $this->db->prepare("DELETE FROM products WHERE id = ?");
        $res = $stmt->execute([$id]);
        // Permanent deletion doesn't necessarily need an activity log if the entity is gone, 
        // but we can log that it's been purged.
        if ($res) $this->activity->log('purge', 'product', $id, 'Permanently deleted');
        return $res;
    }

    private function getGallery($productId) {
        $stmt = $this->db->prepare("SELECT url FROM product_images WHERE product_id = ? ORDER BY sort_order ASC");
        $stmt->execute([$productId]);
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }
}
