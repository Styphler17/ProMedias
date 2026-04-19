<?php
namespace Models;

use Core\Database;

class AdminUser {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getByEmail($email) {
        $stmt = $this->db->prepare("SELECT id, email, password_hash, avatar FROM admin_users WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch();
    }

    public function getById($id) {
        $stmt = $this->db->prepare("SELECT id, email, avatar, created_at FROM admin_users WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
}
