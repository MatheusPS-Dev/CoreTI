// modules/anydesk.js - CRUD e Renderização de PCs AnyDesk
// ========================================================

import { state, DOM } from '../state.js';
import { db } from '../api.js';
import { showToast } from '../toast.js';
import { closeModal } from '../utils.js';

/** Renderiza a tabela de PCs AnyDesk (com suporte a busca) */
export function renderAnydesk() {
    DOM.anydeskTableBody.innerHTML = '';

    // Aplicar filtro de busca
    const searchTerm = (DOM.anydeskSearchInput?.value || '').toLowerCase().trim();
    const filtered = searchTerm
        ? state.anydesk_pcs.filter(pc =>
            pc.nome_usuario.toLowerCase().includes(searchTerm) ||
            pc.ip_pc.toLowerCase().includes(searchTerm) ||
            pc.anydesk_codigo.toLowerCase().includes(searchTerm) ||
            pc.mac_address.toLowerCase().includes(searchTerm) ||
            pc.porta_patchpanel.toLowerCase().includes(searchTerm)
        )
        : state.anydesk_pcs;

    if (filtered.length === 0) {
        const msg = searchTerm
            ? 'Nenhum computador encontrado para esta busca.'
            : 'Nenhum computador cadastrado. Clique em "Adicionar PC" para começar.';
        DOM.anydeskTableBody.innerHTML = `
            <tr><td colspan="6" class="px-6 py-12 text-center text-on-surface-variant">${msg}</td></tr>
        `;
        return;
    }

    filtered.forEach(pc => {
        const row = document.createElement('tr');
        row.className = 'border-b border-surface-dim hover:bg-surface/50 transition-colors group';
        row.innerHTML = `
            <td class="px-6 py-4 font-medium">${pc.nome_usuario}</td>
            <td class="px-6 py-4"><code class="px-2 py-0.5 bg-surface-container text-on-surface-variant text-xs rounded">${pc.ip_pc}</code></td>
            <td class="px-6 py-4"><code class="px-2 py-0.5 bg-surface-container text-on-surface-variant text-xs rounded">${pc.mac_address}</code></td>
            <td class="px-6 py-4"><span class="px-2.5 py-1 bg-surface-container text-on-surface-variant text-xs font-semibold rounded-full">${pc.porta_patchpanel}</span></td>
            <td class="px-6 py-4"><span class="font-semibold text-primary">${pc.anydesk_codigo}</span></td>
            <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button class="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-on-primary rounded-md transition-colors" onclick="connectAnyDesk('${pc.anydesk_codigo}')" title="Conectar via AnyDesk">
                        <span class="material-symbols-outlined" style="font-size:18px">cast</span>
                    </button>
                    <button class="p-1.5 text-secondary hover:bg-secondary-container/20 rounded-md transition-colors" onclick="openAnydeskModal(${pc.id})" title="Editar">
                        <span class="material-symbols-outlined" style="font-size:18px">edit</span>
                    </button>
                    <button class="p-1.5 text-error hover:bg-error-container rounded-md transition-colors" onclick="deleteAnydeskHandler(${pc.id})" title="Excluir">
                        <span class="material-symbols-outlined" style="font-size:18px">delete</span>
                    </button>
                </div>
            </td>
        `;
        DOM.anydeskTableBody.appendChild(row);
    });
}

/**
 * Conecta ao AnyDesk usando o protocolo anydesk://
 * @param {string} codigo - Código AnyDesk do PC
 */
export function connectAnyDesk(codigo) {
    showToast(`Abrindo AnyDesk para ${codigo}...`);
    window.location.href = `anydesk:${codigo}`;
}

// Expor para handlers inline do HTML
window.connectAnyDesk = connectAnyDesk;

/**
 * Abre o modal de AnyDesk (cadastro ou edição).
 * @param {number|null} id - ID do PC (null = cadastro novo)
 */
export function openAnydeskModal(id = null) {
    DOM.formAnydesk.reset();

    if (id) {
        document.getElementById('modal-anydesk-title').textContent = 'Editar Computador';
        const pc = state.anydesk_pcs.find(p => p.id === id);
        if (pc) {
            DOM.formAnydeskId.value = pc.id;
            DOM.formAnydeskUsuario.value = pc.nome_usuario;
            DOM.formAnydeskIp.value = pc.ip_pc;
            DOM.formAnydeskMac.value = pc.mac_address;
            DOM.formAnydeskPorta.value = pc.porta_patchpanel;
            DOM.formAnydeskCodigo.value = pc.anydesk_codigo;
        }
    } else {
        document.getElementById('modal-anydesk-title').textContent = 'Adicionar Computador';
        DOM.formAnydeskId.value = '';
    }
    document.getElementById('modal-anydesk').classList.add('active');
    DOM.formAnydeskUsuario.focus();
}

// Expor para handlers inline do HTML
window.openAnydeskModal = openAnydeskModal;

/**
 * Configura os event listeners de AnyDesk.
 * @param {Function} onDataChanged - Callback chamado após alterações nos dados
 */
export function setupAnydeskEvents(onDataChanged) {
    DOM.btnAddAnydesk.addEventListener('click', () => openAnydeskModal());

    // Busca em tempo real
    if (DOM.anydeskSearchInput) {
        DOM.anydeskSearchInput.addEventListener('input', () => renderAnydesk());
    }

    DOM.formAnydesk.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = DOM.formAnydeskId.value;

        const pcData = {
            nome_usuario: DOM.formAnydeskUsuario.value.trim(),
            ip_pc: DOM.formAnydeskIp.value.trim(),
            mac_address: DOM.formAnydeskMac.value.trim(),
            porta_patchpanel: DOM.formAnydeskPorta.value.trim(),
            anydesk_codigo: DOM.formAnydeskCodigo.value.trim()
        };

        if (!pcData.nome_usuario || !pcData.ip_pc || !pcData.anydesk_codigo) {
            showToast('Nome do usuário, IP e código AnyDesk são obrigatórios.', 'danger');
            return;
        }

        try {
            if (id) {
                await db.updateAnyDeskPc(id, pcData);
                showToast('Computador atualizado com sucesso!');
            } else {
                await db.addAnyDeskPc(pcData);
                showToast('Computador cadastrado com sucesso!');
            }
            closeModal('modal-anydesk');
            await onDataChanged();
        } catch (error) {
            showToast(error.message || 'Erro ao processar cadastro do computador.', 'danger');
        }
    });

    // Handler global: excluir PC
    window.deleteAnydeskHandler = async function(id) {
        if (confirm('Tem certeza de que deseja excluir este computador?')) {
            try {
                await db.deleteAnyDeskPc(id);
                showToast('Computador removido com sucesso!');
                await onDataChanged();
            } catch (error) {
                showToast(error.message, 'danger');
            }
        }
    };
}
