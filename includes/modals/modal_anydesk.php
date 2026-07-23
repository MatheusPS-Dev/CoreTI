    <!-- Modal: AnyDesk -->
    <div id="modal-anydesk" class="modal-overlay fixed inset-0 bg-black/50 z-[60] items-center justify-center p-4">
        <div class="bg-surface-container-lowest rounded-xl shadow-2xl max-w-lg w-full p-6 relative">
            <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                    <div class="p-2 bg-primary-container/20 text-on-primary-container rounded-lg"><span class="material-symbols-outlined">desktop_windows</span></div>
                    <h2 id="modal-anydesk-title" class="font-title-md text-title-md text-on-surface">Adicionar Computador</h2>
                </div>
                <button onclick="closeModal('modal-anydesk')" class="p-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"><span class="material-symbols-outlined">close</span></button>
            </div>
            <form id="form-anydesk">
                <input type="hidden" id="form-anydesk-id">
                <div class="mb-4">
                    <label class="block font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase">Nome do Usuário *</label>
                    <input type="text" id="form-anydesk-usuario" required class="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface" placeholder="Ex: João Silva">
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase">IP do PC *</label>
                        <input type="text" id="form-anydesk-ip" required class="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface" placeholder="Ex: 192.168.1.100">
                    </div>
                    <div>
                        <label class="block font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase">Endereço MAC *</label>
                        <input type="text" id="form-anydesk-mac" required class="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface" placeholder="Ex: AA:BB:CC:DD:EE:FF">
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label class="block font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase">Porta Patch Panel *</label>
                        <input type="text" id="form-anydesk-porta" required class="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface" placeholder="Ex: P12">
                    </div>
                    <div>
                        <label class="block font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase">ID AnyDesk *</label>
                        <input type="text" id="form-anydesk-codigo" required class="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface" placeholder="Ex: 123 456 789">
                    </div>
                </div>
                <div class="flex justify-end gap-3 pt-2 border-t border-surface-dim">
                    <button type="button" onclick="closeModal('modal-anydesk')" class="px-5 py-2.5 font-label-sm text-label-sm text-on-surface-variant border border-outline-variant rounded-lg hover:bg-surface-container transition-colors">CANCELAR</button>
                    <button type="submit" class="px-5 py-2.5 bg-primary text-on-primary font-label-sm text-label-sm rounded-lg hover:bg-surface-tint transition-colors flex items-center gap-2">
                        <span class="material-symbols-outlined" style="font-size:18px">check</span> SALVAR
                    </button>
                </div>
            </form>
        </div>
    </div>
