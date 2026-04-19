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
