        <!-- ========== SECTION: IMPRESSORAS ========== -->
        <section id="section-impressoras" class="app-section">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 class="font-headline-lg text-[28px] md:text-headline-lg text-on-surface mb-1">Gerenciamento de Impressoras</h1>
                    <p class="text-on-surface-variant">Monitore o status e localização física do seu inventário de impressão.</p>
                </div>
                <button id="btn-add-printer" class="bg-primary text-on-primary hover:bg-surface-tint px-5 py-2.5 rounded-lg font-label-sm text-label-sm transition-colors flex items-center gap-2 shadow-sm">
                    <span class="material-symbols-outlined" style="font-size:18px">add</span>
                    Adicionar Impressora
                </button>
            </div>
            <!-- Filters -->
            <div class="bg-surface-container-lowest border border-surface-dim rounded-xl p-4 md:p-6 mb-6 flex flex-col md:flex-row gap-4 items-end">
                <div class="flex-1 w-full flex flex-col gap-1">
                    <label class="font-label-sm text-label-sm text-on-surface-variant">Busca Global</label>
                    <div class="relative">
                        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" style="font-size:18px">search</span>
                        <input id="printer-search-input" type="text" class="w-full bg-surface-container border border-outline-variant rounded-lg pl-10 pr-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm text-on-surface placeholder:text-outline" placeholder="Buscar por IP, Tag ou Modelo...">
                    </div>
                </div>
                <div class="flex-1 w-full flex flex-col gap-1">
                    <label class="font-label-sm text-label-sm text-on-surface-variant">Departamento</label>
                    <select id="printer-dept-filter" class="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm text-on-surface appearance-none">
                        <option value="">Todos os Departamentos</option>
                    </select>
                </div>
            </div>
            <div class="bg-surface-container-lowest border border-surface-dim rounded-xl overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-surface-container-low border-b border-surface-dim">
                                <th class="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant font-semibold">Modelo</th>
                                <th class="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant font-semibold">Tag</th>
                                <th class="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant font-semibold">Endereço IP</th>
                                <th class="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant font-semibold">Modelo de Toner</th>
                                <th class="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant font-semibold">Departamento</th>
                                <th class="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant font-semibold text-right pr-8 w-32">Ações</th>
                            </tr>
                        </thead>
                        <tbody id="printers-table-body" class="text-sm"></tbody>
                    </table>
                </div>
            </div>
        </section>
