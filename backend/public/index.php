<?php

$app = require __DIR__ . '/../bootstrap/app.php';

header("Access-Control-Allow-Origin: *");
//header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$app = new app\system\App();
$app->setRoutes(include __DIR__ . '/../bootstrap/route.php');
$app->run();

//$app->run();