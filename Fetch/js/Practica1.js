

fetch('datos.json')
.then(function(response) {
    var paises = document.getElementById("paises");
    response.json().then(function(datos) {

        datos.forEach( registro => {
            
            //console.log(registro);
            let nombre = document.createElement("p");
            nombre.textContent = "El País: " + registro.country + ", tiene: " + registro.cases+" de casos";
            paises.appendChild(nombre);

        });

    });

})
.catch(function(error) {
    console.log('Hubo un problema con la petición Fetch:' + error.message);
});