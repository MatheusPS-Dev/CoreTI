<?php
// login.php - Endpoint de autenticação para o CoreTI
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Método de requisição inválido.'], 405);
}

$body = getJsonBody();
$usuario = isset($body['usuario']) ? trim($body['usuario']) : '';
$senha = isset($body['senha']) ? $body['senha'] : '';

if (empty($usuario) || empty($senha)) {
    jsonResponse(['error' => 'Por favor, informe o usuário e a senha.'], 400);
}

try {
    $db = getDB();
    $stmt = $db->prepare('SELECT id, usuario, senha, nome, nivel FROM usuarios WHERE usuario = ?');
    $stmt->execute([$usuario]);
    $user = $stmt->fetch();

    if ($user && password_verify($senha, $user['senha'])) {
        // Sucesso no login
        jsonResponse([
            'success' => true,
            'user' => [
                'id' => (int)$user['id'],
                'usuario' => $user['usuario'],
                'nome' => $user['nome'],
                'nivel' => $user['nivel']
            ]
        ]);
    } else {
        // Falha na autenticação
        jsonResponse(['error' => 'Usuário ou senha incorretos.'], 401);
    }

} catch (Exception $e) {
    jsonResponse(['error' => 'Erro ao realizar login: ' . $e->getMessage()], 500);
}
