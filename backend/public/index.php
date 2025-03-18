<?php
//phpinfo();

ob_start();

ini_set('display_errors', 1);
error_reporting(E_ALL);

error_log("Request received at index.php");

require __DIR__ . '/../bootstrap/autoload.php';

header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$app = new system\App();
$app->setRoutes(include __DIR__ . '/../bootstrap/route.php');
$app->run();

echo "<script>console.log('Request received at index.php');</script>";
//$app->run();

ob_end_flush();