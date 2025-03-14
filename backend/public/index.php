<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"));
    $name = $data->name;
    $email = $data->email;

    $response = [
        "status" => "success",
        "data" => [
            "name" => $name,
            "email" => $email,
        ],
        "message" => "User created successfully"
    ];
    echo json_encode($response);
} else {
    echo json_encode(["status" => "false", "message" => "error occurred"]);
}
?>