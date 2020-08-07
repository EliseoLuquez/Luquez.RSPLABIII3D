import { EFiltroAnimal } from "../dist/app.js";
import Anuncio_Mascota from "../dist/anuncio_Mascota.js";

let frm = document.forms[0];
let botonAlta = document.getElementById('btnAlta');
let botonModificar = document.getElementById('btnModificar');
let botonBaja = document.getElementById('btnBaja');
let botonCancelar = document.getElementById('btnCancelar');
let divTabla = document.getElementById('divTabla');
let filtrarAnimal = document.getElementById('txtMascota');
let txtPromedio = document.getElementById('txtPromedio');
let checkboxContainer = document.querySelectorAll(".checkboxContainer input");
let listaCBMascotas = [];//array con los objetos tildados 
let checksMarcados = {};//checks tildados
let anunciosMascotas = [];
let txtPrecioMax = document.getElementById('txtPrecioMax');
let txtPrecioMin = document.getElementById('txtPrecioMin');
let txtPorcentaje = document.getElementById('txtProcentaje');
let anuncioFiltrado;

window.addEventListener('load', () => {
    divSpinner.appendChild(Spinner());
    setTimeout(() => {
        TraerDatos();
        LeerLSChB();
        divSpinner.hidden = true;
    }, 2000);
    //ListenerTd();
    EnumTypescript();
    botonBaja.hidden = true;
    botonModificar.hidden = true;
});

frm.addEventListener('submit', function (e) {
    e.preventDefault();
    let nuevoDato = obtenerDato(frm);
    Alta(nuevoDato);
    Cancelar(frm);
});


botonBaja.addEventListener('click', function (e) {
    if (confirm('¿Eliminar?')) {
        let nuevoDato = obtenerDato(frm);
        Baja(nuevoDato);
        Cancelar(frm);
        botonAlta.hidden = false;
        botonBaja.hidden = true;
        botonModificar.hidden = true;
    }
});

botonModificar.addEventListener('click', function (e) {
    if (confirm('¿Modificar?')) {
        let nuevoDato = obtenerDato(frm);
        Modificar(nuevoDato);
        Cancelar(frm);
        botonAlta.hidden = false;
        botonBaja.hidden = true;
        botonModificar.hidden = true;

    }
});

botonCancelar.addEventListener('click', function (e) {
    Cancelar(frm);
    botonAlta.hidden = false;
    botonBaja.hidden = true;
    botonModificar.hidden = true;
});

filtrarAnimal.addEventListener('change', function (e) {
    let tipoAnimal = e.target.value.toLowerCase();
    anuncioFiltrado = anunciosMascotas.filter(function (anuncio) {
        return (anuncio.animal === tipoAnimal)
    });

    var promedio = anuncioFiltrado
        .map(function (anuncio) {
            return parseFloat(anuncio.precio);
        })
        .reduce(function (previo, actual) {
            return (previo + actual) / (anuncioFiltrado.length);
        })

    var precioMax = anuncioFiltrado.reduce(function (a, b) {
        console.log(a.precio);
        console.log(b.precio);
        return Math.max(parseInt(a.precio), parseInt(b.precio));
    });

    var precioMin = anuncioFiltrado.reduce(function (a, b) {
        return Math.min(a.precio, b.precio);
    });

    var mascVacunada = anuncioFiltrado.filter(function (anuncio) {
        return (anuncio.vacuna.includes('Si'));
    });

    var porcentaje = mascVacunada.length * 100 / anuncioFiltrado.length;

    txtPromedio.value = promedio;
    txtPrecioMax.value = precioMax;
    txtPrecioMin.value = precioMin;
    txtPorcentaje.value = porcentaje;
    RefrescarDiv(divTabla, CrearTabla(anuncioFiltrado));

});




function TraerDatos() {
    if (localStorage.getItem("anunciosMascotas")) {
        anunciosMascotas = JSON.parse(localStorage.getItem("anunciosMascotas"));
        //RefrescarDiv(divTabla, CrearTabla(anunciosMascotas));
        VerificarCheckboxs();
        if (checksMarcados == '') {
            RefrescarDiv(divTabla, CrearTabla(anunciosMascotas));
        }
    } else {
        localStorage.setItem("anunciosMascotas", JSON.stringify(anunciosMascotas));
    }
}


function Alta(dato) {
    let id = 0;
    anunciosMascotas.forEach(element => {
        if (element.id >= id) {
            id = element.id;
        }
    });
    dato.id = parseInt(id)+1;
    anunciosMascotas.push(dato);

    localStorage.setItem("anunciosMascotas", JSON.stringify(anunciosMascotas));
    //divSpinner.style.visibility = "visible";
    divSpinner.appendChild(Spinner());
    setTimeout(() => {
        RefrescarDiv(divTabla, CrearTabla(anunciosMascotas));
        divSpinner.hidden = true;
    }, 2000);
}


function Baja(dato) {

    for (let i = 0; i < anunciosMascotas.length; i++) {

        if (anunciosMascotas[i].id == dato.id) {
            anunciosMascotas.splice(anunciosMascotas[i].id, 1);
        }
    }
    localStorage.setItem('anunciosMascotas', JSON.stringify(anunciosMascotas));
    RefrescarDiv(divTabla, CrearTabla(anunciosMascotas));
}


function Modificar(dato) {

    for (let i = 0; i < anunciosMascotas.length; i++) {

        if (anunciosMascotas[i].id == dato.id) {
            anunciosMascotas[i] = dato;
        }
    }
    localStorage.setItem('anunciosMascotas', JSON.stringify(anunciosMascotas));
}

function CargarFormulario(e) {
    let tr = e.target.parentElement;
    let nodes = tr.childNodes;
    let dato = new Anuncio_Mascota(nodes[0].textContent, nodes[1].textContent, nodes[2].textContent, nodes[3].textContent,
        nodes[4].textContent, nodes[5].textContent, nodes[6].textContent, nodes[7].textContent, nodes[8].textContent);
    botonAlta.hidden = true;
    botonBaja.hidden = false;
    botonCancelar.hidden = false;
    botonModificar.hidden = false;
    CargarForm(dato);
}



function obtenerDato(frm) {
    let id;
    let titulo;
    let transaccion = 'venta';
    let descripcion;
    let animal;
    let precio;
    let raza;
    let fecha;
    let vacuna;
    let active = 'active';


    for (let i = 0; i < frm.elements.length; i++) {

        switch (frm.elements[i].name) {
            case 'id':
                id = frm.elements[i].value;
                break;
            case 'titulo':
                titulo = frm.elements[i].value;
                break;
            case 'descripcion':
                descripcion = frm.elements[i].value;
                break;
            case 'animal':
                if (document.getElementById('perro').checked == true) {
                    animal = 'perro';
                }
                else if (document.getElementById('gato').checked == true) {
                    animal = 'gato';
                }
                break;
            case 'precio':
                precio = frm.elements[i].value;
                break;
            case 'raza':
                raza = frm.elements[i].value;
                break;
            case 'fecha':
                fecha = frm.elements[i].value;
                break;
            case 'vacunas':
                vacuna = document.getElementById('txtVacunas').value;
                break;
        }
    }
    return new Anuncio_Mascota(id, titulo, transaccion, descripcion, precio, animal, raza, fecha, vacuna, active);
}


function CargarForm(Anuncio_Mascota) {

    document.getElementById('txtId').value = Anuncio_Mascota.id;
    document.getElementById('txtTitulo').value = Anuncio_Mascota.titulo;
    document.getElementById('txtDescripcion').value = Anuncio_Mascota.descripcion;
    document.getElementById('txtPrecio').value = Anuncio_Mascota.precio;
    document.getElementById('txtRaza').value = Anuncio_Mascota.raza;
    document.getElementById('txtFecha').value = Anuncio_Mascota.fecha;
    document.getElementById('txtVacunas').value = Anuncio_Mascota.vacuna;

    if (Anuncio_Mascota.animal == 'perro') {
        document.getElementById('perro').checked = true;
        document.getElementById('gato').checked = false;
    }
    else if (Anuncio_Mascota.animal == 'gato') {
        document.getElementById('perro').checked = false;
        document.getElementById('gato').checked = true;
    }
}


function Cancelar(frm) {
    for (let i = 0; i < frm.elements.length; i++) {
        switch (frm.elements[i].name) {
            case 'id':
                frm.elements[i].value = '';
                break;
            case 'titulo':
                frm.elements[i].value = '';
                break;
            case 'descripcion':
                frm.elements[i].value = '';
                break;
            case 'animal':
                if (document.getElementById('perro').checked == true || document.getElementById('gato').checked == true) {
                    document.getElementById('perro').checked = false;
                    document.getElementById('gato').checked = false;
                }
                break;
            case 'precio':
                frm.elements[i].value = '';
                break;
            case 'raza':
                frm.elements[i].value = '';
                break;
            case 'fecha':
                frm.elements[i].value = '';
                break;
            case 'vacunas':
                frm.elements[i].value = '';
                break;
        }
    }
    VerificarCheckboxs();
}

function Spinner() {
    let divSpinner = document.getElementById('divSpinner');
    var spinner = document.createElement('img');
    spinner.setAttribute('src', './img/480.gif');
    spinner.setAttribute('alt', 'spinner');
    return spinner;
}

function EnumTypescript() {
    for (const key in EFiltroAnimal) {
        if (isNaN(key)) {
            let option = document.createElement('option');
            let texto = document.createTextNode(key);
            option.appendChild(texto);
            option.setAttribute('value', key);
            filtrarAnimal.appendChild(option);
        }
    }
}


function InicializarContainerCheckboxes(marcados) {
    for (const key in marcados) {
        if (key != 'id') {
            const item = document.getElementById(key);
            item.checked = marcados[key];
        }
    }
    VerificarCheckboxs();
}

function InicializarCheckboxs() {
    checkboxContainer.forEach((checkbox) => {
        checksMarcados[checkbox.id] = checkbox.checked;
    });
}

function LeerLSChB() {
    if (localStorage.getItem("listaCBMascotas")) {
        checksMarcados = JSON.parse(localStorage.getItem("listaCBMascotas"));
        InicializarContainerCheckboxes(checksMarcados);
    } else {
        InicializarCheckboxs();
    }
}

function VerificarCheckboxs() {
    checkboxContainer.forEach((checkbox) => {
        checkbox.addEventListener("change", (event) => {
            checksMarcados["id"] = true;
            checkboxContainer.forEach((checkbox) => {
                checksMarcados[checkbox.id] = checkbox.checked;
            });

            if (event.target.checked == false) {
                listaCBMascotas = anunciosMascotas.map((e) => {
                    return Object.keys(e).reduce((object, key) => {
                        if (key !== event.target.id && checksMarcados[key]) {
                            object[key] = e[key];
                        }
                        return object;
                    }, {});
                });
            } else {
                listaCBMascotas = anunciosMascotas.map((e) => {
                    let aux = {};
                    for (const key in e) {
                        if (checksMarcados[key]) aux[key] = e[key];
                    }
                    return aux;
                });
            }
            localStorage.setItem("listaCBMascotas", JSON.stringify(checksMarcados));
            RefrescarDiv(divTabla, CrearTabla(listaCBMascotas));

        });

        if (checksMarcados.checked == false) {
            listaCBMascotas = anunciosMascotas.map((e) => {
                return Object.keys(e).reduce((object, key) => {
                    if (key !== checksMarcados.id && checksMarcados[key]) {
                        object[key] = e[key];
                    }
                    return object;
                }, {});
            });
        } else {
            listaCBMascotas = anunciosMascotas.map((e) => {
                let aux = {};
                for (const key in e) {
                    if (checksMarcados[key]) aux[key] = e[key];
                }
                return aux;
            });
        }
        RefrescarDiv(divTabla, CrearTabla(listaCBMascotas));

    });
}





/****                TABLA                     ****/
function CrearTabla(arr) {
    let tabla = document.createElement('table');
    tabla.appendChild(CrearCabeceraTabla(arr[0]));
    tabla.appendChild(CrearCuerpoTabla(arr));
    tabla.classList.add('table');
    tabla.classList.add('table-striped');
    tabla.classList.add('table-hover');
    tabla.classList.add('table');
    return tabla;
}


function CrearCabeceraTabla(objeto) {
    let thead = document.createElement('thead');
    let tr = document.createElement('tr');

    for (const key in objeto) {
        let th = document.createElement('th');
        let texto = document.createTextNode(key);
        th.appendChild(texto);
        tr.appendChild(th);
    }

    thead.appendChild(tr);
    thead.classList.add('thead-dark');
    thead.classList.add('text-capitalize');
    thead.classList.add('text-center');
    return thead;
}


function RefrescarDiv(div, tabla) {
    while (div.hasChildNodes()) {
        div.removeChild(div.firstElementChild);
    }
    div.appendChild(tabla);
}


function CrearCuerpoTabla(arr) {
    let tbody = document.createElement('tbody');

    arr.forEach(element => {
        let tr = document.createElement('tr');

        for (const key in element) {
            let td = document.createElement('td');
            let texto = document.createTextNode(element[key]);
            td.addEventListener('click', CargarFormulario);
            td.appendChild(texto);
            tr.appendChild(td);
        }
        tbody.appendChild(tr);

    });
    return tbody;
}
/*
function ListenerTd() {
    let tds = document.getElementsByTagName('td');
    for (let i = 0; i < tds.length; i++) {
        let td = tds[i];
        td.addEventListener('click', CargarFormulario);
    }
}
*/
