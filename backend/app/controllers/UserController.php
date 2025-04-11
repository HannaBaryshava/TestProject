<?php

namespace app\controllers;

use app\database\Database;

//require_once '../config/config.php';
require_once __DIR__ . '/../../model/database/database.php';

class UserController
{
    private Database $db;
    private ValidationService $validator;


    protected array $messages = [
        'required' => 'The :fieldName: field is required',
        'min' => 'The :fieldName: field must be a minimum :rulevalue: characters',
        'max' => 'The :fieldName: field must be a maximum :rulevalue: characters',
        'email' => 'Not valid email',
        'password' => 'Not valid password',
        'in' => 'The :fieldName: field must be one of :rulevalue:',
        'default' => ' Validation failed for :fieldName:',
        'unique' => 'This email is already in use',
    ];

    protected array $rules = [
        'name' => ['required', 'min:2', 'max:50'],
        'email' => ['required', 'email', 'unique'],
        'country' => ['required', 'in:usa,poland,belarus'],
        'city' => ['required', 'min:2', 'max:50'],
        'gender' => ['required', 'in:male,female'],
        'status' => ['required', 'in:active,inactive'],
    ];

    public function __construct()
    {
        $this->db = new Database();
        $this->validator = new ValidationService();
    }

    /**
     * @throws \JsonException
     */
    public function create(): void
    {
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


            $errors = $this->validator->validate(
                $data,
                $this->rules,
                $this->messages,
                $this->db
            );

            if (empty($errors)) {
                $response = $this->db->createUser($data);
                error_log("Response type: " . gettype($response));
                error_log("Response content: " . print_r($response, true));
            } else {
                http_response_code(400);
                $response = [
                    "data" => (object)[],
                    "errors" => $errors,
                    "message" => ["Validation errors while creating"]
                ];
            }

            echo json_encode($response, JSON_THROW_ON_ERROR);  // добавь для json_encode в других частях как здесь? везде дбавить try/catch
        }
    }

    /**
     * @throws \JsonException
     */
    public function getAllUsers(): void
    {

        if ($_SERVER["REQUEST_METHOD"] === "GET") {

            $sortColumn = $_GET['_sort'] ?? null;
            $sortOrder = $_GET['_order'] ?? 'asc';

            $response = $this->db->selectAllUsers($sortColumn, $sortOrder);

            http_response_code(empty($response['errors']) ? 200 : 400);

                if (empty($errors)) {
                    http_response_code(200);

                } else {
                    http_response_code(400);
                    $response = [
                        "data" => (object)[],
                        "errors" => $errors,
                        "message" => ["Validation errors while updating"]
                    ];
                }
        }
        echo json_encode($response, JSON_THROW_ON_ERROR);
    }

    /**
     * @throws \JsonException
     */
    public function update(): void //айди в теле запроса
    {
        header("Content-Type: application/json");
        $data = json_decode(file_get_contents("php://input"), true);

        $errors = $this->validator->validate(
            $data,
            $this->rules,
            $this->messages,
            $this->db
        );

        if (empty($errors)) {
            $response = $this->db->updateUser($data);
            http_response_code(200);
        } else {
            http_response_code(400);
            $response = [
                "data" => (object)[],
                "errors" => $errors,
                "message" => ["Validation errors while updating"]
            ];
        }

        echo json_encode($response, JSON_THROW_ON_ERROR);
    }

    /**
     * @throws \JsonException
     */
    public function updateById(int $userId): void //айди в url
    {
        header("Content-Type: application/json");
        $data = json_decode(file_get_contents("php://input"), true);

        $data['id'] = $userId;

        $errors = $this->validator->validate(
            $data,
            $this->rules,
            $this->messages,
            $this->db
        );

        if (empty($errors)) {
            http_response_code(200);
            $response = $this->db->updateUser($data);
        } else {
            http_response_code(400);
            $response = [
                "data" => (object)[],
                "errors" => $errors,
                "message" => ["Validation errors while updating"]
            ];
        }

        echo json_encode($response,JSON_THROW_ON_ERROR);
    }


    /**
     * @throws \JsonException
     */
    public function deleteById(int $userId): void
    {

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            exit(0);
        }

        $response = $this->db->deleteUser($userId);

        if (!empty($response['errors'])) {
            http_response_code(404);
            $response = [
                "data" => (object)[],
                "errors" => $response['errors'],
                "message" => ["Failed to delete user"]
            ];
        } else {
            http_response_code(200);
            $response = [
                "data" => (object)[],
                "errors" => [],
                "message" => ["User successfully deleted"]
            ];
        }

        echo json_encode($response, JSON_THROW_ON_ERROR);
    }


}