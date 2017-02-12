(function(dmUIConfig) {
  $(document).ready(function () {
    var pupAddress = [
			{'latlng': [19.2153052, 72.8289045], name: 'Chandivali West'},
			{'latlng': [19.1283001, 72.921797], name: 'Ambedkar Nagar'},
			{'latlng': [19.1467451, 72.9861459], name: 'Airoli'},
			{'latlng': [19.2089194, 72.8702703], name: 'Thakur Village'}
		];
    var infoWnd, mapCanvas, zoomChangeBoundsListener, google;
    function initialize() {
      var myOptions = {
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			//Creates a map object.
      mapCanvas = new google.maps.Map(document.getElementById('map_canvas'), myOptions);

			//Creates a infowindow object.
      infoWnd = new google.maps.InfoWindow();

			//Mapping markers on the map
      var bounds = new google.maps.LatLngBounds();
      var pup, i, latlng;

      for (i in pupAddress) {
				//Creates a marker
        pup = pupAddress[i];
        latlng = new google.maps.LatLng(pup.latlng[0], pup.latlng[1]);
        bounds.extend(latlng);
        var marker = createMarker(
          mapCanvas, latlng, pup.name
        );

				//Creates a sidebar button for the marker
        createMarkerButton(marker);
      }
      //Fits the map bounds
      mapCanvas.fitBounds(bounds);
      zoomChangeBoundsListener = google.maps.event.addListenerOnce(mapCanvas, 'bounds_changed', function(event) {
        if (this.getZoom()){
          this.setZoom(14);
        }
      });
      setTimeout(function(){
        google.maps.event.removeListener(zoomChangeBoundsListener);
      }, 2000);
    }

    function createMarker(map, latlng, title) {
      //Creates a marker
      var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: title
      });

      //The infoWindow is opened when the sidebar button is clicked
      google.maps.event.addListener(marker, 'click', function(){
        infoWnd.setContent('<strong>' + title + '</title>');
        infoWnd.open(map, marker);
      });
      return marker;
    }
    function createMarkerButton(marker) {
      //Creates a sidebar button
      var ul = document.getElementById('marker_list');
      var li = document.createElement('li');
      var title = marker.getTitle();
      li.innerHTML = title;
      ul.appendChild(li);

      //Trigger a click event to marker when the button is clicked.
      google.maps.event.addDomListener(li, 'click', function(){
        google.maps.event.trigger(marker, 'click');
      });
    }
    google.maps.event.addDomListener(window, 'load', initialize);
  });
}(DM_UI_CONFIG));
