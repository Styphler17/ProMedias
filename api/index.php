<?php
require_once __DIR__ . '/config.php';

/**
 * ProMedias MVC Router
 * Automatically loads Controllers and Models based on the request.
 */

// 1. Simple PSR-4 Style Autoloader
spl_autoload_register(function ($class) {
    $path = __DIR__ . '/' . str_replace('\\', '/', $class) . '.php';
    if (file_exists($path)) {
        require_once $path;
    }
});

use Core\Database;

// 2. Parse the Route
$request_uri = $_SERVER['REQUEST_URI'];
$base_path = dirname($_SERVER['SCRIPT_NAME']);
$route = str_replace($base_path, '', $request_uri);
$route = explode('?', $route)[0]; 
$route = trim($route, '/');

$method = $_SERVER['REQUEST_METHOD'];
$body = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$parts = explode('/', $route);
$main_route = ucfirst($parts[0]); // e.g. 'announcements' -> 'Announcements'
$id_param = $parts[1] ?? null;

// 3. Helper to send responses
function respond($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit();
}

// 4. Dispatch to Controller
$controllerName = "Controllers\\" . $main_route . "Controller";

try {
    if (class_exists($controllerName)) {
        $controller = new $controllerName();
        
        $result = null;
        // Action recognition (e.g. /auth/login)
        if ($id_param && method_exists($controller, $id_param)) {
            $result = $controller->$id_param($body);
        } else {
            switch ($method) {
                case 'GET':    $result = $controller->index(['id' => $id_param]); break;
                case 'POST':   $result = $controller->create($body); break;
                case 'PUT':    $result = $controller->update($id_param, $body); break;
                case 'DELETE': $result = $controller->delete($id_param); break;
                default:       respond(["error" => "Method $method not allowed"], 405);
            }
        }
        
        respond($result);
    } else {
        respond(["error" => "Controller $controllerName not found"], 404);
    }
} catch (\Exception $e) {
    respond([
        "error" => "Server Error",
        "message" => $e->getMessage()
    ], 500);
}
