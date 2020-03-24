fetch('https://corona.lmao.ninja/countries')
        .then(function(response) {
            var paises = document.getElementById("paises");
            response.json().then(function(datos) {

                datos.forEach( registro => {
                    
                    console.log(registro);

                    let renglon = document.createElement("div");
                    renglon.className = "row border bg-light";
                    paises.appendChild(renglon);

                    let columna = document.createElement("div");
                    columna.className = "col-12";
                    renglon.appendChild(columna);

                    let nombre = document.createElement("p");
                    nombre.textContent = "País: " + registro.country + ", casos: " + registro.cases;
                    columna.appendChild(nombre);

                });

            });
 
        })
        .catch(function(error) {
            console.log('Hubo un problema con la petición de Fetch:' + error.message);
        });