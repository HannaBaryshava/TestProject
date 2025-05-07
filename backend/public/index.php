<?php
require __DIR__ . '/../bootstrap/autoload.php';

use OpenApi\Annotations as OA;

/**
 * @OA\Info(
 *     title="GoRest API",
 *     version="1.0.0",
 *     description="API для работы с пользователями GoREST",
 *     @OA\Contact(
 *         email="support@gorest.com"
 *     )
 * )
 */

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
    http_response_code(204);
    exit();
}

//header("Access-Control-Allow-Origin: *");
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$app = new system\App();
$app->setRoutes(include __DIR__ . '/../bootstrap/route.php');
$app->run();
