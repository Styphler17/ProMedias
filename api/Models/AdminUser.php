<?php
namespace Models;

use Core\Database;

class AdminUser {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
        // Self-migration check to ensure display_name exists
        try {
            $this->db->exec("ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS display_name VARCHAR(255) DEFAULT NULL AFTER id");
        } catch (\Exception $e) { /* ignore if already exists */ }
    }

    public function getByEmail($email) {
        $stmt = $this->db->prepare("SELECT id, display_name, email, password_hash, avatar FROM admin_users WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch();
    }

    public function getById($id) {
        $stmt = $this->db->prepare("SELECT id, display_name, email, avatar, created_at FROM admin_users WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function update($id, $data) {
        $fields = [];
        $params = [];

        if (isset($data['email'])) {
            $fields[] = "email = ?";
            $params[] = $data['email'];
        }
        if (isset($data['display_name'])) {
            $fields[] = "display_name = ?";
            $params[] = $data['display_name'];
        }
        if (isset($data['avatar'])) {
            $fields[] = "avatar = ?";
            $params[] = $data['avatar'];
        }
        if (isset($data['password'])) {
            $fields[] = "password_hash = ?";
            $params[] = password_hash($data['password'], PASSWORD_DEFAULT);
        }

        if (empty($fields)) return $this->getById($id);

        $params[] = $id;
        $sql = "UPDATE admin_users SET " . implode(", ", $fields) . " WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        return $this->getById($id);
    }
}
