// modules/estoque.js - CRUD e Renderização de Estoque
// ====================================================

import { state, DOM } from '../state.js';
import { db } from '../api.js';
import { showToast } from '../toast.js';
import { closeModal } from '../utils.js';

/** Renderiza a tabela de estoque */
export function renderEstoque() {
    DOM.estoqueTableBody.innerHTML = '';

    if (state.estoque.length === 0) {
        DOM.estoqueTableBody.innerHTML = `
            <tr><td colspan="6" class="px-6 py-12 text-center text-on-surface-variant">Nenhum item cadastrado no estoque.</td></tr>
        `;
        return;
    }

    state.estoque.forEach(item => {
        const isLow = item.quantidade <= item.quantidade_minima;
        const statusBadge = isLow
            ? '<span class="px-2.5 py-1 bg-error-container text-on-error-container text-xs font-semibold rounded-full">Baixo Estoque</span>'
            : '<span class="px-2.5 py-1 bg-primary-container/20 text-on-primary-container text-xs font-semibold rounded-full">OK</span>';

        const row = document.createElement('tr');
        row.className = 'border-b border-surface-dim hover:bg-surface/50 transition-colors group';
        row.innerHTML = `
            <td class="px-6 py-4 font-medium">${item.nome}</td>
            <td class="px-6 py-4"><span class="px-2.5 py-1 bg-surface-container text-on-surface-variant text-xs font-semibold rounded-full">${item.categoria || 'Geral'}</span></td>
            <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                    <button class="p-1 text-on-surface-variant hover:bg-error-container hover:text-on-error-container rounded-md transition-colors" onclick="adjustEstoqueQty(${item.id}, -1)" title="Remover 1">
                        <span class="material-symbols-outlined" style="font-size:18px">remove</span>
                    </button>
                    <span class="font-semibold text-on-surface min-w-[2rem] text-center ${isLow ? 'text-error' : ''}">${item.quantidade}</span>
                    <button class="p-1 text-on-surface-variant hover:bg-primary-container/20 hover:text-on-primary-container rounded-md transition-colors" onclick="adjustEstoqueQty(${item.id}, 1)" title="Adicionar 1">
                        <span class="material-symbols-outlined" style="font-size:18px">add</span>
                    </button>
                </div>
            </td>
            <td class="px-6 py-4 text-center text-on-surface-variant">${item.quantidade_minima}</td>
            <td class="px-6 py-4 text-center">${statusBadge}</td>
            <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button class="p-1.5 text-secondary hover:bg-secondary-container/20 rounded-md transition-colors" onclick="openEstoqueModal(${item.id})" title="Editar">
                        <span class="material-symbols-outlined" style="font-size:18px">edit</span>
                    </button>
                    <button class="p-1.5 text-error hover:bg-error-container rounded-md transition-colors" onclick="deleteEstoqueHandler(${item.id})" title="Excluir">
                        <span class="material-symbols-outlined" style="font-size:18px">delete</span>
                    </button>
                </div>
            </td>
        `;
        DOM.estoqueTableBody.appendChild(row);
    });
}

/**
 * Abre o modal de estoque (cadastro ou edição).
 * @param {number|null} id - ID do item (null = cadastro novo)
 */
export function openEstoqueModal(id = null) {
    DOM.formEstoque.reset();
    DOM.formEstoqueQuantidade.value = '0';
    DOM.formEstoqueMinima.value = '2';

    if (id) {
        document.getElementById('modal-estoque-title').textContent = 'Editar Item do Estoque';
        const item = state.estoque.find(i => i.id === id);
        if (item) {
            DOM.formEstoqueId.value = item.id;
            DOM.formEstoqueNome.value = item.nome;
            DOM.formEstoqueCategoria.value = item.categoria;
            DOM.formEstoqueQuantidade.value = item.quantidade;
            DOM.formEstoqueMinima.value = item.quantidade_minima;
        }
    } else {
        document.getElementById('modal-estoque-title').textContent = 'Adicionar Item ao Estoque';
        DOM.formEstoqueId.value = '';
    }
    document.getElementById('modal-estoque').classList.add('active');
    DOM.formEstoqueNome.focus();
}

// Expor para handlers inline do HTML
window.openEstoqueModal = openEstoqueModal;

/**
 * Configura os event listeners de estoque.
 * @param {Function} onDataChanged - Callback chamado após alterações nos dados
 */
export function setupEstoqueEvents(onDataChanged) {
    DOM.btnAddEstoque.addEventListener('click', () => openEstoqueModal());

    DOM.formEstoque.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = DOM.formEstoqueId.value;

        const itemData = {
            nome: DOM.formEstoqueNome.value.trim(),
            categoria: DOM.formEstoqueCategoria.value.trim(),
            quantidade: parseInt(DOM.formEstoqueQuantidade.value) || 0,
            quantidade_minima: parseInt(DOM.formEstoqueMinima.value) || 2
        };

        if (!itemData.nome) {
            showToast('O nome do item é obrigatório.', 'danger');
            return;
        }

        try {
            if (id) {
                await db.updateEstoque(id, itemData);
                showToast('Item atualizado com sucesso!');
            } else {
                await db.addEstoque(itemData);
                showToast('Item adicionado ao estoque!');
            }
            closeModal('modal-estoque');
            await onDataChanged();
        } catch (error) {
            showToast(error.message || 'Erro ao processar item de estoque.', 'danger');
        }
    });

    // Handler global: excluir item
    window.deleteEstoqueHandler = async function(id) {
        if (confirm('Tem certeza de que deseja excluir este item do estoque?')) {
            try {
                await db.deleteEstoque(id);
                showToast('Item excluído do estoque!');
                await onDataChanged();
            } catch (error) {
                showToast(error.message, 'danger');
            }
        }
    };

    // Handler global: ajustar quantidade (+1 ou -1)
    window.adjustEstoqueQty = async function(id, delta) {
        const item = state.estoque.find(i => i.id === id);
        if (!item) return;

        const newQty = Math.max(0, item.quantidade + delta);
        try {
            await db.updateEstoque(id, {
                nome: item.nome,
                categoria: item.categoria,
                quantidade: newQty,
                quantidade_minima: item.quantidade_minima
            });
            await onDataChanged();
        } catch (error) {
            showToast(error.message || 'Erro ao atualizar quantidade.', 'danger');
        }
    };
}
