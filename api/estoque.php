<?php
// estoque.php - API CRUD para Controle de Estoque
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? intval($_GET['id']) : null;
$db = getDB();

switch ($method) {

    // ========== LISTAR TODOS ==========
    case 'GET':
        $stmt = $db->query('SELECT id, nome, quantidade, quantidade_minima, categoria FROM estoque ORDER BY nome ASC');
        jsonResponse($stmt->fetchAll());
        break;

    // ========== CADASTRAR NOVO ==========
    case 'POST':
        $body = getJsonBody();
        $nome = trim($body['nome'] ?? '');
        $quantidade = isset($body['quantidade']) ? intval($body['quantidade']) : 0;
        $quantidade_minima = isset($body['quantidade_minima']) ? intval($body['quantidade_minima']) : 2;
        $categoria = trim($body['categoria'] ?? '');

        if (empty($nome)) {
            jsonResponse(['error' => 'O nome do item é obrigatório.'], 400);
        }

        // Verificar se já existe
        $check = $db->prepare('SELECT id FROM estoque WHERE nome = ?');
        $check->execute([$nome]);
        if ($check->fetch()) {
            jsonResponse(['error' => 'Já existe um item com este nome no estoque.'], 400);
        }

        $stmt = $db->prepare('INSERT INTO estoque (nome, quantidade, quantidade_minima, categoria) VALUES (?, ?, ?, ?)');
        $stmt->execute([$nome, $quantidade, $quantidade_minima, $categoria]);
        $newId = $db->lastInsertId();

        jsonResponse(['id' => (int)$newId, 'nome' => $nome, 'quantidade' => $quantidade, 'quantidade_minima' => $quantidade_minima, 'categoria' => $categoria], 201);
        break;

    // ========== EDITAR EXISTENTE ==========
    case 'PUT':
        if (!$id) {
            jsonResponse(['error' => 'ID do item não informado.'], 400);
        }

        $body = getJsonBody();
        $nome = trim($body['nome'] ?? '');
        $quantidade = isset($body['quantidade']) ? intval($body['quantidade']) : 0;
        $quantidade_minima = isset($body['quantidade_minima']) ? intval($body['quantidade_minima']) : 2;
        $categoria = trim($body['categoria'] ?? '');

        if (empty($nome)) {
            jsonResponse(['error' => 'O nome do item é obrigatório.'], 400);
        }

        // Verificar se existe outro com o mesmo nome
        $check = $db->prepare('SELECT id FROM estoque WHERE nome = ? AND id != ?');
        $check->execute([$nome, $id]);
        if ($check->fetch()) {
            jsonResponse(['error' => 'Já existe um item com este nome no estoque.'], 400);
        }

        $stmt = $db->prepare('UPDATE estoque SET nome = ?, quantidade = ?, quantidade_minima = ?, categoria = ? WHERE id = ?');
        $stmt->execute([$nome, $quantidade, $quantidade_minima, $categoria, $id]);

        if ($stmt->rowCount() === 0) {
            jsonResponse(['error' => 'Item não encontrado.'], 404);
        }

        jsonResponse(['id' => $id, 'nome' => $nome, 'quantidade' => $quantidade, 'quantidade_minima' => $quantidade_minima, 'categoria' => $categoria]);
        break;

    // ========== EXCLUIR ==========
    case 'DELETE':
        if (!$id) {
            jsonResponse(['error' => 'ID do item não informado.'], 400);
        }

        $stmt = $db->prepare('DELETE FROM estoque WHERE id = ?');
        $stmt->execute([$id]);

        if ($stmt->rowCount() === 0) {
            jsonResponse(['error' => 'Item não encontrado.'], 404);
        }

        jsonResponse(['success' => true, 'message' => 'Item excluído do estoque.']);
        break;

    default:
        jsonResponse(['error' => 'Método não suportado.'], 405);
}
