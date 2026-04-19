<?php
namespace Controllers;

use Models\Setting;

class SettingsController {
    private $model;

    public function __construct() {
        $this->model = new Setting();
    }

    public function index() {
        return $this->model->getAll();
    }

    public function update($id, $data) {
        $this->model->updateMultiple($data);
        return ["ok" => true];
    }
}
