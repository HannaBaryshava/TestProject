<?php

namespace app\controllers;

use app\database\Database;

//require_once '../config/config.php';
require_once __DIR__ . '/../../model/database/database.php';

class UserController
{
    private $db;

    protected $messages = [
        'required' => 'The :fieldName: field is required',
        'min' => 'The :fieldName: field must be a minimum :rulevalue: characters',
        'max' => 'The :fieldName: field must be a maximum :rulevalue: characters',
        'email' => 'Not valid email',
        'password' => 'Not valid password',
        'in' => 'The :fieldName: field must be one of :rulevalue:',
        'default' => ' Validation failed for :fieldName:',
        'unique' => 'This email is already in use',
    ];

    protected $rules = [
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
    }

    protected function validate(array $data, array $rules): array
    {
        $errors = [];

        foreach ($rules as $field => $fieldRules) {
            foreach ($fieldRules as $rule) {
                $value = $data[$field] ?? null;
                $value = strtolower($value);
                $ruleParts = explode(':', $rule, 2);
                $ruleName = $ruleParts[0];
                $ruleValue = $ruleParts[1] ?? null;
                $userId = isset($data['id']) ? (int)$data['id'] : null;

                if (!empty($errors[$field]) && in_array($this->messages['required'], $errors[$field])) {
                    break;
                }

                switch ($ruleName) {
                    case 'required':
                        if (empty($value)) {
                            $message = str_replace(':fieldName:', $field, $this->messages['required']);
                            $errors[$field][] = $message;
                            break 2;
                        }
                        break;
                    case 'email':
                        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                            $message = str_replace(':fieldName:', $field, $this->messages['email']);
                            $errors[$field][] = $message;
                        }
                        break;
                    case 'in':
                        $allowed = explode(',', $ruleValue);
                        if (!in_array($value, $allowed)) {
                            $message = str_replace([':fieldName:', ':rulevalue:'], [$field, implode(', ', $allowed)], $this->messages['in']);
                            $errors[$field][] = $message;
                        }
                        break;
                    case 'min':
                        if (strlen($value) < $ruleValue) {
                            $message = str_replace([':fieldName:', ':rulevalue:'], [$field, $ruleValue], $this->messages['min']);
                            $errors[$field][] = $message;
                        }
                        break;
                    case 'max':
                        if (strlen($value) > $ruleValue) {
                            $message = str_replace([':fieldName:', ':rulevalue:'], [$field, $ruleValue], $this->messages['max']);
                            $errors[$field][] = $message;
                        }
                        break;
                    case 'unique':
                        if (!$this->db->isEmailUnique($value, $userId)) { //?
                            $errors[$field][] = str_replace(':fieldName:', $field, $this->messages['unique']);
                        }
                        break;
                    default:
                        $message = str_replace(':fieldName:', $field, $this->messages['default']);
                        $errors[$field][] = $message;
                        break;
                }
            }
        }

        return $errors;
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


            $errors = $this->validate($data, $this->rules);

            if (empty($errors)) {
                $response = $this->db->createUser($data);
                error_log("Response type: " . gettype($response));
                error_log("Response content: " . print_r($response, true));
            } else {
                http_response_code(400);
                $response = [
                    "data" => (object)[],
                    "errors" => $errors,
                    "message" => ["Validation errors occurred"]
                ];
            }


            echo json_encode($response);
        }
    }

    public function getAllUsers(): void
    {

        if ($_SERVER["REQUEST_METHOD"] === "GET") {

            $sortColumn = $_GET['_sort'] ?? null;
            $sortOrder = $_GET['_order'] ?? 'asc';

//            $response = $this->db->selectAllUsers();
            $response = $this->db->selectAllUsers($sortColumn, $sortOrder);

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