function CrearTabla(arr)
{
    let tabla = document.createElement('table');
    tabla.appendChild(CrearCabeceraTabla(arr[0]));
    tabla.appendChild(CrearCuerpoTabla(arr));
    tabla.classList.add('table');
    tabla.classList.add('table-striped');
    tabla.classList.add('table-hover');
    tabla.classList.add('table');
    return tabla;
}


function CrearCabeceraTabla(objeto)
{
    let thead = document.createElement('thead');
    let tr = document.createElement('tr');

    for (const key in objeto)
    {
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


function RefrescarDiv(div, tabla)
{
    while(div.hasChildNodes())
    {
        div.removeChild(div.firstElementChild);
    }
    div.appendChild(tabla);
}


function CrearCuerpoTabla(arr)
{
    let tbody = document.createElement('tbody');
    
    arr.forEach(element => {
        let tr = document.createElement('tr');

        for (const key in element) 
        {
            let td = document.createElement('td');
            let texto = document.createTextNode(element[key]);
            td.appendChild(texto);
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
        
    });
   
    return tbody;
}






// function CrearTabla(array)
// {
//     var tabla = document.createElement('tabla');

//     tabla.getAttribute('border', '1px solid black');
//     tabla.getAttribute('style', 'border-collapse: collapse');
//     tabla.getAttribute('width 700px');

//     let cabecera = document.createElement('tr');

//     for (atributo in array[0])
//     {
//         let th = document.createElement('th');
//         th.textContent = atributo;
//         if(atributo != 'active')
//         {
//             cabecera.appendChild(th);
//         }  
//     }

//     tabla.appendChild(cabecera);

//     for (var i in array)
//     {
//         var row = document.createElement('tr');
//         var auxObj = array[i];

//         for (var j in auxObj)
//         {
//             if(auxObj[j] == auxObj['active'])
//             {
//                 continue;
//             }
//             let td = document.createElement('td');
//             td.setAttribute('style', 'text-aling: center');
//             var dato = document.createTextNode(auxObj[j]);
//             td.appendChild(dato);
//             row.appendChild(td);
    
//         }
//         tabla.appendChild(row);
//     }
//     return tabla;
// }