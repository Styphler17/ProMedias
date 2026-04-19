<?php
namespace Controllers;

use Models\Activity;

class DashboardController {
    private $activity;

    public function __construct() {
        $this->activity = new Activity();
    }

    public function index() {
        return [
            "activities" => $this->activity->getRecent(15)
        ];
    }

    public function activity() {
        return $this->activity->getRecent(50);
    }
}
