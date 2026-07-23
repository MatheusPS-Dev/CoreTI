        <!-- ========== SECTION: ANYDESK ========== -->
        <section id="section-anydesk" class="app-section">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 class="font-headline-lg text-[28px] md:text-headline-lg text-on-surface mb-1">AnyDesk — Acesso Remoto</h1>
                    <p class="text-on-surface-variant">Gerencie os computadores cadastrados e conecte-se rapidamente via AnyDesk.</p>
                </div>
                <button id="btn-add-anydesk" class="bg-primary text-on-primary hover:bg-surface-tint px-5 py-2.5 rounded-lg font-label-sm text-label-sm transition-colors flex items-center gap-2 shadow-sm">
                    <span class="material-symbols-outlined" style="font-size:18px">add</span>
                    Adicionar PC
                </button>
            </div>

            <!-- Barra de busca -->
            <div class="mb-6">
                <div class="relative max-w-md">
                    <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" style="font-size:20px">search</span>
                    <input type="text" id="anydesk-search-input" placeholder="Buscar por usuário, IP ou código AnyDesk..." class="w-full bg-surface-container border border-outline-variant rounded-lg pl-10 pr-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface text-sm">
                </div>
            </div>

            <div class="bg-surface-container-lowest border border-surface-dim rounded-xl overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-surface-container-low border-b border-surface-dim">
                                <th class="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant font-semibold">Usuário</th>
                                <th class="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant font-semibold">IP</th>
                                <th class="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant font-semibold">MAC</th>
                                <th class="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant font-semibold">Patch Panel</th>
                                <th class="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant font-semibold">ID AnyDesk</th>
                                <th class="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant font-semibold text-right pr-8 w-44">Ações</th>
                            </tr>
                        </thead>
                        <tbody id="anydesk-table-body" class="text-sm"></tbody>
                    </table>
                </div>
            </div>
        </section>
