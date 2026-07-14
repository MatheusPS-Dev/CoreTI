// navigation.js - Roteamento, Navegação por Abas e Sidebar Mobile
// ================================================================

import { state, DOM } from './state.js';

// Callback para renderizar o conteúdo de uma aba — configurado pelo app.js
let _renderTabCallback = null;

/**
 * Registra a função de renderização de abas.
 * @param {Function} callback - Função (tabName) => void
 */
export function setRenderTabCallback(callback) {
    _renderTabCallback = callback;
}

/**
 * Troca a aba ativa do sistema.
 * @param {string} tabName - Nome da aba (dashboard, impressoras, etc.)
 */
export function switchTab(tabName) {
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
    if (_renderTabCallback) {
        _renderTabCallback(tabName);
    }
}

/** Configura os event listeners de navegação (menu + sidebar mobile) */
export function setupNavigation() {
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
}
