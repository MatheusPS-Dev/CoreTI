// auth.js - Autenticação, Login, Logout e Sessão
// ================================================

import { state, DOM } from './state.js';
import { db } from './api.js';
import { showToast } from './toast.js';

/**
 * Verifica se há uma sessão de autenticação ativa no localStorage.
 * @param {Function} onSuccess - Callback chamado após sessão restaurada com sucesso
 */
export async function checkAuthSession(onSuccess) {
    const savedSession = localStorage.getItem('coreti_session');
    if (savedSession) {
        try {
            state.currentUser = JSON.parse(savedSession);
            showAppLayout();
            await onSuccess();
        } catch (e) {
            console.error('Falha ao decodificar sessão.', e);
            logout();
        }
    } else {
        showLoginLayout();
    }
}

/** Alterna a exibição para a tela de Login */
export function showLoginLayout() {
    DOM.loginScreen.classList.remove('hidden');
    DOM.mainNav.classList.add('hidden');
    DOM.mainContent.classList.add('hidden');
}

/** Alterna a exibição para a tela do Aplicativo */
export function showAppLayout() {
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
                // Importação circular evitada: switchTab será configurado via setupLoginEvents
                document.querySelector('[data-target="dashboard"]')?.click();
            }
        }
    }
}

/** Realiza o Logout do sistema */
export function logout() {
    localStorage.removeItem('coreti_session');
    state.currentUser = null;
    showLoginLayout();
    showToast('Sessão encerrada.');
}

/** Atualiza o indicador visual de conexão (MySQL Conectado / Modo Offline) */
export function updateModeIndicator() {
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

/**
 * Configura os event listeners de login e logout.
 * @param {Function} onLoginSuccess - Callback chamado após login bem-sucedido
 */
export function setupLoginEvents(onLoginSuccess) {
    DOM.formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        DOM.loginErrorMsg.classList.add('hidden');

        const usuario = DOM.loginUsername.value.trim();
        const senha = DOM.loginPassword.value;

        if (!usuario || !senha) return;

        try {
            const user = await db.login(usuario, senha);
            state.currentUser = user;
            showAppLayout();
            await onLoginSuccess();
            showToast(`Bem-vindo de volta, ${user.nome}!`);
            DOM.formLogin.reset();
        } catch (error) {
            DOM.loginErrorText.textContent = error.message || 'Erro ao realizar login.';
            DOM.loginErrorMsg.classList.remove('hidden');
        }
    });

    DOM.btnLogout.addEventListener('click', logout);
}
