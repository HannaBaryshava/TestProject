<?php

namespace app\controllers;
use App\system\App;

class UserController
{
    public function create()
    {
        error_log("UserController::create called");
        header("Access-Control-Allow-Origin: *");
//        header("Access-Control-Allow-Headers: Content-Type");
        header("Content-Type: application/json; charset=UTF-8");

        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit(0);
        }

        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $data = json_decode(file_get_contents("php://input"));
            $name = $data->name;
            $email = $data->email;
            error_log("Received data: " . print_r($data, true));
            $response = [
                "status" => "success",
                "data" => [
                    "name" => $name,
                    "email" => $email,
                ],
                "message" => "User created successfully"
            ];
            echo json_encode($response);
        } else {
            echo json_encode(["status" => "false", "message" => "error occurred"]);
        }
    }

}