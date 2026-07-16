// state.js - Estado Global e Referências DOM da Aplicação CoreTI
// ================================================================

// Estado compartilhado — todos os módulos importam daqui
export const state = {
    currentTab: 'dashboard',
    departments: [],
    printers: [],
    exchanges: [],
    users: [],
    estoque: [],
    stats: {},
    currentUser: null // Sessão do usuário logado
};

// Referências DOM — populadas uma vez após DOMContentLoaded
export const DOM = {};

/**
 * Inicializa todas as referências DOM.
 * Deve ser chamado uma vez após o DOM estar pronto.
 */
export function initDOM() {
    // Autenticação & Layout
    DOM.loginScreen = document.getElementById('login-screen');
    DOM.formLogin = document.getElementById('form-login');
    DOM.loginUsername = document.getElementById('login-username');
    DOM.loginPassword = document.getElementById('login-password');
    DOM.loginErrorMsg = document.getElementById('login-error-msg');
    DOM.loginErrorText = document.getElementById('login-error-text');

    DOM.mainNav = document.getElementById('main-nav');
    DOM.mainContent = document.getElementById('main-content');
    DOM.sidebar = document.getElementById('app-sidebar');
    DOM.sidebarBackdrop = document.getElementById('sidebar-backdrop');
    DOM.btnHamburger = document.getElementById('btn-hamburger');
    DOM.menuItems = document.querySelectorAll('.menu-item');
    DOM.sections = document.querySelectorAll('.app-section');
    DOM.appModeText = document.getElementById('app-mode-text');
    DOM.appModeBadge = document.getElementById('app-mode-badge');
    DOM.toastContainer = document.getElementById('toast-container');

    // Perfil do Usuário
    DOM.sessionUserName = document.getElementById('session-user-name');
    DOM.sessionUserLevel = document.getElementById('session-user-level');
    DOM.sessionUserNameMobile = document.getElementById('session-user-name-mobile');
    DOM.btnLogout = document.getElementById('btn-logout');

    // Dashboard
    DOM.statTotalExchanges = document.getElementById('stat-total-exchanges');
    DOM.statTotalPrinters = document.getElementById('stat-total-printers');
    DOM.statTotalDepts = document.getElementById('stat-total-depts');
    DOM.deptChartContainer = document.getElementById('dept-chart-container');
    DOM.printerCriticalList = document.getElementById('printer-critical-list');
    DOM.dashboardRecentTableBody = document.getElementById('dashboard-recent-table-body');
    DOM.btnQuickExchange = document.getElementById('btn-quick-exchange');

    // Departamentos
    DOM.deptsTableBody = document.getElementById('depts-table-body');
    DOM.btnAddDept = document.getElementById('btn-add-dept');
    DOM.formDept = document.getElementById('form-dept');
    DOM.formDeptId = document.getElementById('form-dept-id');
    DOM.formDeptName = document.getElementById('form-dept-name');

    // Impressoras
    DOM.printersTableBody = document.getElementById('printers-table-body');
    DOM.btnAddPrinter = document.getElementById('btn-add-printer');
    DOM.formPrinter = document.getElementById('form-printer');
    DOM.formPrinterId = document.getElementById('form-printer-id');
    DOM.formPrinterModel = document.getElementById('form-printer-model');
    DOM.formPrinterToner = document.getElementById('form-printer-toner');
    DOM.formPrinterDept = document.getElementById('form-printer-dept');
    DOM.formPrinterTag = document.getElementById('form-printer-tag');
    DOM.formPrinterIp = document.getElementById('form-printer-ip');
    DOM.printerSearchInput = document.getElementById('printer-search-input');
    DOM.printerDeptFilter = document.getElementById('printer-dept-filter');

    // Trocas
    DOM.exchangesTableBody = document.getElementById('exchanges-table-body');
    DOM.btnAddExchangeMain = document.getElementById('btn-add-exchange-main');
    DOM.formExchange = document.getElementById('form-exchange');
    DOM.formExchangeDept = document.getElementById('form-exchange-dept');
    DOM.formExchangePrinter = document.getElementById('form-exchange-printer');
    DOM.formExchangeDate = document.getElementById('form-exchange-date');
    DOM.formExchangeTime = document.getElementById('form-exchange-time');
    DOM.formExchangeResponsible = document.getElementById('form-exchange-responsible');
    DOM.formExchangeObs = document.getElementById('form-exchange-obs');

    // Filtros de Trocas
    DOM.filterExchangeDept = document.getElementById('filter-exchange-dept');
    DOM.filterExchangeStart = document.getElementById('filter-exchange-start');
    DOM.filterExchangeEnd = document.getElementById('filter-exchange-end');
    DOM.btnClearFilters = document.getElementById('btn-clear-filters');

    // Usuários (Admin apenas)
    DOM.usersTableBody = document.getElementById('users-table-body');
    DOM.btnAddUser = document.getElementById('btn-add-user');
    DOM.formUser = document.getElementById('form-user');
    DOM.formUserName = document.getElementById('form-user-name');
    DOM.formUserLogin = document.getElementById('form-user-login');
    DOM.formUserPass = document.getElementById('form-user-pass');
    DOM.formUserLevel = document.getElementById('form-user-level');
    DOM.navItemUsuarios = document.getElementById('nav-item-usuarios');
    DOM.sidebarItemUsuarios = document.getElementById('sidebar-item-usuarios');

    // Estoque
    DOM.estoqueTableBody = document.getElementById('estoque-table-body');
    DOM.btnAddEstoque = document.getElementById('btn-add-estoque');
    DOM.formEstoque = document.getElementById('form-estoque');
    DOM.formEstoqueId = document.getElementById('form-estoque-id');
    DOM.formEstoqueNome = document.getElementById('form-estoque-nome');
    DOM.formEstoqueCategoria = document.getElementById('form-estoque-categoria');
    DOM.formEstoqueQuantidade = document.getElementById('form-estoque-quantidade');
    DOM.formEstoqueMinima = document.getElementById('form-estoque-minima');

    // Dashboard: Alertas de Estoque
    DOM.lowStockAlertContainer = document.getElementById('low-stock-alert-container');
}
