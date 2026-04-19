<?php
namespace Core;

use PDO;
use PDOException;

/**
 * Core Database Engine
 * Handles connection pooling and PDO initialization.
 */
class Database {
    private static $instance = null;
    private $pdo;

    private function __construct() {
        // We reference the config globally for now to keep the migration simple
        global $db_config;

        $passwords = [$db_config['pass'], '']; 
        $connected = false;

        foreach ($passwords as $p) {
            try {
                $dsn = "mysql:host={$db_config['host']};port=8889;dbname={$db_config['name']};charset=utf8mb4";
                $this->pdo = new PDO($dsn, $db_config['user'], $p, [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                ]);
                $connected = true;
                break;
            } catch (PDOException $e) {
                $last_error = $e->getMessage();
            }
        }

        if (!$connected) {
            http_response_code(500);
            die("❌ DATABASE CONNECTION ERROR: $last_error");
        }
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection() {
        return $this->pdo;
    }
}
