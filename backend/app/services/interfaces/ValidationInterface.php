<?php

namespace app\services\interfaces;

use app\database\Database;

interface ValidationInterface
{
    public function validate(array $data, array $rules, array $messages,  Database $db): array;
}
