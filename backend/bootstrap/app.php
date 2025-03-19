<?php
require __DIR__ . '/autoload.php';

$app = new system\App();
$app->setRoutes(include __DIR__ . '/route.php');
return $app;