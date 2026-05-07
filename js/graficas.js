document.addEventListener("DOMContentLoaded", function() {
    let zonaPublica = document.getElementById("graficas-publicas");
    let zonaAdmin = document.getElementById("zona-graficas");

    if (zonaPublica || zonaAdmin) {
        obtenerDatos("mostrartodo", "")
            .then(function(datosApi) {
                let registros = prepararRegistros(datosApi);

                if (registros.length == 0) {
                    if (zonaPublica) {
                        zonaPublica.innerHTML = "No hay datos disponibles para crear las gráficas.";
                    }

                    if (zonaAdmin) {
                        zonaAdmin.innerHTML = "No hay datos disponibles para crear las gráficas.";
                    }

                    return;
                }

                if (zonaPublica) {
                    pintarHistogramasIMC(zonaPublica, registros);
                }

                if (zonaAdmin) {
                    zonaAdmin.innerHTML = "";
                    pintarHistogramasIMC(zonaAdmin, registros);
                    pintarNubesBasicas(zonaAdmin, registros);
                }
            })
            .catch(function(error) {
                console.log(error);

                if (zonaPublica) {
                    zonaPublica.innerHTML = "No se han podido cargar las gráficas.";
                }

                if (zonaAdmin) {
                    zonaAdmin.innerHTML = "No se han podido cargar las gráficas.";
                }
            });
    }
});

function prepararRegistros(datosApi) {
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

        let imc = obtenerNumero(antropometrico, ["Ant3", "imc", "IMC"]);
        let ica = obtenerNumero(antropometrico, ["Ant8", "ica", "ICA"]);
        let icc = obtenerNumero(antropometrico, ["Ant7", "icc", "ICC"]);

        let registro = {
            familia: obtenerValor(participante, ["familia", "familia_profesional", "familiaProfesional"]),
            sexo: obtenerValor(participante, ["sexo", "Sexo"]),
            centro: obtenerValor(participante, ["centro", "centro_educativo", "centroEducativo"]),
            clasificacionIMC: obtenerValor(antropometrico, ["Ant4", "clasificacion_imc", "clasificacionIMC"]),
            imc: imc,
            ica: ica,
            icc: icc,
            grasa: obtenerNumero(antropometrico, ["Ant13", "grasa", "grasa_corporal"]),
            masa: obtenerNumero(antropometrico, ["Ant12", "masa", "masa_muscular"]),
            grasaVisceral: obtenerNumero(antropometrico, ["Ant15", "grasa_visceral", "grasaVisceral"]),
            tension: obtenerTension(obtenerValor(antropometrico, ["Ant21", "tension", "tension_arterial"])),
            puntuacionAlimentacion: calcularAlimentacion(alimentacion),
            puntuacionActividad: calcularActividad(actividad),
            puntuacionSueno: calcularSueno(sueno)
        };

        let codigo = Number(obtenerValor(participante, ["cod_participante", "codigo"]));

        if (
            codigo >= 10001 &&
            codigo <= 10060 &&
            registro.familia != "" &&
            registro.sexo != "" &&
            registro.centro != "" &&
            registro.clasificacionIMC != "" &&
            registro.imc > 0
        ) {
            registros.push(registro);
        }
    }

    return registros;
}

function obtenerValor(objeto, campos) {
    for (let i = 0; i < campos.length; i++) {
        if (objeto[campos[i]] != null && objeto[campos[i]] != "") {
            return objeto[campos[i]];
        }
    }

    return "";
}

function obtenerNumero(objeto, campos) {
    let valor = obtenerValor(objeto, campos);

    if (valor == "") {
        return NaN;
    }

    return Number(valor);
}

function pintarHistogramasIMC(zona, registros) {
    let graficas = [
        {
            id: "histograma-familia-imc",
            titulo: "Clasificación IMC por familia profesional",
            grupo: "familia",
            categoria: "clasificacionIMC"
        },
        {
            id: "histograma-sexo-imc",
            titulo: "Clasificación IMC por sexo",
            grupo: "sexo",
            categoria: "clasificacionIMC"
        },
        {
            id: "histograma-centro-imc",
            titulo: "Clasificación IMC por centro educativo",
            grupo: "centro",
            categoria: "clasificacionIMC"
        },
        {
            id: "histograma-familia-ica",
            titulo: "Clasificación ICA por familia profesional",
            grupo: "familia",
            categoria: "clasificacionICA"
        },
        {
            id: "histograma-centro-ica",
            titulo: "Clasificación ICA por centro educativo",
            grupo: "centro",
            categoria: "clasificacionICA"
        },
        {
            id: "histograma-sexo-icc",
            titulo: "Clasificación ICC por sexo",
            grupo: "sexo",
            categoria: "clasificacionICC"
        }
    ];

    for (let i = 0; i < registros.length; i++) {
        registros[i].clasificacionICA = clasificarICA(registros[i].ica);
        registros[i].clasificacionICC = clasificarICC(registros[i].icc, registros[i].sexo);
    }

    for (let i = 0; i < graficas.length; i++) {
        let divGrafica = crearTarjeta(zona, graficas[i].titulo, graficas[i].id);
        crearHistogramaAgrupado(divGrafica.id, registros, graficas[i].grupo, graficas[i].categoria);
    }
}

function pintarNubesBasicas(zona, registros) {
    let titulo = document.createElement("h2");
    titulo.textContent = "Nubes de puntos";
    zona.appendChild(titulo);

    let div1 = crearTarjeta(zona, "IMC por familia profesional", "nube-familia-imc");
    crearNubePuntos(div1.id, registros, "familia", "imc", "Familia profesional", "IMC", true);

    let div2 = crearTarjeta(zona, "IMC según grasa corporal total", "nube-grasa-imc");
    crearNubePuntos(div2.id, registros, "grasa", "imc", "Grasa corporal total", "IMC", false);

    let tituloAlimentacion = document.createElement("h2");
    tituloAlimentacion.textContent = "Adherencia a la dieta mediterránea";
    zona.appendChild(tituloAlimentacion);

    crearNubePuntos(crearTarjeta(zona, "Alimentación e IMC", "nube-alim-imc").id, registros, "puntuacionAlimentacion", "imc", "Puntuación alimentación", "IMC", false);
    crearNubePuntos(crearTarjeta(zona, "Alimentación e ICA", "nube-alim-ica").id, registros, "puntuacionAlimentacion", "ica", "Puntuación alimentación", "ICA", false);
    crearNubePuntos(crearTarjeta(zona, "Alimentación e ICC", "nube-alim-icc").id, registros, "puntuacionAlimentacion", "icc", "Puntuación alimentación", "ICC", false);
    crearNubePuntos(crearTarjeta(zona, "Alimentación y grasa corporal total", "nube-alim-grasa").id, registros, "puntuacionAlimentacion", "grasa", "Puntuación alimentación", "Grasa corporal total", false);
    crearNubePuntos(crearTarjeta(zona, "Alimentación y masa muscular total", "nube-alim-masa").id, registros, "puntuacionAlimentacion", "masa", "Puntuación alimentación", "Masa muscular total", false);

    let tituloActividad = document.createElement("h2");
    tituloActividad.textContent = "Actividad física";
    zona.appendChild(tituloActividad);

    crearNubePuntos(crearTarjeta(zona, "Actividad física e IMC", "nube-act-imc").id, registros, "puntuacionActividad", "imc", "Puntuación actividad física", "IMC", false);
    crearNubePuntos(crearTarjeta(zona, "Actividad física e ICA", "nube-act-ica").id, registros, "puntuacionActividad", "ica", "Puntuación actividad física", "ICA", false);
    crearNubePuntos(crearTarjeta(zona, "Actividad física e ICC", "nube-act-icc").id, registros, "puntuacionActividad", "icc", "Puntuación actividad física", "ICC", false);
    crearNubePuntos(crearTarjeta(zona, "Actividad física y grasa corporal total", "nube-act-grasa").id, registros, "puntuacionActividad", "grasa", "Puntuación actividad física", "Grasa corporal total", false);
    crearNubePuntos(crearTarjeta(zona, "Actividad física y masa muscular total", "nube-act-masa").id, registros, "puntuacionActividad", "masa", "Puntuación actividad física", "Masa muscular total", false);

    let tituloSueno = document.createElement("h2");
    tituloSueno.textContent = "Sueño";
    zona.appendChild(tituloSueno);

    crearNubePuntos(crearTarjeta(zona, "Sueño e IMC", "nube-sueno-imc").id, registros, "puntuacionSueno", "imc", "Puntuación sueño", "IMC", false);
    crearNubePuntos(crearTarjeta(zona, "Sueño e ICA", "nube-sueno-ica").id, registros, "puntuacionSueno", "ica", "Puntuación sueño", "ICA", false);
    crearNubePuntos(crearTarjeta(zona, "Sueño e ICC", "nube-sueno-icc").id, registros, "puntuacionSueno", "icc", "Puntuación sueño", "ICC", false);
    crearNubePuntos(crearTarjeta(zona, "Sueño y grasa corporal total", "nube-sueno-grasa").id, registros, "puntuacionSueno", "grasa", "Puntuación sueño", "Grasa corporal total", false);
    crearNubePuntos(crearTarjeta(zona, "Sueño y masa muscular total", "nube-sueno-masa").id, registros, "puntuacionSueno", "masa", "Puntuación sueño", "Masa muscular total", false);

    let tituloRelaciones = document.createElement("h2");
    tituloRelaciones.textContent = "Relaciones entre cuestionarios";
    zona.appendChild(tituloRelaciones);

    crearNubePuntos(crearTarjeta(zona, "Alimentación y actividad física", "nube-alim-actividad").id, registros, "puntuacionAlimentacion", "puntuacionActividad", "Puntuación alimentación", "Puntuación actividad física", false);
    crearNubePuntos(crearTarjeta(zona, "Alimentación y sueño", "nube-alim-sueno").id, registros, "puntuacionAlimentacion", "puntuacionSueno", "Puntuación alimentación", "Puntuación sueño", false);
    crearNubePuntos(crearTarjeta(zona, "Sueño y actividad física", "nube-sueno-actividad").id, registros, "puntuacionSueno", "puntuacionActividad", "Puntuación sueño", "Puntuación actividad física", false);

    let tituloTension = document.createElement("h2");
    tituloTension.textContent = "Tensión arterial";
    zona.appendChild(tituloTension);

    crearNubePuntos(crearTarjeta(zona, "ICC y tensión arterial", "nube-icc-tension").id, registros, "icc", "tension", "ICC", "Tensión arterial", false);
    crearNubePuntos(crearTarjeta(zona, "ICA y tensión arterial", "nube-ica-tension").id, registros, "ica", "tension", "ICA", "Tensión arterial", false);
    crearNubePuntos(crearTarjeta(zona, "Grasa visceral y tensión arterial", "nube-grasa-visceral-tension").id, registros, "grasaVisceral", "tension", "Grasa visceral", "Tensión arterial", false);
    crearNubePuntos(crearTarjeta(zona, "Alimentación y tensión arterial", "nube-alim-tension").id, registros, "puntuacionAlimentacion", "tension", "Puntuación alimentación", "Tensión arterial", false);
    crearNubePuntos(crearTarjeta(zona, "Actividad física y tensión arterial", "nube-act-tension").id, registros, "puntuacionActividad", "tension", "Puntuación actividad física", "Tensión arterial", false);
    crearNubePuntos(crearTarjeta(zona, "Sueño y tensión arterial", "nube-sueno-tension").id, registros, "puntuacionSueno", "tension", "Puntuación sueño", "Tensión arterial", false);
}

function crearTarjeta(zona, tituloTexto, idGrafica) {
    let tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-grafica";

    let titulo = document.createElement("h3");
    titulo.textContent = tituloTexto;

    let divGrafica = document.createElement("div");
    divGrafica.id = idGrafica;
    divGrafica.className = "grafica-d3";

    tarjeta.appendChild(titulo);
    tarjeta.appendChild(divGrafica);
    zona.appendChild(tarjeta);

    return divGrafica;
}

function crearHistogramaAgrupado(id, datos, campoGrupo, campoCategoria) {
    let grupos = [];
    let categorias = [];

    for (let i = 0; i < datos.length; i++) {
        if (!grupos.includes(datos[i][campoGrupo])) {
            grupos.push(datos[i][campoGrupo]);
        }

        if (!categorias.includes(datos[i][campoCategoria])) {
            categorias.push(datos[i][campoCategoria]);
        }
    }

    let datosGrafica = [];

    for (let i = 0; i < grupos.length; i++) {
        for (let j = 0; j < categorias.length; j++) {
            let cantidad = 0;

            for (let k = 0; k < datos.length; k++) {
                if (datos[k][campoGrupo] == grupos[i] && datos[k][campoCategoria] == categorias[j]) {
                    cantidad++;
                }
            }

            datosGrafica.push({
                grupo: grupos[i],
                categoria: categorias[j],
                cantidad: cantidad
            });
        }
    }

    if (datosGrafica.length == 0) {
        d3.select("#" + id)
            .html("<p>No hay datos suficientes para representar esta gráfica.</p>");
        return;
    }

    let ancho = 850;
    let alto = 420;
    let margen = {
        superior: 30,
        derecho: 130,
        inferior: 90,
        izquierdo: 50
    };

    let svg = d3.select("#" + id)
        .html("")
        .append("svg")
        .attr("width", ancho)
        .attr("height", alto);

    let anchoGrafica = ancho - margen.izquierdo - margen.derecho;
    let altoGrafica = alto - margen.superior - margen.inferior;

    let g = svg.append("g")
        .attr("transform", "translate(" + margen.izquierdo + "," + margen.superior + ")");

    let x0 = d3.scaleBand()
        .domain(grupos)
        .range([0, anchoGrafica])
        .padding(0.2);

    let x1 = d3.scaleBand()
        .domain(categorias)
        .range([0, x0.bandwidth()])
        .padding(0.05);

    let maximo = d3.max(datosGrafica, function(d) {
        return d.cantidad;
    });

    let y = d3.scaleLinear()
        .domain([0, maximo])
        .nice()
        .range([altoGrafica, 0]);

    let color = d3.scaleOrdinal()
        .domain(categorias)
        .range(["#0071BC", "#29B6F6", "#2C3E50", "#7FB3D5"]);

    g.append("g")
        .attr("class", "eje")
        .attr("transform", "translate(0," + altoGrafica + ")")
        .call(d3.axisBottom(x0))
        .selectAll("text")
        .attr("transform", "rotate(-20)")
        .style("text-anchor", "end");

    g.append("g")
        .attr("class", "eje")
        .call(d3.axisLeft(y).ticks(5));

    let gruposSvg = g.selectAll(".grupo")
        .data(grupos)
        .enter()
        .append("g")
        .attr("transform", function(d) {
            return "translate(" + x0(d) + ",0)";
        });

    gruposSvg.selectAll("rect")
        .data(function(grupo) {
            return datosGrafica.filter(function(d) {
                return d.grupo == grupo;
            });
        })
        .enter()
        .append("rect")
        .attr("x", function(d) {
            return x1(d.categoria);
        })
        .attr("y", function(d) {
            return y(d.cantidad);
        })
        .attr("width", x1.bandwidth())
        .attr("height", function(d) {
            return altoGrafica - y(d.cantidad);
        })
        .attr("fill", function(d) {
            return color(d.categoria);
        });

    let leyenda = svg.append("g")
        .attr("class", "leyenda")
        .attr("transform", "translate(" + (ancho - margen.derecho + 20) + "," + margen.superior + ")");

    for (let i = 0; i < categorias.length; i++) {
        let fila = leyenda.append("g")
            .attr("transform", "translate(0," + (i * 25) + ")");

        fila.append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", color(categorias[i]));

        fila.append("text")
            .attr("x", 22)
            .attr("y", 13)
            .text(categorias[i]);
    }
}

function crearNubePuntos(id, datos, campoX, campoY, etiquetaX, etiquetaY, xEsTexto) {
    let datosGrafica = [];

    for (let i = 0; i < datos.length; i++) {
        let valorX = datos[i][campoX];
        let valorY = Number(datos[i][campoY]);

        if (xEsTexto) {
            if (valorX != "" && !isNaN(valorY) && valorY > 0) {
                datosGrafica.push(datos[i]);
            }
        } else {
            let valorXNumero = Number(valorX);

            if (!isNaN(valorXNumero) && !isNaN(valorY)) {
                if (valorValido(campoX, valorXNumero) && valorValido(campoY, valorY)) {
                    datosGrafica.push(datos[i]);
                }
            }
        }
    }

    if (datosGrafica.length == 0) {
        d3.select("#" + id)
            .html("<p>No hay datos suficientes para representar esta gráfica.</p>");
        return;
    }

    let ancho = 850;
    let alto = 420;
    let margen = {
        superior: 30,
        derecho: 30,
        inferior: 90,
        izquierdo: 60
    };

    let svg = d3.select("#" + id)
        .html("")
        .append("svg")
        .attr("width", ancho)
        .attr("height", alto);

    let anchoGrafica = ancho - margen.izquierdo - margen.derecho;
    let altoGrafica = alto - margen.superior - margen.inferior;

    let g = svg.append("g")
        .attr("transform", "translate(" + margen.izquierdo + "," + margen.superior + ")");

    let x;

    if (xEsTexto) {
        let categorias = [];

        for (let i = 0; i < datosGrafica.length; i++) {
            if (!categorias.includes(datosGrafica[i][campoX])) {
                categorias.push(datosGrafica[i][campoX]);
            }
        }

        x = d3.scalePoint()
            .domain(categorias)
            .range([0, anchoGrafica])
            .padding(0.5);
    } else {
        x = d3.scaleLinear()
            .domain(d3.extent(datosGrafica, function(d) {
                return Number(d[campoX]);
            }))
            .nice()
            .range([0, anchoGrafica]);
    }

    let y = d3.scaleLinear()
        .domain(d3.extent(datosGrafica, function(d) {
            return Number(d[campoY]);
        }))
        .nice()
        .range([altoGrafica, 0]);

    g.append("g")
        .attr("class", "eje")
        .attr("transform", "translate(0," + altoGrafica + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-20)")
        .style("text-anchor", "end");

    g.append("g")
        .attr("class", "eje")
        .call(d3.axisLeft(y));

    g.selectAll("circle")
        .data(datosGrafica)
        .enter()
        .append("circle")
        .attr("cx", function(d, i) {
            if (xEsTexto) {
                return x(d[campoX]) + ((i % 5) - 2) * 7;
            } else {
                return x(Number(d[campoX]));
            }
        })
        .attr("cy", function(d) {
            return y(Number(d[campoY]));
        })
        .attr("r", 5)
        .attr("fill", "#0071BC")
        .attr("opacity", 0.75)
        .append("title")
        .text(function(d) {
            return etiquetaX + ": " + d[campoX] + " / " + etiquetaY + ": " + d[campoY];
        });

    g.append("text")
        .attr("x", anchoGrafica / 2)
        .attr("y", altoGrafica + 75)
        .attr("text-anchor", "middle")
        .text(etiquetaX);

    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -altoGrafica / 2)
        .attr("y", -40)
        .attr("text-anchor", "middle")
        .text(etiquetaY);
}

function valorValido(campo, valor) {
    if (
        campo == "imc" ||
        campo == "ica" ||
        campo == "icc" ||
        campo == "grasa" ||
        campo == "masa" ||
        campo == "grasaVisceral" ||
        campo == "tension"
    ) {
        return valor > 0;
    }

    return true;
}

function calcularAlimentacion(alimentacion) {
    let total = 0;

    for (let i = 1; i <= 14; i++) {
        total = total + Number(alimentacion["Ali" + i] || 0);
    }

    return total;
}

function calcularActividad(actividad) {
    let vigorosa = Number(actividad.AcF1 || 0) * Number(actividad.AcF2 || 0) * 8;
    let moderada = Number(actividad.AcF3 || 0) * Number(actividad.AcF4 || 0) * 4;
    let caminata = Number(actividad.AcF5 || 0) * Number(actividad.AcF6 || 0) * 3.3;

    return Math.round(vigorosa + moderada + caminata);
}

function calcularSueno(sueno) {
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

    let item4 = 0;

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

    return item1 + item2 + item3 + item4 + item5 + item6 + item7;
}

function clasificarICA(ica) {
    if (ica < 0.50) {
        return "Rango saludable";
    } else if (ica <= 0.60) {
        return "Riesgo aumentado";
    } else {
        return "Alto riesgo cardiovascular";
    }
}

function clasificarICC(icc, sexo) {
    if (sexo == "Hombre" && icc > 1) {
        return "Alto riesgo";
    } else if (sexo == "Mujer" && icc > 0.9) {
        return "Alto riesgo";
    } else {
        return "Riesgo normal";
    }
}

function obtenerTension(valor) {
    if (valor == null || valor == "") {
        return NaN;
    }

    let texto = String(valor);
    let partes = texto.split("/");

    if (partes.length >= 1) {
        return Number(partes[0]);
    }

    return Number(valor);
}