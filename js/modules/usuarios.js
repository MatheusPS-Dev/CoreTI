// modules/usuarios.js - CRUD e Renderização de Usuários (Admin)
// ==============================================================

import { state, DOM } from '../state.js';
import { db } from '../api.js';
import { showToast } from '../toast.js';
import { closeModal } from '../utils.js';

/** Renderiza a tabela de usuários do sistema */
export function renderUsers() {
    DOM.usersTableBody.innerHTML = '';

    if (state.users.length === 0) {
        DOM.usersTableBody.innerHTML = `
            <tr><td colspan="5" class="px-6 py-12 text-center text-on-surface-variant">Nenhum usuário cadastrado além do administrador padrão.</td></tr>
        `;
    } else {
        state.users.forEach(u => {
            const formattedDate = u.created_at ? new Date(u.created_at).toLocaleDateString('pt-BR') : '-';
            const row = document.createElement('tr');
            row.className = 'border-b border-surface-dim hover:bg-surface/50 transition-colors group';
            row.innerHTML = `
                <td class="px-6 py-4 font-medium flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                        <span class="material-symbols-outlined" style="font-size:18px">person</span>
                    </div>
                    <span>${u.nome}</span>
                </td>
                <td class="px-6 py-4 font-mono text-sm">${u.usuario}</td>
                <td class="px-6 py-4">
                    <span class="px-2.5 py-1 text-xs font-semibold rounded-full ${u.nivel === 'admin' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}">
                        ${u.nivel === 'admin' ? 'Administrador' : 'Suporte'}
                    </span>
                </td>
                <td class="px-6 py-4 text-on-surface-variant text-sm">${formattedDate}</td>
                <td class="px-6 py-4">
                    <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button class="p-1.5 text-error hover:bg-error-container rounded-md transition-colors" onclick="deleteUserHandler(${u.id})" title="Excluir">
                            <span class="material-symbols-outlined" style="font-size:18px">delete</span>
                        </button>
                    </div>
                </td>
            `;
            DOM.usersTableBody.appendChild(row);
        });
    }
}

/** Abre o modal de cadastrar novo usuário */
export function openUserModal() {
    DOM.formUser.reset();
    document.getElementById('modal-user').classList.add('active');
    DOM.formUserName.focus();
}

/**
 * Configura os event listeners de usuários.
 * @param {Function} onDataChanged - Callback chamado após alterações nos dados
 */
export function setupUsuariosEvents(onDataChanged) {
    DOM.btnAddUser.addEventListener('click', () => openUserModal());

    DOM.formUser.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userData = {
            nome: DOM.formUserName.value.trim(),
            usuario: DOM.formUserLogin.value.trim().toLowerCase(),
            senha: DOM.formUserPass.value,
            nivel: DOM.formUserLevel.value
        };

        if (!userData.nome || !userData.usuario || !userData.senha || !userData.nivel) {
            showToast('Preencha todos os campos obrigatórios.', 'danger');
            return;
        }

        try {
            await db.addUser(userData);
            showToast('Usuário cadastrado com sucesso!');
            closeModal('modal-user');
            await onDataChanged();
        } catch (error) {
            showToast(error.message || 'Erro ao cadastrar usuário.', 'danger');
        }
    });

    window.deleteUserHandler = async function(id) {
        if (confirm('Tem certeza de que deseja remover o acesso deste usuário?')) {
            try {
                await db.deleteUser(id);
                showToast('Acesso removido com sucesso!');
                await onDataChanged();
            } catch (error) {
                showToast(error.message, 'danger');
            }
        }
    };
}
