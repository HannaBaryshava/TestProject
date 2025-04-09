<?php
return [
    'POST /users/create' => ["app\controllers\UserController", "create"],
    'POST /api/users/create' => ["app\controllers\UserController", "create"],
    'GET /api/users' => ["app\controllers\UserController", "getAllUsers"],
    'PUT /api/users/update/{id}' => ["app\controllers\UserController", "updateById"],
    'PUT /api/users/update' => ["app\controllers\UserController", "update"],
    'DELETE /api/users/delete/{id}' => ["app\controllers\UserController", "deleteById"],
];