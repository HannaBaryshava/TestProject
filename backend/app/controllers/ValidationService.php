<?php

namespace app\controllers;
use app\database\Database;

interface ValidatorInterface
{
    public function validate(array $data, array $rules, array $messages,  Database $db): array;
}

class ValidationService implements ValidatorInterface
{
    public function validate(
        array $data,
        array $rules,
        array $messages,
        Database $db
    ): array {
        $errors = [];

        foreach ($rules as $field => $fieldRules) {
            foreach ($fieldRules as $rule) {
                $value = $data[$field] ?? null;
                $value = strtolower($value);
                $ruleParts = explode(':', $rule, 2);
                $ruleName = $ruleParts[0];
                $ruleValue = $ruleParts[1] ?? null;
                $userId = isset($data['id']) ? (int)$data['id'] : null;

                if (!empty($errors[$field]) && in_array($messages['required'], $errors[$field])) {
                    break;
                }

                switch ($ruleName) {
                    case 'required':
                        if (empty($value)) {
                            $message = str_replace(':fieldName:', $field, $messages['required']);
                            $errors[$field][] = $message;
                            break 2;
                        }
                        break;
                    case 'email':
                        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                            $message = str_replace(':fieldName:', $field, $messages['email']);
                            $errors[$field][] = $message;
                        }
                        break;
                    case 'in':
                        $allowed = explode(',', $ruleValue);
                        if (!in_array($value, $allowed)) {
                            $message = str_replace([':fieldName:', ':rulevalue:'], [$field, implode(', ', $allowed)], $messages['in']);
                            $errors[$field][] = $message;
                        }
                        break;
                    case 'min':
                        if (strlen($value) < $ruleValue) {
                            $message = str_replace([':fieldName:', ':rulevalue:'], [$field, $ruleValue], $messages['min']);
                            $errors[$field][] = $message;
                        }
                        break;
                    case 'max':
                        if (strlen($value) > $ruleValue) {
                            $message = str_replace([':fieldName:', ':rulevalue:'], [$field, $ruleValue], $messages['max']);
                            $errors[$field][] = $message;
                        }
                        break;
                    case 'unique':
                        if (!$db->isEmailUnique($value, $userId)) { //?
                            $errors[$field][] = str_replace(':fieldName:', $field, $messages['unique']);
                        }
                        break;
                    default:
                        $message = str_replace(':fieldName:', $field, $messages['default']);
                        $errors[$field][] = $message;
                        break;
                }
            }
        }

        return $errors;
    }
}