<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Tablas de resultados</title>
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
            <a href="#">Recoger Datos</a>
            <a href="visualizartablas.php" class="activo">Visualizar Tablas</a>
            <a href="visualizargraficas.php">Visualizar Gráficas</a>
            <a href="home.php">Logout</a>
        </div>
    </nav>

    <main class="contenedor">
        <section class="bloque">
            <h2>Tablas de resultados obtenidos</h2>
            <p>En esta página se mostrarán las tablas asociadas a las gráficas del proyecto.</p>

            <div id="zona-tablas" class="zona-resultados">
                <div class="formulario-busqueda">
                    <button id="btn-cargar-tablas-generales">Cargar tablas generales</button>
                </div>

                <div id="contenido-tablas"></div>
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

    <script src="js/api.js"></script>
    <script src="js/tablas.js"></script>
</body>
</html>