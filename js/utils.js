// utils.js - Funções Utilitárias e Helpers Genéricos
// ===================================================

import { state, DOM } from './state.js';

/**
 * Formata uma data ISO (YYYY-MM-DD) para o formato brasileiro (DD/MM/YYYY).
 * @param {string} dateString - Data no formato YYYY-MM-DD
 * @returns {string} Data formatada
 */
export function formatDateBR(dateString) {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

/**
 * Fecha um modal genérico por ID.
 * @param {string} modalId - ID do elemento modal
 */
export function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Expor closeModal globalmente para handlers inline no HTML (onclick="closeModal(...)")
window.closeModal = closeModal;

/**
 * Preenche os seletores de departamento em formulários e filtros.
 * Deve ser chamado após os dados estarem carregados no state.
 */
export function populateDropdowns() {
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
