// Enviroment variables
var current;
var locationsF = [];
var map;
var directionx;
function iniciaMapa() {
  console.log("Favoritosv17");
  db.collection('sitios').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
      var user = sessionStorage.getItem("idusuario");
      if (change.doc.data().idusuario == user) {
        let aLink = document.createElement("a");
        aLink.className = "dropdown-item";
        aLink.innerHTML = change.doc.data().nombre;
        aLink.href = "#";
        aLink.addEventListener("click", (e) => {
          moverACoordenadas(change.doc.data().coordenadas.latitude + "," + change.doc.data().coordenadas.longitude + "," + change.doc.data().nombre);
        });
        document.getElementById("dropFav").appendChild(aLink);
      }
    });
  });
  db.collection('rutas').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
      var user = sessionStorage.getItem("idusuario");
      if (change.doc.data().idusuario == user) {
        let aLink = document.createElement("a");
        aLink.className = "dropdown-item";
        aLink.innerHTML = change.doc.data().descripcion;
        aLink.href = "#";
        aLink.addEventListener("click", (e) => {
          moverACoordenadas(change.doc.data().coordenadas.latitude + "," + change.doc.data().coordenadas.longitude + "," + change.doc.data().nombre);
        });
        document.getElementById("dropFav2").appendChild(aLink);
      }
    });
  });
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(iniciaAutoCompletado);
  } else {
    console.log("El navegador no tiene geolocalización");
  }
}

function moverACoordenadas(posicion) {
  var posicionSplit = posicion.split(",");
  console.log(posicionSplit);
  var center = new google.maps.LatLng(posicionSplit[0], posicionSplit[1]);
  window.map.panTo(center);
  markers = [];
  // Clear out the old markers.
  markers.forEach(function (marker) {
    marker.setMap(null);
  });
  markers = [];
  var icon = {
    url: './images/marcador.png',
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(25, 25),
  };
  markers.push(
    new google.maps.Marker({
      map: map,
      icon: icon,
      title: posicionSplit[2],
      position: { lat: parseFloat(posicionSplit[0]), lng: parseFloat(posicionSplit[1]) },
    })
  );
  document.getElementById("searchbar").value = posicionSplit[2];
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
    console.log(places);
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
        url: './images/marcador.png',
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
  console.log(current.name);
  locationsF.push({
    address: current.name,
    lat: current.geometry.location.lat(),
    lng: current.geometry.location.lng(),
  });
  console.log(JSON.stringify(locationsF));
  var paradas = document.getElementById("paradasList");
  paradas.innerHTML += '<a class="dropdown-item" href="#" onclick="borrarUnaParada(&apos;' + current.name + '&apos;)" id="' + current.name + '">(X) ' + current.name + "</a>";
}
//Add to favorites
function agregarAfavoritos(){
  console.log(current.name);
  if(current != null){
    db.collection('sitios').add({
      nombre: current.name,
      idusuario: sessionStorage.getItem("idusuario"),
      coordenadas: new firebase.firestore.GeoPoint(current.geometry.location.lat(), current.geometry.location.lng())
    });
  }
  else{
    alert("Selecciona una ruta profa");
  }
}
function agregarRutaFav(){
  if (locationsF != null){
    var nombreRutaFav = document.getElementById("txtRutaFav").value
    console.log(nombreRutaFav.value)
    locationsF.forEach(element => console.log(element))
    console.log(JSON.stringify(locationsF))
    db.collection('rutas').add({
      descripcion: nombreRutaFav,
      idusuario: sessionStorage.getItem("idusuario"),
      listadestinos: JSON.stringify(locationsF)
    })
  
  }
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
    url: "https://api.routexl.com/tour",
    method: "POST",
    dataType: "json",
    data: { locations: locationsF },
  });

  request.done(function (msg) {
    console.log(msg);
    trazarRuta(msg);
  });

  request.fail(function (jqXHR, textStatus) {
    console.log(jqXHR);
    alert("Asegurese que agregó al menos dos paradas a su ruta");
  });
}


// Draw the route on the map
function trazarRuta(rutas) {
  document.getElementById("searchbar").classList.add("disabled");
  document.getElementById("selectidioma").classList.add("disabled");
  document.getElementById("botonParada").classList.add("disabled");
  document.getElementById("botonFav").classList.add("disabled");
  document.getElementById("botonFavRuta").classList.add("disabled");
  document.getElementById("botoninicialowo").classList.add("disabled");
  document.getElementById("botonRuta").classList.add("disabled");
  document.getElementById("borraParadas").classList.add("disabled");
  document.getElementById("transporte").classList.add("disabled");
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
        var _distance = response.rows[0].elements[0].distance.text;
        var _duration = response.rows[0].elements[0].duration.text;
        var _consumo = calcularConsumo(_distance);
        document.getElementById("IdDistance").innerHTML = "Distancia: " + _distance;
        document.getElementById("IdConsumption").innerHTML = "Consumo: " + _consumo + "itros";
        document.getElementById("IdDuration").innerHTML = "Duración: " + _duration + "utos";
      } else {
        alert("Unable to find the distance via road.");
      }
    }
  );
}

// Erease the routes
function quitarParadas() {
  var paradas = document.getElementById("paradasList");
  paradas.innerHTML = '<div class="container-fluid"> <button onclick="quitarParadas()" id="borraParadas" style="font-weight: bold;" class="btn btn-danger btn-block">Eliminar Paradas</button> <div class="dropdown-divider"></div><div class="dropdown-divider"></div> </div>';
  locationsF = [];
}

// Clear the map
function borrarRutas() {
  quitarParadas();
  directionx.setMap(null);

  document.getElementById("IdDistance").innerHTML = "";
  document.getElementById("IdConsumption").innerHTML = "";
  document.getElementById("IdDuration").innerHTML = "";
  document.getElementById("searchbar").classList.remove("disabled");
  document.getElementById("selectidioma").classList.remove("disabled");
  document.getElementById("botonParada").classList.remove("disabled");
  document.getElementById("botonFav").classList.remove("disabled");
  document.getElementById("botonFavRuta").classList.remove("disabled");
  document.getElementById("botoninicialowo").classList.remove("disabled");
  document.getElementById("botonRuta").classList.remove("disabled");
  document.getElementById("borraParadas").classList.remove("disabled");
  document.getElementById("transporte").classList.remove("disabled");
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
  //document.getElementById("botoninicialowo").style.visibility = "hidden";
}

function guardarActual(posicion) {
  locationsF.push({
    address: "Ubicacion Actual",
    lat: posicion.coords.latitude,
    lng: posicion.coords.longitude,
  });
  map.panTo(new google.maps.LatLng(posicion.coords.latitude, posicion.coords.longitude));
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(posicion.coords.latitude, posicion.coords.longitude),
    icon: './images/marcador.png',
    map
  });
  marker.setMap(map);
}

function calcularConsumo(distance) {
  var combo = document.getElementById("transportes");
  var selected = combo.options[combo.selectedIndex].text;
  console.log(selected);
  var distanceNum = distance.replace( /^\D+/g, '');
  distanceNum = parseFloat(distanceNum);
  console.log(distanceNum);
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
