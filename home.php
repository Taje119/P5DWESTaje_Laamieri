<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Salud en primera persona</title>
    <link rel="stylesheet" href="css/estilos.css">
</head>
<body>

    <header class="cabecera">
        <div class="contenedor">
            <img src="img/logo_salud.png" alt="Logo Salud en primera persona" class="logo-principal">
            <h1 class="titulo-principal">Salud en primera persona</h1>
        </div>
    </header>

    <nav class="menu">
        <div class="contenedor">
            <a href="home.php" class="activo">Inicio</a>
            <a href="visualizartablas.php">Login</a>
        </div>
    </nav>

    <main class="contenedor">
        <section class="bloque">
            <h2>Difusión de resultados</h2>
            <p>En esta página se mostrarán las gráficas públicas del proyecto.</p>

            <div id="graficas-publicas" class="zona-resultados">
                Cargando gráficas públicas...
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="contenedor">
            <p>Logos de instituciones de financiación y entidades participantes</p>

            <div class="logos-footer">
                <img src="img/ministerio_educacion.png" alt="Ministerio de Educación">
                <img src="img/jccm.png" alt="Junta de Comunidades de Castilla-La Mancha">
                <img src="img/fp_clm.jpg" alt="Formación Profesional Castilla-La Mancha">
                <img src="img/cifp_cuenca.png" alt="CIFP Nº1 Cuenca">
                <img src="img/cofinanciado.png" alt="Cofinanciado por la Unión Europea">
            </div>
        </div>
    </footer>

    <script src="js/d3.v7.min.js"></script>
    <script src="js/api.js"></script>
    <script src="js/graficas.js"></script>

</body>
</html>