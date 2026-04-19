<?php
namespace Models;

use Core\Database;
use PDO;

class Activity {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
        $this->checkAndMigrate();
    }

    private function checkAndMigrate() {
        $this->db->exec("CREATE TABLE IF NOT EXISTS admin_activities (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            action_type VARCHAR(50) NOT NULL,
            entity_type VARCHAR(50) NOT NULL,
            entity_id INT NOT NULL,
            details TEXT DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");
    }

    public function log($action, $entityType, $entityId, $details = null) {
        $stmt = $this->db->prepare("INSERT INTO admin_activities (user_id, action_type, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)");
        // Demo: user_id = 1
        return $stmt->execute([1, $action, $entityType, $entityId, $details]);
    }

    public function getRecent($limit = 10) {
        $stmt = $this->db->prepare("
            SELECT a.*, u.email as user_email, u.display_name
            FROM admin_activities a
            JOIN admin_users u ON a.user_id = u.id
            ORDER BY a.created_at DESC
            LIMIT ?
        ");
        $stmt->bindValue(1, $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
