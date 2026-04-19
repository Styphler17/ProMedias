<?php
namespace Models;

use Core\Database;

class Category {
    /** @var \PDO */
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getAll() {
        return $this->db->query("SELECT id, name, slug, main_category as mainCategory, description FROM categories ORDER BY name ASC")->fetchAll();
    }

    public function create($data) {
        $stmt = $this->db->prepare("INSERT INTO categories (name, slug, main_category, description) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $data['name'], 
            $data['slug'], 
            $data['mainCategory'] ?? $data['main_category'] ?? null,
            $data['description'] ?? null
        ]);
        return $this->db->lastInsertId();
    }

    public function update($id, $data) {
        $stmt = $this->db->prepare("UPDATE categories SET name = ?, slug = ?, main_category = ?, description = ? WHERE id = ?");
        return $stmt->execute([
            $data['name'], 
            $data['slug'], 
            $data['mainCategory'] ?? $data['main_category'] ?? null,
            $data['description'] ?? null,
            $id
        ]);
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM categories WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
