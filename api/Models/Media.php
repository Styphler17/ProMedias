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
            // Get current columns
            $stmt = $this->db->query("SHOW COLUMNS FROM media");
            $cols = $stmt->fetchAll(\PDO::FETCH_COLUMN);
            
            $queries = [
                'filename'   => "ALTER TABLE media ADD COLUMN filename VARCHAR(255) DEFAULT ''",
                'type'       => "ALTER TABLE media ADD COLUMN type VARCHAR(50) DEFAULT ''",
                'size'       => "ALTER TABLE media ADD COLUMN size INT DEFAULT 0",
                'category'   => "ALTER TABLE media ADD COLUMN category VARCHAR(50) DEFAULT 'uncategorized'",
                'deleted_at' => "ALTER TABLE media ADD COLUMN deleted_at DATETIME DEFAULT NULL"
            ];

            foreach ($queries as $col => $sql) {
                if (!in_array($col, $cols)) {
                    $this->db->exec($sql);
                }
            }
        } catch (\Exception $e) { 
            // If the table doesn't exist, this will fail, but we don't want to crash everything
        }
    }

    public function getAll($status = 'active', $sort = 'date', $category = null, $search = null) {
        $sql = "SELECT id, filename, url, type, size, category, created_at, deleted_at FROM media WHERE 1=1";
        
        if ($status === 'trash') {
            $sql .= " AND deleted_at IS NOT NULL";
        } else {
            $sql .= " AND deleted_at IS NULL";
        }

        if ($category) {
            $sql .= " AND category = " . $this->db->quote($category);
        }

        if ($search) {
            $sql .= " AND (filename LIKE " . $this->db->quote("%$search%") . " OR category LIKE " . $this->db->quote("%$search%") . ")";
        }

        if ($sort === 'date') {
            $sql .= " ORDER BY created_at DESC";
        } elseif ($sort === 'name') {
            $sql .= " ORDER BY filename ASC";
        } elseif ($sort === 'size') {
            $sql .= " ORDER BY size DESC";
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
