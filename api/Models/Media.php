<?php
namespace Models;

use Core\Database;

class Media {
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
            $check = $this->db->query("SHOW COLUMNS FROM media LIKE 'deleted_at'")->fetch();
            if (!$check) {
                $this->db->exec("ALTER TABLE media ADD COLUMN deleted_at DATETIME DEFAULT NULL");
            }
        } catch (\Exception $e) { /* ignore */ }
    }

    public function getAll($status = 'active', $sort = 'date') {
        $sql = "SELECT id, filename, url, type, size, category, created_at, deleted_at FROM media WHERE 1=1";
        
        if ($status === 'trash') {
            $sql .= " AND deleted_at IS NOT NULL";
        } else {
            $sql .= " AND deleted_at IS NULL";
        }

        if ($sort === 'date') {
            $sql .= " ORDER BY created_at DESC";
        }
        return $this->db->query($sql)->fetchAll();
    }

    public function create($data) {
        $stmt = $this->db->prepare("INSERT INTO media (filename, url, type, size, category) VALUES (?, ?, ?, ?, ?)");
        $res = $stmt->execute([
            $data['filename'],
            $data['url'],
            $data['type'],
            $data['size'] ?? 0,
            $data['category'] ?? 'uncategorized'
        ]);
        if ($res) {
            $id = $this->db->lastInsertId();
            $this->activity->log('create', 'media', $id, "Uploaded {$data['filename']}");
        }
        return $res;
    }

    public function softDelete($id) {
        $stmt = $this->db->prepare("UPDATE media SET deleted_at = NOW() WHERE id = ?");
        $res = $stmt->execute([$id]);
        if ($res) $this->activity->log('delete', 'media', $id, 'Moved to trash');
        return $res;
    }

    public function restore($id) {
        $stmt = $this->db->prepare("UPDATE media SET deleted_at = NULL WHERE id = ?");
        $res = $stmt->execute([$id]);
        if ($res) $this->activity->log('restore', 'media', $id, 'Restored from trash');
        return $res;
    }

    public function deletePermanently($id) {
        $stmt = $this->db->prepare("DELETE FROM media WHERE id = ?");
        $res = $stmt->execute([$id]);
        if ($res) $this->activity->log('purge', 'media', $id, 'Permanently deleted');
        return $res;
    }
}
