<?php
// config.php - Configuração de Conexão com o Banco de Dados MySQL
// ================================================================

// Capturar erros PHP e retornar como JSON (evitar resposta vazia)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Handler global de erros: converte erros PHP em exceções
set_error_handler(function($severity, $message, $file, $line) {
    throw new ErrorException($message, 0, $severity, $file, $line);
});

// Handler global de exceções: retorna JSON em vez de HTML/vazio
set_exception_handler(function($e) {
    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
    }
    echo json_encode(['error' => 'Erro interno do servidor: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
    exit;
});

// Função para carregar variáveis de ambiente de um arquivo .env
function loadEnv($path) {
    if (!file_exists($path)) {
        return;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        // Ignorar comentários ou linhas sem definição
        if (empty($line) || strpos($line, '#') === 0 || strpos($line, '=') === false) {
            continue;
        }

        list($key, $value) = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);

        // Remover aspas se houver
        if (preg_match('/^["\'\`](.*)["\'\`]$/', $value, $matches)) {
            $value = $matches[1];
        }

        if (getenv($key) === false) {
            putenv("{$key}={$value}");
        }
        if (!isset($_ENV[$key])) {
            $_ENV[$key] = $value;
        }
        if (!isset($_SERVER[$key])) {
            $_SERVER[$key] = $value;
        }
    }
}

// Carregar variáveis de ambiente do arquivo .env (localizado na raiz do projeto)
loadEnv(__DIR__ . '/../.env');

// Credenciais do Banco de Dados MySQL
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: '');
define('DB_USER', getenv('DB_USER') ?: '');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_CHARSET', getenv('DB_CHARSET') ?: 'utf8mb4');

// Headers padrão para todas as respostas da API
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

// Responder imediatamente a requisições OPTIONS (preflight CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Função para conectar ao banco de dados usando PDO
function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE  => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES    => false,
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao conectar ao banco de dados: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }
    return $pdo;
}

// Função para ler o corpo JSON da requisição (com fallback)
function getJsonBody() {
    $raw = file_get_contents('php://input');
    
    if (empty($raw)) {
        // Fallback: tentar ler de $_POST caso php://input esteja vazio
        if (!empty($_POST)) {
            return $_POST;
        }
        return [];
    }
    
    $data = json_decode($raw, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        return [];
    }
    
    return $data ?: [];
}

// Função para enviar resposta JSON com código HTTP
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
