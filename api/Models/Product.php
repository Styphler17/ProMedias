<?php
namespace Models;

use Core\Database;
use PDO;

class Product {
    /** @var \PDO */
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getAll($status = 'published') {
        $sql = "
            SELECT 
                p.id, p.name, p.slug, p.price, p.specs, p.description, p.status, p.created_at,
                p.category_id as categoryId,
                p.condition_state as `condition`,
                p.condition_score as conditionScore,
                c.name as category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
        ";
        
        $params = [];
        if ($status !== 'all') {
            $sql .= " WHERE p.status = ? ";
            $params[] = $status;
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
                id, name, slug, price, specs, description, status, created_at,
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

    private function getGallery($productId) {
        $stmt = $this->db->prepare("SELECT url FROM product_images WHERE product_id = ? ORDER BY sort_order ASC");
        $stmt->execute([$productId]);
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }
}
