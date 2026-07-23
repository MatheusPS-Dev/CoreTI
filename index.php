<!DOCTYPE html>
<html lang="pt-BR">
<?php include 'includes/head.php'; ?>
<body class="min-h-screen flex flex-col bg-background text-on-background font-body-md text-body-md antialiased selection:bg-primary-container selection:text-on-primary-container">

    <?php include 'includes/login.php'; ?>

    <?php include 'includes/navbar.php'; ?>

    <?php include 'includes/sidebar.php'; ?>

    <!-- ==================== MAIN CONTENT ==================== -->
    <main class="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-lg py-8 md:py-xl hidden" id="main-content">

        <?php include 'includes/sections/dashboard.php'; ?>

        <?php include 'includes/sections/departamentos.php'; ?>

        <?php include 'includes/sections/impressoras.php'; ?>

        <?php include 'includes/sections/estoque.php'; ?>

        <?php include 'includes/sections/trocas.php'; ?>

        <?php include 'includes/sections/usuarios.php'; ?>

        <?php include 'includes/sections/anydesk.php'; ?>

    </main>

    <!-- ==================== MODALS ==================== -->

    <?php include 'includes/modals/modal_dept.php'; ?>

    <?php include 'includes/modals/modal_printer.php'; ?>

    <?php include 'includes/modals/modal_exchange.php'; ?>

    <?php include 'includes/modals/modal_estoque.php'; ?>

    <?php include 'includes/modals/modal_user.php'; ?>

    <?php include 'includes/modals/modal_anydesk.php'; ?>

    <?php include 'includes/footer.php'; ?>

</body>
</html>
