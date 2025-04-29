<?php
// GoRestController.php
namespace app\controllers;

class GoRestController
{
    private const GOREST_TOKEN = 'c162f0af0adc771ec62a44b499d5d895af5af4d617d281599179a982aafa30d1';

    private function initGorestCurl(string $url, string $method = 'GET', array $payload = []): \CurlHandle
    {
        $token = self::GOREST_TOKEN;

        $headers = [
            "Authorization: Bearer {$token}",
            'Accept: application/json',
            'Content-Type: application/json'
        ];

        $ch = curl_init();

        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 15,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_HTTPHEADER => $headers,
        ]);

        if (in_array($method, ['POST', 'PUT', 'PATCH'])) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        }

        return $ch;
    }

    private function handleCors(): void
    {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
        header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }
    }

    private function handleApiResponse(string|false $response, int $httpCode, string $error): void  //?
    {
        if ($error) {
            http_response_code(500);
            echo json_encode([
                "data" => [],
                "errors" => ["curl" => $error],
                "message" => ["Failed to connect to Gorest API"]
            ]);
            return;
        }

        $json = json_decode($response, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(500);
            echo json_encode([
                "data" => [],
                "errors" => ["json" => json_last_error_msg()],
                "message" => ["Invalid JSON response"]
            ]);
            return;
        }

        http_response_code($httpCode);
        echo json_encode([
            "data" => $json,
            "errors" => [],
            "message" => ["Request completed with status {$httpCode}"]
        ]);
    }

    public function getGorestUsers(): void
    {
        $this->handleCors();

        $page = max((int)($_GET['page'] ?? 1), 1);
        $limit = min(max((int)($_GET['limit'] ?? 10), 1), 100);

        $url = "https://gorest.co.in/public/v2/users?page={$page}&per_page={$limit}";

        $ch = $this->initGorestCurl($url, 'GET');
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);


        if ($error) {
            http_response_code(500);
            echo json_encode([
                "data" => [],
                "errors" => ["curl" => $error],
                "message" => ["Failed to connect to Gorest API"]
            ]);
            return;
        }

        $users = json_decode($response, true);

        if ($httpCode !== 200 || json_last_error() !== JSON_ERROR_NONE) {
            http_response_code($httpCode);
            echo json_encode([
                "data" => [],
                "errors" => ["api" => "Invalid API response"],
                "message" => ["Failed to fetch users"]
            ]);
            return;
        }

        foreach ($users as $user) {
            if (empty($user['city'])) {
                $user['city'] = 'city';
            }
            if (empty($user['country'])) {
                $user['country'] = 'country';
            }
        }
        unset($user);

        http_response_code(200);
        echo json_encode([
            "data" => $users,
            "errors" => [],
            "message" => ["Users fetched successfully"]
        ]);
    }

    public function updateGorestUsers(int $userId): void
    {
        $this->handleCors();

        $input = file_get_contents("php://input");
        $data = json_decode($input, true);

        if (!$data || !is_array($data)) {
            http_response_code(400);
            echo json_encode([
                "data" => (object)[],
                "errors" => ["Invalid JSON body"],
                "message" => ["Malformed input or missing body."]
            ]);
            return;
        }

        $url = "https://gorest.co.in/public/v2/users/{$userId}";
        $ch = $this->initGorestCurl($url, 'PUT', $data);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            http_response_code(500);
            echo json_encode([
                "data" => (object)[],
                "errors" => ["curl" => $error],
                "message" => ["Failed to connect to GoREST API"]
            ]);
            return;
        }

        $decoded = json_decode($response, true);

        if ($httpCode >= 200 && $httpCode < 300) {
            http_response_code($httpCode);
            echo json_encode([
                "data" => $decoded,
                "errors" => [],
                "message" => ["User updated successfully"]
            ]);
        } else {
            http_response_code($httpCode);
            echo json_encode([
                "data" => (object)[],
                "errors" => $decoded,
                "message" => ["Failed to update user"]
            ]);
        }
    }

    public function createGorestUser(): void
    {
        $this->handleCors();

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['message' => ['Method Not Allowed']]);
            return;
        }

        $payload = json_decode(file_get_contents('php://input'), true);
        $url = "https://gorest.co.in/public/v2/users";

        $ch = $this->initGorestCurl($url, 'POST', $payload);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        $this->handleApiResponse($response, $httpCode, $error);
    }

    public function patchGorestUser(int $id): void
    {
        $this->handleCors();

        if ($_SERVER['REQUEST_METHOD'] !== 'PATCH') {
            http_response_code(405);
            echo json_encode(['message' => ['Method Not Allowed']]);
            return;
        }

        $payload = json_decode(file_get_contents('php://input'), true);
        $url = "https://gorest.co.in/public/v2/users/{$id}";

        $ch = $this->initGorestCurl($url, 'PATCH', $payload);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        $this->handleApiResponse($response, $httpCode, $error);
    }

    public function deleteGorestUser(int $userId): void   //ошибка, но удаляет
    {
        $this->handleCors();

        $url = "https://gorest.co.in/public/v2/users/{$userId}";
        $ch = $this->initGorestCurl($url, 'DELETE');

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            http_response_code(500);
            echo json_encode([
                "data" => [],
                "errors" => ["curl" => $error],
                "message" => ["Failed to connect to GoRest API"]
            ]);
            return;
        }

        $responseData = $response !== '' ? json_decode($response, true) : [];

        http_response_code($httpCode);
        echo json_encode([
            "data" => $responseData,
            "errors" => [],
            "message" => ["User deleted successfully"]
        ]);
    }

}