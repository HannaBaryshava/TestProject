<?php

namespace app\controllers;

//require_once '../config/config.php';
//require_once '../../database/database.php';

class UserController
{

    private $pdo;

    public function __construct()
    {
//        $this->db = new Database;

        $host = 'localhost';
        $dbname = 'user_db';
        $username = 'root';
        $password = 'passw0rd_mySql';

        try {
            $this->pdo = new \PDO(
                "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
                $username,
                $password,
                [
                    \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
                    \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC
                ]
            );
        } catch (\PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            die(json_encode([
                "errors" => ["database" => "Connection error"],
                "message" => "Service unavailable"
            ]));
        }
    }
    public function create()
    {

        $errors = [];
        $response = [];

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

            $requiredFields = ['name', 'email', 'country', 'city', 'gender', 'status'];
            foreach ($requiredFields as $field) {
                if (empty($data->$field)) {
                    $errors[$field] = "Field $field is required";
                }
            }

            if (empty($errors)) {
                try {

                    $stmt = $this->pdo->prepare("
                        INSERT INTO user_table 
                        (name, email, country, city, gender, status) 
                        VALUES (:name, :email, :country, :city, :gender, :status)
                    ");

                    $stmt->bindParam(':name', $data->name);
                    $stmt->bindParam(':email', $data->email);
                    $stmt->bindParam(':country', $data->country);
                    $stmt->bindParam(':city', $data->city);
                    $stmt->bindParam(':gender', $data->gender);
                    $stmt->bindParam(':status', $data->status);

                    if ($stmt->execute()) {
                        $response = [
                            "data" => [
                                "id" => $this->pdo->lastInsertId(),
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
                    }
                } catch (\PDOException $e) {
                    error_log("Database error: " . $e->getMessage());
                    $errors['database'] = "Database operation failed";
                }
            }

            if (!empty($errors)) {
                http_response_code(400);
                $response = [
                    "data" => (object)[],
                    "errors" => $errors,
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
}