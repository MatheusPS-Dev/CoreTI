<?php
// anydesk.php - API CRUD para Computadores AnyDesk
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? intval($_GET['id']) : null;
$db = getDB();

switch ($method) {

    // ========== LISTAR TODOS ==========
    case 'GET':
        $stmt = $db->query('SELECT id, nome_usuario, ip_pc, mac_address, porta_patchpanel, anydesk_codigo FROM anydesk_pcs ORDER BY nome_usuario ASC');
        jsonResponse($stmt->fetchAll());
        break;

    // ========== CADASTRAR NOVO ==========
    case 'POST':
        $body = getJsonBody();
        $nome_usuario = trim($body['nome_usuario'] ?? '');
        $ip_pc = trim($body['ip_pc'] ?? '');
        $mac_address = trim($body['mac_address'] ?? '');
        $porta_patchpanel = trim($body['porta_patchpanel'] ?? '');
        $anydesk_codigo = trim($body['anydesk_codigo'] ?? '');

        if (empty($nome_usuario) || empty($ip_pc) || empty($anydesk_codigo)) {
            jsonResponse(['error' => 'Nome do usuário, IP e código AnyDesk são obrigatórios.'], 400);
        }

        // Verificar se já existe um PC com o mesmo código AnyDesk
        $check = $db->prepare('SELECT id FROM anydesk_pcs WHERE anydesk_codigo = ?');
        $check->execute([$anydesk_codigo]);
        if ($check->fetch()) {
            jsonResponse(['error' => 'Já existe um computador cadastrado com este código AnyDesk.'], 400);
        }

        $stmt = $db->prepare('INSERT INTO anydesk_pcs (nome_usuario, ip_pc, mac_address, porta_patchpanel, anydesk_codigo) VALUES (?, ?, ?, ?, ?)');
        $stmt->execute([$nome_usuario, $ip_pc, $mac_address, $porta_patchpanel, $anydesk_codigo]);
        $newId = $db->lastInsertId();

        jsonResponse([
            'id' => (int)$newId,
            'nome_usuario' => $nome_usuario,
            'ip_pc' => $ip_pc,
            'mac_address' => $mac_address,
            'porta_patchpanel' => $porta_patchpanel,
            'anydesk_codigo' => $anydesk_codigo
        ], 201);
        break;

    // ========== EDITAR EXISTENTE ==========
    case 'PUT':
        if (!$id) {
            jsonResponse(['error' => 'ID do computador não informado.'], 400);
        }

        $body = getJsonBody();
        $nome_usuario = trim($body['nome_usuario'] ?? '');
        $ip_pc = trim($body['ip_pc'] ?? '');
        $mac_address = trim($body['mac_address'] ?? '');
        $porta_patchpanel = trim($body['porta_patchpanel'] ?? '');
        $anydesk_codigo = trim($body['anydesk_codigo'] ?? '');

        if (empty($nome_usuario) || empty($ip_pc) || empty($anydesk_codigo)) {
            jsonResponse(['error' => 'Nome do usuário, IP e código AnyDesk são obrigatórios.'], 400);
        }

        // Verificar se existe outro com o mesmo código AnyDesk
        $check = $db->prepare('SELECT id FROM anydesk_pcs WHERE anydesk_codigo = ? AND id != ?');
        $check->execute([$anydesk_codigo, $id]);
        if ($check->fetch()) {
            jsonResponse(['error' => 'Já existe outro computador com este código AnyDesk.'], 400);
        }

        $stmt = $db->prepare('UPDATE anydesk_pcs SET nome_usuario = ?, ip_pc = ?, mac_address = ?, porta_patchpanel = ?, anydesk_codigo = ? WHERE id = ?');
        $stmt->execute([$nome_usuario, $ip_pc, $mac_address, $porta_patchpanel, $anydesk_codigo, $id]);

        if ($stmt->rowCount() === 0) {
            jsonResponse(['error' => 'Computador não encontrado.'], 404);
        }

        jsonResponse([
            'id' => $id,
            'nome_usuario' => $nome_usuario,
            'ip_pc' => $ip_pc,
            'mac_address' => $mac_address,
            'porta_patchpanel' => $porta_patchpanel,
            'anydesk_codigo' => $anydesk_codigo
        ]);
        break;

    // ========== EXCLUIR ==========
    case 'DELETE':
        if (!$id) {
            jsonResponse(['error' => 'ID do computador não informado.'], 400);
        }

        $stmt = $db->prepare('DELETE FROM anydesk_pcs WHERE id = ?');
        $stmt->execute([$id]);

        if ($stmt->rowCount() === 0) {
            jsonResponse(['error' => 'Computador não encontrado.'], 404);
        }

        jsonResponse(['success' => true, 'message' => 'Computador removido.']);
        break;

    default:
        jsonResponse(['error' => 'Método não suportado.'], 405);
}
