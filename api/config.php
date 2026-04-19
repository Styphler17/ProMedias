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

// Auto-detect correct password for MAMP (root or empty)
$passwords_to_try = [$db_config['pass'], '']; 
$connected = false;

foreach ($passwords_to_try as $p) {
    try {
        $dsn = "mysql:host={$db_config['host']};port=8889;dbname={$db_config['name']};charset=utf8mb4";
        $pdo = new PDO($dsn, $db_config['user'], $p, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
        $connected = true;
        break;
    } catch (PDOException $e) {
        // Continue to try next password
        $last_error = $e->getMessage();
    }
}

if (!$connected) {
    http_response_code(500);
    
    // Diagnostic query to help user
    try {
        $temp_pdo = new PDO("mysql:host={$db_config['host']};port=8889", $db_config['user'], 'root');
    } catch (Exception $e) {
        $temp_pdo = new PDO("mysql:host={$db_config['host']};port=8889", $db_config['user'], '');
    }
    
    $dbs = $temp_pdo->query("SHOW DATABASES")->fetchAll(PDO::FETCH_COLUMN);
    $db_list = implode(', ', $dbs);

    die("❌ DATABASE CONNECTION ERROR: $last_error\n\n" .
        "Available Databases: $db_list\n" .
        "Is your target database '{$db_config['name']}' in this list?");
}
