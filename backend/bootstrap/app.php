<?php

require __DIR__ . '/../system/App.php';
require __DIR__ . '/base-config.php';
require __DIR__ . '/base-paths.php';

use app\system\App;

$app = new App();

$routes = require __DIR__ . '/route.php';
$app->setRoutes($routes);

return $app;
