<?php
namespace Models;

use Core\Database;

class Setting {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    public function getAll() {
        $rows = $this->db->query("SELECT setting_key, setting_value FROM site_settings")->fetchAll();
        $settings = [];
        foreach ($rows as $row) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }
        return $settings;
    }

    public function updateMultiple($data) {
        $stmt = $this->db->prepare("INSERT INTO site_settings (setting_key, setting_value) 
                                    VALUES (?, ?) 
                                    ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
        
        foreach ($data as $key => $value) {
            $stmt->execute([$key, $value]);
        }
        return true;
    }
}
