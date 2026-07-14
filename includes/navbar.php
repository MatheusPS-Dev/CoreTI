    <!-- ==================== TOP NAVBAR ==================== -->
    <nav class="bg-inverse-surface w-full border-b border-outline-variant z-50 sticky top-0 hidden" id="main-nav">
        <div class="flex justify-between items-center w-full px-4 md:px-lg max-w-container-max mx-auto h-16">
            <!-- Left: Logo -->
            <div class="flex items-center gap-lg">
                <a href="#" class="font-headline-lg text-[28px] font-bold text-primary-fixed shrink-0 tracking-tight">
                    CoreTI
                </a>
            </div>

            <!-- Center: Desktop Nav Links -->
            <div class="hidden md:flex items-center h-full gap-1">
                <a href="#" class="menu-item active h-full flex items-center px-4 font-label-sm text-label-sm transition-colors duration-150" data-target="dashboard">
                    <span>Dashboard</span>
                </a>
                <a href="#" class="menu-item h-full flex items-center px-4 font-label-sm text-label-sm text-surface-variant hover:text-primary-fixed-dim transition-colors duration-150" data-target="impressoras">
                    <span>Impressoras</span>
                </a>
                <a href="#" class="menu-item h-full flex items-center px-4 font-label-sm text-label-sm text-surface-variant hover:text-primary-fixed-dim transition-colors duration-150" data-target="departamentos">
                    <span>Departamentos</span>
                </a>
                <a href="#" class="menu-item h-full flex items-center px-4 font-label-sm text-label-sm text-surface-variant hover:text-primary-fixed-dim transition-colors duration-150" data-target="trocas">
                    <span>Histórico de Trocas</span>
                </a>
                <a href="#" class="menu-item h-full flex items-center px-4 font-label-sm text-label-sm text-surface-variant hover:text-primary-fixed-dim transition-colors duration-150 hidden" id="nav-item-usuarios" data-target="usuarios">
                    <span>Usuários</span>
                </a>
            </div>

            <!-- Right: User session + Status + Actions -->
            <div class="flex items-center gap-4">
                <div id="app-mode-badge" class="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-outline-variant/30 bg-inverse-on-surface/5">
                    <span class="status-dot w-2 h-2 rounded-full bg-green-500"></span>
                    <span id="app-mode-text" class="text-surface-variant">Carregando...</span>
                </div>
                
                <!-- User Profile Session Info -->
                <div class="flex items-center gap-3 pl-3 border-l border-outline-variant/30">
                    <div class="text-right hidden sm:block">
                        <div class="text-xs font-semibold text-primary-fixed" id="session-user-name">Carregando...</div>
                        <div class="text-[10px] text-surface-variant capitalize" id="session-user-level">Suporte</div>
                    </div>
                    <button id="btn-logout" class="flex items-center justify-center p-2 text-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors" title="Sair do sistema">
                        <span class="material-symbols-outlined" style="font-size:20px">logout</span>
                    </button>
                </div>

                <!-- Mobile Hamburger -->
                <button id="btn-hamburger" class="md:hidden p-2 text-surface-variant hover:text-primary-fixed-dim rounded-lg transition-colors" aria-label="Menu">
                    <span class="material-symbols-outlined">menu</span>
                </button>
            </div>
        </div>
    </nav>
