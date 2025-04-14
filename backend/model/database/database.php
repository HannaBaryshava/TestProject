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
    private static ?Database $instance = null;

    private const DB_NAME = 'user_db';
    private const DB_HOST = 'localhost';
    private const DB_USERNAME = 'root';
    private const DB_PASSWORD = 'passw0rd_mySql';
    private array $options = [
        \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
        \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC
    ];

    private ?PDO $dbh = null;
    private ?PDOStatement $stmt = null;
    private \PDO $pdo;

    private function __construct()
    {
        $this->connect();
    }

    public static function getInstance(): Database
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function connect(): PDO
    {
        try {
            $this->pdo = new \PDO(
                "mysql:host=".self::DB_HOST.";dbname=".self::DB_NAME.";charset=utf8mb4",
               self::DB_USERNAME,
                self::DB_PASSWORD,
                $this->options
            );
            return $this->pdo;
        } catch (\PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            throw new \RuntimeException("Service unavailable. Please try again later.", 503); // лучше исползуем RuntimeException вместо die
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

            $this->extracted($stmt, $data);

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

            if ($users) {   //добавить empty
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
            $this->extracted($stmt, $data);

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

    public function isEmailUnique(string $email, ?int $excludeUserId = null): bool
    {
        try {
            $query = "SELECT id FROM user_table WHERE email = :email";
            $params = [':email' => $email];

            if ($excludeUserId !== null) {
                $query .= " AND id != :exclude_id";
                $params[':exclude_id'] = $excludeUserId;
            }

            $stmt = $this->pdo->prepare($query);
            $stmt->execute($params);

            return $stmt->rowCount() === 0;

        } catch (\PDOException $e) {
            error_log("Email check failed: " . $e->getMessage());
            return false;
        }
    }

    public function query($sql): void
    {
        $this->stmt = $this->dbh->prepare($sql);
    }
    public function bind($stmt, $param, $value, $type = null): void
    {
        if (is_null($type)) {

            $type = match (true) {
                is_int($value) => \PDO::PARAM_INT,
                is_bool($value) => \PDO::PARAM_BOOL,
                is_null($value) => \PDO::PARAM_NULL,
                default =>  \PDO::PARAM_STR,
            };

//            switch (true) {   //заменить на match
//                case is_int($value):
//                    $type = \PDO::PARAM_INT;
//                    break;
//                case is_bool($value):
//                    $type = \PDO::PARAM_BOOL;
//                    break;
//                case is_null($value):
//                    $type = \PDO::PARAM_NULL;
//                    break;
//                default:
//                    $type = \PDO::PARAM_STR;
//            }
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

    /**
     * @param $stmt
     * @param array $data
     * @return void
     */
    public function extracted($stmt, array $data): void
    {
        $this->bind($stmt, ':name', $data['name']);          //было дублирование кода, поэтому вынес в отдельный метод
        $this->bind($stmt, ':email', $data['email']);
        $this->bind($stmt, ':country', $data['country']);
        $this->bind($stmt, ':city', $data['city']);
        $this->bind($stmt, ':gender', $data['gender']);
        $this->bind($stmt, ':status', $data['status']);
    }
}