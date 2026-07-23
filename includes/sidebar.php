    <!-- ==================== MOBILE SIDEBAR ==================== -->
    <div class="sidebar-backdrop fixed inset-0 bg-black/40 z-[55]" id="sidebar-backdrop"></div>
    <aside id="app-sidebar" class="mobile-sidebar fixed top-0 left-0 w-72 h-full bg-inverse-surface z-[60] flex flex-col shadow-2xl md:hidden">
        <div class="flex items-center justify-between px-6 h-16 border-b border-outline-variant/30">
            <span class="font-headline-lg text-xl font-bold text-primary-fixed">CoreTI</span>
            <button onclick="document.getElementById('app-sidebar').classList.remove('active'); document.getElementById('sidebar-backdrop').classList.remove('active');" class="p-1 text-surface-variant hover:text-primary-fixed-dim rounded-lg">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
        <nav class="flex flex-col py-4 gap-1 px-3">
            <a href="#" class="menu-item active flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors" data-target="dashboard">
                <span class="material-symbols-outlined" style="font-size:20px">dashboard</span> Dashboard
            </a>
            <a href="#" class="menu-item flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-surface-variant hover:text-primary-fixed-dim hover:bg-white/5 transition-colors" data-target="impressoras">
                <span class="material-symbols-outlined" style="font-size:20px">print</span> Impressoras
            </a>
            <a href="#" class="menu-item flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-surface-variant hover:text-primary-fixed-dim hover:bg-white/5 transition-colors" data-target="estoque">
                <span class="material-symbols-outlined" style="font-size:20px">inventory_2</span> Estoque
            </a>
            <a href="#" class="menu-item flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-surface-variant hover:text-primary-fixed-dim hover:bg-white/5 transition-colors" data-target="departamentos">
                <span class="material-symbols-outlined" style="font-size:20px">corporate_fare</span> Departamentos
            </a>
            <a href="#" class="menu-item flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-surface-variant hover:text-primary-fixed-dim hover:bg-white/5 transition-colors" data-target="trocas">
                <span class="material-symbols-outlined" style="font-size:20px">history</span> Histórico de Trocas
            </a>
            <a href="#" class="menu-item flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-surface-variant hover:text-primary-fixed-dim hover:bg-white/5 transition-colors hidden" id="sidebar-item-usuarios" data-target="usuarios">
                <span class="material-symbols-outlined" style="font-size:20px">admin_panel_settings</span> Usuários
            </a>
            <a href="#" class="menu-item flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-surface-variant hover:text-primary-fixed-dim hover:bg-white/5 transition-colors" data-target="anydesk">
                <span class="material-symbols-outlined" style="font-size:20px">desktop_windows</span> AnyDesk
            </a>
        </nav>
        
        <div class="mt-auto px-6 py-4 border-t border-outline-variant/30">
            <div class="text-xs font-semibold text-primary-fixed mb-1" id="session-user-name-mobile">Carregando...</div>
            <div id="app-mode-badge-mobile" class="flex items-center gap-2 text-[10px] text-surface-variant">
                <span class="status-dot-mobile w-1.5 h-1.5 rounded-full bg-green-500"></span>
                <span id="app-mode-text-mobile">Carregando...</span>
            </div>
        </div>
    </aside>
