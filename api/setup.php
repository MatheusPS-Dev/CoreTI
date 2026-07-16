<?php
// setup.php - Script de Configuração Inicial do Banco de Dados
// =============================================================
// Acesse este arquivo UMA VEZ pelo navegador para criar as tabelas
// e popular com dados de demonstração.
// URL: https://klenus.com.br/api/setup.php
// =============================================================

require_once __DIR__ . '/config.php';

// Desabilitar cache
header('Cache-Control: no-cache, no-store, must-revalidate');

$db = getDB();
$messages = [];
$hasError = false;

try {
    // ========== PASSO 1: Criar Tabelas ==========
    
    $db->exec('
        CREATE TABLE IF NOT EXISTS departamentos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(255) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ');
    $messages[] = '✅ Tabela "departamentos" criada com sucesso.';

    $db->exec('
        CREATE TABLE IF NOT EXISTS impressoras (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome_modelo VARCHAR(255) NOT NULL,
            tag_ativo VARCHAR(100) DEFAULT \'\',
            ip VARCHAR(45) DEFAULT \'\',
            modelo_toner VARCHAR(255) NOT NULL,
            id_departamento INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (id_departamento) REFERENCES departamentos(id) ON DELETE RESTRICT
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ');
    $messages[] = '✅ Tabela "impressoras" criada com sucesso.';

    $db->exec('
        CREATE TABLE IF NOT EXISTS trocas (
            id INT AUTO_INCREMENT PRIMARY KEY,
            id_impressora INT NOT NULL,
            data DATE NOT NULL,
            horario VARCHAR(10) NOT NULL,
            responsavel VARCHAR(255) NOT NULL,
            observacoes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (id_impressora) REFERENCES impressoras(id) ON DELETE RESTRICT
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ');
    $messages[] = '✅ Tabela "trocas" criada com sucesso.';

    $db->exec('
        CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            usuario VARCHAR(100) NOT NULL UNIQUE,
            senha VARCHAR(255) NOT NULL,
            nome VARCHAR(100) NOT NULL,
            nivel VARCHAR(20) NOT NULL DEFAULT \'user\',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ');
    $messages[] = '✅ Tabela "usuarios" criada com sucesso.';

    $db->exec('
        CREATE TABLE IF NOT EXISTS estoque (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(255) NOT NULL UNIQUE,
            quantidade INT NOT NULL DEFAULT 0,
            quantidade_minima INT NOT NULL DEFAULT 2,
            categoria VARCHAR(100) DEFAULT \'\',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ');
    $messages[] = '✅ Tabela "estoque" criada com sucesso.';

    // Inserir usuário Admin padrão se não existir nenhum
    $countUsers = (int)$db->query('SELECT COUNT(*) FROM usuarios')->fetchColumn();
    if ($countUsers === 0) {
        $stmtUser = $db->prepare('INSERT INTO usuarios (usuario, senha, nome, nivel) VALUES (?, ?, ?, ?)');
        $adminPassword = password_hash('admin123', PASSWORD_BCRYPT);
        $stmtUser->execute(['admin', $adminPassword, 'Administrador CoreTI', 'admin']);
        $messages[] = '✅ Usuário administrador padrão criado (admin / admin123).';
    }

    // ========== PASSO 2: Popular com Dados de Demonstração ==========
    
    $countDepts = (int)$db->query('SELECT COUNT(*) FROM departamentos')->fetchColumn();
    
    if ($countDepts === 0) {
        // Inserir departamentos
        $db->exec("
            INSERT INTO departamentos (nome) VALUES
            ('Estoque'),
            ('Vendas'),
            ('Conferência de Produtos'),
            ('Caixa'),
            ('Compras'),
            ('Marketing'),
            ('RH')
        ");
        $messages[] = '✅ Departamentos de demonstração inseridos.';

        // Buscar IDs dos departamentos
        $depts = $db->query('SELECT id, nome FROM departamentos')->fetchAll();
        $deptMap = [];
        foreach ($depts as $d) {
            $deptMap[$d['nome']] = $d['id'];
        }

        // Inserir impressoras
        $stmt = $db->prepare('INSERT INTO impressoras (nome_modelo, tag_ativo, ip, modelo_toner, id_departamento) VALUES (?, ?, ?, ?, ?)');
        
        $printers = [
            ['HP LaserJet M404dw', 'PAT-00892', '192.168.1.150', 'CF258X (58X)', $deptMap['Vendas']],
            ['Brother HL-L2370DW', 'PAT-00910', '192.168.1.151', 'TN760', $deptMap['Estoque']],
            ['Lexmark MX317dn', 'PAT-00765', '192.168.1.152', '51B4000', $deptMap['Conferência de Produtos']],
            ['Samsung M2020W', 'PAT-00654', '192.168.1.153', 'MLT-D111S', $deptMap['Marketing']],
            ['Kyocera ECOSYS M2040dn', 'PAT-01004', '192.168.1.154', 'TK-1175', $deptMap['Compras']]
        ];

        foreach ($printers as $p) {
            $stmt->execute($p);
        }
        $messages[] = '✅ Impressoras de demonstração inseridas.';

        // Buscar IDs das impressoras
        $printerRows = $db->query('SELECT id, nome_modelo FROM impressoras')->fetchAll();
        $printerMap = [];
        foreach ($printerRows as $p) {
            $printerMap[$p['nome_modelo']] = $p['id'];
        }

        // Inserir trocas de demonstração
        $stmtExchange = $db->prepare('INSERT INTO trocas (id_impressora, data, horario, responsavel, observacoes) VALUES (?, ?, ?, ?, ?)');
        
        $exchanges = [
            [$printerMap['HP LaserJet M404dw'], '2026-07-01', '09:30', 'Bruno Silva (TI)', 'Toner estava fraco. Trocado por novo original.'],
            [$printerMap['Brother HL-L2370DW'], '2026-07-02', '14:15', 'Lucas Costa (TI)', 'Substituição preventiva solicitada pela logística.'],
            [$printerMap['Lexmark MX317dn'], '2026-07-04', '10:00', 'Ana Souza (TI)', 'Limpeza de rolo fusor efetuada junto à troca.'],
            [$printerMap['HP LaserJet M404dw'], '2026-07-05', '11:45', 'Bruno Silva (TI)', 'Troca rápida.'],
            [$printerMap['Samsung M2020W'], '2026-07-05', '16:30', 'Ana Souza (TI)', '']
        ];

        foreach ($exchanges as $e) {
            $stmtExchange->execute($e);
        }
        $messages[] = '✅ Histórico de trocas de demonstração inserido.';

        // Inserir estoque de demonstração
        $db->exec("
            INSERT INTO estoque (nome, quantidade, quantidade_minima, categoria) VALUES
            ('Toner CF258X (58X)', 5, 2, 'Toner'),
            ('Toner TN760', 1, 2, 'Toner'),
            ('Papel A4 (Resma)', 10, 5, 'Papel'),
            ('Toner 51B4000', 0, 3, 'Toner'),
            ('Toner MLT-D111S', 8, 2, 'Toner'),
            ('Toner TK-1175', 3, 2, 'Toner')
        ");
        $messages[] = '✅ Estoque de demonstração inserido.';

    } else {
        $messages[] = 'ℹ️ O banco já contém dados. Seed de demonstração pulado.';
    }

    $messages[] = '';
    $messages[] = '🎉 CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!';
    $messages[] = 'O sistema CoreTI está pronto para uso.';
    $messages[] = '';
    $messages[] = '⚠️ IMPORTANTE: Após confirmar que tudo funciona, bloqueie o acesso a este arquivo.';
    $messages[] = 'Edite o arquivo api/.htaccess e descomente as linhas que bloqueiam setup.php.';

} catch (Exception $e) {
    $hasError = true;
    $messages[] = '❌ ERRO: ' . $e->getMessage();
    $messages[] = '';
    $messages[] = 'Verifique as credenciais no arquivo api/config.php';
}

// Exibir resultado como página HTML simples
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CoreTI - Setup do Banco de Dados</title>
    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            background: #0a0f1d;
            color: #f8fafc;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
        }
        .container {
            background: #121829;
            border: 1px solid rgba(56, 189, 248, 0.15);
            border-radius: 16px;
            padding: 40px;
            max-width: 600px;
            width: 90%;
            box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        }
        h1 {
            color: #0ea5e9;
            margin-bottom: 24px;
            font-size: 1.5rem;
        }
        .message {
            padding: 8px 0;
            font-size: 0.95rem;
            line-height: 1.6;
            border-bottom: 1px solid rgba(56, 189, 248, 0.08);
        }
        .message:last-child { border-bottom: none; }
        .error { color: #f43f5e; }
        .success { color: #10b981; }
        .back-link {
            display: inline-block;
            margin-top: 24px;
            color: #0ea5e9;
            text-decoration: none;
            padding: 10px 20px;
            border: 1px solid rgba(14, 165, 233, 0.3);
            border-radius: 12px;
            transition: all 0.3s;
        }
        .back-link:hover {
            background: rgba(14, 165, 233, 0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔧 CoreTI — Setup do Banco de Dados</h1>
        <?php foreach ($messages as $msg): ?>
            <div class="message <?php echo $hasError ? 'error' : 'success'; ?>">
                <?php echo htmlspecialchars($msg); ?>
            </div>
        <?php endforeach; ?>
        <a href="/" class="back-link">← Voltar para o CoreTI</a>
    </div>
</body>
</html>
