<?php

namespace app\controllers;
use system\App;

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
            exit(0);
        }

        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $data = json_decode(file_get_contents("php://input"));
            if (isset($data->name, $data->email, $data->country, $data->city, $data->gender, $data->status)) {
                $name = $data->name;
                $email = $data->email;
                $country = $data->country;
                $city = $data->city;
                $gender = $data->gender;
                $status = $data->status;
                error_log("Received data: " . print_r($data, true));
                $response = [
                    "status" => "success",
                    "data" => [
                        "name" => $name,
                        "email" => $email,
                        "country" => $country,
                        "city" => $city,
                        "gender" => $gender,
                        "status" => $status
                    ],
                    "message" => "User created successfully"
                ];
                echo json_encode($response);
            } else {
                echo json_encode(["status" => "false", "message" => "error occurred"]);
            }
        }

    }
}