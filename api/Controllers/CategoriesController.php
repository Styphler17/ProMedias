<?php
namespace Controllers;

use Models\Category;

class CategoriesController {
    private $model;

    public function __construct() {
        $this->model = new Category();
    }

    public function index() {
        return $this->model->getAll();
    }

    public function create($data) {
        return $this->model->create($data);
    }

    public function update($id, $data) {
        return $this->model->update($id, $data);
    }

    public function delete($id) {
        return $this->model->delete($id);
    }
}
