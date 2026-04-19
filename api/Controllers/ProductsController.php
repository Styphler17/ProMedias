<?php
namespace Controllers;

use Models\Product;

class ProductsController {
    private $model;

    public function __construct() {
        $this->model = new Product();
    }

    public function index($params = []) {
        $id = $params['id'] ?? null;
        
        if ($id && is_numeric($id)) {
            $product = $this->model->getById($id);
            return $product ?: ["error" => "Product not found"];
        }

        $status = $_GET['status'] ?? 'published';
        return $this->model->getAll($status);
    }

    // Add create, update, delete here as needed...
}
