<?php
namespace Models;

use Core\Database;
use PDO;

class Announcement {
    /** @var \PDO */
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getAll($onlyActive = true) {
        $sql = "SELECT id, title, subtitle, image_url, whatsapp_message, sort_order, active 
                FROM announcements";
        
        if ($onlyActive) {
            $sql .= " WHERE active = 1";
        }
        
        $sql .= " ORDER BY sort_order ASC, id ASC";
        
        return $this->db->query($sql)->fetchAll();
    }

    public function create($data) {
        $stmt = $this->db->prepare("
            INSERT INTO announcements (title, subtitle, image_url, whatsapp_message, sort_order, active) 
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $data['title'],
            $data['subtitle'] ?? null,
            $data['image_url'],
            $data['whatsapp_message'] ?? null,
            $data['sort_order'] ?? 0,
            $data['active'] ?? 1
        ]);
        return $this->db->lastInsertId();
    }

    public function update($id, $data) {
        $stmt = $this->db->prepare("
            UPDATE announcements 
            SET title=?, subtitle=?, image_url=?, whatsapp_message=?, sort_order=?, active=? 
            WHERE id=?
        ");
        return $stmt->execute([
            $data['title'],
            $data['subtitle'] ?? null,
            $data['image_url'],
            $data['whatsapp_message'] ?? null,
            $data['sort_order'] ?? 0,
            $data['active'] ?? 1,
            $id
        ]);
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM announcements WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
