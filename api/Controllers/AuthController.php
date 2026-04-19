<?php
namespace Controllers;

use Models\AdminUser;

class AuthController {
    private $model;

    public function __construct() {
        $this->model = new AdminUser();
    }

    /**
     * Handles POST /api/auth/login
     */
    public function login($data) {
        $email = $data['email'] ?? '';
        $pass  = $data['password'] ?? '';

        $user = $this->model->getByEmail($email);

        if ($user && password_verify($pass, $user['password_hash'])) {
            // Simplified token for the bridge. In a full system, you would use JWT or similar.
            return [
                "token" => "sess_" . bin2hex(random_bytes(16)),
                "user" => [
                    "id" => $user['id'],
                    "email" => $user['email'],
                    "avatar" => $user['avatar']
                ]
            ];
        }

        http_response_code(401);
        return ["error" => "Identifiants invalides"];
    }

    /**
     * Handles GET /api/auth/me
     */
    public function me() {
        // Return first admin for demo purposes
        $user = $this->model->getById(1);
        return $user ?: ["error" => "Non autorisé"];
    }

    /**
     * Handles GET /api/auth/ping
     */
    public function ping() {
        return ["v" => "mvc-1.0", "status" => "online"];
    }
}
