function iniciaMapa() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(iniciaAutoCompletado);
        navigator.geolocation.getCurrentPosition(nuestraPosicion);
    } else {
        console.log("El navegador no tiene geolocalización");
    }
    function nuestraPosicion(posicion) {
        var locations=[{"address":"Aqui tas tu wey","lat":"19.432764","lng":"-99.041974"},{"address":"Universidad La Salle Nezahualcóyotl","lat":"19.423820","lng":"-99.016544"},{"address":"Mercado Municipal No. 15 'El Sol'","lat":"19.434061","lng":"-99.044454"},{"address":"Tacos El Güero","lat":"19.439309","lng":"-99.164815"}];
        var request = jQuery.ajax({

			beforeSend: function (xhr) {
			    xhr.setRequestHeader ("Authorization", "Basic " + btoa("RedMx14:Tofis123"));
			},

			url: "https://api.routexl.nl/tour",
			method: "POST",
			dataType: "json",

			data: { locations: locations },
						
		});
		
		request.done(function( msg ) {
			console.log(msg);
		});
			 
		request.fail(function( jqXHR, textStatus ) {
			console.log(textStatus);
		});
    }
}
var current ; 
var locationsF = [];
function iniciaAutoCompletado(posicion){
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: posicion.coords.latitude, lng: posicion.coords.longitude},
        zoom: 13,
        mapTypeId: 'roadmap'
      });

      // Create the search box and link it to the UI element.
      var input = document.getElementById('pac-input');
      var input2 = document.getElementById('pac-input2');
      var searchBox = new google.maps.places.SearchBox(input);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input2);

      // Bias the SearchBox results towards current map's viewport.
      map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
      });

      var markers = [];
      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
          marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
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

function agregarLugarcito(){
    locationsF.push({"address":current.name,"lat":current.geometry.location.lat,"lng":current.geometry.location.lng});
    console.log(current.geometry.location.lat);
    console.log(current.geometry.location.lat());
    console.log(JSON.stringify(locationsF));
}
