<?php
error_log("Request received at index.php");

require __DIR__ . '/../bootstrap/autoload.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Max-Age: 86400"); // Cache for 1 day
    http_response_code(204); // No content
    exit();
}

header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$app = new system\App();
$app->setRoutes(include __DIR__ . '/../bootstrap/route.php');
$app->run();

//$app->run();