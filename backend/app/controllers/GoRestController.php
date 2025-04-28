<?php
// GoRestController.php
namespace app\controllers;

class GoRestController
{
    private const GOREST_TOKEN = 'c162f0af0adc771ec62a44b499d5d895af5af4d617d281599179a982aafa30d1';

    public function getGorestUsers(): void
    {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }

        $page = max((int)($_GET['page'] ?? 1), 1);
        $limit = min(max((int)($_GET['limit'] ?? 10), 1), 100);

        $url = "https://gorest.co.in/public/v2/users?page={$page}&per_page={$limit}";
        $token = self::GOREST_TOKEN;

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_HTTPHEADER => [
                "Authorization: Bearer {$token}",
                'Accept: application/json'
            ],
            CURLOPT_SSL_VERIFYPEER => true
        ]);

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

        http_response_code(200);
        echo json_encode([
            "data" => $users,
            "errors" => [],
            "message" => ["Users fetched successfully"]
        ]);
    }

}