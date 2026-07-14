    <!-- Modal: Usuário -->
    <div id="modal-user" class="modal-overlay fixed inset-0 bg-black/50 z-[60] items-center justify-center p-4">
        <div class="bg-surface-container-lowest rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                    <div class="p-2 bg-primary-container/20 text-on-primary-container rounded-lg"><span class="material-symbols-outlined">person_add</span></div>
                    <h2 class="font-title-md text-title-md text-on-surface">Cadastrar Usuário</h2>
                </div>
                <button onclick="closeModal('modal-user')" class="p-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"><span class="material-symbols-outlined">close</span></button>
            </div>
            <form id="form-user">
                <div class="space-y-4 mb-6">
                    <div>
                        <label class="block font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase">Nome Completo *</label>
                        <input type="text" id="form-user-name" required class="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface" placeholder="Ex: Matheus Klenus">
                    </div>
                    <div>
                        <label class="block font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase">Nome de Usuário (Login) *</label>
                        <input type="text" id="form-user-login" required class="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface" placeholder="Ex: matheus.klenus">
                    </div>
                    <div>
                        <label class="block font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase">Senha *</label>
                        <input type="password" id="form-user-pass" required class="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface" placeholder="••••••••">
                    </div>
                    <div>
                        <label class="block font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase">Nível de Acesso *</label>
                        <select id="form-user-level" required class="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-on-surface appearance-none">
                            <option value="user">Suporte (Apenas registros)</option>
                            <option value="admin">Administrador (Total)</option>
                        </select>
                    </div>
                </div>
                <div class="flex justify-end gap-3 pt-2 border-t border-surface-dim">
                    <button type="button" onclick="closeModal('modal-user')" class="px-5 py-2.5 font-label-sm text-label-sm text-on-surface-variant border border-outline-variant rounded-lg hover:bg-surface-container transition-colors">CANCELAR</button>
                    <button type="submit" class="px-5 py-2.5 bg-primary text-on-primary font-label-sm text-label-sm rounded-lg hover:bg-surface-tint transition-colors flex items-center gap-2">
                        <span class="material-symbols-outlined" style="font-size:18px">check</span> CADASTRAR
                    </button>
                </div>
            </form>
        </div>
    </div>
