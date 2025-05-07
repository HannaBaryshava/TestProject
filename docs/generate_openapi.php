<?php

require_once 'vendor/autoload.php';
$path = './backend/app/controllers';
$openapi = \OpenApi\Generator::scan([$path]);
header('Content-Type: application/x-yaml');
echo $openapi->toYaml();

//// JSON
//header('Content-Type: application/json');
//echo $openapi->toJson();

//php docs/generate_openapi.php > docs/openapi.yaml