<?php
namespace Controllers;

use Models\Media;

class MediaController {
    private $model;

    public function __construct() {
        $this->model = new Media();
    }

    public function index($params = []) {
        $sort = $_GET['sort'] ?? 'date';
        return $this->model->getAll($sort);
    }

    public function upload($data) {
        // Placeholder for file upload logic if needed
        return ["error" => "Direct upload not implemented in bridge yet"];
    }
}
