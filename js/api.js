// api.js - Camada de Dados (Dual-Mode: LocalStorage / API PHP+MySQL)
// ==================================================================

// Detecta automaticamente o modo de operação:
// - Via http/https (hospedagem remota): usa API PHP conectada ao MySQL
// - Via localhost ou file:// (local): usa LocalStorage do navegador como fallback
// Nota: para testar a API PHP/MySQL no localhost, acesse a URL com o parâmetro '?api=true' (ex: http://localhost:8000/?api=true)
const isLocalhost = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1');
const forceAPI = window.location.search.includes('api=true');
const USE_API = window.location.protocol.startsWith('http') && (!isLocalhost || forceAPI);

// Calcula dinamicamente o caminho da API base
let basePath = window.location.pathname;
if (basePath.endsWith('.html') || basePath.endsWith('.php') || basePath.split('/').pop().includes('.')) {
    const parts = basePath.split('/');
    parts.pop();
    basePath = parts.join('/');
}
if (!basePath.endsWith('/')) {
    basePath += '/';
}
const API_BASE = basePath + 'api';

// Dados Iniciais para o LocalStorage (Seed)
const INITIAL_DEPARTMENTS = [
    { id: 1, nome: 'Estoque' },
    { id: 2, nome: 'Vendas' },
    { id: 3, nome: 'Conferência de Produtos' },
    { id: 4, nome: 'Caixa' },
    { id: 5, nome: 'Compras' },
    { id: 6, nome: 'Marketing' },
    { id: 7, nome: 'RH' }
];

const INITIAL_PRINTERS = [
    { id: 1, nome_modelo: 'HP LaserJet M404dw', tag_ativo: 'PAT-00892', ip: '192.168.1.150', modelo_toner: 'CF258X (58X)', id_departamento: 2 },
    { id: 2, nome_modelo: 'Brother HL-L2370DW', tag_ativo: 'PAT-00910', ip: '192.168.1.151', modelo_toner: 'TN760', id_departamento: 1 },
    { id: 3, nome_modelo: 'Lexmark MX317dn', tag_ativo: 'PAT-00765', ip: '192.168.1.152', modelo_toner: '51B4000', id_departamento: 3 },
    { id: 4, nome_modelo: 'Samsung M2020W', tag_ativo: 'PAT-00654', ip: '192.168.1.153', modelo_toner: 'MLT-D111S', id_departamento: 6 },
    { id: 5, nome_modelo: 'Kyocera ECOSYS M2040dn', tag_ativo: 'PAT-01004', ip: '192.168.1.154', modelo_toner: 'TK-1175', id_departamento: 5 }
];

const INITIAL_EXCHANGES = [
    { id: 1, id_impressora: 1, data: '2026-07-01', horario: '09:30', responsavel: 'Bruno Silva (TI)', observacoes: 'Toner estava fraco. Trocado por novo original.' },
    { id: 2, id_impressora: 2, data: '2026-07-02', horario: '14:15', responsavel: 'Lucas Costa (TI)', observacoes: 'Substituição preventiva solicitada pela logística.' },
    { id: 3, id_impressora: 3, data: '2026-07-04', horario: '10:00', responsavel: 'Ana Souza (TI)', observacoes: 'Limpeza de rolo fusor efetuada junto à troca.' },
    { id: 4, id_impressora: 1, data: '2026-07-05', horario: '11:45', responsavel: 'Bruno Silva (TI)', observacoes: 'Troca rápida.' },
    { id: 5, id_impressora: 4, data: '2026-07-05', horario: '16:30', responsavel: 'Ana Souza (TI)', observacoes: '' }
];

const INITIAL_USERS = [
    { id: 1, usuario: 'admin', nome: 'Administrador CoreTI', nivel: 'admin' },
    { id: 2, usuario: 'tecnico', nome: 'Técnico de Suporte', nivel: 'user' }
];

const INITIAL_ESTOQUE = [
    { id: 1, nome: 'Toner CF258X (58X)', quantidade: 5, quantidade_minima: 2, categoria: 'Toner' },
    { id: 2, nome: 'Toner TN760', quantidade: 1, quantidade_minima: 2, categoria: 'Toner' },
    { id: 3, nome: 'Papel A4 (Resma)', quantidade: 10, quantidade_minima: 5, categoria: 'Papel' },
    { id: 4, nome: 'Toner 51B4000', quantidade: 0, quantidade_minima: 3, categoria: 'Toner' },
    { id: 5, nome: 'Toner MLT-D111S', quantidade: 8, quantidade_minima: 2, categoria: 'Toner' },
    { id: 6, nome: 'Toner TK-1175', quantidade: 3, quantidade_minima: 2, categoria: 'Toner' }
];

const INITIAL_ANYDESK = [
    { id: 1, nome_usuario: 'Carlos Mendes', ip_pc: '192.168.1.50', mac_address: 'AA:BB:CC:11:22:33', porta_patchpanel: 'P01', anydesk_codigo: '123 456 789' },
    { id: 2, nome_usuario: 'Fernanda Lima', ip_pc: '192.168.1.51', mac_address: 'DD:EE:FF:44:55:66', porta_patchpanel: 'P02', anydesk_codigo: '987 654 321' },
    { id: 3, nome_usuario: 'Roberto Alves', ip_pc: '192.168.1.52', mac_address: '11:22:33:AA:BB:CC', porta_patchpanel: 'P05', anydesk_codigo: '555 123 456' }
];

// Utilitários de Inicialização do LocalStorage
function initLocalStorage() {
    if (!localStorage.getItem('toner_departamentos')) {
        localStorage.setItem('toner_departamentos', JSON.stringify(INITIAL_DEPARTMENTS));
    }
    if (!localStorage.getItem('toner_impressoras')) {
        localStorage.setItem('toner_impressoras', JSON.stringify(INITIAL_PRINTERS));
    }
    if (!localStorage.getItem('toner_historico')) {
        localStorage.setItem('toner_historico', JSON.stringify(INITIAL_EXCHANGES));
    }
    if (!localStorage.getItem('toner_usuarios')) {
        localStorage.setItem('toner_usuarios', JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem('toner_estoque')) {
        localStorage.setItem('toner_estoque', JSON.stringify(INITIAL_ESTOQUE));
    }
    if (!localStorage.getItem('toner_anydesk')) {
        localStorage.setItem('toner_anydesk', JSON.stringify(INITIAL_ANYDESK));
    }
}

// Inicializa no carregamento caso esteja usando modo LocalStorage
if (!USE_API) {
    initLocalStorage();
}

// Retorna os cabeçalhos de autenticação com base no usuário logado no momento
function getAuthHeaders() {
    const session = JSON.parse(localStorage.getItem('coreti_session') || '{}');
    return {
        'Content-Type': 'application/json',
        'X-User-Level': session.nivel || 'user',
        'X-User-Login': session.usuario || ''
    };
}

// Função auxiliar para fazer requisições à API com tratamento de erros robusto
async function apiRequest(url, options = {}) {
    // Mesclar os headers de autenticação
    const authHeaders = getAuthHeaders();
    options.headers = {
        ...authHeaders,
        ...options.headers
    };

    const response = await fetch(url, options);

    // Ler a resposta como texto primeiro (evitar crash em resposta vazia)
    const text = await response.text();

    // Se a resposta estiver vazia, gerar erro descritivo
    if (!text || text.trim() === '') {
        throw new Error('O servidor retornou uma resposta vazia. Verifique se os arquivos PHP estão corretos no servidor.');
    }

    // Tentar interpretar como JSON
    let data;
    try {
        data = JSON.parse(text);
    } catch (e) {
        // Se não for JSON válido (ex: página de erro HTML do servidor)
        throw new Error('Resposta inesperada do servidor: ' + text.substring(0, 150));
    }

    // Se a resposta da API indicar erro, lançar exceção para o handler capturar
    if (!response.ok || data.error) {
        throw new Error(data.error || `Erro na requisição (HTTP ${response.status})`);
    }

    return data;
}

// Objeto de Operações no Banco de Dados
export const db = {
    // --- MODO ATIVO ---
    isUsingAPI: function() {
        return USE_API;
    },

    // --- AUTENTICAÇÃO ---
    login: async function(usuario, senha) {
        if (USE_API) {
            const res = await apiRequest(`${API_BASE}/auth/login.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, senha })
            });
            if (res.success && res.user) {
                localStorage.setItem('coreti_session', JSON.stringify(res.user));
                return res.user;
            }
            throw new Error('Erro ao processar dados de login.');
        } else {
            // Simulação LocalStorage
            const users = JSON.parse(localStorage.getItem('toner_usuarios') || '[]');
            const user = users.find(u => u.usuario === usuario);
            if (user && senha === 'admin123') { // Qualquer senha 'admin123' funciona localmente no mockup
                const sessionUser = { id: user.id, usuario: user.usuario, nome: user.nome, nivel: user.nivel };
                localStorage.setItem('coreti_session', JSON.stringify(sessionUser));
                return sessionUser;
            }
            throw new Error('Usuário ou senha incorretos (Nota: localmente, use qualquer usuário cadastrado com a senha "admin123").');
        }
    },

    // --- GERENCIAMENTO DE USUÁRIOS (ADMIN) ---
    getUsers: async function() {
        if (USE_API) {
            return await apiRequest(`${API_BASE}/auth/usuarios.php`);
        } else {
            return JSON.parse(localStorage.getItem('toner_usuarios') || '[]');
        }
    },

    addUser: async function(userData) {
        if (USE_API) {
            return await apiRequest(`${API_BASE}/auth/usuarios.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
        } else {
            const users = JSON.parse(localStorage.getItem('toner_usuarios') || '[]');
            const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
            const newUser = {
                id: newId,
                usuario: userData.usuario,
                nome: userData.nome,
                nivel: userData.nivel || 'user'
            };
            users.push(newUser);
            localStorage.setItem('toner_usuarios', JSON.stringify(users));
            return newUser;
        }
    },

    deleteUser: async function(id) {
        if (USE_API) {
            return await apiRequest(`${API_BASE}/auth/usuarios.php?id=${id}`, {
                method: 'DELETE'
            });
        } else {
            const users = JSON.parse(localStorage.getItem('toner_usuarios') || '[]');
            const session = JSON.parse(localStorage.getItem('coreti_session') || '{}');
            const userToDelete = users.find(u => u.id === parseInt(id));
            
            if (userToDelete && userToDelete.usuario === session.usuario) {
                throw new Error("Você não pode excluir a sua própria conta de administrador.");
            }

            const filtered = users.filter(u => u.id !== parseInt(id));
            localStorage.setItem('toner_usuarios', JSON.stringify(filtered));
            return { success: true };
        }
    },

    // --- DEPARTAMENTOS ---
    getDepartments: async function() {
        if (USE_API) {
            try {
                return await apiRequest(`${API_BASE}/departamentos.php`);
            } catch (error) {
                console.error("Erro na API, usando LocalStorage como fallback", error);
                initLocalStorage();
                return JSON.parse(localStorage.getItem('toner_departamentos'));
            }
        } else {
            return JSON.parse(localStorage.getItem('toner_departamentos'));
        }
    },

    addDepartment: async function(nome) {
        if (USE_API) {
            return await apiRequest(`${API_BASE}/departamentos.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome })
            });
        } else {
            const depts = JSON.parse(localStorage.getItem('toner_departamentos'));
            const newId = depts.length > 0 ? Math.max(...depts.map(d => d.id)) + 1 : 1;
            const newDept = { id: newId, nome };
            depts.push(newDept);
            localStorage.setItem('toner_departamentos', JSON.stringify(depts));
            return newDept;
        }
    },

    updateDepartment: async function(id, nome) {
        if (USE_API) {
            return await apiRequest(`${API_BASE}/departamentos.php?id=${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome })
            });
        } else {
            const depts = JSON.parse(localStorage.getItem('toner_departamentos'));
            const index = depts.findIndex(d => d.id === parseInt(id));
            if (index !== -1) {
                depts[index].nome = nome;
                localStorage.setItem('toner_departamentos', JSON.stringify(depts));
                return depts[index];
            }
            throw new Error("Departamento não encontrado");
        }
    },

    deleteDepartment: async function(id) {
        if (USE_API) {
            return await apiRequest(`${API_BASE}/departamentos.php?id=${id}`, {
                method: 'DELETE'
            });
        } else {
            // Verifica se existem impressoras vinculadas
            const printers = JSON.parse(localStorage.getItem('toner_impressoras') || '[]');
            const hasPrinters = printers.some(p => p.id_departamento === parseInt(id));
            if (hasPrinters) {
                throw new Error("Não é possível excluir este departamento pois existem impressoras vinculadas a ele.");
            }

            const depts = JSON.parse(localStorage.getItem('toner_departamentos'));
            const filtered = depts.filter(d => d.id !== parseInt(id));
            localStorage.setItem('toner_departamentos', JSON.stringify(filtered));
            return { success: true };
        }
    },

    // --- IMPRESSORAS ---
    getPrinters: async function() {
        if (USE_API) {
            try {
                return await apiRequest(`${API_BASE}/impressoras.php`);
            } catch (error) {
                console.error("Erro na API, usando LocalStorage como fallback", error);
                initLocalStorage();
                return JSON.parse(localStorage.getItem('toner_impressoras'));
            }
        } else {
            return JSON.parse(localStorage.getItem('toner_impressoras'));
        }
    },

    addPrinter: async function(printer) {
        if (USE_API) {
            return await apiRequest(`${API_BASE}/impressoras.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(printer)
            });
        } else {
            const printers = JSON.parse(localStorage.getItem('toner_impressoras'));
            const newId = printers.length > 0 ? Math.max(...printers.map(p => p.id)) + 1 : 1;
            const newPrinter = {
                id: newId,
                nome_modelo: printer.nome_modelo,
                tag_ativo: printer.tag_ativo || '',
                ip: printer.ip || '',
                modelo_toner: printer.modelo_toner,
                id_departamento: parseInt(printer.id_departamento)
            };
            printers.push(newPrinter);
            localStorage.setItem('toner_impressoras', JSON.stringify(printers));
            return newPrinter;
        }
    },

    updatePrinter: async function(id, printer) {
        if (USE_API) {
            return await apiRequest(`${API_BASE}/impressoras.php?id=${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(printer)
            });
        } else {
            const printers = JSON.parse(localStorage.getItem('toner_impressoras'));
            const index = printers.findIndex(p => p.id === parseInt(id));
            if (index !== -1) {
                printers[index] = {
                    id: parseInt(id),
                    nome_modelo: printer.nome_modelo,
                    tag_ativo: printer.tag_ativo || '',
                    ip: printer.ip || '',
                    modelo_toner: printer.modelo_toner,
                    id_departamento: parseInt(printer.id_departamento)
                };
                localStorage.setItem('toner_impressoras', JSON.stringify(printers));
                return printers[index];
            }
            throw new Error("Impressora não encontrada");
        }
    },

    deletePrinter: async function(id) {
        if (USE_API) {
            return await apiRequest(`${API_BASE}/impressoras.php?id=${id}`, {
                method: 'DELETE'
            });
        } else {
            // Verifica se há trocas associadas no histórico
            const exchanges = JSON.parse(localStorage.getItem('toner_historico') || '[]');
            const hasExchanges = exchanges.some(e => e.id_impressora === parseInt(id));
            if (hasExchanges) {
                throw new Error("Não é possível excluir esta impressora pois há histórico de trocas associado a ela. Exclua o histórico primeiro ou desative a impressora.");
            }

            const printers = JSON.parse(localStorage.getItem('toner_impressoras'));
            const filtered = printers.filter(p => p.id !== parseInt(id));
            localStorage.setItem('toner_impressoras', JSON.stringify(filtered));
            return { success: true };
        }
    },

    // --- HISTÓRICO DE TROCAS ---
    getExchanges: async function() {
        if (USE_API) {
            try {
                return await apiRequest(`${API_BASE}/trocas.php`);
            } catch (error) {
                console.error("Erro na API, usando LocalStorage como fallback", error);
                initLocalStorage();
                return JSON.parse(localStorage.getItem('toner_historico'));
            }
        } else {
            return JSON.parse(localStorage.getItem('toner_historico'));
        }
    },

    addExchange: async function(exchange) {
        if (USE_API) {
            return await apiRequest(`${API_BASE}/trocas.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(exchange)
            });
        } else {
            const exchanges = JSON.parse(localStorage.getItem('toner_historico'));
            const newId = exchanges.length > 0 ? Math.max(...exchanges.map(e => e.id)) + 1 : 1;
            const newExchange = {
                id: newId,
                id_impressora: parseInt(exchange.id_impressora),
                data: exchange.data,
                horario: exchange.horario,
                responsavel: exchange.responsavel,
                observacoes: exchange.observacoes || ''
            };
            exchanges.push(newExchange);
            // Ordenar por data decrescente
            exchanges.sort((a, b) => new Date(b.data + 'T' + b.horario) - new Date(a.data + 'T' + a.horario));
            localStorage.setItem('toner_historico', JSON.stringify(exchanges));

            // Atualizar estoque local automaticamente
            const printers = JSON.parse(localStorage.getItem('toner_impressoras') || '[]');
            const printer = printers.find(p => p.id === parseInt(exchange.id_impressora));
            if (printer && printer.modelo_toner) {
                const estoque = JSON.parse(localStorage.getItem('toner_estoque') || '[]');
                const tonerModel = printer.modelo_toner.toLowerCase().trim();
                
                // Procurar por match aproximado no estoque
                const stockItem = estoque.find(item => {
                    const itemName = item.nome.toLowerCase();
                    return itemName.includes(tonerModel) || tonerModel.includes(itemName);
                });
                
                if (stockItem) {
                    stockItem.quantidade = Math.max(0, (parseInt(stockItem.quantidade) || 0) - 1);
                    localStorage.setItem('toner_estoque', JSON.stringify(estoque));
                }
            }

            return newExchange;
        }
    },

    deleteExchange: async function(id) {
        if (USE_API) {
            return await apiRequest(`${API_BASE}/trocas.php?id=${id}`, {
                method: 'DELETE'
            });
        } else {
            const exchanges = JSON.parse(localStorage.getItem('toner_historico'));
            const filtered = exchanges.filter(e => e.id !== parseInt(id));
            localStorage.setItem('toner_historico', JSON.stringify(filtered));
            return { success: true };
        }
    },

    // --- ESTOQUE ---
    getEstoque: async function() {
        if (USE_API) {
            try {
                return await apiRequest(`${API_BASE}/estoque.php`);
            } catch (error) {
                console.error("Erro na API de estoque, usando LocalStorage como fallback", error);
                initLocalStorage();
                return JSON.parse(localStorage.getItem('toner_estoque'));
            }
        } else {
            return JSON.parse(localStorage.getItem('toner_estoque') || '[]');
        }
    },

    addEstoque: async function(item) {
        if (USE_API) {
            return await apiRequest(`${API_BASE}/estoque.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
        } else {
            const items = JSON.parse(localStorage.getItem('toner_estoque') || '[]');
            const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
            const newItem = {
                id: newId,
                nome: item.nome,
                quantidade: parseInt(item.quantidade) || 0,
                quantidade_minima: parseInt(item.quantidade_minima) || 2,
                categoria: item.categoria || ''
            };
            items.push(newItem);
            localStorage.setItem('toner_estoque', JSON.stringify(items));
            return newItem;
        }
    },

    updateEstoque: async function(id, item) {
        if (USE_API) {
            return await apiRequest(`${API_BASE}/estoque.php?id=${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
        } else {
            const items = JSON.parse(localStorage.getItem('toner_estoque') || '[]');
            const index = items.findIndex(i => i.id === parseInt(id));
            if (index !== -1) {
                items[index] = {
                    id: parseInt(id),
                    nome: item.nome,
                    quantidade: parseInt(item.quantidade) || 0,
                    quantidade_minima: parseInt(item.quantidade_minima) || 2,
                    categoria: item.categoria || ''
                };
                localStorage.setItem('toner_estoque', JSON.stringify(items));
                return items[index];
            }
            throw new Error("Item não encontrado no estoque");
        }
    },

    deleteEstoque: async function(id) {
        if (USE_API) {
            return await apiRequest(`${API_BASE}/estoque.php?id=${id}`, {
                method: 'DELETE'
            });
        } else {
            const items = JSON.parse(localStorage.getItem('toner_estoque') || '[]');
            const filtered = items.filter(i => i.id !== parseInt(id));
            localStorage.setItem('toner_estoque', JSON.stringify(filtered));
            return { success: true };
        }
    },

    // --- MÉTRICAS DE DASHBOARD ---
    getDashboardStats: async function() {
        if (USE_API) {
            try {
                return await apiRequest(`${API_BASE}/dashboard/stats.php`);
            } catch (error) {
                console.error("Erro na API de métricas, calculando no client-side", error);
            }
        }

        // Caso dê fallback para LocalStorage ou esteja offline
        const depts = await this.getDepartments();
        const printers = await this.getPrinters();
        const exchanges = await this.getExchanges();

        // 1. Total de trocas
        const totalExchanges = exchanges.length;

        // 2. Mapeamento de impressoras por ID
        const printerMap = {};
        printers.forEach(p => {
            printerMap[p.id] = p;
        });

        // 3. Mapeamento de departamentos por ID
        const deptMap = {};
        depts.forEach(d => {
            deptMap[d.id] = d.nome;
        });

        // 4. Calcular trocas por departamento e impressora
        const deptStats = {};
        depts.forEach(d => { deptStats[d.nome] = 0; });

        const printerStats = {};
        printers.forEach(p => { printerStats[p.nome_modelo] = 0; });

        exchanges.forEach(e => {
            const printer = printerMap[e.id_impressora];
            if (printer) {
                // Soma no departamento
                const deptName = deptMap[printer.id_departamento] || 'Desconhecido';
                deptStats[deptName] = (deptStats[deptName] || 0) + 1;

                // Soma na impressora
                printerStats[printer.nome_modelo] = (printerStats[printer.nome_modelo] || 0) + 1;
            }
        });

        // 5. Formatar trocas por departamento (ordenado)
        const exchangesByDept = Object.keys(deptStats).map(name => ({
            name,
            count: deptStats[name]
        })).sort((a, b) => b.count - a.count);

        // 6. Formatar trocas por impressora (ordenado, pegar top 5)
        const exchangesByPrinter = Object.keys(printerStats).map(name => ({
            name,
            count: printerStats[name]
        })).sort((a, b) => b.count - a.count).slice(0, 5);

        // 7. Últimas 5 trocas formatadas
        const recentExchanges = exchanges.slice(0, 5).map(e => {
            const printer = printerMap[e.id_impressora];
            const deptName = printer ? (deptMap[printer.id_departamento] || 'Desconhecido') : 'Desconhecido';
            return {
                id: e.id,
                data: e.data,
                horario: e.horario,
                responsavel: e.responsavel,
                impressora_modelo: printer ? printer.nome_modelo : 'Impressora Removida',
                departamento_nome: deptName,
                observacoes: e.observacoes
            };
        });

        // 8. Itens com estoque baixo
        const estoque = await this.getEstoque();
        const lowStockItems = estoque.filter(item => item.quantidade <= item.quantidade_minima);

        return {
            totalExchanges,
            totalPrinters: printers.length,
            totalDepartments: depts.length,
            exchangesByDept,
            exchangesByPrinter,
            recentExchanges,
            lowStockItems
        };
    },

    // --- ANYDESK PCs ---
    getAnyDeskPcs: async function() {
        if (USE_API) {
            try {
                return await apiRequest(`${API_BASE}/anydesk.php`);
            } catch (error) {
                console.error("Erro na API de AnyDesk, usando LocalStorage como fallback", error);
                initLocalStorage();
                return JSON.parse(localStorage.getItem('toner_anydesk'));
            }
        } else {
            return JSON.parse(localStorage.getItem('toner_anydesk') || '[]');
        }
    },

    addAnyDeskPc: async function(pc) {
        if (USE_API) {
            return await apiRequest(`${API_BASE}/anydesk.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pc)
            });
        } else {
            const pcs = JSON.parse(localStorage.getItem('toner_anydesk') || '[]');
            const newId = pcs.length > 0 ? Math.max(...pcs.map(p => p.id)) + 1 : 1;
            const newPc = {
                id: newId,
                nome_usuario: pc.nome_usuario,
                ip_pc: pc.ip_pc,
                mac_address: pc.mac_address,
                porta_patchpanel: pc.porta_patchpanel,
                anydesk_codigo: pc.anydesk_codigo
            };
            pcs.push(newPc);
            localStorage.setItem('toner_anydesk', JSON.stringify(pcs));
            return newPc;
        }
    },

    updateAnyDeskPc: async function(id, pc) {
        if (USE_API) {
            return await apiRequest(`${API_BASE}/anydesk.php?id=${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pc)
            });
        } else {
            const pcs = JSON.parse(localStorage.getItem('toner_anydesk') || '[]');
            const index = pcs.findIndex(p => p.id === parseInt(id));
            if (index !== -1) {
                pcs[index] = {
                    id: parseInt(id),
                    nome_usuario: pc.nome_usuario,
                    ip_pc: pc.ip_pc,
                    mac_address: pc.mac_address,
                    porta_patchpanel: pc.porta_patchpanel,
                    anydesk_codigo: pc.anydesk_codigo
                };
                localStorage.setItem('toner_anydesk', JSON.stringify(pcs));
                return pcs[index];
            }
            throw new Error("Computador não encontrado");
        }
    },

    deleteAnyDeskPc: async function(id) {
        if (USE_API) {
            return await apiRequest(`${API_BASE}/anydesk.php?id=${id}`, {
                method: 'DELETE'
            });
        } else {
            const pcs = JSON.parse(localStorage.getItem('toner_anydesk') || '[]');
            const filtered = pcs.filter(p => p.id !== parseInt(id));
            localStorage.setItem('toner_anydesk', JSON.stringify(filtered));
            return { success: true };
        }
    }
};
