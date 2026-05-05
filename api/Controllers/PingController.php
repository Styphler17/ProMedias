<?php
namespace Controllers;

class PingController {
    public function index() {
        return [
            "status" => "online",
            "service" => "promedias-api",
            "version" => "mvc-1.0"
        ];
    }
}
