<?php
// departamentos.php - API CRUD para Departamentos
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? intval($_GET['id']) : null;
$db = getDB();

switch ($method) {

    // ========== LISTAR TODOS ==========
    case 'GET':
        $stmt = $db->query('SELECT id, nome FROM departamentos ORDER BY nome ASC');
        jsonResponse($stmt->fetchAll());
        break;

    // ========== CADASTRAR NOVO ==========
    case 'POST':
        $body = getJsonBody();
        $nome = trim($body['nome'] ?? '');

        if (empty($nome)) {
            jsonResponse(['error' => 'O nome do departamento é obrigatório.'], 400);
        }

        // Verificar se já existe
        $check = $db->prepare('SELECT id FROM departamentos WHERE nome = ?');
        $check->execute([$nome]);
        if ($check->fetch()) {
            jsonResponse(['error' => 'Já existe um departamento com este nome.'], 400);
        }

        $stmt = $db->prepare('INSERT INTO departamentos (nome) VALUES (?)');
        $stmt->execute([$nome]);
        $newId = $db->lastInsertId();

        jsonResponse(['id' => (int)$newId, 'nome' => $nome], 201);
        break;

    // ========== EDITAR EXISTENTE ==========
    case 'PUT':
        if (!$id) {
            jsonResponse(['error' => 'ID do departamento não informado.'], 400);
        }

        $body = getJsonBody();
        $nome = trim($body['nome'] ?? '');

        if (empty($nome)) {
            jsonResponse(['error' => 'O nome do departamento é obrigatório.'], 400);
        }

        // Verificar se existe outro com o mesmo nome
        $check = $db->prepare('SELECT id FROM departamentos WHERE nome = ? AND id != ?');
        $check->execute([$nome, $id]);
        if ($check->fetch()) {
            jsonResponse(['error' => 'Já existe um departamento com este nome.'], 400);
        }

        $stmt = $db->prepare('UPDATE departamentos SET nome = ? WHERE id = ?');
        $stmt->execute([$nome, $id]);

        if ($stmt->rowCount() === 0) {
            jsonResponse(['error' => 'Departamento não encontrado.'], 404);
        }

        jsonResponse(['id' => $id, 'nome' => $nome]);
        break;

    // ========== EXCLUIR ==========
    case 'DELETE':
        if (!$id) {
            jsonResponse(['error' => 'ID do departamento não informado.'], 400);
        }

        // Verificar se existem impressoras vinculadas
        $check = $db->prepare('SELECT COUNT(*) as total FROM impressoras WHERE id_departamento = ?');
        $check->execute([$id]);
        $result = $check->fetch();
        if ($result['total'] > 0) {
            jsonResponse(['error' => 'Não é possível excluir este departamento pois existem impressoras vinculadas a ele.'], 400);
        }

        $stmt = $db->prepare('DELETE FROM departamentos WHERE id = ?');
        $stmt->execute([$id]);

        if ($stmt->rowCount() === 0) {
            jsonResponse(['error' => 'Departamento não encontrado.'], 404);
        }

        jsonResponse(['success' => true, 'message' => 'Departamento excluído.']);
        break;

    default:
        jsonResponse(['error' => 'Método não suportado.'], 405);
}
