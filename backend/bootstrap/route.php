<?php
return [
    'POST /users/create' => ["app\controllers\UserController", "create"],
    'POST /api/users/create' => ["app\controllers\UserController", "create"],
    'GET /api/users' => ["app\controllers\UserController", "getAllUsers"],
];