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
  //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input2);

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
  });
}

function trazarRuta(rutas) {
  var posicionex = [];
  var wayputos = [];
  for (let index = 0; index < locationsF.length; index++) {
    for (let index2 = 0; index2 < locationsF.length; index2++) {
      if (rutas.route[index].name === locationsF[index2].address) {
        posicionex.push({ lat: locationsF[index].lat, lng: locationsF[index].lng });
        if (index != 0 || index != locationsF.length) {
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
      new google.maps.DirectionsRenderer({
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

      // var dvDistance = document.getElementById("dvDistance");
      // dvDistance.innerHTML = "";
      // dvDistance.innerHTML += "Distance: " + distance + "<br />";
      // dvDistance.innerHTML += "Duration:" + duration;
      var distamce = document.getElementById('distance');
      var dumration = document.getElementById('duration');

      distamce.innerHTML += 'Distancia: ' + distance;
      dumration.innerHTML += 'Duración: ' +duration;

    } else {
      alert("Unable to find the distance via road.");
    }
  });
}
