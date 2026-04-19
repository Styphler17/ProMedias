<?php
require_once __DIR__ . '/../api/config.php';

try {
    // 1. Add deleted_at to products
    $pdo->exec("ALTER TABLE products ADD COLUMN IF NOT EXISTS deleted_at DATETIME DEFAULT NULL");
    echo "✅ SUCCESS: 'deleted_at' column added to 'products'.\n";

    // 2. Add deleted_at to media
    $pdo->exec("ALTER TABLE media ADD COLUMN IF NOT EXISTS deleted_at DATETIME DEFAULT NULL");
    echo "✅ SUCCESS: 'deleted_at' column added to 'media'.\n";

    // 3. Create admin_activities table
    $pdo->exec("CREATE TABLE IF NOT EXISTS admin_activities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        action_type VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'restore'
        entity_type VARCHAR(50) NOT NULL, -- 'product', 'media', 'category', etc.
        entity_id INT NOT NULL,
        details TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    echo "✅ SUCCESS: 'admin_activities' table created.\n";

} catch (PDOException $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
}
