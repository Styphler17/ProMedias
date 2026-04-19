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
        } catch (\Exception $e) { /* ignore */ }
    }

    public function getAll($status = 'published') {
        $sql = "
            SELECT 
                p.id, p.name, p.slug, p.price, p.specs, p.description, p.status, p.created_at, p.deleted_at,
                p.category_id as categoryId,
                p.condition_state as `condition`,
                p.condition_score as conditionScore,
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
                condition_score as conditionScore
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
