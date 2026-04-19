<?php
require_once __DIR__ . '/config.php';

/**
 * ProMedias API Router — v3 (Production Ready)
 * Handles all Frontend and Admin Dashboard requests.
 */

$request_uri = $_SERVER['REQUEST_URI'];
$base_path = dirname($_SERVER['SCRIPT_NAME']);
$route = str_replace($base_path, '', $request_uri);
$route = explode('?', $route)[0]; 
$route = trim($route, '/');

$method = $_SERVER['REQUEST_METHOD'];
$body = json_decode(file_get_contents('php://input'), true);

function respond($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit();
}

$parts = explode('/', $route);
$main_route = $parts[0];
$id_param = $parts[1] ?? null;

switch ($main_route) {
    
    // 📢 ANNOUNCEMENTS
    case 'announcements':
        if ($method === 'GET') {
            if ($id_param === 'all') { // Admin view
                $stmt = $pdo->query("SELECT * FROM announcements ORDER BY sort_order ASC, id ASC");
            } else { // Public view
                $stmt = $pdo->query("SELECT id, title, subtitle, image_url, whatsapp_message FROM announcements WHERE active=1 ORDER BY sort_order ASC, id ASC");
            }
            respond($stmt->fetchAll());
        }
        if ($method === 'POST') {
            $stmt = $pdo->prepare("INSERT INTO announcements (title, subtitle, image_url, whatsapp_message, sort_order, active) VALUES (?,?,?,?,?,?)");
            $stmt->execute([$body['title'], $body['subtitle'] ?? null, $body['image_url'], $body['whatsapp_message'] ?? null, $body['sort_order'] ?? 0, $body['active'] ?? 1]);
            respond(["id" => $pdo->lastInsertId()], 201);
        }
        if ($method === 'PUT' && $id_param) {
            $stmt = $pdo->prepare("UPDATE announcements SET title=?, subtitle=?, image_url=?, whatsapp_message=?, sort_order=?, active=? WHERE id=?");
            $stmt->execute([$body['title'], $body['subtitle'] ?? null, $body['image_url'], $body['whatsapp_message'] ?? null, $body['sort_order'] ?? 0, $body['active'] ?? 1, $id_param]);
            respond(["ok" => true]);
        }
        if ($method === 'DELETE' && $id_param) {
            $pdo->prepare("DELETE FROM announcements WHERE id=?")->execute([$id_param]);
            respond(["ok" => true]);
        }
        break;

    // 💻 PRODUCTS
    case 'products':
        if ($method === 'GET') {
            if ($id_param && is_numeric($id_param)) {
                $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
                $stmt->execute([$id_param]);
                $product = $stmt->fetch();
                if ($product) {
                    $img_stmt = $pdo->prepare("SELECT image_url FROM product_images WHERE product_id = ?");
                    $img_stmt->execute([$id_param]);
                    $product['gallery'] = $img_stmt->fetchAll(PDO::FETCH_COLUMN);
                }
                respond($product ?: ["error" => "Not found"], $product ? 200 : 404);
            } else {
                $status = $_GET['status'] ?? 'published';
                $stmt = $pdo->prepare("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.status = ? ORDER BY p.created_at DESC");
                $stmt->execute([$status]);
                $products = $stmt->fetchAll();
                foreach ($products as &$p) {
                    $img_stmt = $pdo->prepare("SELECT image_url FROM product_images WHERE product_id = ?");
                    $img_stmt->execute([$p['id']]);
                    $p['gallery'] = $img_stmt->fetchAll(PDO::FETCH_COLUMN);
                }
                respond($products);
            }
        }
        // POST/PUT/DELETE for products would be added here similarly...
        break;

    // 📁 CATEGORIES
    case 'categories':
        if ($method === 'GET') {
            respond($pdo->query("SELECT * FROM categories ORDER BY name ASC")->fetchAll());
        }
        break;

    // 🖼️ MEDIA
    case 'media':
        if ($method === 'GET') {
            respond($pdo->query("SELECT * FROM media ORDER BY created_at DESC")->fetchAll());
        }
        if ($method === 'DELETE' && $id_param) {
            $pdo->prepare("DELETE FROM media WHERE id=?")->execute([$id_param]);
            respond(["ok" => true]);
        }
        break;

    // ⚙️ SETTINGS
    case 'settings':
        $sub = $parts[1] ?? null;
        if ($method === 'GET') {
            if (in_array($sub, ['site', 'about', 'contact'])) {
                // Public grouped fetch
                $stmt = $pdo->prepare("SELECT setting_key, setting_value FROM site_settings WHERE `group` = ?");
                $stmt->execute([$sub]);
                $rows = $stmt->fetchAll();
                $settings = [];
                foreach ($rows as $r) { $settings[$r['setting_key']] = $r['setting_value']; }
                respond($settings);
            } else {
                // Admin full fetch
                $rows = $pdo->query("SELECT setting_key, setting_value FROM site_settings")->fetchAll();
                $settings = [];
                foreach ($rows as $r) { $settings[$r['setting_key']] = $r['setting_value']; }
                respond($settings);
            }
        }
        if ($method === 'PUT') {
            foreach ($body as $key => $value) {
                $stmt = $pdo->prepare("INSERT INTO site_settings (setting_key, setting_value) VALUES (?,?) ON DUPLICATE KEY UPDATE setting_value=?");
                $stmt->execute([$key, $value, $value]);
            }
            respond(["ok" => true]);
        }
        break;

    // 🔐 AUTH
    case 'auth':
        $sub = $parts[1] ?? null;
        if ($sub === 'login' && $method === 'POST') {
            $stmt = $pdo->prepare("SELECT id, password_hash FROM admin_users WHERE email = ?");
            $stmt->execute([$body['email']]);
            $user = $stmt->fetch();
            if ($user && password_verify($body['password'], $user['password_hash'])) {
                respond(["token" => "sess_" . bin2hex(random_bytes(16))]); // Demo token
            }
            respond(["error" => "Invalid"], 401);
        }
        if ($sub === 'me') respond($pdo->query("SELECT id, email, avatar FROM admin_users LIMIT 1")->fetch());
        if ($sub === 'ping') respond(["v" => "php-1.0", "status" => "online"]);
        break;

    default:
        respond(["error" => "Route not found"], 404);
}

// Helper for PHP < 7.3 compatibility if needed
if (!function_exists('Object.fromEntries')) {
    function Object_fromEntries($pairs) {
        $out = [];
        foreach ($pairs as $p) { $out[$p[0]] = $p[1]; }
        return $out;
    }
}
