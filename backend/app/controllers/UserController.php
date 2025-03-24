<?php

namespace app\controllers;

class UserController
{
    public function create()
    {
        $errors = [];

        error_log("UserController::create called");
        header("Access-Control-Allow-Origin: *");
//        header("Access-Control-Allow-Headers: Content-Type");
        header("Content-Type: application/json; charset=UTF-8");

        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            exit(0);
        }

        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $data = json_decode(file_get_contents("php://input"));
            if (!empty($data->name) && !empty($data->email) && !empty($data->country) && !empty($data->city) && !empty($data->gender) && !empty($data->status)) {

                error_log("Received data: " . print_r($data, true));
                $response = [
                    "data" => [
                        "name" => $data->name,
                        "email" => $data->email,
                        "country" => $data->country,
                        "city" => $data->city,
                        "gender" => $data->gender,
                        "status" => $data->status
                    ],
                    "errors" => (object)[],
                    "message" => ["User created successfully"]
                ];

            } else {
                $response = [
                    "data" => (object)[],
                    "errors" => (object)[], //?
                    "message" => ["Validation errors occurred"]
                ];
            }

            echo json_encode($response);
        }

    }
}