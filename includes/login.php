    <!-- ==================== TELA DE LOGIN ==================== -->
    <div id="login-screen" class="fixed inset-0 bg-background z-[150] flex items-center justify-center p-4">
        <div class="bg-surface-container-lowest border border-surface-dim rounded-2xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden">
            <!-- Decorative circle -->
            <div class="absolute -right-10 -top-10 w-32 h-32 bg-primary/5 rounded-full"></div>
            
            <div class="text-center mb-8 relative z-10">
                <span class="inline-flex p-3 bg-primary-container/20 text-primary rounded-xl mb-4">
                    <span class="material-symbols-outlined style-filled" style="font-size: 32px">vpn_key</span>
                </span>
                <h1 class="font-headline-lg text-headline-lg text-on-surface mb-2">Acesso ao CoreTI</h1>
                <p class="text-on-surface-variant text-sm">Insira suas credenciais para entrar no painel de controle.</p>
            </div>

            <form id="form-login" class="space-y-5 relative z-10">
                <div>
                    <label class="block font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase">Nome de Usuário</label>
                    <div class="relative">
                        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline" style="font-size:18px">person</span>
                        <input id="login-username" type="text" required class="w-full bg-surface-container border border-outline-variant rounded-lg pl-10 pr-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all text-on-surface" placeholder="Ex: admin">
                    </div>
                </div>
                <div>
                    <label class="block font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase">Senha</label>
                    <div class="relative">
                        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline" style="font-size:18px">lock</span>
                        <input id="login-password" type="password" required class="w-full bg-surface-container border border-outline-variant rounded-lg pl-10 pr-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all text-on-surface" placeholder="••••••••">
                    </div>
                </div>

                <div id="login-error-msg" class="hidden text-error text-xs font-semibold bg-error-container/30 border border-error/20 p-3 rounded-lg flex items-center gap-2">
                    <span class="material-symbols-outlined text-sm">error</span>
                    <span id="login-error-text">Credenciais inválidas.</span>
                </div>

                <button type="submit" class="w-full bg-primary text-on-primary hover:bg-surface-tint py-3 rounded-lg font-label-sm text-label-sm transition-colors flex items-center justify-center gap-2 shadow-sm font-semibold">
                    ENTRAR <span class="material-symbols-outlined" style="font-size: 16px">login</span>
                </button>
            </form>
        </div>
    </div>
