        <!-- ========== SECTION: DASHBOARD ========== -->
        <section id="section-dashboard" class="app-section active">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 class="font-headline-lg text-[28px] md:text-headline-lg text-on-surface mb-1">Dashboard Principal</h1>
                    <p class="text-on-surface-variant">Visão geral do consumo de toners e status das impressoras.</p>
                </div>
                <button id="btn-quick-exchange" class="bg-primary text-on-primary hover:bg-surface-tint px-5 py-2.5 rounded-lg font-label-sm text-label-sm transition-colors flex items-center gap-2 shadow-sm">
                    <span class="material-symbols-outlined" style="font-size:18px">add</span>
                    Registrar Nova Troca
                </button>
            </div>

            <!-- Low Stock Alerts -->
            <div id="low-stock-alert-container" class="mb-6 hidden"></div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-lg mb-10">
                <div class="bg-surface-container-lowest border border-surface-dim rounded-xl p-6 flex flex-col relative overflow-hidden group">
                    <div class="absolute -right-4 -top-4 w-24 h-24 bg-surface-container-low rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
                    <div class="flex justify-between items-start mb-4 relative z-10">
                        <div class="p-3 bg-surface-container rounded-lg text-on-surface"><span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">swap_horiz</span></div>
                        <span class="font-label-sm text-label-sm text-on-surface-variant bg-surface px-2 py-1 rounded border border-surface-dim">Total</span>
                    </div>
                    <div class="relative z-10">
                        <h3 class="font-display-lg text-display-lg text-on-surface mb-1" id="stat-total-exchanges">0</h3>
                        <p class="font-label-sm text-label-sm text-on-surface-variant">Total de Trocas</p>
                    </div>
                </div>
                <div class="bg-surface-container-lowest border border-surface-dim rounded-xl p-6 flex flex-col relative overflow-hidden group">
                    <div class="absolute -right-4 -top-4 w-24 h-24 bg-primary-container/20 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
                    <div class="flex justify-between items-start mb-4 relative z-10">
                        <div class="p-3 bg-primary-container/20 text-on-primary-container rounded-lg"><span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">print</span></div>
                        <span class="font-label-sm text-label-sm text-on-primary-container bg-primary-fixed px-2 py-1 rounded">Ativas</span>
                    </div>
                    <div class="relative z-10">
                        <h3 class="font-display-lg text-display-lg text-on-surface mb-1" id="stat-total-printers">0</h3>
                        <p class="font-label-sm text-label-sm text-on-surface-variant">Impressoras Monitoradas</p>
                    </div>
                </div>
                <div class="bg-surface-container-lowest border border-surface-dim rounded-xl p-6 flex flex-col relative overflow-hidden group">
                    <div class="absolute -right-4 -top-4 w-24 h-24 bg-surface-container-low rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
                    <div class="flex justify-between items-start mb-4 relative z-10">
                        <div class="p-3 bg-surface-container rounded-lg text-on-surface"><span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">corporate_fare</span></div>
                        <span class="font-label-sm text-label-sm text-on-surface-variant bg-surface px-2 py-1 rounded border border-surface-dim">Setores</span>
                    </div>
                    <div class="relative z-10">
                        <h3 class="font-display-lg text-display-lg text-on-surface mb-1" id="stat-total-depts">0</h3>
                        <p class="font-label-sm text-label-sm text-on-surface-variant">Departamentos</p>
                    </div>
                </div>
            </div>

            <!-- Analytics: Chart + Critical Printers -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-lg mb-10">
                <div class="bg-surface-container-lowest border border-surface-dim rounded-xl p-6">
                    <div class="flex justify-between items-center mb-4">
                        <span class="font-title-md text-title-md text-on-surface">Trocas por Departamento</span>
                        <span class="text-xs text-on-surface-variant">Demanda de insumos</span>
                    </div>
                    <div id="dept-chart-container" class="flex flex-col gap-1"></div>
                </div>
                <div class="bg-surface-container-lowest border border-surface-dim rounded-xl p-6">
                    <div class="flex justify-between items-center mb-4">
                        <span class="font-title-md text-title-md text-on-surface">Impressoras Críticas</span>
                        <span class="text-xs text-on-surface-variant">Mais trocas realizadas</span>
                    </div>
                    <div id="printer-critical-list"></div>
                </div>
            </div>

            <!-- Recent Exchanges Table -->
            <div class="bg-surface-container-lowest border border-surface-dim rounded-xl overflow-hidden">
                <div class="px-6 py-4 border-b border-surface-dim">
                    <span class="font-title-md text-title-md text-on-surface">Últimas Trocas de Toner</span>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-surface-container-low border-b border-surface-dim">
                                <th class="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant font-semibold">Data / Hora</th>
                                <th class="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant font-semibold">Impressora</th>
                                <th class="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant font-semibold">Departamento</th>
                                <th class="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant font-semibold">Responsável</th>
                                <th class="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant font-semibold">Observações</th>
                                <th class="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant font-semibold w-20">Ações</th>
                            </tr>
                        </thead>
                        <tbody id="dashboard-recent-table-body" class="text-sm"></tbody>
                    </table>
                </div>
            </div>
        </section>
