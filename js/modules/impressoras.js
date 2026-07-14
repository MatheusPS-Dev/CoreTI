// modules/impressoras.js - CRUD e Renderização de Impressoras
// =============================================================

import { state, DOM } from '../state.js';
import { db } from '../api.js';
import { showToast } from '../toast.js';
import { closeModal, populateDropdowns } from '../utils.js';

/** Renderiza a tabela de impressoras com filtros aplicados */
export function renderPrinters() {
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

/**
 * Abre o modal de impressora (cadastro ou edição).
 * @param {number|null} id - ID da impressora (null = cadastro novo)
 */
export function openPrinterModal(id = null) {
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
}

// Expor para handlers inline do HTML
window.openPrinterModal = openPrinterModal;

/**
 * Configura os event listeners de impressoras.
 * @param {Function} onDataChanged - Callback chamado após alterações nos dados
 */
export function setupImpressorasEvents(onDataChanged) {
    DOM.btnAddPrinter.addEventListener('click', () => openPrinterModal());

    DOM.formPrinter.addEventListener('submit', async (e) => {
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
            await onDataChanged();
        } catch (error) {
            showToast(error.message || 'Erro ao processar impressora.', 'danger');
        }
    });

    // Filtros em tempo real
    DOM.printerSearchInput.addEventListener('input', renderPrinters);
    DOM.printerDeptFilter.addEventListener('change', renderPrinters);

    window.deletePrinterHandler = async function(id) {
        if (confirm('Tem certeza de que deseja excluir esta impressora?')) {
            try {
                await db.deletePrinter(id);
                showToast('Impressora excluída com sucesso!');
                await onDataChanged();
            } catch (error) {
                showToast(error.message, 'danger');
            }
        }
    };
}
