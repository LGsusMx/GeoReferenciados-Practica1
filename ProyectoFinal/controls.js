function iniciaMapa() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(iniciaAutoCompletado);
  } else {
    console.log("El navegador no tiene geolocalización");
  }

}
var current;
var locationsF = [];
var map;
var directionx;

function iniciaAutoCompletado(posicion) {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: posicion.coords.latitude, lng: posicion.coords.longitude },
    zoom: 13,
    mapTypeId: 'roadmap'
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var input2 = document.getElementById('pac-input2');
  var searchBox = new google.maps.places.SearchBox(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function () {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function () {
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
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));
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

function agregarLugarcito() {
  locationsF.push({ "address": current.name, "lat": current.geometry.location.lat(), "lng": current.geometry.location.lng() });
  console.log(JSON.stringify(locationsF));
  var paradas = document.getElementById('paradasList');
  paradas.innerHTML += '<a class="dropdown-item" href="#" onclick="borrarUnaParada(&apos;' + current.name + '&apos;)" id="' + current.name + '">' + current.name + '</a>';

  alert('Se agregó ' + current.name + ' a la lista de paradas');
}

function hacerLaTrazacion() {
  var request = jQuery.ajax({

    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", "Basic " + btoa("RedMx14:Tofis123"));
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
    alert('Asegurese que agregó al menos dos paradas a su ruta');
  });
}

function trazarRuta(rutas) {
  var posicionex = [];
  var wayputos = [];
  for (let index = 0; index < locationsF.length; index++) {
    for (let index2 = 0; index2 < locationsF.length; index2++) {
      if (rutas.route[index].name === locationsF[index2].address) {
        posicionex.push({ lat: locationsF[index].lat, lng: locationsF[index].lng });
        if (index != 0 || index != locationsF.length - 1) {
          wayputos.push({
            location: { lat: locationsF[index].lat, lng: locationsF[index].lng },
            stopover: true
          });
        }
      }
    }
  }
  var directionsService = new google.maps.DirectionsService();
  var request = {
    origin: { lat: posicionex[0].lat, lng: posicionex[0].lng },
    destination: { lat: posicionex[posicionex.length - 1].lat, lng: posicionex[posicionex.length - 1].lng },
    waypoints: wayputos,
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function (response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionx = new google.maps.DirectionsRenderer({
        map: map,
        directions: response
      });
    }
  });

  //*********DISTANCE AND DURATION**********************//
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix({
    origins: [{ lat: posicionex[0].lat, lng: posicionex[0].lng }],
    destinations: [{ lat: posicionex[posicionex.length - 1].lat, lng: posicionex[posicionex.length - 1].lng }],
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false
  }, function (response, status) {
    if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
      var distance = response.rows[0].elements[0].distance.text;
      var duration = response.rows[0].elements[0].duration.text;

      var distamce = document.getElementById('distance');
      var dumration = document.getElementById('duration');
      var searchbar = document.getElementById('searchbar');
      var selectidioma = document.getElementById('selectidioma');
      var btnParada = document.getElementById('botonParada');
      var btnRuta = document.getElementById('botonRuta');
      var borraParadas = document.getElementById('borraParadas');
      var labelAdvertencia = document.getElementById('labelAdvertencia');

      searchbar.innerHTML = '';
      selectidioma.innerHTML = '';
      btnParada.innerHTML = '';
      borraParadas.innerHTML = '';
      labelAdvertencia.innerHTML = '';

      btnRuta.innerHTML = '<button id="pac-input2" class="controls btn btn-outline-danger my-2 my-sm-0" onclick="borrarRutas()">Trazar una nueva ruta</button>';

      distamce.innerHTML = 'Distancia: ' + distance;
      dumration.innerHTML = 'Duración: ' + duration;

    } else {
      alert("Unable to find the distance via road.");
    }
  });
}

function quitarParadas() {
  var paradas = document.getElementById('paradasList');
  paradas.innerHTML = '<a class="dropdown-item" style="color: red;" href="#" onclick="quitarParadas()" id="borraParadas">Borrar todas las paradas</a><div class="dropdown-divider"></div>';
  paradas.innerHTML += '<a class="dropdown-item disabled" style="color: orange;" href="#" id="labelAdvertencia">Seleccione un elemento de la lista para borrarlo</a><div class="dropdown-divider"></div>'
  locationsF = [];
}

function borrarRutas() {
  quitarParadas();
  directionx.setMap(null);

  var distamce = document.getElementById('distance');
  var dumration = document.getElementById('duration');
  var searchbar = document.getElementById('searchbar');
  var btnParada = document.getElementById('botonParada');
  var btnRuta = document.getElementById('botonRuta');
  var selectidioma = document.getElementById('selectidioma');

  distamce.innerHTML = '';
  dumration.innerHTML = '';

  searchbar.innerHTML = '<li class="nav-item" id="searchbar"><input id="pac-input" ' +
    'class="form-control mr-sm-2 controls" type="text" placeholder="Escriba una parada" aria-label="Search" /></li>'

  btnParada.innerHTML = '<li class="nav-item" id="botonParada"><button onclick="agregarLugarcito()"' +
    'class="btn btn-outline-success my-2 my-sm-0 mr-sm-2">Agregar parada</button></li>'

  btnRuta.innerHTML = '<li class="nav-item mr-sm-2 form-inline" id="botonRuta"><button id="pac-input2"' +
    'class="controls btn btn-outline-info my-2 my-sm-0" onclick="hacerLaTrazacion()">Trazar ruta</button></li>';

  selectidioma.innerHTML = '<li id="selectidioma" class="nav-item mr-sm-2 form-inline">' +
  '<div class="col-6 text-center"><select name="idioma" id="idioma" class="theme-pink" onchange="cambioIdioma()">' +
      '<option value="es" id="español">Español</option>' +
      '<option value="en" id="ingles">Inglés</option>' +
      '<option value="it" id="italiano">Italiano</option>' +
      '<option value="zh" id="chino">Chino</option>' +
      '<option value="ja" id="japones">Japonés</option>' +
      '<option value="ru" id="ruso">Ruso</option>' +
      '<option value="de" id="aleman">Alemán</option>' +
    '</select></div></li>';
}

function borrarUnaParada(parada) {
  
  alert('Se borró ' + parada + ' de la lista de paradas');
  var paradaABorrar = document.getElementById(parada);
  paradaABorrar.remove();

  for (var i = 0; i < locationsF.length; i++) {
    if (locationsF[i].address === parada) {
      locationsF.splice(i, 1);
    }
  }
  
}