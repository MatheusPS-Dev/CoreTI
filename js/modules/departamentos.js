// modules/departamentos.js - CRUD e Renderização de Departamentos
// ================================================================

import { state, DOM } from '../state.js';
import { db } from '../api.js';
import { showToast } from '../toast.js';
import { closeModal } from '../utils.js';

/** Renderiza a tabela de departamentos */
export function renderDepartments() {
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

/**
 * Abre o modal de departamento (cadastro ou edição).
 * @param {number|null} id - ID do departamento (null = cadastro novo)
 * @param {string} name - Nome atual do departamento (para edição)
 */
export function openDeptModal(id = null, name = '') {
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
}

// Expor para handlers inline do HTML
window.openDeptModal = openDeptModal;

/**
 * Configura os event listeners de departamentos.
 * @param {Function} onDataChanged - Callback chamado após alterações nos dados
 */
export function setupDepartamentosEvents(onDataChanged) {
    DOM.btnAddDept.addEventListener('click', () => openDeptModal());

    DOM.formDept.addEventListener('submit', async (e) => {
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
            await onDataChanged();
        } catch (error) {
            showToast(error.message || 'Erro ao processar departamento.', 'danger');
        }
    });

    window.deleteDeptHandler = async function(id) {
        if (confirm('Tem certeza de que deseja excluir este departamento?')) {
            try {
                await db.deleteDepartment(id);
                showToast('Departamento excluído com sucesso!');
                await onDataChanged();
            } catch (error) {
                showToast(error.message, 'danger');
            }
        }
    };
}
