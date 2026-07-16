// modules/dashboard.js - Renderização do Dashboard Principal
// ===========================================================

import { state, DOM } from '../state.js';
import { formatDateBR } from '../utils.js';

/** Renderiza todo o conteúdo do Dashboard */
export function renderDashboard() {
    // 0. Alertas de estoque baixo
    if (DOM.lowStockAlertContainer) {
        const lowStockItems = (state.estoque || []).filter(item => item.quantidade <= item.quantidade_minima);
        if (lowStockItems.length > 0) {
            DOM.lowStockAlertContainer.classList.remove('hidden');
            DOM.lowStockAlertContainer.innerHTML = lowStockItems.map(item => `
                <div class="bg-error-container text-on-error-container p-4 rounded-xl flex items-center gap-3 border border-error/20 mb-2">
                    <span class="material-symbols-outlined" style="font-size:22px">warning</span>
                    <div class="flex-1">
                        <span class="font-semibold">${item.nome}</span>
                        <span class="text-sm"> — Restam <strong>${item.quantidade}</strong> un. (mínimo: ${item.quantidade_minima})</span>
                    </div>
                    <span class="px-2.5 py-1 bg-error/15 text-xs font-semibold rounded-full">${item.quantidade === 0 ? 'Esgotado' : 'Baixo Estoque'}</span>
                </div>
            `).join('');
        } else {
            DOM.lowStockAlertContainer.classList.add('hidden');
            DOM.lowStockAlertContainer.innerHTML = '';
        }
    }

    // 1. Atualizar cards numéricos
    DOM.statTotalExchanges.textContent = state.stats.totalExchanges;
    DOM.statTotalPrinters.textContent = state.stats.totalPrinters;
    DOM.statTotalDepts.textContent = state.stats.totalDepartments;

    // 2. Gráfico de Consumo por Departamento (CSS bars)
    DOM.deptChartContainer.innerHTML = '';
    if (state.stats.exchangesByDept.length === 0) {
        DOM.deptChartContainer.innerHTML = `<div class="py-8 text-center text-on-surface-variant text-sm">Sem dados de trocas para exibir.</div>`;
    } else {
        const maxExchanges = Math.max(...state.stats.exchangesByDept.map(d => d.count), 1);
        state.stats.exchangesByDept.forEach(item => {
            const percentage = (item.count / maxExchanges) * 100;
            const barItem = document.createElement('div');
            barItem.className = 'flex items-center gap-3 py-2';
            barItem.innerHTML = `
                <span class="w-28 text-sm font-medium text-on-surface-variant truncate" title="${item.name}">${item.name}</span>
                <div class="flex-1 h-3 bg-surface-container rounded-full overflow-hidden">
                    <div class="h-full bg-primary rounded-full transition-all duration-500" style="width: ${percentage}%"></div>
                </div>
                <span class="w-8 text-sm font-semibold text-on-surface text-right">${item.count}</span>
            `;
            DOM.deptChartContainer.appendChild(barItem);
        });
    }

    // 3. Impressoras Críticas (Top 5 mais trocas)
    DOM.printerCriticalList.innerHTML = '';
    const topPrinters = state.stats.exchangesByPrinter;
    if (topPrinters.length === 0) {
        DOM.printerCriticalList.innerHTML = `<div class="py-8 text-center text-on-surface-variant text-sm">Sem dados de impressoras.</div>`;
    } else {
        topPrinters.forEach(item => {
            const printerObj = state.printers.find(p => p.nome_modelo === item.name);
            const tonerModel = printerObj ? printerObj.modelo_toner : 'N/A';
            const deptName = printerObj ? (state.departments.find(d => d.id === printerObj.id_departamento)?.nome || 'TI') : 'TI';

            const indicator = document.createElement('div');
            indicator.className = 'flex items-center justify-between py-3 border-b border-surface-dim last:border-0';
            indicator.innerHTML = `
                <div>
                    <div class="font-medium text-on-surface">${item.name}</div>
                    <div class="text-xs text-on-surface-variant">Toner: ${tonerModel} | Depto: ${deptName}</div>
                </div>
                <span class="px-3 py-1 bg-primary-container/20 text-on-primary-container text-xs font-semibold rounded-full">${item.count} trocas</span>
            `;
            DOM.printerCriticalList.appendChild(indicator);
        });
    }

    // 4. Tabela de últimas 5 trocas
    DOM.dashboardRecentTableBody.innerHTML = '';
    if (state.stats.recentExchanges.length === 0) {
        DOM.dashboardRecentTableBody.innerHTML = `
            <tr><td colspan="6" class="px-6 py-12 text-center text-on-surface-variant">Nenhuma troca registrada até o momento.</td></tr>
        `;
    } else {
        state.stats.recentExchanges.forEach(e => {
            const formattedDate = formatDateBR(e.data);
            const row = document.createElement('tr');
            row.className = 'border-b border-surface-dim hover:bg-surface/50 transition-colors';
            row.innerHTML = `
                <td class="px-6 py-4">
                    <div class="font-semibold">${formattedDate}</div>
                    <div class="text-xs text-on-surface-variant">${e.horario}</div>
                </td>
                <td class="px-6 py-4 font-medium">${e.impressora_modelo}</td>
                <td class="px-6 py-4"><span class="px-2.5 py-1 bg-primary-container/20 text-on-primary-container text-xs font-semibold rounded-full">${e.departamento_nome}</span></td>
                <td class="px-6 py-4">${e.responsavel}</td>
                <td class="px-6 py-4 text-on-surface-variant max-w-[250px] truncate" title="${e.observacoes || 'Sem observações'}">
                    ${e.observacoes || '<span class="italic opacity-50">Sem observações</span>'}
                </td>
                <td class="px-6 py-4">
                    <button class="p-1.5 text-error hover:bg-error-container rounded-md transition-colors" onclick="deleteExchangeHandler(${e.id})" title="Excluir">
                        <span class="material-symbols-outlined" style="font-size:18px">delete</span>
                    </button>
                </td>
            `;
            DOM.dashboardRecentTableBody.appendChild(row);
        });
    }
}
