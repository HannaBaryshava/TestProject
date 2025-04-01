<?php

namespace app\controllers;
use app\database\Database;

//require_once '../config/config.php';
require_once __DIR__ . '/../../model/database/database.php';

class UserController
{
    private $db;

    public function __construct()
    {
        $this->db = new Database();
    }

    public function create()
    {
        $errors = [];
        $response = [];

        error_log("UserController::create called");
        header("Access-Control-Allow-Origin: *");
        header("Content-Type: application/json; charset=UTF-8");

        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            exit(0);
        }

        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $data = json_decode(file_get_contents("php://input"), true);
            $requiredFields = ['name', 'email', 'country', 'city', 'gender', 'status'];
//            foreach ($requiredFields as $field) {
//                if (empty($data->$field)) {
//                    $errors[$field] = "Field $field is required";
//                }
//            }

            if (empty($errors)) {
                $response = $this->db->createUser($data);
                error_log("Response type: " . gettype($response));
                error_log("Response content: " . print_r($response, true));
            } else {
                http_response_code(400);
                $response = [
                    "data" => (object)[],
                    "errors" => (object)[],
                    "message" => ["Validation errors occurred"]
                ];
            }


//            if (!empty($data->name) && !empty($data->email) && !empty($data->country) && !empty($data->city) && !empty($data->gender) && !empty($data->status)) {
//
//                error_log("Received data: " . print_r($data, true));
//                $response = [
//                    "data" => [
//                        "name" => $data->name,
//                        "email" => $data->email,
//                        "country" => $data->country,
//                        "city" => $data->city,
//                        "gender" => $data->gender,
//                        "status" => $data->status
//                    ],
//                    "errors" => (object)[],
//                    "message" => ["User created successfully"]
//                ];
//
//            } else {
//                $response = [
//                    "data" => (object)[],
//                    "errors" => (object)[], //?
//                    "message" => ["Validation errors occurred"]
//                ];
//            }


            echo json_encode($response);
        }
    }

    public function getAllUsers()
    {

        if ($_SERVER["REQUEST_METHOD"] === "GET") {
            $response = $this->db->selectAllUsers();

            http_response_code(empty($response['errors']) ? 200 : 400);
            echo json_encode($response);
        }
    }

    public function update() //айди в теле запроса
    {
        header("Content-Type: application/json");
        $data = json_decode(file_get_contents("php://input"), true);

        $response = $this->db->updateUser($data);

        http_response_code(empty($response['errors']) ? 200 : 400);
        echo json_encode($response);
    }

    public function updateById($userId) //айди в url
    {
        header("Content-Type: application/json");
        $data = json_decode(file_get_contents("php://input"), true);

        $data['id'] = (int)$userId;

        $response = $this->db->updateUser($data);

        http_response_code(empty($response['errors']) ? 200 : 400);
        echo json_encode($response);
    }


//    public function update($userId)
//    {
//        header("Content-Type: application/json; charset=UTF-8");
//        header("Access-Control-Allow-Origin: *");
//        header("Access-Control-Allow-Methods: PUT, OPTIONS");
//        header("Access-Control-Allow-Headers: Content-Type, Authorization");
//
//        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//            exit(0);
//        }
//
//        if (!is_numeric($userId) || $userId <= 0) {
//            http_response_code(400);
//            echo json_encode([
//                'data' => null,
//                'errors' => ['id' => 'Invalid user ID'],
//                'message' => 'Validation failed'
//            ]);
//            return;
//        }
//
//        $data = json_decode(file_get_contents("php://input"), true);
//
//        $data['id'] = (int)$userId;
//
//        $response = $this->db->updateUser($data);
//
//        http_response_code(empty($response['errors']) ? 200 : 400);
//        echo json_encode($response);
//    }

    public function deleteById($userId)
    {

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            exit(0);
        }

        if (!is_numeric($userId) || $userId <= 0) {
            http_response_code(400);
            echo json_encode([
                'data' => null,
                'errors' => ['id' => 'Invalid user ID'],
                'message' => 'Validation failed'
            ]);
            return;
        }

        $response = $this->db->deleteUser((int)$userId);

        if (!empty($response['errors'])) {
            http_response_code(404);
        } else {
            http_response_code(200);
        }

        echo json_encode($response);
    }
}