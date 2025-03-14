<?php

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['name']) && isset($data['email'])) {
    $name = htmlspecialchars($data['name']);
    $email = htmlspecialchars($data['email']);

    echo json_encode([
        'status' => 'success',
        'message' => 'User created successfully',
        'data' => [
            'name' => $name,
            'email' => $email,
        ],
    ]);
} else {

    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Name and email are required',
    ]);
}
?>