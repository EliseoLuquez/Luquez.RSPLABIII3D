//import  {EFiltroAnimal}  from "./app.js";

let frm;
let botonAlta;
let botonModificar;
let botonBaja;
let botonCancelar;
let divTabla;
let filtrarAnimal;
let anunciosGuardados;
let txtPromedio;
let checkboxContainer;
let listaCBMascotas = [];//array con los objetos tildados 
let checksMarcados = {};//checks tildados
let listaAnuncioMascotas = [];
let txtPrecioMax = document.getElementById('txtPrecioMax');
let txtPrecioMin = document.getElementById('txtPrecioMin');
let txtPorcentaje = document.getElementById('txtProcentaje');

frm = document.forms[0];
botonAlta = document.getElementById('btnAlta');
botonBaja = document.getElementById('btnBaja');
botonModificar = document.getElementById('btnModificar');
botonCancelar = document.getElementById('btnCancelar');
divTabla = document.getElementById('divTabla');
filtrarAnimal = document.getElementById('txtMascota');
txtPromedio = document.getElementById('txtPromedio');
checkboxContainer = document.querySelectorAll(".checkboxContainer input");


window.addEventListener('load', () => {


    LeerLS();
    if(listaCBMascotas != '')
    {
        VerificarCheckboxs();
    }
    else
    {
        TraerDatos();
    }
    //VerificarCheckboxs();
    EnumTypescript();

    botonBaja.hidden = true;
    botonModificar.hidden = true;
});

frm.addEventListener('submit', function (e) {
    e.preventDefault();
});

botonAlta.addEventListener('click', function (e) {
    let nuevoDato = obtenerDato(frm);
    Alta(nuevoDato);
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
    const anuncioFiltrado = anunciosGuardados.filter(function (anuncio) {
        return (anuncio.animal.includes(tipoAnimal))
    });

    var promedio = anuncioFiltrado
        .map(function (anuncio) {
            return parseFloat(anuncio.precio);
        })
        .reduce(function (previo, actual) {
            return (previo + actual) / (anuncioFiltrado.length);
        })

    var precioMax = anuncioFiltrado.reduce(function (a, b)
    {
        return Math.max(a.precio, b.precio);
    });

    var precioMin = anuncioFiltrado.reduce(function (a, b)
    {
        return Math.min(a.precio, b.precio);
    });

    var mascVacunada = anuncioFiltrado.filter(function (anuncio){
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

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status = 200) {
                anunciosGuardados = JSON.parse(xhr.responseText).data;
                divTabla.innerHTML = '';

                RefrescarDiv(divTabla, CrearTabla(anunciosGuardados));

                //VerificarCheckboxs();

                let tds = document.getElementsByTagName('td');
                for (let i = 0; i < tds.length; i++) {
                    let td = tds[i];
                    td.addEventListener('click', CargarFormulario);
                }
            }
            else {
                console.log(xhr.status + '' + xhr.statusText);
            }
        }
        else {
            divTabla.appendChild(Spinner());
        }
    }
    xhr.open('GET', 'http://localhost:3000/traer', true);
    xhr.send();

}


function Alta(dato) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            if (xhr.responseText == 'Alta Exitosa') {
                //console.log(dato);
                TraerDatos();
            }
            else {
                console.log(xhr.responseText);
                TraerDatos();
            }
        }
        else {
            divTabla.innerHTML = '';
            //divTabla.appendChild(Spinner());
        }
    }
    xhr.open('POST', 'http://localhost:3000/alta', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(dato));
}


function Baja() {
    let id = parseInt(document.querySelector('#txtId').value);
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            if (xhr.responseText == 'Baja Exitosa') {
                TraerDatos();
            }
            else {
                console.log(xhr.responseText);
                TraerDatos();
            }
        }
        else {
            divTabla.innerHTML = '';
            //divTabla.appendChild(Spinner());
        }
    }
    xhr.open('POST', 'http://localhost:3000/baja', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    //console.log(JSON.stringify(dato['id']));  
    xhr.send(`id=${id}`);
}


function Modificar(dato) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            if (xhr.responseText == 'Modificacion Exitosa') {
                TraerDatos();
            }
            else {
                console.log(xhr.responseText);
                TraerDatos();
            }
        }
        else {
            divTabla.innerHTML = '';
            //divTabla.appendChild(Spinner());
        }
    }
    xhr.open('POST', 'http://localhost:3000/modificar', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(dato));
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
    CargarForm(document.forms[0], dato);
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

    for (elements of frm.elements) {
        switch (elements.name) {
            case 'id':
                id = elements.value;
                break;
            case 'titulo':
                titulo = elements.value;
                break;
            case 'descripcion':
                descripcion = elements.value;
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
                precio = elements.value;
                break;
            case 'raza':
                raza = elements.value;
                break;
            case 'fecha':
                fecha = elements.value;
                break;
            case 'vacunas':
                vacuna = document.getElementById('txtVacunas').value;
                break;
        }
    }
    return new Anuncio_Mascota(id, titulo, transaccion, descripcion, precio, animal, raza, fecha, vacuna, active);
}


function CargarForm(frm, Anuncio_Mascota) {
    for (elements of frm.elements) {
        switch (elements.name) {
            case 'id':
                elements.value = Anuncio_Mascota.id;
                break;
            case 'titulo':
                elements.value = Anuncio_Mascota.titulo;
                break;
            case 'animal':
                if (Anuncio_Mascota.animal == 'perro') {
                    document.getElementById('perro').checked = true;
                    document.getElementById('gato').checked = false;
                }
                else if (Anuncio_Mascota.animal == 'gato') {
                    document.getElementById('perro').checked = false;
                    document.getElementById('gato').checked = true;
                }
                break;
            case 'descripcion':
                elements.value = Anuncio_Mascota.descripcion;
                break;
            case 'precio':
                elements.value = Anuncio_Mascota.precio;
                break;
            case 'raza':
                elements.value = Anuncio_Mascota.animal;
                break;
            case 'fecha':
                elements.value = Anuncio_Mascota.fecha;
                break;
            case 'vacunas':
                elements.value = Anuncio_Mascota.vacuna;
                break;
        }
    }
}


function Cancelar(frm) {
    for (elements of frm.elements) {
        switch (elements.name) {
            case 'id':
                elements.value = '';
                break;
            case 'titulo':
                elements.value = '';
                break;
            case 'descripcion':
                elements.value = '';
                break;
            case 'animal':
                if (document.getElementById('perro').checked == true || document.getElementById('gato').checked == true) {
                    document.getElementById('perro').checked = false;
                    document.getElementById('gato').checked = false;
                }
                break;
            case 'precio':
                elements.value = '';
                break;
            case 'raza':
                elements.value = '';
                break;
            case 'fecha':
                elements.value = '';
                break;
            case 'vacunas':
                elements.value = '';
                break;
        }
    }
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

function VerificarCheckboxs() {
    checkboxContainer.forEach((checkbox) => {
        checkbox.addEventListener("click", (event) => {
            checksMarcados["id"] = true;

            checkboxContainer.forEach((checkbox) => {
                checksMarcados[checkbox.id] = checkbox.checked;
            });

            if (event.target.checked == false) {
                listaCBMascotas = anunciosGuardados.map((e) => {
                    return Object.keys(e).reduce((object, key) => {
                        if (key !== event.target.id && checksMarcados[key]) {
                            object[key] = e[key];
                        }
                        return object;
                    }, {});
                });
            } else {
                listaCBMascotas = anunciosGuardados.map((e) => {
                    let aux = {};
                    for (const key in e) {
                        if (checksMarcados[key]) aux[key] = e[key];
                    }
                    return aux;
                });
            }
            LSGuardar(checksMarcados);
            RefrescarDiv(divTabla, CrearTabla(listaCBMascotas));
        });
    });
}

function LSGuardar(checkstildados) {
    localStorage.setItem("listaCBMascotas", JSON.stringify(checkstildados));
}

function LeerLS() {
    if (localStorage.getItem("listaCBMascotas")) {
        checksMarcados = JSON.parse(localStorage.getItem("listaCBMascotas"));
        InicializarContainerCheckboxes(checksMarcados);
    } else {
        InicializarCheckboxs();
    }
}
