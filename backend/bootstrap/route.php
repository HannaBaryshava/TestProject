<?php
return [
    'POST /users/create' => ["app\controllers\UserController", "create"],
    'POST /api/users/create' => ["app\controllers\UserController", "create"],
    'POST /api/users/select' => ["app\controllers\UserController", "connectToDatabase"],
//    'POST /api/users/create' => ["app\controllers\UserController", "create"],
];