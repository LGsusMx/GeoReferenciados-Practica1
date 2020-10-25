// Enviroment variables
var current;
var locationsF = [];
var map;
var directionx;
function iniciaMapa() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(iniciaAutoCompletado);
  } else {
    console.log("El navegador no tiene geolocalización");
  }
}

// Google search places init
function iniciaAutoCompletado(posicion) {
  // Create the search box and link it to the UI element.
  var input = document.getElementById("pac-input");
  var input2 = document.getElementById("pac-input2");
  var searchBox = new google.maps.places.SearchBox(input);
  iniciarEstilos(posicion);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", function () {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", function () {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function (marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function (place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };

      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location,
        })
      );
      current = place;
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}

// Add place to the array
function agregarLugarcito() {
  locationsF.push({
    address: current.name,
    lat: current.geometry.location.lat(),
    lng: current.geometry.location.lng(),
  });
  console.log(JSON.stringify(locationsF));
  var paradas = document.getElementById("paradasList");
  paradas.innerHTML +=
    '<a class="dropdown-item" href="#" onclick="borrarUnaParada(&apos;' +
    current.name +
    '&apos;)" id="' +
    current.name +
    '">' +
    current.name +
    "</a>";

  alert("Se agregó " + current.name + " a la lista de paradas");
}

// Make a request to routexl api
function hacerLaTrazacion() {
  var request = jQuery.ajax({
    beforeSend: function (xhr) {
      xhr.setRequestHeader(
        "Authorization",
        "Basic " + btoa("RedMx14:Tofis123")
      );
    },
    url: "https://api.routexl.nl/tour",
    method: "POST",
    dataType: "json",
    data: { locations: locationsF },
  });

  request.done(function (msg) {
    console.log(msg);
    trazarRuta(msg);
  });

  request.fail(function (jqXHR, textStatus) {
    console.log(textStatus);
    alert("Asegurese que agregó al menos dos paradas a su ruta");
  });
}

// Draw the route on the map
function trazarRuta(rutas) {
  var posicionex = [];
  var wayputos = [];
  for (let index = 0; index < locationsF.length; index++) {
    for (let index2 = 0; index2 < locationsF.length; index2++) {
      if (rutas.route[index].name === locationsF[index2].address) {
        posicionex.push({
          lat: locationsF[index].lat,
          lng: locationsF[index].lng,
        });
        if (index != 0 || index != locationsF.length - 1) {
          wayputos.push({
            location: {
              lat: locationsF[index].lat,
              lng: locationsF[index].lng,
            },
            stopover: true,
          });
        }
      }
    }
  }
  var directionsService = new google.maps.DirectionsService();
  var request = {
    origin: { lat: posicionex[0].lat, lng: posicionex[0].lng },
    destination: {
      lat: posicionex[posicionex.length - 1].lat,
      lng: posicionex[posicionex.length - 1].lng,
    },
    waypoints: wayputos,
    travelMode: google.maps.TravelMode.DRIVING,
  };
  directionsService.route(request, function (response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionx = new google.maps.DirectionsRenderer({
        map: map,
        directions: response,
      });
    }
  });

  //*********DISTANCE AND DURATION**********************//
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [{ lat: posicionex[0].lat, lng: posicionex[0].lng }],
      destinations: [
        {
          lat: posicionex[posicionex.length - 1].lat,
          lng: posicionex[posicionex.length - 1].lng,
        },
      ],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false,
    },
    function (response, status) {
      if (
        status == google.maps.DistanceMatrixStatus.OK &&
        response.rows[0].elements[0].status != "ZERO_RESULTS"
      ) {
        var consumo = calcularConsumo(distance);
        var distance = response.rows[0].elements[0].distance.text;
        var duration = response.rows[0].elements[0].duration.text;
        var distamce = document.getElementById("distance");
        var dumration = document.getElementById("duration");
        var searchbar = document.getElementById("searchbar");
        var selectidioma = document.getElementById("selectidioma");
        var btnParada = document.getElementById("botonParada");
        var btninicial = document.getElementById("botoninicialowo");
        var btnRuta = document.getElementById("botonRuta");
        var borraParadas = document.getElementById("borraParadas");
        var labelAdvertencia = document.getElementById("labelAdvertencia");
        var selectransporte = document.getElementById("transporte");
        searchbar.innerHTML = "";
        selectidioma.innerHTML = "";
        btnParada.innerHTML = "";
        btninicial.innerHTML = "";
        borraParadas.innerHTML = "";
        labelAdvertencia.innerHTML = "";
        selectransporte.innerHTML = "";
        btnRuta.innerHTML =
          '<button id="pac-input2" class="controls btn btn-outline-danger my-2 my-sm-0" onclick="borrarRutas()">Trazar una nueva ruta</button>';

        distamce.innerHTML =
          "Distancia: " + distance + " generando un consumo de " + consumo;
        dumration.innerHTML = "Duración: " + duration;
      } else {
        alert("Unable to find the distance via road.");
      }
    }
  );
}

// Erease the routes
function quitarParadas() {
  var paradas = document.getElementById("paradasList");
  paradas.innerHTML =
    '<a class="dropdown-item" style="color: red;" href="#" onclick="quitarParadas()" id="borraParadas">Borrar todas las paradas</a><div class="dropdown-divider"></div>';
  paradas.innerHTML +=
    '<a class="dropdown-item disabled" style="color: orange;" href="#" id="labelAdvertencia">Seleccione un elemento de la lista para borrarlo</a><div class="dropdown-divider"></div>';
  locationsF = [];
}

// Clear the map
function borrarRutas() {
  quitarParadas();
  directionx.setMap(null);

  var distamce = document.getElementById("distance");
  var dumration = document.getElementById("duration");
  var searchbar = document.getElementById("searchbar");
  var btnParada = document.getElementById("botonParada");
  var btnRuta = document.getElementById("botonRuta");
  var selectidioma = document.getElementById("selectidioma");
  var btninicial = document.getElementById("botoninicialowo");
  var selectransporte = document.getElementById("transporte");
  distamce.innerHTML = "";
  dumration.innerHTML = "";
  selectransporte.innerHTML =
    '<li id="transporte">' +
    '<select class="theme-pink"  name="transporte">' +
    '<option value="moto">Motocicleta</option>' +
    '<option value="automovil">Automovil</option>' +
    '<option value="furgoneta">Furgoneta</option>' +
    '<option value="camion">Camion</option>' +
    "</select>" +
    "</li>";
  btninicial.innerHTML =
    '<li class="nav-item" id="botoninicialowo">' +
    '<button onclick="agregarActual()" id="Odd" class="btn btn-outline-primary my-2 my-sm-0 mr-sm-2">Agregar ubicacion actual</button>' +
    "</li>";
  searchbar.innerHTML =
    '<li class="nav-item" id="searchbar"><input id="pac-input" ' +
    'class="form-control mr-sm-2 controls" type="text" placeholder="Escriba una parada" aria-label="Search" /></li>';

  btnParada.innerHTML =
    '<li class="nav-item" id="botonParada"><button onclick="agregarLugarcito()"' +
    'class="btn btn-outline-success my-2 my-sm-0 mr-sm-2">Agregar parada</button></li>';

  btnRuta.innerHTML =
    '<li class="nav-item mr-sm-2 form-inline" id="botonRuta"><button id="pac-input2"' +
    'class="controls btn btn-outline-info my-2 my-sm-0" onclick="hacerLaTrazacion()">Trazar ruta</button></li>';

  selectidioma.innerHTML =
    '<li id="selectidioma" class="nav-item mr-sm-2 form-inline">' +
    '<div class="col-6 text-center"><select name="idioma" id="idioma" class="theme-pink" onchange="cambioIdioma()">' +
    '<option value="es" id="español">Español</option>' +
    '<option value="en" id="ingles">Inglés</option>' +
    '<option value="it" id="italiano">Italiano</option>' +
    '<option value="zh" id="chino">Chino</option>' +
    '<option value="ja" id="japones">Japonés</option>' +
    '<option value="ru" id="ruso">Ruso</option>' +
    '<option value="de" id="aleman">Alemán</option>' +
    "</select></div></li>";
}

// Erease only one route
function borrarUnaParada(parada) {
  alert("Se borró " + parada + " de la lista de paradas");
  var paradaABorrar = document.getElementById(parada);
  paradaABorrar.remove();

  for (var i = 0; i < locationsF.length; i++) {
    if (locationsF[i].address === parada) {
      locationsF.splice(i, 1);
    }
  }
}

// Gives style to the map
function iniciarEstilos(posicion) {
  var styledMapType = new google.maps.StyledMapType(
    [
      {
        elementType: "labels",
        stylers: [
          {
            visibility: "on",
          },
        ],
      },
      {
        elementType: "labels.icon",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#000000",
          },
          {
            saturation: 36,
          },
          {
            lightness: 40,
          },
        ],
      },
      {
        elementType: "labels.text.stroke",
        stylers: [
          {
            color: "#000000",
          },
          {
            lightness: 16,
          },
          {
            visibility: "on",
          },
        ],
      },
      {
        featureType: "administrative",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#000000",
          },
          {
            lightness: 20,
          },
        ],
      },
      {
        featureType: "administrative",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#000000",
          },
          {
            lightness: 17,
          },
          {
            weight: 1.2,
          },
        ],
      },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#c4c4c4",
          },
        ],
      },
      {
        featureType: "administrative.neighborhood",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#707070",
          },
        ],
      },
      {
        featureType: "landscape",
        elementType: "geometry",
        stylers: [
          {
            color: "#000000",
          },
          {
            lightness: 20,
          },
        ],
      },
      {
        featureType: "poi",
        elementType: "geometry",
        stylers: [
          {
            color: "#000000",
          },
          {
            lightness: 21,
          },
          {
            visibility: "on",
          },
        ],
      },
      {
        featureType: "poi.business",
        elementType: "geometry",
        stylers: [
          {
            visibility: "on",
          },
        ],
      },
      {
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [
          {
            color: "#000000",
          },
          {
            lightness: 18,
          },
        ],
      },
      {
        featureType: "road.arterial",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#575757",
          },
        ],
      },
      {
        featureType: "road.arterial",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#ffffff",
          },
        ],
      },
      {
        featureType: "road.arterial",
        elementType: "labels.text.stroke",
        stylers: [
          {
            color: "#2c2c2c",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#be2026",
          },
          {
            lightness: "0",
          },
          {
            visibility: "on",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.stroke",
        stylers: [
          {
            hue: "#ff000a",
          },
          {
            visibility: "off",
          },
        ],
      },
      {
        featureType: "road.local",
        elementType: "geometry",
        stylers: [
          {
            color: "#000000",
          },
          {
            lightness: 16,
          },
        ],
      },
      {
        featureType: "road.local",
        elementType: "labels.text.fill",
        stylers: [
          {
            color: "#999999",
          },
        ],
      },
      {
        featureType: "road.local",
        elementType: "labels.text.stroke",
        stylers: [
          {
            saturation: "-52",
          },
        ],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [
          {
            color: "#000000",
          },
          {
            lightness: 19,
          },
        ],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [
          {
            color: "#000000",
          },
          {
            lightness: 17,
          },
        ],
      },
    ],
    { name: "Night Mode" }
  );

  var propiedades = {
    center: {
      lat: posicion.coords.latitude,
      lng: posicion.coords.longitude,
    },
    zoom: 14,
    mapTypeControlOptions: {
      mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain", "Night Mode"],
    },
  };

  var mapa = document.getElementById("map");
  map = new google.maps.Map(mapa, propiedades);

  map.mapTypes.set("Night Mode", styledMapType);
  map.setMapTypeId("Night Mode");
}

function agregarActual() {
  navigator.geolocation.getCurrentPosition(guardarActual);
  document.getElementById("botoninicialowo").style.visibility = "hidden";
}

function guardarActual(posicion) {
  locationsF.push({
    address: "Ubicacion Actual",
    lat: posicion.coords.latitude,
    lng: posicion.coords.longitude,
  });
}

function calcularConsumo(distance) {
  var combo = document.getElementById("transportes");
  var selected = combo.options[combo.selectedIndex].text;
  console.log(selected);
  var distanceNum= ar  = distance.replace( /^\D+/g, '');
  distanceNum = parseInt(distanceNum,10);
  switch (selected) {
    case "Motocicleta":
      return (4.4*distanceNum)/100+' L';
    case "Automovil":
      return (5.56*distanceNum)/100+' L';
    case "Furgoneta":
      return (11*distanceNum)/100+' L';
    case "Camion":
      return (35*distanceNum)/100+' L';
    default:
      return 'Desconocidos l';
  }
}
