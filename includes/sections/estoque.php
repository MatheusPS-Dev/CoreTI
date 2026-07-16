        <!-- ========== SECTION: ESTOQUE ========== -->
        <section id="section-estoque" class="app-section">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 class="font-headline-lg text-[28px] md:text-headline-lg text-on-surface mb-1">Controle de Estoque</h1>
                    <p class="text-on-surface-variant">Gerencie os suprimentos de TI e configure alertas de baixo estoque.</p>
                </div>
                <button id="btn-add-estoque" class="bg-primary text-on-primary hover:bg-surface-tint px-5 py-2.5 rounded-lg font-label-sm text-label-sm transition-colors flex items-center gap-2 shadow-sm">
                    <span class="material-symbols-outlined" style="font-size:18px">add</span>
                    Adicionar Item
                </button>
            </div>
            <div class="bg-surface-container-lowest border border-surface-dim rounded-xl overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-surface-container-low border-b border-surface-dim">
                                <th class="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant font-semibold">Item</th>
                                <th class="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant font-semibold">Categoria</th>
                                <th class="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant font-semibold text-center">Quantidade</th>
                                <th class="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant font-semibold text-center">Limite Mínimo</th>
                                <th class="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant font-semibold text-center">Status</th>
                                <th class="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant font-semibold text-right pr-8 w-32">Ações</th>
                            </tr>
                        </thead>
                        <tbody id="estoque-table-body" class="text-sm"></tbody>
                    </table>
                </div>
            </div>
        </section>
