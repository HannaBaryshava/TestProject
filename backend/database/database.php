<?php
/*
PDO Database Class
connect to database
Create Prepared Statements
Bind Values
Return rows and results
*/

namespace backend\database;

use PDO;
use PDOException;

class Database
{
    private $pdo;
    private $host = 'localhost';
    private $dbname = 'user_db';
    private $user = 'root';
    private $pass = 'passw0rd_mySql';

    private $dbh;
    private $stmt;
    private $error;

    public function __construct()
    {
        //set DSN
        $dsn = 'mysql:host=' . $this->host . ';dbname=' . $this->dbname;
        $options = array(
            PDO::ATTR_PERSISTENT => true,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC
        );

        //create PDO instance
        try {
            $this->dbh = new PDO($dsn, $this->user, $this->pass, $options);
        } catch (PDOException $e) {
            $this->error = $e->getMessage();
            echo $this->error;
        }

        phpinfo(INFO_MODULES);
        exit;
    }

    public function getConnection(): PDO
    {
        return $this->dbh;
    }

    public function query($sql): void
    {
        $this->stmt = $this->dbh->prepare($sql);
    }
    public function bind($param, $value, $type = null): void
    {
        if (is_null($type)) {
            switch (true) {
                case is_int($value):
                    $type = PDO::PARAM_INT;
                    break;
                case is_bool($value):
                    $type = PDO::PARAM_BOOL;
                    break;
                case is_null($value):
                    $type = PDO::PARAM_NULL;
                    break;
                default:
                    $type = PDO::PARAM_STR;
            }
        }
        $this->stmt->bindValue($param, $value, $type);
    }
    public function execute()
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