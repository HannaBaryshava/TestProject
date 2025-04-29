<?php
return [
    'POST /users/create' => ["app\controllers\UserController", "create"],
    'POST /api/users/create' => ["app\controllers\UserController", "create"],
    'GET /api/users' => ["app\controllers\UserController", "getAllUsers"],
    'PUT /api/users/update/{id}' => ["app\controllers\UserController", "updateById"],
    'PUT /api/users/update' => ["app\controllers\UserController", "update"],
    'DELETE /api/users/delete/{id}' => ["app\controllers\UserController", "deleteById"],
    'DELETE /api/users/delete' => ["app\controllers\UserController", "deleteMultiple"],
    'GET /api/gorest/users' => ["app\controllers\GoRestController", "getGorestUsers"],
    'PUT /api/gorest/users/{id}' => ["app\controllers\GoRestController", "updateGorestUsers"],
    'POST /api/gorest/users' => ['app\controllers\GoRestController', 'createGorestUser'],
    'PATCH /api/gorest/users/{id}' => ['app\controllers\GoRestController', 'patchGorestUser'],
    'DELETE /api/gorest/users/{id}' => ['app\controllers\GoRestController', 'deleteGorestUser'],
];
