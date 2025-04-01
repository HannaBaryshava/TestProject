<?php
namespace system;

class App
{
    protected $routes = [];

    public function setRoutes(array $routes)
    {
        $this->routes = $routes;
    }

    public function run()
    {
        $requestMethod = $_SERVER['REQUEST_METHOD'];
        $requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        $routeKey = "$requestMethod $requestUri";

//        echo "Route key: $routeKey";

        foreach ($this->routes as $route => $handler) {
            $pattern = str_replace('{id}', '(\d+)', $route);
            $pattern = "#^$pattern$#";

            if (preg_match($pattern, "$requestMethod $requestUri", $matches)) {
                error_log("Matched route: " . $route);

                $id = $matches[1] ?? null;
                if ($id) {
                    error_log("Extracted ID: " . $id);
                }

                [$controllerClass, $method] = $handler;
                $controller = new $controllerClass();

                if ($id) {
                    $controller->$method($id);
                } else {
                    $controller->$method();
                }

                return;
            }
        }

//        if (isset($this->routes[$routeKey])) {
//            list($controllerClass, $method) = $this->routes[$routeKey];
//
//            $controller = new $controllerClass();
//            $controller->$method();
//        } else {
//            header("HTTP/1.0 404 Not Found");
//            echo "404 Not Found";  //done
//        }
    }
}