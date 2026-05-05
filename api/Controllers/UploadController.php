<?php
namespace Controllers;

use Models\Media;

class UploadController {
    private $model;

    public function __construct() {
        $this->model = new Media();
    }

    public function create($body) {
        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            return ["error" => "No valid file uploaded"];
        }

        $file = $_FILES['file'];
        $category = $body['category'] ?? $_POST['category'] ?? 'uncategorized';
        $allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
        $mime = mime_content_type($file['tmp_name']) ?: $file['type'];

        if (!in_array($mime, $allowed, true)) {
            http_response_code(400);
            return ["error" => "Unsupported file type"];
        }

        $uploadDir = dirname(__DIR__, 2) . '/uploads';
        if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true)) {
            http_response_code(500);
            return ["error" => "Upload directory is not writable"];
        }

        $originalName = basename($file['name']);
        $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
        $safeBase = preg_replace('/[^a-zA-Z0-9_-]+/', '-', pathinfo($originalName, PATHINFO_FILENAME));
        $filename = trim($safeBase, '-') . '-' . time() . ($extension ? ".$extension" : '');
        $target = $uploadDir . '/' . $filename;

        if (!move_uploaded_file($file['tmp_name'], $target)) {
            http_response_code(500);
            return ["error" => "Failed to save upload"];
        }

        $url = '/uploads/' . $filename;
        $this->model->create([
            'filename' => $filename,
            'original_name' => $originalName,
            'url' => $url,
            'type' => $mime,
            'mime_type' => $mime,
            'size' => filesize($target),
            'category' => $category
        ]);

        return ["url" => $url];
    }
}
