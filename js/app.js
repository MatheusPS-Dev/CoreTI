// app.js - Ponto de Entrada Principal da Aplicação CoreTI
// ========================================================
// Este arquivo importa e orquestra todos os módulos do sistema.

import { state, DOM, initDOM } from './state.js';
import { db } from './api.js';
import { showToast } from './toast.js';
import { populateDropdowns } from './utils.js';
import { checkAuthSession, setupLoginEvents, updateModeIndicator } from './auth.js';
import { setupNavigation, setRenderTabCallback } from './navigation.js';

// Módulos de funcionalidade
import { renderDashboard } from './modules/dashboard.js';
import { renderDepartments, setupDepartamentosEvents } from './modules/departamentos.js';
import { renderPrinters, setupImpressorasEvents } from './modules/impressoras.js';
import { renderExchanges, setupTrocasEvents } from './modules/trocas.js';
import { renderUsers, setupUsuariosEvents } from './modules/usuarios.js';
import { renderEstoque, setupEstoqueEvents } from './modules/estoque.js';
import { renderAnydesk, setupAnydeskEvents } from './modules/anydesk.js';

// =========================================================================
// INICIALIZAÇÃO DA APLICAÇÃO
// =========================================================================

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Inicializar referências DOM
    initDOM();

    // 2. Configurar navegação
    setupNavigation();

    // 3. Registrar o dispatcher de renderização de abas
    setRenderTabCallback(renderTabContent);

    // 4. Configurar todos os event listeners
    setupAllEvents();

    // 5. Atualizar indicador de modo (MySQL / Offline)
    updateModeIndicator();

    // 6. Verificar sessão de autenticação
    checkAuthSession(async () => {
        await refreshData();
        renderAll();
    });
});

// =========================================================================
// ORQUESTRAÇÃO CENTRAL
// =========================================================================

/**
 * Carrega os dados mais recentes do banco de dados.
 * Chamado após login e após qualquer operação CRUD.
 */
async function refreshData() {
    if (!state.currentUser) return;
    try {
        state.departments = await db.getDepartments();
        state.printers = await db.getPrinters();
        state.exchanges = await db.getExchanges();
        state.estoque = await db.getEstoque();
        state.anydesk_pcs = await db.getAnyDeskPcs();
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

/**
 * Callback compartilhado: recarrega dados e re-renderiza tudo.
 * Passado como onDataChanged para todos os módulos de CRUD.
 */
async function onDataChanged() {
    await refreshData();
    renderAll();
}

/** Renderiza todo o conteúdo visível */
function renderAll() {
    renderTabContent(state.currentTab);
    populateDropdowns();
}

/**
 * Dispatcher de renderização por aba.
 * Chamado pelo módulo de navegação ao trocar de aba.
 */
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
        case 'estoque':
            renderEstoque();
            break;
        case 'anydesk':
            renderAnydesk();
            break;
    }
}

/** Configura todos os event listeners do sistema */
function setupAllEvents() {
    // Login & Logout
    setupLoginEvents(async () => {
        await refreshData();
        renderAll();
    });

    // Módulos CRUD
    setupDepartamentosEvents(onDataChanged);
    setupImpressorasEvents(onDataChanged);
    setupTrocasEvents(onDataChanged);
    setupUsuariosEvents(onDataChanged);
    setupEstoqueEvents(onDataChanged);
    setupAnydeskEvents(onDataChanged);
}
