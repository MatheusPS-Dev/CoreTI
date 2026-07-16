<?php
// trocas.php - API CRUD para Histórico de Trocas de Toner
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? intval($_GET['id']) : null;
$db = getDB();

switch ($method) {

    // ========== LISTAR TODAS ==========
    case 'GET':
        $stmt = $db->query('SELECT id, id_impressora, data, horario, responsavel, observacoes FROM trocas ORDER BY data DESC, horario DESC');
        $rows = $stmt->fetchAll();
        foreach ($rows as &$row) {
            $row['id'] = (int)$row['id'];
            $row['id_impressora'] = (int)$row['id_impressora'];
        }
        jsonResponse($rows);
        break;

    // ========== REGISTRAR NOVA TROCA ==========
    case 'POST':
        $body = getJsonBody();
        $id_impressora = intval($body['id_impressora'] ?? 0);
        $data = trim($body['data'] ?? '');
        $horario = trim($body['horario'] ?? '');
        $responsavel = trim($body['responsavel'] ?? '');
        $observacoes = trim($body['observacoes'] ?? '');

        if ($id_impressora === 0 || empty($data) || empty($horario) || empty($responsavel)) {
            jsonResponse(['error' => 'Impressora, Data, Horário e Responsável são obrigatórios.'], 400);
        }

        // Buscar o modelo de toner associado à impressora para dar baixa automática no estoque
        $printerStmt = $db->prepare('SELECT modelo_toner FROM impressoras WHERE id = ?');
        $printerStmt->execute([$id_impressora]);
        $printer = $printerStmt->fetch();

        $stmt = $db->prepare('INSERT INTO trocas (id_impressora, data, horario, responsavel, observacoes) VALUES (?, ?, ?, ?, ?)');
        $stmt->execute([$id_impressora, $data, $horario, $responsavel, $observacoes]);
        $newId = (int)$db->lastInsertId();

        if ($printer) {
            $modelo_toner = trim($printer['modelo_toner']);
            if (!empty($modelo_toner)) {
                // Tenta achar o item do estoque correspondente (busca exata ou aproximada)
                $estoqueStmt = $db->prepare('
                    SELECT id, quantidade 
                    FROM estoque 
                    WHERE nome = ? OR nome LIKE ? OR ? LIKE CONCAT("%", nome, "%") 
                    LIMIT 1
                ');
                $estoqueStmt->execute([$modelo_toner, '%' . $modelo_toner . '%', $modelo_toner]);
                $estoqueItem = $estoqueStmt->fetch();

                if ($estoqueItem) {
                    $newQty = max(0, intval($estoqueItem['quantidade']) - 1);
                    $updateEstoque = $db->prepare('UPDATE estoque SET quantidade = ? WHERE id = ?');
                    $updateEstoque->execute([$newQty, $estoqueItem['id']]);
                }
            }
        }

        jsonResponse([
            'id' => $newId,
            'id_impressora' => $id_impressora,
            'data' => $data,
            'horario' => $horario,
            'responsavel' => $responsavel,
            'observacoes' => $observacoes
        ], 201);
        break;

    // ========== EXCLUIR REGISTRO ==========
    case 'DELETE':
        if (!$id) {
            jsonResponse(['error' => 'ID do registro de troca não informado.'], 400);
        }

        $stmt = $db->prepare('DELETE FROM trocas WHERE id = ?');
        $stmt->execute([$id]);

        if ($stmt->rowCount() === 0) {
            jsonResponse(['error' => 'Registro de troca não encontrado.'], 404);
        }

        jsonResponse(['success' => true, 'message' => 'Registro de troca excluído.']);
        break;

    default:
        jsonResponse(['error' => 'Método não suportado.'], 405);
}
