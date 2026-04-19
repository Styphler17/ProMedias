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
            return [
                "token" => "sess_" . bin2hex(random_bytes(16)),
                "user" => [
                    "id" => $user['id'],
                    "display_name" => $user['display_name'],
                    "email" => $user['email'],
                    "avatar" => $user['avatar'],
                    "role" => $user['role']
                ]
            ];
        }

        http_response_code(401);
        return ["error" => "Identifiants invalides"];
    }

    public function me() {
        $user = $this->model->getById(1);
        if (!$user) return ["error" => "Non autorisé"];
        return $user;
    }

    /**
     * Handles PUT /api/auth/profile
     */
    public function profile($data) {
        // In a real system, we would get the ID from the token/session
        $userId = 1; 

        $updateData = [];

        if (isset($data['email']))        $updateData['email'] = $data['email'];
        if (isset($data['display_name'])) $updateData['display_name'] = $data['display_name'];
        if (isset($data['avatar']))      $updateData['avatar'] = $data['avatar'];

        if (!empty($data['newPassword'])) {
            $current = $this->model->getById($userId);
            $userWithPass = $this->model->getByEmail($current['email']);
            
            if (!password_verify($data['currentPassword'] ?? '', $userWithPass['password_hash'])) {
                http_response_code(400);
                return ["error" => "Mot de passe actuel incorrect"];
            }
            $updateData['password'] = $data['newPassword'];
        }

        return $this->model->update($userId, $updateData);
    }

    public function ping() {
        return ["v" => "mvc-1.0", "status" => "online"];
    }
}
