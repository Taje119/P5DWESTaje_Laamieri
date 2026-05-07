<?php
header("Content-Type: application/json; charset=UTF-8");

$cuestionario = isset($_GET["cuestionario"]) ? $_GET["cuestionario"] : "todos";
$cod = isset($_GET["cod"]) ? $_GET["cod"] : "";

$base = "https://saludenprimera.alwaysdata.net/index.php/api/";

if ($cuestionario == "mostrartodo") {
    $url = $base . "mostrartodo";
} else {
    if ($cod == "") {
        echo json_encode(["error" => "Falta el código del participante"]);
        exit;
    }

    $url = $base . $cuestionario . "/" . $cod;
}

$respuesta = file_get_contents($url);

if ($respuesta === false) {
    echo json_encode(["error" => "No se pudo conectar con la API"]);
} else {
    echo $respuesta;
}
?>