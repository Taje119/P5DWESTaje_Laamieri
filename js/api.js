function obtenerDatos(cuestionario, codParticipante) {
    let url = "api_proxy.php?cuestionario=" + cuestionario;

    if (codParticipante != "") {
        url = url + "&cod=" + codParticipante;
    }

    return fetch(url)
        .then(function(respuesta) {
            return respuesta.json();
        });
}