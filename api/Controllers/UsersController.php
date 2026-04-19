<?php
namespace Controllers;

use Models\AdminUser;

class UsersController {
    private $model;

    public function __construct() {
        $this->model = new AdminUser();
    }

    public function index($params = []) {
        $id = $params['id'] ?? null;
        if ($id) {
            return $this->model->getById($id);
        }
        return $this->model->getAll();
    }

    public function create($data) {
        if (empty($data['email']) || empty($data['password'])) {
            http_response_code(400);
            return ["error" => "Email and password are required"];
        }
        return $this->model->create($data);
    }

    public function update($id, $data) {
        if (!$id) return ["error" => "Missing ID"];
        return $this->model->update($id, $data);
    }

    public function delete($id) {
        if (!$id) return ["error" => "Missing ID"];
        return $this->model->delete($id) ? ["success" => true] : ["error" => "Cannot delete user (might be a Super Admin)"];
    }

    public function patch($id, $data) {
        return $this->update($id, $data);
    }
}
