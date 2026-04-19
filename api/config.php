<?php
/**
 * ProMedias API Configuration
 * Handles database connections and global settings for the PHP bridge.
 */

// --- HOSTINGER DATABASE CONFIGURATION ---
// You can find these values in your Hostinger hPanel -> Databases -> MySQL Databases
$db_config = [
    'host' => '127.0.0.1',
    'user' => 'root',    // Replace with your Hostinger DB Username
    'pass' => 'root',   // Replace with your Hostinger DB Password
    'name' => 'promedias' // Replace with your Hostinger DB Name
];

// Local environment override if needed
if (file_exists(__DIR__ . '/.env.php')) {
    include __DIR__ . '/.env.php';
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $dsn = "mysql:host={$db_config['host']};port=8889;dbname={$db_config['name']};charset=utf8mb4";
    $pdo = new PDO($dsn, $db_config['user'], $db_config['pass'], [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    die("❌ DATABASE CONNECTION ERROR: " . $e->getMessage() . "\n\nCheck if your MAMP MySQL server is running and the database '{$db_config['name']}' exists.");
}
