<?php
// GoRestController.php
namespace app\controllers;
//use OpenApi\Annotations as OA;
use OpenApi\Attributes as OA;

#[OA\Info(
    version: "1.0.0",
    description: "API для работы с пользователями GoREST",
    title: "GoRest API",
    contact: new OA\Contact(email: "support@gorest.com"),
)]

class GoRestController
{
    private const GOREST_TOKEN = 'c162f0af0adc771ec62a44b499d5d895af5af4d617d281599179a982aafa30d1';

    /**
     * @param string $url
     * @param string $method
     * @param array $payload
     * @return \CurlHandle
     */
    private function initGorestCurl(string $url, string $method = 'GET', array $payload = []): \CurlHandle
    {
        $token = self::GOREST_TOKEN;

        $headers = [
            "Authorization: Bearer {$token}",
            'Accept: application/json',
            'Content-Type: application/json'
        ];

        $ch = curl_init();

        if (!empty($_COOKIE['session_token'])) {
            $cookieValue = $_COOKIE['session_token'];
            $headers[] = "Cookie: session_token={$cookieValue}";
        }

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

    #[OA\Get(
        path: '/api/gorest/users',
        summary: 'Получить список пользователей GoREST',
        tags: ['GoREST'],
        parameters: [
            new OA\Parameter(
                name: 'page',
                description: 'Номер страницы (по умолчанию 1)',
                in: 'query',
                required: false,
                schema: new OA\Schema(
                    type: 'integer',
                    default: 1
                )
            ),
            new OA\Parameter(
                name: 'limit',
                description: 'Количество пользователей на странице (макс. 100)',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'integer', default: 10)
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Список пользователей успешно получен',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: 'data',
                            type: 'array',
                            items: new OA\Items(
                                properties: [
                                    new OA\Property(property: 'id', type: 'integer', example: 7877779),
                                    new OA\Property(property: 'name', type: 'string', example: 'Ganapati Desai'),
                                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'desai_ganapati@harvey-deckow.example'),
                                    new OA\Property(property: 'gender', type: 'string', example: 'female'),
                                    new OA\Property(property: 'status', type: 'string', example: 'inactive'),
                                    new OA\Property(property: 'city', type: 'string', example: 'city'),
                                    new OA\Property(property: 'country', type: 'string', example: 'country')
                                ],
                                type: 'object'
                            )
                        ),
                        new OA\Property(
                            property: 'errors',
                            type: 'array',
                            items: new OA\Items(type: 'string')
                        ),
                        new OA\Property(
                            property: 'message',
                            type: 'array',
                            items: new OA\Items(type: 'string', example: 'Users fetched successfully')
                        )
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(
                response: 500,
                description: 'Ошибка соединения или парсинга'
            )
        ]
    )]

    public function getGorestUsers(): void
    {
        $this->handleCors();

        $page = max((int)($_GET['page'] ?? 1), 1);
        $limit = min(max((int)($_GET['limit'] ?? 10), 1), 100);

        $url = "https://gorest.co.in/public/v2/users?page={$page}&per_page={$limit}";

        $ch = $this->initGorestCurl($url, 'GET');
        $response = curl_exec($ch);
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

        foreach ($users as &$user) {
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

    #[OA\Put(
        path: '/api/gorest/users/{userId}',
        summary: 'Обновить информацию о пользователе GoREST',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: 'application/json',
                schema: new OA\Schema(
                    properties: [
                        new OA\Property(property: 'name', type: 'string', example: 'Ganapati Desai'),
                        new OA\Property(property: 'email', type: 'string', format: 'email', example: 'desai_ganapati@harvey-deckow.example'),
                        new OA\Property(property: 'gender', type: 'string', example: 'female'),
                        new OA\Property(property: 'status', type: 'string', example: 'inactive'),
                        new OA\Property(property: 'city', type: 'string', example: 'city'),
                        new OA\Property(property: 'country', type: 'string', example: 'country')
                    ],
                    type: 'object'
                )
            )
        ),
        tags: ['GoREST'],
        parameters: [
            new OA\Parameter(
                name: 'userId',
                description: 'ID пользователя для обновления',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer')
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Пользователь успешно обновлен',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'data', properties: [
                            new OA\Property(property: 'id', type: 'integer', example: 7877779),
                            new OA\Property(property: 'name', type: 'string', example: 'Ganapati Desai'),
                            new OA\Property(property: 'email', type: 'string', format: 'email', example: 'desai_ganapati@harvey-deckow.example'),
                            new OA\Property(property: 'gender', type: 'string', example: 'female'),
                            new OA\Property(property: 'status', type: 'string', example: 'inactive'),
                            new OA\Property(property: 'city', type: 'string', example: 'city'),
                            new OA\Property(property: 'country', type: 'string', example: 'country')
                        ], type: 'object')
                    ]
                )
            ),
            new OA\Response(
                response: 400,
                description: 'Неверный JSON в теле запроса',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'data', type: 'object'),
                        new OA\Property(property: 'errors', type: 'array', items: new OA\Items(type: 'string')),
                        new OA\Property(property: 'message', type: 'array', items: new OA\Items(type: 'string'))
                    ]
                )
            ),
            new OA\Response(
                response: 500,
                description: 'Ошибка при подключении или выполнении запроса'
            )
        ]
    )]

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

    #[OA\Post(
        path: '/api/gorest/users',
        summary: 'Создать нового пользователя GoREST',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: 'application/json',
                schema: new OA\Schema(
                    properties: [
                        new OA\Property(property: 'name', type: 'string', description: 'Имя пользователя'),
                        new OA\Property(property: 'email', type: 'string', format: 'email', description: 'Email пользователя'),
                        new OA\Property(property: 'gender', type: 'string', description: 'Пол пользователя'),
                        new OA\Property(property: 'status', type: 'string', description: 'Статус пользователя (например, active, inactive)'),
                        new OA\Property(property: 'city', type: 'string', description: 'Город пользователя'),
                        new OA\Property(property: 'country', type: 'string', description: 'Страна пользователя')
                    ],
                    type: 'object'
                )
            )
        ),
        tags: ['GoREST'],
        responses: [
            new OA\Response(
                response: 201,
                description: 'Пользователь успешно создан',
                content: new OA\MediaType(
                    mediaType: 'application/json',
                    schema: new OA\Schema(
                        properties: [
                            new OA\Property(property: 'id', type: 'integer', description: 'ID созданного пользователя'),
                            new OA\Property(property: 'name', type: 'string', description: 'Имя пользователя'),
                            new OA\Property(property: 'email', type: 'string', format: 'email', description: 'Email пользователя'),
                            new OA\Property(property: 'gender', type: 'string', description: 'Пол пользователя'),
                            new OA\Property(property: 'status', type: 'string', description: 'Статус пользователя'),
                            new OA\Property(property: 'city', type: 'string', description: 'Город пользователя'),
                            new OA\Property(property: 'country', type: 'string', description: 'Страна пользователя')
                        ],
                        type: 'object'
                    )
                )
            ),
            new OA\Response(
                response: 400,
                description: 'Неверный запрос, некорректные данные'
            ),
            new OA\Response(
                response: 500,
                description: 'Ошибка сервера'
            )
        ]
    )]


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

    #[OA\Patch(
        path: '/api/gorest/users/{id}',
        summary: 'Обновить информацию о пользователе GoREST',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: 'application/json',
                schema: new OA\Schema(
                    properties: [
                        new OA\Property(property: 'name', type: 'string', description: 'Имя пользователя'),
                        new OA\Property(property: 'email', type: 'string', format: 'email', description: 'Email пользователя'),
                        new OA\Property(property: 'gender', type: 'string', description: 'Пол пользователя'),
                        new OA\Property(property: 'status', type: 'string', description: 'Статус пользователя'),
                        new OA\Property(property: 'city', type: 'string', description: 'Город пользователя'),
                        new OA\Property(property: 'country', type: 'string', description: 'Страна пользователя')
                    ],
                    type: 'object'
                )
            )
        ),
        tags: ['GoREST'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                description: 'ID пользователя для обновления',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer')
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Пользователь успешно обновлен',
                content: new OA\MediaType(
                    mediaType: 'application/json',
                    schema: new OA\Schema(
                        properties: [
                            new OA\Property(property: 'id', type: 'integer', description: 'ID обновленного пользователя'),
                            new OA\Property(property: 'name', type: 'string', description: 'Имя пользователя'),
                            new OA\Property(property: 'email', type: 'string', format: 'email', description: 'Email пользователя'),
                            new OA\Property(property: 'gender', type: 'string', description: 'Пол пользователя'),
                            new OA\Property(property: 'status', type: 'string', description: 'Статус пользователя'),
                            new OA\Property(property: 'city', type: 'string', description: 'Город пользователя'),
                            new OA\Property(property: 'country', type: 'string', description: 'Страна пользователя')
                        ],
                        type: 'object'
                    )
                )
            ),
            new OA\Response(
                response: 400,
                description: 'Неверный запрос, некорректные данные'
            ),
            new OA\Response(
                response: 404,
                description: 'Пользователь не найден'
            ),
            new OA\Response(
                response: 500,
                description: 'Ошибка сервера'
            )
        ]
    )]


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

    #[OA\Delete(
        path: '/api/gorest/users/{userId}',
        summary: 'Удалить пользователя GoREST',
        tags: ['GoREST'],
        parameters: [
            new OA\Parameter(
                name: 'userId',
                description: 'ID пользователя для удаления',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer')
            )
        ],
        responses: [
            new OA\Response(
                response: 204,
                description: 'Пользователь успешно удален'
            ),
            new OA\Response(
                response: 404,
                description: 'Пользователь не найден'
            ),
            new OA\Response(
                response: 500,
                description: 'Ошибка сервера'
            )
        ]
    )]


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
                "errors" => ["curl" => $error],
                "message" => ["Failed to connect to GoRest API"]
            ]);
            return;
        }

        if ($httpCode === 204) {
            http_response_code(204);
            return;
        }

        $responseData = $response !== '' ? json_decode($response, true) : [];

        http_response_code($httpCode);
        echo json_encode([
            "data" => $responseData,
            "errors" => [],
            "message" => ["User deleted successfully or error info from API"]
        ]);
    }

}