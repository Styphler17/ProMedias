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

    public function delete($id) {
        if (!$id) return ["error" => "Missing ID"];
        return $this->model->softDelete($id) ? ["success" => true] : ["error" => "Failed to move to trash"];
    }

    public function create($body) {
        return $this->model->create($body);
    }

    public function update($id, $body) {
        return $this->model->update($id, $body);
    }

    /**
     * POST /api/products/suggest-seo
     * mapped via router because 'suggestSEO' is the second part of the URL
     */
    public function suggestSEO($body) {
        $name = $body['name'] ?? '';
        $description = $body['description'] ?? '';
        $categoryId = $body['categoryId'] ?? null;
        return $this->model->generateSEO($name, $description, $categoryId);
    }

    /**
     * POST /api/products/restore
     */
    public function restore($body) {
        $id = $body['id'] ?? null;
        if (!$id) return ["error" => "Missing ID"];
        return $this->model->restore($id) ? ["success" => true] : ["error" => "Failed to restore"];
    }

    /**
     * DELETE /api/products/purge
     */
    public function purge($body) {
        $id = $body['id'] ?? null;
        if (!$id) return ["error" => "Missing ID"];
        return $this->model->deletePermanently($id) ? ["success" => true] : ["error" => "Failed to delete permanently"];
    }
}
