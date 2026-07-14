// modules/trocas.js - CRUD e Renderização do Histórico de Trocas
// ===============================================================

import { state, DOM } from '../state.js';
import { db } from '../api.js';
import { showToast } from '../toast.js';
import { closeModal, populateDropdowns, formatDateBR } from '../utils.js';

/** Renderiza a tabela de trocas com filtros aplicados */
export function renderExchanges() {
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

/** Abre o modal de registrar nova troca */
export function openExchangeModal() {
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
}

/** Handler para mudança de departamento no formulário de troca */
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

/**
 * Configura os event listeners de trocas.
 * @param {Function} onDataChanged - Callback chamado após alterações nos dados
 */
export function setupTrocasEvents(onDataChanged) {
    DOM.formExchange.addEventListener('submit', async (e) => {
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
            await onDataChanged();
        } catch (error) {
            showToast('Erro ao registrar troca.', 'danger');
        }
    });

    DOM.formExchangeDept.addEventListener('change', handleExchangeDeptChange);

    // Filtros
    DOM.filterExchangeDept.addEventListener('change', renderExchanges);
    DOM.filterExchangeStart.addEventListener('change', renderExchanges);
    DOM.filterExchangeEnd.addEventListener('change', renderExchanges);
    DOM.btnClearFilters.addEventListener('click', () => {
        DOM.filterExchangeDept.value = '';
        DOM.filterExchangeStart.value = '';
        DOM.filterExchangeEnd.value = '';
        renderExchanges();
    });

    // Atalhos rápidos para registrar troca
    if (DOM.btnQuickExchange) DOM.btnQuickExchange.addEventListener('click', () => openExchangeModal());
    if (DOM.btnAddExchangeMain) DOM.btnAddExchangeMain.addEventListener('click', () => openExchangeModal());

    window.deleteExchangeHandler = async function(id) {
        if (confirm('Deseja realmente remover este registro de troca do histórico?')) {
            try {
                await db.deleteExchange(id);
                showToast('Registro de troca excluído!');
                await onDataChanged();
            } catch (error) {
                showToast('Erro ao remover troca.', 'danger');
            }
        }
    };
}
