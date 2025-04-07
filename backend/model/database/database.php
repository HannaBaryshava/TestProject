<?php
/*
PDO Database Class
connect to database
Create Prepared Statements
Bind Values
Return rows and results
*/

namespace app\database;

use PDO;
use PDOException;
use PDOStatement;

class Database
{
    private ?PDO $dbh = null;
    private ?PDOStatement $stmt = null;
    private ?PDO $connection = null;
    private string $dsn;
    private $pdo;

    private string $dbname = 'user_db';
    private string $host = 'localhost';
    private string $username = 'root';
    private string $password = 'passw0rd_mySql';
    private array $options = [
        \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
        \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC
    ];

    public function __construct()
    {
        $this->connect();
    }

    public function connect()
    {
        try {
            $this->pdo = new \PDO(
                "mysql:host=$this->host;dbname=$this->dbname;charset=utf8mb4",
                $this->username,
                $this->password,
                $this->options
            );
            return $this->pdo;
        } catch (\PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            die(json_encode([
                "errors" => ["database" => "Connection error"],
                "message" => "Service unavailable"
            ]));
        }
    }

    public function createUser(array $data): array
    {
        $response = [
            'data' => null,
            'errors' => [],
            'message' => ''
        ];

        try {
            $stmt = $this->pdo->prepare("
            INSERT INTO user_table 
            (name, email, country, city, gender, status) 
            VALUES (:name, :email, :country, :city, :gender, :status)
        ");

            $this->bind($stmt, ':name', $data['name']);
            $this->bind($stmt, ':email', $data['email']);
            $this->bind($stmt, ':country', $data['country']);
            $this->bind($stmt, ':city', $data['city']);
            $this->bind($stmt, ':gender', $data['gender']);
            $this->bind($stmt, ':status', $data['status']);

            if ($stmt->execute()) {
                $response = [
                    "data" => [
                        "id" => $this->pdo->lastInsertId(),
                        "name" => $data['name'],
                        "email" => $data['email'],
                        "country" => $data['country'],
                        "city" => $data['city'],
                        "gender" => $data['gender'],
                        "status" => $data['status']
                    ],
                    "errors" => [],
                    "message" => "User created successfully"
                ];
            }
        } catch (\PDOException $e) {
            error_log("Database error: " . $e->getMessage());
            $response['errors'] = ['database' => 'Database operation failed'];
        }

        return $response;
    }

    public function selectAllUsers(string $sortColumn = null, string $sortOrder = 'asc'): array
    {
        $response = [
            'data' => [],
            'errors' => [],
            'message' => ''
        ];

        try {
            $query = "SELECT id, name, email, country, city, gender, status FROM user_table";

            if ($sortColumn !== null) {
                $allowedColumns = ['id', 'name', 'email', 'country', 'city', 'gender', 'status'];
                $sortColumn = strtolower($sortColumn);

                if (in_array($sortColumn, $allowedColumns)) {

                    $sortOrder = strtoupper($sortOrder) === 'DESC' ? 'DESC' : 'ASC';

                    $query .= " ORDER BY $sortColumn $sortOrder";
                } else {
                    $response['errors'][] = "Invalid sort column: " . htmlspecialchars($sortColumn);
                    return $response;
                }
            }

            $stmt = $this->pdo->query($query);

            $users = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            if ($users) {
                $response['data'] = $users;
                $response['message'] = 'Users found' .($sortColumn !== null ? ' (sorted by ' . $sortColumn . ' ' . $sortOrder . ')' : '');

            } else {
                $response['message'] = 'No users found';
            }
        } catch (\PDOException $e) {
            error_log("Database error: " . $e->getMessage());
            $response['errors'] = ['database' => 'Database operation failed'];
        }

        return $response;
    }

    public function updateUser(array $data): array
    {
        $response = [
            'data' => null,
            'errors' => [],
            'message' => ''
        ];

        if (empty($data['id'])) {
            $response['errors'] = ['id' => 'User ID is required'];
            $response['message'] = 'Validation failed';
            return $response;
        }

        try {
            $stmt = $this->pdo->prepare("
            UPDATE user_table SET
                name = :name,
                email = :email,
                country = :country,
                city = :city,
                gender = :gender,
                status = :status
            WHERE id = :id
        ");

            $this->bind($stmt, ':id', $data['id'], \PDO::PARAM_INT);
            $this->bind($stmt, ':name', $data['name']);
            $this->bind($stmt, ':email', $data['email']);
            $this->bind($stmt, ':country', $data['country']);
            $this->bind($stmt, ':city', $data['city']);
            $this->bind($stmt, ':gender', $data['gender']);
            $this->bind($stmt, ':status', $data['status']);

            if ($stmt->execute()) {
                $selectStmt = $this->pdo->prepare("
                SELECT * FROM user_table 
                WHERE id = :id
            ");
                $this->bind($selectStmt, ':id', $data['id'], \PDO::PARAM_INT);
                $selectStmt->execute();

                $response['data'] = $selectStmt->fetch(\PDO::FETCH_ASSOC);
                $response['message'] = 'User updated successfully';
            }

        } catch (\PDOException $e) {
            error_log("Database error: " . $e->getMessage());
            $response['errors'] = ['database' => 'Update operation failed'];
        }

        return $response;
    }

    public function deleteUser(int $id): array
    {
        $response = [
            'data' => null,
            'errors' => [],
            'message' => ''
        ];

        try {
            $checkStmt = $this->pdo->prepare("SELECT id FROM user_table WHERE id = :id");
            $this->bind($checkStmt, ':id', $id, \PDO::PARAM_INT);
            $checkStmt->execute();

            if (!$checkStmt->fetch()) {
                $response['errors'] = ['not_found' => 'User not found'];
                $response['message'] = 'Deletion failed';
                return $response;
            }

            $deleteStmt = $this->pdo->prepare("DELETE FROM user_table WHERE id = :id");
            $this->bind($deleteStmt, ':id', $id, \PDO::PARAM_INT);

            if ($deleteStmt->execute()) {
                $response['message'] = 'User deleted successfully';
                if ($deleteStmt->rowCount() > 0) {
                    $response['data'] = ['id' => $id];
                }
            }

        } catch (\PDOException $e) {
            error_log("Database error: " . $e->getMessage());
            $response['errors'] = ['database' => 'Deletion failed'];
        }

        return $response;
    }

    public function getConnection(): PDO //skip
    {
        if ($this->connection === null) {
            throw new \RuntimeException(
                "Database connection not established. Call connect() first."
            );
        }
        return $this->connection;
    }

    public function query($sql): void
    {
        $this->stmt = $this->dbh->prepare($sql);
    }
    public function bind($stmt, $param, $value, $type = null): void
    {
        if (is_null($type)) {
            switch (true) {
                case is_int($value):
                    $type = \PDO::PARAM_INT;
                    break;
                case is_bool($value):
                    $type = \PDO::PARAM_BOOL;
                    break;
                case is_null($value):
                    $type = \PDO::PARAM_NULL;
                    break;
                default:
                    $type = \PDO::PARAM_STR;
            }
        }
        $stmt->bindValue($param, $value, $type);
    }

    public function execute(): bool
    {
        return $this->stmt->execute();
    }
    public function lastInsertId(): string
    {
        return $this->dbh->lastInsertId();
    }

//    public function resultSet()
//    {
//        $this->execute();
//        return $this->stmt->fetchAll(PDO::FETCH_OBJ);
//    }
//    public function single()
//    {
//        $this->execute();
//        return $this->stmt->fetch(PDO::FETCH_OBJ);
//    }
//    public function rowCount()
//    {
//        return $this->stmt->rowCount();
//    }
}