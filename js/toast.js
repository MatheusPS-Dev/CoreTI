// toast.js - Sistema de Notificações Toast
// ==========================================

import { DOM } from './state.js';

/**
 * Exibe uma notificação toast na tela.
 * @param {string} message - Texto da notificação
 * @param {'success'|'danger'} type - Tipo do toast
 */
export function showToast(message, type = 'success') {
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
