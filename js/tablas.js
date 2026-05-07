document.addEventListener("DOMContentLoaded", function() {
    let boton = document.getElementById("btn-cargar-tablas-generales");

    if (boton) {
        cargarTablasGenerales();

        boton.addEventListener("click", function() {
            cargarTablasGenerales();
        });
    }
});

function cargarTablasGenerales() {
    let contenedor = document.getElementById("contenido-tablas");

    contenedor.innerHTML = "Cargando tablas generales...";

    obtenerDatos("mostrartodo", "")
        .then(function(datosApi) {
            let registros = prepararRegistrosTabla(datosApi);

            contenedor.innerHTML = "";

            if (registros.length == 0) {
                contenedor.innerHTML = "<p class='mensaje-error'>No hay datos disponibles.</p>";
            } else {
                mostrarTablaVariables(contenedor, registros);
                mostrarTablaResumenIMC(contenedor, registros);
                mostrarTablaResumenCuestionarios(contenedor, registros);
            }
        })
        .catch(function(error) {
            contenedor.innerHTML = "<p class='mensaje-error'>No se han podido cargar las tablas.</p>";
            console.log(error);
        });
}

function prepararRegistrosTabla(datosApi) {
    let lista = [];

    if (Array.isArray(datosApi)) {
        lista = datosApi;
    } else if (Array.isArray(datosApi.datos)) {
        lista = datosApi.datos;
    } else if (typeof datosApi == "object") {
        lista = Object.values(datosApi);
    }

    let registros = [];

    for (let i = 0; i < lista.length; i++) {
        let item = lista[i];

        let participante = item.participante || item;
        let antropometrico = item.antropometrico || item;
        let alimentacion = item.alimentacion || item;
        let actividad = item.actividad || item;
        let sueno = item.sueno || item;

        let imc = Number(obtenerValorTabla(antropometrico, ["Ant3", "imc", "IMC"]));
        let clasificacionIMC = obtenerValorTabla(antropometrico, ["Ant4", "clasificacion_imc", "clasificacionIMC"]);
        let ica = Number(obtenerValorTabla(antropometrico, ["Ant8", "ica", "ICA"]));
        let icc = Number(obtenerValorTabla(antropometrico, ["Ant7", "icc", "ICC"]));
        let sexo = obtenerValorTabla(participante, ["sexo", "Sexo"]);

        let registro = {
            codigo: obtenerValorTabla(participante, ["cod_participante", "codigo"]),
            sexo: sexo,
            centro: obtenerValorTabla(participante, ["centro", "centro_educativo", "centroEducativo"]),
            familia: obtenerValorTabla(participante, ["familia", "familia_profesional", "familiaProfesional"]),
            imc: imc,
            clasificacionIMC: clasificacionIMC,
            ica: ica,
            clasificacionICA: clasificarICATabla(ica),
            icc: icc,
            clasificacionICC: clasificarICCTabla(icc, sexo),
            grasa: Number(obtenerValorTabla(antropometrico, ["Ant13", "grasa", "grasa_corporal"])),
            masa: Number(obtenerValorTabla(antropometrico, ["Ant12", "masa", "masa_muscular"])),
            grasaVisceral: Number(obtenerValorTabla(antropometrico, ["Ant15", "grasa_visceral", "grasaVisceral"])),
            tension: obtenerTensionTabla(obtenerValorTabla(antropometrico, ["Ant21", "tension", "tension_arterial"])),
            puntuacionAlimentacion: calcularAlimentacionTabla(alimentacion),
            puntuacionActividad: calcularActividadTabla(actividad),
            puntuacionSueno: calcularSuenoTabla(sueno)
        };

        let codigoNumero = Number(registro.codigo);

        if (
            codigoNumero >= 10001 &&
            codigoNumero <= 10060 &&
            registro.imc > 0 &&
            registro.clasificacionIMC != ""
        ) {
            registros.push(registro);
        }
    }

    return registros;
}

function mostrarTablaVariables(contenedor, registros) {
    let bloque = document.createElement("div");
    bloque.className = "grupo-tabla";

    let titulo = document.createElement("h3");
    titulo.textContent = "Tabla general de variables usadas en las gráficas";
    bloque.appendChild(titulo);

    let scroll = document.createElement("div");
    scroll.className = "tabla-scroll";

    let tabla = document.createElement("table");
    tabla.className = "tabla-datos";

    tabla.innerHTML = `
        <tr>
            <th>Código</th>
            <th>Sexo</th>
            <th>Centro</th>
            <th>Familia</th>
            <th>IMC</th>
            <th>Clasificación IMC</th>
            <th>ICA</th>
            <th>Clasificación ICA</th>
            <th>ICC</th>
            <th>Clasificación ICC</th>
            <th>Grasa corporal</th>
            <th>Masa muscular</th>
            <th>Grasa visceral</th>
            <th>Tensión arterial</th>
            <th>Puntuación alimentación</th>
            <th>Puntuación actividad</th>
            <th>Puntuación sueño</th>
        </tr>
    `;

    for (let i = 0; i < registros.length; i++) {
        let r = registros[i];

        let fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${r.codigo}</td>
            <td>${r.sexo}</td>
            <td>${r.centro}</td>
            <td>${r.familia}</td>
            <td>${r.imc}</td>
            <td>${r.clasificacionIMC}</td>
            <td>${r.ica}</td>
            <td>${r.clasificacionICA}</td>
            <td>${r.icc}</td>
            <td>${r.clasificacionICC}</td>
            <td>${r.grasa}</td>
            <td>${r.masa}</td>
            <td>${r.grasaVisceral}</td>
            <td>${r.tension}</td>
            <td>${r.puntuacionAlimentacion}</td>
            <td>${r.puntuacionActividad}</td>
            <td>${r.puntuacionSueno}</td>
        `;

        tabla.appendChild(fila);
    }

    scroll.appendChild(tabla);
    bloque.appendChild(scroll);
    contenedor.appendChild(bloque);
}

function mostrarTablaResumenIMC(contenedor, registros) {
    let resumen = {};

    for (let i = 0; i < registros.length; i++) {
        let clasificacion = registros[i].clasificacionIMC;

        if (!resumen[clasificacion]) {
            resumen[clasificacion] = 0;
        }

        resumen[clasificacion]++;
    }

    mostrarTablaSimple(contenedor, "Resumen de clasificación IMC", resumen, "Clasificación", "Participantes");
}

function mostrarTablaResumenCuestionarios(contenedor, registros) {
    let totalAlimentacion = 0;
    let totalActividad = 0;
    let totalSueno = 0;

    for (let i = 0; i < registros.length; i++) {
        totalAlimentacion += registros[i].puntuacionAlimentacion;
        totalActividad += registros[i].puntuacionActividad;
        totalSueno += registros[i].puntuacionSueno;
    }

    let resumen = {
        "Media alimentación": (totalAlimentacion / registros.length).toFixed(2),
        "Media actividad física": (totalActividad / registros.length).toFixed(2),
        "Media sueño": (totalSueno / registros.length).toFixed(2)
    };

    mostrarTablaSimple(contenedor, "Resumen de puntuaciones de cuestionarios", resumen, "Variable", "Valor");
}

function mostrarTablaSimple(contenedor, tituloTexto, datos, cabecera1, cabecera2) {
    let bloque = document.createElement("div");
    bloque.className = "grupo-tabla";

    let titulo = document.createElement("h3");
    titulo.textContent = tituloTexto;
    bloque.appendChild(titulo);

    let tabla = document.createElement("table");
    tabla.className = "tabla-datos";

    tabla.innerHTML = "<tr><th>" + cabecera1 + "</th><th>" + cabecera2 + "</th></tr>";

    for (let campo in datos) {
        let fila = document.createElement("tr");
        fila.innerHTML = "<td>" + campo + "</td><td>" + datos[campo] + "</td>";
        tabla.appendChild(fila);
    }

    bloque.appendChild(tabla);
    contenedor.appendChild(bloque);
}

function obtenerValorTabla(objeto, campos) {
    for (let i = 0; i < campos.length; i++) {
        if (objeto[campos[i]] != null && objeto[campos[i]] != "") {
            return objeto[campos[i]];
        }
    }

    return "";
}

function calcularAlimentacionTabla(alimentacion) {
    let total = 0;

    for (let i = 1; i <= 14; i++) {
        total = total + Number(alimentacion["Ali" + i] || 0);
    }

    return total;
}

function calcularActividadTabla(actividad) {
    let vigorosa = Number(actividad.AcF1 || 0) * Number(actividad.AcF2 || 0) * 8;
    let moderada = Number(actividad.AcF3 || 0) * Number(actividad.AcF4 || 0) * 4;
    let caminata = Number(actividad.AcF5 || 0) * Number(actividad.AcF6 || 0) * 3.3;

    return Math.round(vigorosa + moderada + caminata);
}

function calcularSuenoTabla(sueno) {
    let item1 = Number(sueno.Sue6 || 0);

    let sumaLatencia = Number(sueno.Sue2 || 0) + Number(sueno.Sue5a || 0);
    let item2 = 0;

    if (sumaLatencia >= 1 && sumaLatencia <= 2) {
        item2 = 1;
    } else if (sumaLatencia >= 3 && sumaLatencia <= 4) {
        item2 = 2;
    } else if (sumaLatencia >= 5) {
        item2 = 3;
    }

    let horas = Number(sueno.Sue4 || 0);
    let item3 = 0;

    if (horas > 0 && horas < 5) {
        item3 = 3;
    } else if (horas < 6) {
        item3 = 2;
    } else if (horas < 7) {
        item3 = 1;
    }

    let sumaMolestias = Number(sueno.Sue5b || 0) + Number(sueno.Sue5c || 0) + Number(sueno.Sue5d || 0) +
        Number(sueno.Sue5e || 0) + Number(sueno.Sue5f || 0) + Number(sueno.Sue5g || 0) +
        Number(sueno.Sue5h || 0) + Number(sueno.Sue5i || 0) + Number(sueno.Sue5j || 0);

    let item5 = 0;

    if (sumaMolestias >= 1 && sumaMolestias <= 9) {
        item5 = 1;
    } else if (sumaMolestias >= 10 && sumaMolestias <= 18) {
        item5 = 2;
    } else if (sumaMolestias >= 19) {
        item5 = 3;
    }

    let item6 = Number(sueno.Sue7 || 0);

    let sumaDia = Number(sueno.Sue8 || 0) + Number(sueno.Sue9 || 0);
    let item7 = 0;

    if (sumaDia >= 1 && sumaDia <= 2) {
        item7 = 1;
    } else if (sumaDia >= 3 && sumaDia <= 4) {
        item7 = 2;
    } else if (sumaDia >= 5) {
        item7 = 3;
    }

    return item1 + item2 + item3 + item5 + item6 + item7;
}

function clasificarICATabla(ica) {
    if (ica < 0.50) {
        return "Rango saludable";
    } else if (ica <= 0.60) {
        return "Riesgo aumentado";
    } else {
        return "Alto riesgo cardiovascular";
    }
}

function clasificarICCTabla(icc, sexo) {
    if (sexo == "Hombre" && icc > 1) {
        return "Alto riesgo";
    } else if (sexo == "Mujer" && icc > 0.9) {
        return "Alto riesgo";
    } else {
        return "Riesgo normal";
    }
}

function obtenerTensionTabla(valor) {
    if (valor == null || valor == "") {
        return "";
    }

    let texto = String(valor);
    let partes = texto.split("/");

    if (partes.length >= 1) {
        return Number(partes[0]);
    }

    return Number(valor);
}