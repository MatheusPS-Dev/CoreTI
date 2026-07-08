<?php
// impressoras.php - API CRUD para Impressoras
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? intval($_GET['id']) : null;
$db = getDB();

switch ($method) {

    // ========== LISTAR TODAS ==========
    case 'GET':
        $stmt = $db->query('SELECT id, nome_modelo, tag_ativo, ip, modelo_toner, id_departamento FROM impressoras ORDER BY id DESC');
        $rows = $stmt->fetchAll();
        // Garantir que id_departamento seja inteiro para compatibilidade com o frontend
        foreach ($rows as &$row) {
            $row['id'] = (int)$row['id'];
            $row['id_departamento'] = (int)$row['id_departamento'];
        }
        jsonResponse($rows);
        break;

    // ========== CADASTRAR NOVA ==========
    case 'POST':
        $body = getJsonBody();
        $nome_modelo = trim($body['nome_modelo'] ?? '');
        $tag_ativo = trim($body['tag_ativo'] ?? '');
        $ip = trim($body['ip'] ?? '');
        $modelo_toner = trim($body['modelo_toner'] ?? '');
        $id_departamento = intval($body['id_departamento'] ?? 0);

        if (empty($nome_modelo) || empty($modelo_toner) || $id_departamento === 0) {
            jsonResponse(['error' => 'Modelo, Modelo do Toner e Departamento são obrigatórios.'], 400);
        }

        $stmt = $db->prepare('INSERT INTO impressoras (nome_modelo, tag_ativo, ip, modelo_toner, id_departamento) VALUES (?, ?, ?, ?, ?)');
        $stmt->execute([$nome_modelo, $tag_ativo, $ip, $modelo_toner, $id_departamento]);
        $newId = (int)$db->lastInsertId();

        jsonResponse([
            'id' => $newId,
            'nome_modelo' => $nome_modelo,
            'tag_ativo' => $tag_ativo,
            'ip' => $ip,
            'modelo_toner' => $modelo_toner,
            'id_departamento' => $id_departamento
        ], 201);
        break;

    // ========== EDITAR EXISTENTE ==========
    case 'PUT':
        if (!$id) {
            jsonResponse(['error' => 'ID da impressora não informado.'], 400);
        }

        $body = getJsonBody();
        $nome_modelo = trim($body['nome_modelo'] ?? '');
        $tag_ativo = trim($body['tag_ativo'] ?? '');
        $ip = trim($body['ip'] ?? '');
        $modelo_toner = trim($body['modelo_toner'] ?? '');
        $id_departamento = intval($body['id_departamento'] ?? 0);

        if (empty($nome_modelo) || empty($modelo_toner) || $id_departamento === 0) {
            jsonResponse(['error' => 'Modelo, Modelo do Toner e Departamento são obrigatórios.'], 400);
        }

        $stmt = $db->prepare('UPDATE impressoras SET nome_modelo = ?, tag_ativo = ?, ip = ?, modelo_toner = ?, id_departamento = ? WHERE id = ?');
        $stmt->execute([$nome_modelo, $tag_ativo, $ip, $modelo_toner, $id_departamento, $id]);

        if ($stmt->rowCount() === 0) {
            jsonResponse(['error' => 'Impressora não encontrada.'], 404);
        }

        jsonResponse([
            'id' => $id,
            'nome_modelo' => $nome_modelo,
            'tag_ativo' => $tag_ativo,
            'ip' => $ip,
            'modelo_toner' => $modelo_toner,
            'id_departamento' => $id_departamento
        ]);
        break;

    // ========== EXCLUIR ==========
    case 'DELETE':
        if (!$id) {
            jsonResponse(['error' => 'ID da impressora não informado.'], 400);
        }

        // Verificar se há trocas vinculadas
        $check = $db->prepare('SELECT COUNT(*) as total FROM trocas WHERE id_impressora = ?');
        $check->execute([$id]);
        $result = $check->fetch();
        if ($result['total'] > 0) {
            jsonResponse(['error' => 'Não é possível excluir esta impressora pois há histórico de trocas associado a ela.'], 400);
        }

        $stmt = $db->prepare('DELETE FROM impressoras WHERE id = ?');
        $stmt->execute([$id]);

        if ($stmt->rowCount() === 0) {
            jsonResponse(['error' => 'Impressora não encontrada.'], 404);
        }

        jsonResponse(['success' => true, 'message' => 'Impressora excluída.']);
        break;

    default:
        jsonResponse(['error' => 'Método não suportado.'], 405);
}
