

fetch('datos.json')
.then(function(response) {
    var paises = document.getElementById("paises");
    response.json().then(function(datos) {

        datos.forEach( registro => {
            
            //console.log(registro);
            //let nombre = document.createElement("p");
            let contenedor = document.createElement("tr");
            let nombre = document.createElement("td");
            nombre.textContent = "El País: " + registro.ciudad + ", tiene: " + registro.casos+" de casos";
            contenedor.appendChild(nombre);
            paises.appendChild(contenedor);

        });

    });

})
.catch(function(error) {
    console.log('Hubo un problema con la petición Fetch:' + error.message);
});