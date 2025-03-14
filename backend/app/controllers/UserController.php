<?php

namespace app\controllers;
class UserController
{

    public function create()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $name = htmlspecialchars($data['name']);
            $email = htmlspecialchars($data['email']);

            header('Content-Type: application/json');
            echo json_encode(['status' => 'success', 'data' => ['name' => $name, 'email' => $email]]);
        } else {
            header('Content-Type: application/json');
            echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
        }
    }

}