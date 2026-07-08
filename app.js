// app.js - Lógica do Frontend CoreTI (Single Page Application com Autenticação)

// Estado Global da Aplicação
const state = {
    currentTab: 'dashboard',
    departments: [],
    printers: [],
    exchanges: [],
    users: [],
    stats: {},
    currentUser: null // Sessão do usuário logado
};

// Elementos do DOM
const DOM = {
    // Autenticação & Layout
    loginScreen: document.getElementById('login-screen'),
    formLogin: document.getElementById('form-login'),
    loginUsername: document.getElementById('login-username'),
    loginPassword: document.getElementById('login-password'),
    loginErrorMsg: document.getElementById('login-error-msg'),
    loginErrorText: document.getElementById('login-error-text'),
    
    mainNav: document.getElementById('main-nav'),
    mainContent: document.getElementById('main-content'),
    sidebar: document.getElementById('app-sidebar'),
    sidebarBackdrop: document.getElementById('sidebar-backdrop'),
    btnHamburger: document.getElementById('btn-hamburger'),
    menuItems: document.querySelectorAll('.menu-item'),
    sections: document.querySelectorAll('.app-section'),
    appModeText: document.getElementById('app-mode-text'),
    appModeBadge: document.getElementById('app-mode-badge'),
    toastContainer: document.getElementById('toast-container'),
    
    // Perfil do Usuário
    sessionUserName: document.getElementById('session-user-name'),
    sessionUserLevel: document.getElementById('session-user-level'),
    sessionUserNameMobile: document.getElementById('session-user-name-mobile'),
    btnLogout: document.getElementById('btn-logout'),

    // Dashboard
    statTotalExchanges: document.getElementById('stat-total-exchanges'),
    statTotalPrinters: document.getElementById('stat-total-printers'),
    statTotalDepts: document.getElementById('stat-total-depts'),
    deptChartContainer: document.getElementById('dept-chart-container'),
    printerCriticalList: document.getElementById('printer-critical-list'),
    dashboardRecentTableBody: document.getElementById('dashboard-recent-table-body'),
    btnQuickExchange: document.getElementById('btn-quick-exchange'),

    // Departamentos
    deptsTableBody: document.getElementById('depts-table-body'),
    btnAddDept: document.getElementById('btn-add-dept'),
    formDept: document.getElementById('form-dept'),
    formDeptId: document.getElementById('form-dept-id'),
    formDeptName: document.getElementById('form-dept-name'),

    // Impressoras
    printersTableBody: document.getElementById('printers-table-body'),
    btnAddPrinter: document.getElementById('btn-add-printer'),
    formPrinter: document.getElementById('form-printer'),
    formPrinterId: document.getElementById('form-printer-id'),
    formPrinterModel: document.getElementById('form-printer-model'),
    formPrinterToner: document.getElementById('form-printer-toner'),
    formPrinterDept: document.getElementById('form-printer-dept'),
    formPrinterTag: document.getElementById('form-printer-tag'),
    formPrinterIp: document.getElementById('form-printer-ip'),
    printerSearchInput: document.getElementById('printer-search-input'),
    printerDeptFilter: document.getElementById('printer-dept-filter'),

    // Trocas
    exchangesTableBody: document.getElementById('exchanges-table-body'),
    btnAddExchangeMain: document.getElementById('btn-add-exchange-main'),
    formExchange: document.getElementById('form-exchange'),
    formExchangeDept: document.getElementById('form-exchange-dept'),
    formExchangePrinter: document.getElementById('form-exchange-printer'),
    formExchangeDate: document.getElementById('form-exchange-date'),
    formExchangeTime: document.getElementById('form-exchange-time'),
    formExchangeResponsible: document.getElementById('form-exchange-responsible'),
    formExchangeObs: document.getElementById('form-exchange-obs'),
    
    // Filtros de Trocas
    filterExchangeDept: document.getElementById('filter-exchange-dept'),
    filterExchangeStart: document.getElementById('filter-exchange-start'),
    filterExchangeEnd: document.getElementById('filter-exchange-end'),
    btnClearFilters: document.getElementById('btn-clear-filters'),

    // Usuários (Admin apenas)
    usersTableBody: document.getElementById('users-table-body'),
    btnAddUser: document.getElementById('btn-add-user'),
    formUser: document.getElementById('form-user'),
    formUserName: document.getElementById('form-user-name'),
    formUserLogin: document.getElementById('form-user-login'),
    formUserPass: document.getElementById('form-user-pass'),
    formUserLevel: document.getElementById('form-user-level'),
    navItemUsuarios: document.getElementById('nav-item-usuarios'),
    sidebarItemUsuarios: document.getElementById('sidebar-item-usuarios')
};

// =========================================================================
// INICIALIZAÇÃO DA APLICAÇÃO
// =========================================================================

document.addEventListener('DOMContentLoaded', async () => {
    setupNavigation();
    setupEventListeners();
    updateModeIndicator();
    checkAuthSession();
});

// Verifica se há uma sessão de autenticação ativa
async function checkAuthSession() {
    const savedSession = localStorage.getItem('coreti_session');
    if (savedSession) {
        try {
            state.currentUser = JSON.parse(savedSession);
            showAppLayout();
            await refreshData();
            renderAll();
        } catch (e) {
            console.error('Falha ao decodificar sessão.', e);
            logout();
        }
    } else {
        showLoginLayout();
    }
}

// Alterna a exibição para a tela de Login
function showLoginLayout() {
    DOM.loginScreen.classList.remove('hidden');
    DOM.mainNav.classList.add('hidden');
    DOM.mainContent.classList.add('hidden');
}

// Alterna a exibição para a tela do Aplicativo
function showAppLayout() {
    DOM.loginScreen.classList.add('hidden');
    DOM.mainNav.classList.remove('hidden');
    DOM.mainContent.classList.remove('hidden');
    
    // Exibir dados do usuário logado
    if (state.currentUser) {
        DOM.sessionUserName.textContent = state.currentUser.nome;
        DOM.sessionUserLevel.textContent = state.currentUser.nivel === 'admin' ? 'Administrador' : 'Técnico de TI';
        DOM.sessionUserNameMobile.textContent = state.currentUser.nome;

        // Exibir aba de usuários apenas para Admin
        if (state.currentUser.nivel === 'admin') {
            DOM.navItemUsuarios.classList.remove('hidden');
            DOM.sidebarItemUsuarios.classList.remove('hidden');
        } else {
            DOM.navItemUsuarios.classList.add('hidden');
            DOM.sidebarItemUsuarios.classList.add('hidden');
            // Se o usuário comum estava na aba usuários antes, voltar pro dashboard
            if (state.currentTab === 'usuarios') {
                switchTab('dashboard');
            }
        }
    }
}

// Realiza o Logout do sistema
function logout() {
    localStorage.removeItem('coreti_session');
    state.currentUser = null;
    showLoginLayout();
    showToast('Sessão encerrada.');
}

// Atualiza o indicador visual de conexão
function updateModeIndicator() {
    const isApi = db.isUsingAPI();
    const dot = DOM.appModeBadge ? DOM.appModeBadge.querySelector('.status-dot') : null;
    // Mobile elements
    const mobileText = document.getElementById('app-mode-text-mobile');
    const mobileDot = document.querySelector('.status-dot-mobile');

    if (isApi) {
        if (DOM.appModeText) DOM.appModeText.textContent = 'MySQL Conectado';
        if (dot) { dot.style.backgroundColor = '#22c55e'; dot.style.boxShadow = '0 0 6px #22c55e'; }
        if (mobileText) mobileText.textContent = 'MySQL Conectado';
        if (mobileDot) { mobileDot.style.backgroundColor = '#22c55e'; }
    } else {
        if (DOM.appModeText) DOM.appModeText.textContent = 'Modo Offline';
        if (dot) { dot.style.backgroundColor = '#f59e0b'; dot.style.boxShadow = '0 0 6px #f59e0b'; }
        if (mobileText) mobileText.textContent = 'Modo Offline';
        if (mobileDot) { mobileDot.style.backgroundColor = '#f59e0b'; }
    }
}

// Carrega os dados mais recentes do DB
async function refreshData() {
    if (!state.currentUser) return;
    try {
        state.departments = await db.getDepartments();
        state.printers = await db.getPrinters();
        state.exchanges = await db.getExchanges();
        state.stats = await db.getDashboardStats();
        
        // Se for admin, carregar também os usuários do sistema
        if (state.currentUser.nivel === 'admin') {
            state.users = await db.getUsers();
        }
    } catch (error) {
        showToast('Erro ao carregar dados do sistema.', 'danger');
        console.error(error);
    }
}

// =========================================================================
// ROTEAMENTO E NAVEGAÇÃO
// =========================================================================

function setupNavigation() {
    // Menu Items (both desktop and mobile)
    DOM.menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = item.getAttribute('data-target');
            switchTab(targetTab);
            // Close mobile sidebar
            if (DOM.sidebar) DOM.sidebar.classList.remove('active');
            if (DOM.sidebarBackdrop) DOM.sidebarBackdrop.classList.remove('active');
        });
    });

    // Toggle Sidebar Mobile
    if (DOM.btnHamburger) {
        DOM.btnHamburger.addEventListener('click', () => {
            DOM.sidebar.classList.toggle('active');
            DOM.sidebarBackdrop.classList.toggle('active');
        });
    }

    // Close sidebar when backdrop is clicked
    if (DOM.sidebarBackdrop) {
        DOM.sidebarBackdrop.addEventListener('click', () => {
            DOM.sidebar.classList.remove('active');
            DOM.sidebarBackdrop.classList.remove('active');
        });
    }

    // Atalhos Rápidos para registrar troca
    if (DOM.btnQuickExchange) DOM.btnQuickExchange.addEventListener('click', () => openExchangeModal());
    if (DOM.btnAddExchangeMain) DOM.btnAddExchangeMain.addEventListener('click', () => openExchangeModal());
}

function switchTab(tabName) {
    state.currentTab = tabName;
    
    // Atualiza classes do menu
    DOM.menuItems.forEach(item => {
        if (item.getAttribute('data-target') === tabName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Atualiza exibição das seções
    DOM.sections.forEach(section => {
        if (section.id === `section-${tabName}`) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });

    // Atualiza a renderização específica da aba selecionada
    renderTabContent(tabName);
}

// =========================================================================
// PROVEDOR DE NOTIFICAÇÕES (TOASTS)
// =========================================================================

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    const isSuccess = type === 'success';
    toast.className = `toast-item flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${isSuccess ? 'bg-surface-container-lowest border-primary/30 text-on-surface' : 'bg-error-container border-error/30 text-on-error-container'}`;
    
    const iconName = isSuccess ? 'check_circle' : 'error';
    toast.innerHTML = `
        <span class="material-symbols-outlined" style="font-size:20px">${iconName}</span>
        <span class="text-sm font-medium">${message}</span>
    `;

    DOM.toastContainer.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// =========================================================================
// RENDERIZADORES DE INTERFACE (UI RENDERERS)
// =========================================================================

async function renderAll() {
    renderTabContent(state.currentTab);
    populateDropdowns();
}

function renderTabContent(tabName) {
    switch (tabName) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'departamentos':
            renderDepartments();
            break;
        case 'impressoras':
            renderPrinters();
            break;
        case 'trocas':
            renderExchanges();
            break;
        case 'usuarios':
            renderUsers();
            break;
    }
}

// --- RENDER DASHBOARD ---
function renderDashboard() {
    // 1. Atualizar cards numéricos
    DOM.statTotalExchanges.textContent = state.stats.totalExchanges;
    DOM.statTotalPrinters.textContent = state.stats.totalPrinters;
    DOM.statTotalDepts.textContent = state.stats.totalDepartments;

    // 2. Gráfico de Consumo por Departamento (CSS bars)
    DOM.deptChartContainer.innerHTML = '';
    if (state.stats.exchangesByDept.length === 0) {
        DOM.deptChartContainer.innerHTML = `<div class="py-8 text-center text-on-surface-variant text-sm">Sem dados de trocas para exibir.</div>`;
    } else {
        const maxExchanges = Math.max(...state.stats.exchangesByDept.map(d => d.count), 1);
        state.stats.exchangesByDept.forEach(item => {
            const percentage = (item.count / maxExchanges) * 100;
            const barItem = document.createElement('div');
            barItem.className = 'flex items-center gap-3 py-2';
            barItem.innerHTML = `
                <span class="w-28 text-sm font-medium text-on-surface-variant truncate" title="${item.name}">${item.name}</span>
                <div class="flex-1 h-3 bg-surface-container rounded-full overflow-hidden">
                    <div class="h-full bg-primary rounded-full transition-all duration-500" style="width: ${percentage}%"></div>
                </div>
                <span class="w-8 text-sm font-semibold text-on-surface text-right">${item.count}</span>
            `;
            DOM.deptChartContainer.appendChild(barItem);
        });
    }

    // 3. Impressoras Críticas (Top 5 mais trocas)
    DOM.printerCriticalList.innerHTML = '';
    const topPrinters = state.stats.exchangesByPrinter;
    if (topPrinters.length === 0) {
        DOM.printerCriticalList.innerHTML = `<div class="py-8 text-center text-on-surface-variant text-sm">Sem dados de impressoras.</div>`;
    } else {
        topPrinters.forEach(item => {
            const printerObj = state.printers.find(p => p.nome_modelo === item.name);
            const tonerModel = printerObj ? printerObj.modelo_toner : 'N/A';
            const deptName = printerObj ? (state.departments.find(d => d.id === printerObj.id_departamento)?.nome || 'TI') : 'TI';

            const indicator = document.createElement('div');
            indicator.className = 'flex items-center justify-between py-3 border-b border-surface-dim last:border-0';
            indicator.innerHTML = `
                <div>
                    <div class="font-medium text-on-surface">${item.name}</div>
                    <div class="text-xs text-on-surface-variant">Toner: ${tonerModel} | Depto: ${deptName}</div>
                </div>
                <span class="px-3 py-1 bg-primary-container/20 text-on-primary-container text-xs font-semibold rounded-full">${item.count} trocas</span>
            `;
            DOM.printerCriticalList.appendChild(indicator);
        });
    }

    // 4. Tabela de últimas 5 trocas
    DOM.dashboardRecentTableBody.innerHTML = '';
    if (state.stats.recentExchanges.length === 0) {
        DOM.dashboardRecentTableBody.innerHTML = `
            <tr><td colspan="6" class="px-6 py-12 text-center text-on-surface-variant">Nenhuma troca registrada até o momento.</td></tr>
        `;
    } else {
        state.stats.recentExchanges.forEach(e => {
            const formattedDate = formatDateBR(e.data);
            const row = document.createElement('tr');
            row.className = 'border-b border-surface-dim hover:bg-surface/50 transition-colors';
            row.innerHTML = `
                <td class="px-6 py-4">
                    <div class="font-semibold">${formattedDate}</div>
                    <div class="text-xs text-on-surface-variant">${e.horario}</div>
                </td>
                <td class="px-6 py-4 font-medium">${e.impressora_modelo}</td>
                <td class="px-6 py-4"><span class="px-2.5 py-1 bg-primary-container/20 text-on-primary-container text-xs font-semibold rounded-full">${e.departamento_nome}</span></td>
                <td class="px-6 py-4">${e.responsavel}</td>
                <td class="px-6 py-4 text-on-surface-variant max-w-[250px] truncate" title="${e.observacoes || 'Sem observações'}">
                    ${e.observacoes || '<span class="italic opacity-50">Sem observações</span>'}
                </td>
                <td class="px-6 py-4">
                    <button class="p-1.5 text-error hover:bg-error-container rounded-md transition-colors" onclick="deleteExchangeHandler(${e.id})" title="Excluir">
                        <span class="material-symbols-outlined" style="font-size:18px">delete</span>
                    </button>
                </td>
            `;
            DOM.dashboardRecentTableBody.appendChild(row);
        });
    }
}

// --- RENDER DEPARTAMENTOS ---
function renderDepartments() {
    DOM.deptsTableBody.innerHTML = '';
    
    // Contar quantas impressoras pertencem a cada departamento
    const printerCounts = {};
    state.printers.forEach(p => {
        printerCounts[p.id_departamento] = (printerCounts[p.id_departamento] || 0) + 1;
    });

    if (state.departments.length === 0) {
        DOM.deptsTableBody.innerHTML = `
            <tr><td colspan="4" class="px-6 py-12 text-center text-on-surface-variant">Nenhum departamento cadastrado.</td></tr>
        `;
    } else {
        state.departments.forEach(d => {
            const numPrinters = printerCounts[d.id] || 0;
            const row = document.createElement('tr');
            row.className = 'border-b border-surface-dim hover:bg-surface/50 transition-colors group';
            row.innerHTML = `
                <td class="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant">${d.id}</td>
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary-container/20 group-hover:text-primary transition-colors">
                            <span class="material-symbols-outlined" style="font-size:18px">group</span>
                        </div>
                        <span class="font-title-md text-title-md">${d.nome}</span>
                    </div>
                </td>
                <td class="px-6 py-4 text-center">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${numPrinters > 0 ? 'bg-primary-container/20 text-on-primary-container' : 'bg-surface-container text-on-surface-variant'}">
                        ${numPrinters} impressora(s)
                    </span>
                </td>
                <td class="px-6 py-4">
                    <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button class="p-1.5 text-secondary hover:bg-secondary-container/20 rounded-md transition-colors" onclick="openDeptModal(${d.id}, '${d.nome.replace(/'/g, "\\'")}')" title="Editar">
                            <span class="material-symbols-outlined" style="font-size:18px">edit</span>
                        </button>
                        <button class="p-1.5 text-error hover:bg-error-container rounded-md transition-colors" onclick="deleteDeptHandler(${d.id})" title="Excluir">
                            <span class="material-symbols-outlined" style="font-size:18px">delete</span>
                        </button>
                    </div>
                </td>
            `;
            DOM.deptsTableBody.appendChild(row);
        });
    }
}

// --- RENDER IMPRESSORAS ---
function renderPrinters() {
    DOM.printersTableBody.innerHTML = '';
    
    const deptMap = {};
    state.departments.forEach(d => { deptMap[d.id] = d.nome; });

    const searchQuery = DOM.printerSearchInput.value.toLowerCase().trim();
    const deptFilterId = DOM.printerDeptFilter.value;

    const filteredPrinters = state.printers.filter(p => {
        const matchesSearch = p.nome_modelo.toLowerCase().includes(searchQuery) ||
                             p.tag_ativo.toLowerCase().includes(searchQuery) ||
                             p.ip.toLowerCase().includes(searchQuery) ||
                             p.modelo_toner.toLowerCase().includes(searchQuery);
        const matchesDept = deptFilterId === "" || p.id_departamento === parseInt(deptFilterId);
        return matchesSearch && matchesDept;
    });

    if (filteredPrinters.length === 0) {
        DOM.printersTableBody.innerHTML = `
            <tr><td colspan="6" class="px-6 py-12 text-center text-on-surface-variant">Nenhuma impressora encontrada.</td></tr>
        `;
    } else {
        filteredPrinters.forEach(p => {
            const deptName = deptMap[p.id_departamento] || 'Desconhecido';
            const row = document.createElement('tr');
            row.className = 'border-b border-surface-dim hover:bg-surface/50 transition-colors group';
            row.innerHTML = `
                <td class="px-6 py-4 font-medium">${p.nome_modelo}</td>
                <td class="px-6 py-4 font-mono text-xs text-on-surface-variant">${p.tag_ativo || '-'}</td>
                <td class="px-6 py-4 font-mono text-xs text-primary">${p.ip || '-'}</td>
                <td class="px-6 py-4"><span class="px-2.5 py-1 bg-primary-container/20 text-on-primary-container text-xs font-semibold rounded-full">${p.modelo_toner}</span></td>
                <td class="px-6 py-4"><span class="px-2.5 py-1 bg-surface-container text-on-surface-variant text-xs font-semibold rounded-full">${deptName}</span></td>
                <td class="px-6 py-4">
                    <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button class="p-1.5 text-secondary hover:bg-secondary-container/20 rounded-md transition-colors" onclick="openPrinterModal(${p.id})" title="Editar">
                            <span class="material-symbols-outlined" style="font-size:18px">edit</span>
                        </button>
                        <button class="p-1.5 text-error hover:bg-error-container rounded-md transition-colors" onclick="deletePrinterHandler(${p.id})" title="Excluir">
                            <span class="material-symbols-outlined" style="font-size:18px">delete</span>
                        </button>
                    </div>
                </td>
            `;
            DOM.printersTableBody.appendChild(row);
        });
    }
}

// --- RENDER HISTÓRICO DE TROCAS ---
function renderExchanges() {
    DOM.exchangesTableBody.innerHTML = '';

    const printerMap = {};
    state.printers.forEach(p => { printerMap[p.id] = p; });
    const deptMap = {};
    state.departments.forEach(d => { deptMap[d.id] = d.nome; });

    const deptFilterId = DOM.filterExchangeDept.value;
    const startDateVal = DOM.filterExchangeStart.value;
    const endDateVal = DOM.filterExchangeEnd.value;

    const filteredExchanges = state.exchanges.filter(e => {
        const printer = printerMap[e.id_impressora];
        const matchesDept = deptFilterId === "" || (printer && printer.id_departamento === parseInt(deptFilterId));
        let matchesPeriod = true;
        if (startDateVal) matchesPeriod = matchesPeriod && (new Date(e.data) >= new Date(startDateVal));
        if (endDateVal) matchesPeriod = matchesPeriod && (new Date(e.data) <= new Date(endDateVal));
        return matchesDept && matchesPeriod;
    });

    if (filteredExchanges.length === 0) {
        DOM.exchangesTableBody.innerHTML = `
            <tr><td colspan="6" class="px-6 py-12 text-center text-on-surface-variant">Nenhum registro de troca encontrado com os filtros aplicados.</td></tr>
        `;
    } else {
        filteredExchanges.forEach(e => {
            const printer = printerMap[e.id_impressora];
            const printerName = printer ? printer.nome_modelo : 'Impressora Removida';
            const deptName = printer ? (deptMap[printer.id_departamento] || 'Desconhecido') : 'Desconhecido';
            const formattedDate = formatDateBR(e.data);

            const row = document.createElement('tr');
            row.className = 'border-b border-surface-dim hover:bg-surface/50 transition-colors';
            row.innerHTML = `
                <td class="px-6 py-4">
                    <div class="font-semibold">${formattedDate}</div>
                    <div class="text-xs text-on-surface-variant">${e.horario}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="font-medium">${printerName}</div>
                    <div class="text-xs text-on-surface-variant">Toner: ${printer ? printer.modelo_toner : '-'}</div>
                </td>
                <td class="px-6 py-4"><span class="px-2.5 py-1 bg-primary-container/20 text-on-primary-container text-xs font-semibold rounded-full">${deptName}</span></td>
                <td class="px-6 py-4 font-medium">${e.responsavel}</td>
                <td class="px-6 py-4 text-on-surface-variant max-w-[300px]" style="word-wrap: break-word;">
                    ${e.observacoes || '<span class="italic opacity-50">Nenhuma observação</span>'}
                </td>
                <td class="px-6 py-4">
                    <button class="p-1.5 text-error hover:bg-error-container rounded-md transition-colors" onclick="deleteExchangeHandler(${e.id})" title="Excluir">
                        <span class="material-symbols-outlined" style="font-size:18px">delete</span>
                    </button>
                </td>
            `;
            DOM.exchangesTableBody.appendChild(row);
        });
    }
}

// --- RENDER GERENCIAMENTO DE USUÁRIOS (ADMIN APENAS) ---
function renderUsers() {
    DOM.usersTableBody.innerHTML = '';
    
    if (state.users.length === 0) {
        DOM.usersTableBody.innerHTML = `
            <tr><td colspan="5" class="px-6 py-12 text-center text-on-surface-variant">Nenhum usuário cadastrado além do administrador padrão.</td></tr>
        `;
    } else {
        state.users.forEach(u => {
            const formattedDate = u.created_at ? new Date(u.created_at).toLocaleDateString('pt-BR') : '-';
            const row = document.createElement('tr');
            row.className = 'border-b border-surface-dim hover:bg-surface/50 transition-colors group';
            row.innerHTML = `
                <td class="px-6 py-4 font-medium flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                        <span class="material-symbols-outlined" style="font-size:18px">person</span>
                    </div>
                    <span>${u.nome}</span>
                </td>
                <td class="px-6 py-4 font-mono text-sm">${u.usuario}</td>
                <td class="px-6 py-4">
                    <span class="px-2.5 py-1 text-xs font-semibold rounded-full ${u.nivel === 'admin' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}">
                        ${u.nivel === 'admin' ? 'Administrador' : 'Suporte'}
                    </span>
                </td>
                <td class="px-6 py-4 text-on-surface-variant text-sm">${formattedDate}</td>
                <td class="px-6 py-4">
                    <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button class="p-1.5 text-error hover:bg-error-container rounded-md transition-colors" onclick="deleteUserHandler(${u.id})" title="Excluir">
                            <span class="material-symbols-outlined" style="font-size:18px">delete</span>
                        </button>
                    </div>
                </td>
            `;
            DOM.usersTableBody.appendChild(row);
        });
    }
}

// Preenche seletores estáticos e de filtros dinamicamente
function populateDropdowns() {
    // 1. Departamentos no Formulário de Impressoras
    DOM.formPrinterDept.innerHTML = '<option value="">-- Selecione o Departamento --</option>';
    // 2. Filtro de Departamentos nas Impressoras
    DOM.printerDeptFilter.innerHTML = '<option value="">Todos os Departamentos</option>';
    // 3. Filtro de Departamentos nas Trocas
    DOM.filterExchangeDept.innerHTML = '<option value="">Todos os Departamentos</option>';
    // 4. Seleção de Departamento no Modal de Registrar Troca
    DOM.formExchangeDept.innerHTML = '<option value="">-- Escolha o departamento --</option>';

    state.departments.forEach(d => {
        const option = `<option value="${d.id}">${d.nome}</option>`;
        DOM.formPrinterDept.innerHTML += option;
        DOM.printerDeptFilter.innerHTML += option;
        DOM.filterExchangeDept.innerHTML += option;
        DOM.formExchangeDept.innerHTML += option;
    });
}

// =========================================================================
// EVENT LISTENERS & MODAIS CRUD
// =========================================================================

function setupEventListeners() {
    // ---- EVENTOS DE LOGIN & LOGOUT ----
    DOM.formLogin.addEventListener('submit', handleLoginSubmit);
    DOM.btnLogout.addEventListener('click', logout);

    // ---- EVENTOS DE DEPARTAMENTOS ----
    DOM.btnAddDept.addEventListener('click', () => openDeptModal());
    DOM.formDept.addEventListener('submit', handleDeptSubmit);

    // ---- EVENTOS DE IMPRESSORAS ----
    DOM.btnAddPrinter.addEventListener('click', () => openPrinterModal());
    DOM.formPrinter.addEventListener('submit', handlePrinterSubmit);
    DOM.printerSearchInput.addEventListener('input', renderPrinters);
    DOM.printerDeptFilter.addEventListener('change', renderPrinters);

    // ---- EVENTOS DE TROCAS ----
    DOM.formExchange.addEventListener('submit', handleExchangeSubmit);
    DOM.formExchangeDept.addEventListener('change', handleExchangeDeptChange);
    
    // Filtros nas trocas
    DOM.filterExchangeDept.addEventListener('change', renderExchanges);
    DOM.filterExchangeStart.addEventListener('change', renderExchanges);
    DOM.filterExchangeEnd.addEventListener('change', renderExchanges);
    DOM.btnClearFilters.addEventListener('click', () => {
        DOM.filterExchangeDept.value = '';
        DOM.filterExchangeStart.value = '';
        DOM.filterExchangeEnd.value = '';
        renderExchanges();
    });

    // ---- EVENTOS DE USUÁRIOS (ADMIN APENAS) ----
    DOM.btnAddUser.addEventListener('click', () => openUserModal());
    DOM.formUser.addEventListener('submit', handleUserSubmit);
}

// Controle genérico de fechar modal
window.closeModal = function(modalId) {
    document.getElementById(modalId).classList.remove('active');
};

// ---- LOGIN SUBMIT ----
async function handleLoginSubmit(e) {
    e.preventDefault();
    DOM.loginErrorMsg.classList.add('hidden');

    const usuario = DOM.loginUsername.value.trim();
    const senha = DOM.loginPassword.value;

    if (!usuario || !senha) return;

    try {
        const user = await db.login(usuario, senha);
        state.currentUser = user;
        showAppLayout();
        await refreshData();
        renderAll();
        showToast(`Bem-vindo de volta, ${user.nome}!`);
        DOM.formLogin.reset();
    } catch (error) {
        DOM.loginErrorText.textContent = error.message || 'Erro ao realizar login.';
        DOM.loginErrorMsg.classList.remove('hidden');
    }
}

// ---- DEPARTAMENTOS ----
window.openDeptModal = function(id = null, name = '') {
    DOM.formDept.reset();
    if (id) {
        document.getElementById('modal-dept-title').textContent = 'Editar Departamento';
        DOM.formDeptId.value = id;
        DOM.formDeptName.value = name;
    } else {
        document.getElementById('modal-dept-title').textContent = 'Cadastrar Departamento';
        DOM.formDeptId.value = '';
    }
    document.getElementById('modal-dept').classList.add('active');
    DOM.formDeptName.focus();
};

async function handleDeptSubmit(e) {
    e.preventDefault();
    const id = DOM.formDeptId.value;
    const nome = DOM.formDeptName.value.trim();

    if (!nome) return;

    try {
        if (id) {
            await db.updateDepartment(id, nome);
            showToast('Departamento atualizado com sucesso!');
        } else {
            await db.addDepartment(nome);
            showToast('Departamento cadastrado com sucesso!');
        }
        closeModal('modal-dept');
        await refreshData();
        renderAll();
    } catch (error) {
        showToast(error.message || 'Erro ao processar departamento.', 'danger');
    }
}

window.deleteDeptHandler = async function(id) {
    if (confirm('Tem certeza de que deseja excluir este departamento?')) {
        try {
            await db.deleteDepartment(id);
            showToast('Departamento excluído com sucesso!');
            await refreshData();
            renderAll();
        } catch (error) {
            showToast(error.message, 'danger');
        }
    }
};

// ---- IMPRESSORAS ----
window.openPrinterModal = function(id = null) {
    DOM.formPrinter.reset();
    populateDropdowns();

    if (id) {
        document.getElementById('modal-printer-title').textContent = 'Editar Impressora';
        const printer = state.printers.find(p => p.id === id);
        if (printer) {
            DOM.formPrinterId.value = printer.id;
            DOM.formPrinterModel.value = printer.nome_modelo;
            DOM.formPrinterToner.value = printer.modelo_toner;
            DOM.formPrinterDept.value = printer.id_departamento;
            DOM.formPrinterTag.value = printer.tag_ativo;
            DOM.formPrinterIp.value = printer.ip;
        }
    } else {
        document.getElementById('modal-printer-title').textContent = 'Cadastrar Impressora';
        DOM.formPrinterId.value = '';
    }
    document.getElementById('modal-printer').classList.add('active');
    DOM.formPrinterModel.focus();
};

async function handlePrinterSubmit(e) {
    e.preventDefault();
    const id = DOM.formPrinterId.value;
    
    const printerData = {
        nome_modelo: DOM.formPrinterModel.value.trim(),
        modelo_toner: DOM.formPrinterToner.value.trim(),
        id_departamento: parseInt(DOM.formPrinterDept.value),
        tag_ativo: DOM.formPrinterTag.value.trim(),
        ip: DOM.formPrinterIp.value.trim()
    };

    if (!printerData.nome_modelo || !printerData.modelo_toner || !printerData.id_departamento) {
        showToast('Preencha os campos obrigatórios.', 'danger');
        return;
    }

    try {
        if (id) {
            await db.updatePrinter(id, printerData);
            showToast('Impressora atualizada com sucesso!');
        } else {
            await db.addPrinter(printerData);
            showToast('Impressora cadastrada com sucesso!');
        }
        closeModal('modal-printer');
        await refreshData();
        renderAll();
    } catch (error) {
        showToast(error.message || 'Erro ao processar impressora.', 'danger');
    }
}

window.deletePrinterHandler = async function(id) {
    if (confirm('Tem certeza de que deseja excluir esta impressora?')) {
        try {
            await db.deletePrinter(id);
            showToast('Impressora excluída com sucesso!');
            await refreshData();
            renderAll();
        } catch (error) {
            showToast(error.message, 'danger');
        }
    }
};

// ---- TROCAS / SUBSTITUIÇÕES ----
window.openExchangeModal = function() {
    DOM.formExchange.reset();
    populateDropdowns();

    DOM.formExchangePrinter.innerHTML = '<option value="">-- Selecione primeiro o departamento --</option>';
    DOM.formExchangePrinter.disabled = true;

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    DOM.formExchangeDate.value = `${year}-${month}-${day}`;

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    DOM.formExchangeTime.value = `${hours}:${minutes}`;
    
    // Preenche o responsável com o nome do usuário logado por padrão
    if (state.currentUser) {
        DOM.formExchangeResponsible.value = state.currentUser.nome;
    }

    document.getElementById('modal-exchange').classList.add('active');
};

function handleExchangeDeptChange() {
    const deptId = DOM.formExchangeDept.value;
    DOM.formExchangePrinter.innerHTML = '';

    if (!deptId) {
        DOM.formExchangePrinter.innerHTML = '<option value="">-- Selecione primeiro o departamento --</option>';
        DOM.formExchangePrinter.disabled = true;
        return;
    }

    const filteredPrinters = state.printers.filter(p => p.id_departamento === parseInt(deptId));

    if (filteredPrinters.length === 0) {
        DOM.formExchangePrinter.innerHTML = '<option value="">Nenhuma impressora vinculada a este departamento</option>';
        DOM.formExchangePrinter.disabled = true;
    } else {
        DOM.formExchangePrinter.innerHTML = '<option value="">-- Selecione a Impressora --</option>';
        filteredPrinters.forEach(p => {
            DOM.formExchangePrinter.innerHTML += `<option value="${p.id}">${p.nome_modelo} [Toner: ${p.modelo_toner}]</option>`;
        });
        DOM.formExchangePrinter.disabled = false;
    }
}

async function handleExchangeSubmit(e) {
    e.preventDefault();

    const exchangeData = {
        id_impressora: parseInt(DOM.formExchangePrinter.value),
        data: DOM.formExchangeDate.value,
        horario: DOM.formExchangeTime.value,
        responsavel: DOM.formExchangeResponsible.value.trim(),
        observacoes: DOM.formExchangeObs.value.trim()
    };

    if (!exchangeData.id_impressora || !exchangeData.data || !exchangeData.horario || !exchangeData.responsavel) {
        showToast('Preencha os campos obrigatórios.', 'danger');
        return;
    }

    try {
        await db.addExchange(exchangeData);
        showToast('Substituição de toner registrada com sucesso!');
        closeModal('modal-exchange');
        await refreshData();
        renderAll();
    } catch (error) {
        showToast('Erro ao registrar troca.', 'danger');
    }
}

window.deleteExchangeHandler = async function(id) {
    if (confirm('Deseja realmente remover este registro de troca do histórico?')) {
        try {
            await db.deleteExchange(id);
            showToast('Registro de troca excluído!');
            await refreshData();
            renderAll();
        } catch (error) {
            showToast('Erro ao remover troca.', 'danger');
        }
    }
};

// ---- USUÁRIOS (ADMIN APENAS) ----
window.openUserModal = function() {
    DOM.formUser.reset();
    document.getElementById('modal-user').classList.add('active');
    DOM.formUserName.focus();
};

async function handleUserSubmit(e) {
    e.preventDefault();

    const userData = {
        nome: DOM.formUserName.value.trim(),
        usuario: DOM.formUserLogin.value.trim().toLowerCase(),
        senha: DOM.formUserPass.value,
        nivel: DOM.formUserLevel.value
    };

    if (!userData.nome || !userData.usuario || !userData.senha || !userData.nivel) {
        showToast('Preencha todos os campos obrigatórios.', 'danger');
        return;
    }

    try {
        await db.addUser(userData);
        showToast('Usuário cadastrado com sucesso!');
        closeModal('modal-user');
        await refreshData();
        renderUsers();
    } catch (error) {
        showToast(error.message || 'Erro ao cadastrar usuário.', 'danger');
    }
}

window.deleteUserHandler = async function(id) {
    if (confirm('Tem certeza de que deseja remover o acesso deste usuário?')) {
        try {
            await db.deleteUser(id);
            showToast('Acesso removido com sucesso!');
            await refreshData();
            renderUsers();
        } catch (error) {
            showToast(error.message, 'danger');
        }
    }
};

// =========================================================================
// UTILITÁRIOS E AUXILIARES
// =========================================================================

function formatDateBR(dateString) {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}
