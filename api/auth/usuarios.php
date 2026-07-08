<?php
// usuarios.php - Endpoint de gerenciamento de usuários do CoreTI
require_once __DIR__ . '/../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

// Obter nível do usuário logado (passado via header customizado)
$headers = getallheaders();
$userLevel = isset($headers['X-User-Level']) ? trim($headers['X-User-Level']) : '';
$requestingUser = isset($headers['X-User-Login']) ? trim($headers['X-User-Login']) : '';

// Validar se é administrador
if ($userLevel !== 'admin') {
    jsonResponse(['error' => 'Acesso negado. Apenas administradores podem acessar esta função.'], 403);
}

try {
    switch ($method) {
        case 'GET':
            // Listar todos os usuários (exceto senha)
            $stmt = $db->query('SELECT id, usuario, nome, nivel, created_at FROM usuarios ORDER BY nome ASC');
            $users = $stmt->fetchAll();
            
            // Garantir que tipos de ID sejam inteiros
            foreach ($users as &$u) {
                $u['id'] = (int)$u['id'];
            }
            
            jsonResponse($users);
            break;

        case 'POST':
            // Cadastrar um novo usuário
            $body = getJsonBody();
            $usuario = isset($body['usuario']) ? trim($body['usuario']) : '';
            $senha = isset($body['senha']) ? $body['senha'] : '';
            $nome = isset($body['nome']) ? trim($body['nome']) : '';
            $nivel = isset($body['nivel']) ? trim($body['nivel']) : 'user';

            if (empty($usuario) || empty($senha) || empty($nome)) {
                jsonResponse(['error' => 'Nome, Usuário e Senha são campos obrigatórios.'], 400);
            }

            if (!in_array($nivel, ['admin', 'user'])) {
                jsonResponse(['error' => 'Nível de permissão inválido.'], 400);
            }

            // Verificar se o usuário já existe
            $stmtCheck = $db->prepare('SELECT COUNT(*) FROM usuarios WHERE usuario = ?');
            $stmtCheck->execute([$usuario]);
            if ((int)$stmtCheck->fetchColumn() > 0) {
                jsonResponse(['error' => 'Este nome de usuário já está sendo utilizado.'], 400);
            }

            // Cadastrar
            $senhaHash = password_hash($senha, PASSWORD_BCRYPT);
            $stmtInsert = $db->prepare('INSERT INTO usuarios (usuario, senha, nome, nivel) VALUES (?, ?, ?, ?)');
            $stmtInsert->execute([$usuario, $senhaHash, $nome, $nivel]);

            jsonResponse(['success' => true, 'id' => (int)$db->lastInsertId()]);
            break;

        case 'DELETE':
            // Remover um usuário
            if (!isset($_GET['id'])) {
                jsonResponse(['error' => 'ID do usuário não fornecido.'], 400);
            }

            $userId = (int)$_GET['id'];

            // Impedir que o admin se exclua
            $stmtCheckAdmin = $db->prepare('SELECT usuario FROM usuarios WHERE id = ?');
            $stmtCheckAdmin->execute([$userId]);
            $userToDelete = $stmtCheckAdmin->fetchColumn();

            if ($userToDelete === $requestingUser) {
                jsonResponse(['error' => 'Você não pode excluir a sua própria conta de administrador.'], 400);
            }

            $stmtDelete = $db->prepare('DELETE FROM usuarios WHERE id = ?');
            $stmtDelete->execute([$userId]);

            jsonResponse(['success' => true]);
            break;

        default:
            jsonResponse(['error' => 'Método não permitido.'], 405);
            break;
    }
} catch (Exception $e) {
    jsonResponse(['error' => 'Erro ao processar usuários: ' . $e->getMessage()], 500);
}
