<?php
namespace Controllers;

use Models\Announcement;

class AnnouncementsController {
    private $model;

    public function __construct() {
        $this->model = new Announcement();
    }

    public function index($params = []) {
        $isAdmin = isset($_GET['view']) && $_GET['view'] === 'admin';
        return $this->model->getAll(!$isAdmin);
    }

    public function create($data) {
        if (!isset($data['title']) || !isset($data['image_url'])) {
            return ["error" => "Title and image_url are required"];
        }
        $id = $this->model->create($data);
        return ["id" => $id];
    }

    public function update($id, $data) {
        if (!$id) return ["error" => "ID required"];
        $this->model->update($id, $data);
        return ["ok" => true];
    }

    public function delete($id) {
        if (!$id) return ["error" => "ID required"];
        $this->model->delete($id);
        return ["ok" => true];
    }
}
