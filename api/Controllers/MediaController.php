<?php
namespace Controllers;

use Models\Media;

class MediaController {
    private $model;

    public function __construct() {
        $this->model = new Media();
    }

    public function index($params = []) {
        $status = $_GET['status'] ?? 'active';
        $sort   = $_GET['sort']   ?? 'date';
        return $this->model->getAll($status, $sort);
    }

    public function delete($id) {
        if (!$id) return ["error" => "Missing ID"];
        return $this->model->softDelete($id) ? ["success" => true] : ["error" => "Failed to move to trash"];
    }

    /**
     * POST /api/media/restore
     */
    public function restore($body) {
        $id = $body['id'] ?? null;
        if (!$id) return ["error" => "Missing ID"];
        return $this->model->restore($id) ? ["success" => true] : ["error" => "Failed to restore"];
    }

    /**
     * DELETE /api/media/purge
     */
    public function purge($body) {
        $id = $body['id'] ?? null;
        if (!$id) return ["error" => "Missing ID"];
        return $this->model->deletePermanently($id) ? ["success" => true] : ["error" => "Failed to delete permanently"];
    }
}
