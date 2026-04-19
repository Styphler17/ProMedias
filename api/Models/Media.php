<?php
namespace Models;

use Core\Database;

class Media {
    /** @var \PDO */
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getAll($sort = 'date') {
        $sql = "SELECT * FROM media";
        if ($sort === 'date') {
            $sql .= " ORDER BY created_at DESC";
        }
        return $this->db->query($sql)->fetchAll();
    }

    public function create($data) {
        $stmt = $this->db->prepare("INSERT INTO media (filename, url, type, size) VALUES (?, ?, ?, ?)");
        return $stmt->execute([
            $data['filename'],
            $data['url'],
            $data['type'],
            $data['size'] ?? 0
        ]);
    }
}
