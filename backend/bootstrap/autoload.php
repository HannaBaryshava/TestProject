<?php
spl_autoload_register(function ($class) {
    $baseDir = __DIR__ . '/../'; // Указываем на корневую папку backend
    error_log("Base directory: $baseDir");  // Логируем базовый путь

    $file = $baseDir . str_replace('\\', '/', $class) . '.php';
    error_log("Trying to load class: $class from $file");  // Логируем путь к файлу

    if (file_exists($file)) {
        error_log("Class $class found at $file");  // Логируем успешную загрузку
        require $file;
    } else {
        error_log("Class $class not found at $file");  // Логируем ошибку загрузки
    }
//
//    $targetFile = __DIR__ . '/../model/database/database.php';
//    if ($class === 'database\Database' && file_exists($targetFile)) {
//        error_log("Loading Database class from: $targetFile");
//        require $targetFile;
//        return;
//    }
//
//    // Для всех других классов просто логируем ошибку
//    error_log("Autoload blocked: Only Database class can be loaded. Requested: $class");


});
