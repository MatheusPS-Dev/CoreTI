<?php
// stats.php - Endpoint de métricas e estatísticas para o Dashboard
require_once __DIR__ . '/../config.php';

$db = getDB();

try {
    // 1. Contadores gerais
    $totalExchanges = (int)$db->query('SELECT COUNT(*) FROM trocas')->fetchColumn();
    $totalPrinters = (int)$db->query('SELECT COUNT(*) FROM impressoras')->fetchColumn();
    $totalDepartments = (int)$db->query('SELECT COUNT(*) FROM departamentos')->fetchColumn();

    // 2. Trocas por departamento
    $stmt = $db->query('
        SELECT d.nome AS name, COUNT(t.id) AS count
        FROM departamentos d
        LEFT JOIN impressoras i ON i.id_departamento = d.id
        LEFT JOIN trocas t ON t.id_impressora = i.id
        GROUP BY d.id, d.nome
        ORDER BY count DESC
    ');
    $exchangesByDept = $stmt->fetchAll();
    // Converter count para inteiro
    foreach ($exchangesByDept as &$item) {
        $item['count'] = (int)$item['count'];
    }

    // 3. Trocas por impressora (Top 5 — impressoras críticas)
    $stmt = $db->query('
        SELECT i.nome_modelo AS name, COUNT(t.id) AS count
        FROM impressoras i
        INNER JOIN trocas t ON t.id_impressora = i.id
        GROUP BY i.id, i.nome_modelo
        ORDER BY count DESC
        LIMIT 5
    ');
    $exchangesByPrinter = $stmt->fetchAll();
    foreach ($exchangesByPrinter as &$item) {
        $item['count'] = (int)$item['count'];
    }

    // 4. Últimas 5 trocas com nome da impressora e departamento
    $stmt = $db->query('
        SELECT 
            t.id,
            t.data,
            t.horario,
            t.responsavel,
            t.observacoes,
            COALESCE(i.nome_modelo, \'Impressora Removida\') AS impressora_modelo,
            COALESCE(d.nome, \'Desconhecido\') AS departamento_nome
        FROM trocas t
        LEFT JOIN impressoras i ON t.id_impressora = i.id
        LEFT JOIN departamentos d ON i.id_departamento = d.id
        ORDER BY t.data DESC, t.horario DESC
        LIMIT 5
    ');
    $recentExchanges = $stmt->fetchAll();
    foreach ($recentExchanges as &$item) {
        $item['id'] = (int)$item['id'];
    }

    // 5. Retornar todas as métricas
    jsonResponse([
        'totalExchanges'    => $totalExchanges,
        'totalPrinters'     => $totalPrinters,
        'totalDepartments'  => $totalDepartments,
        'exchangesByDept'   => $exchangesByDept,
        'exchangesByPrinter'=> $exchangesByPrinter,
        'recentExchanges'   => $recentExchanges
    ]);

} catch (Exception $e) {
    jsonResponse(['error' => 'Erro ao gerar métricas do painel: ' . $e->getMessage()], 500);
}
