<?php
namespace Models;

use Core\Database;

class AdminUser {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
        $this->checkAndMigrate();
    }

    private function checkAndMigrate() {
        try {
            $stmt = $this->db->query("SHOW COLUMNS FROM admin_users");
            $cols = $stmt->fetchAll(\PDO::FETCH_COLUMN);

            if (!in_array('display_name', $cols)) {
                $this->db->exec("ALTER TABLE admin_users ADD COLUMN display_name VARCHAR(255) DEFAULT NULL AFTER id");
            }
            if (!in_array('role', $cols)) {
                $this->db->exec("ALTER TABLE admin_users ADD COLUMN role VARCHAR(50) DEFAULT 'administrator'");
                // Set first user as super_admin
                $this->db->exec("UPDATE admin_users SET role = 'super_admin' WHERE id = (SELECT id FROM (SELECT MIN(id) as id FROM admin_users) as t)");
            }
        } catch (\Exception $e) {}
    }

    public function getAll() {
        return $this->db->query("SELECT id, display_name, email, avatar, role, created_at FROM admin_users ORDER BY id ASC")->fetchAll();
    }

    public function getByEmail($email) {
        $stmt = $this->db->prepare("SELECT id, display_name, email, password_hash, avatar, role FROM admin_users WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch();
    }

    public function getById($id) {
        $stmt = $this->db->prepare("SELECT id, display_name, email, avatar, role, created_at FROM admin_users WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function create($data) {
        $hash = password_hash($data['password'], PASSWORD_DEFAULT);
        $stmt = $this->db->prepare("INSERT INTO admin_users (email, password_hash, display_name, role) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $data['email'],
            $hash,
            $data['display_name'] ?? null,
            $data['role'] ?? 'editor'
        ]);
        return $this->getById($this->db->lastInsertId());
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM admin_users WHERE id = ? AND role != 'super_admin'");
        return $stmt->execute([$id]);
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
        if (isset($data['role'])) {
            $fields[] = "role = ?";
            $params[] = $data['role'];
        }
        if (isset($data['password']) && !empty($data['password'])) {
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
