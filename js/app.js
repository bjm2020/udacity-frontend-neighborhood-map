var viewModel = function() {
  var self = this;
  this.locations = ko.observableArray();
  neighborhood.locations.forEach(function(location) {
    self.locations.push(location);
  });

  this.filteredLocations = this.locations;

  this.Query = ko.observable('');
  this.filteredLocations = ko.computed(function() {
    var q = self.Query().toLowerCase();
    return self.locations().filter(function(i) {
      return i.title.toLowerCase().indexOf(q) >= 0;
    });
  });

};

var initMap = function() {
  // Constructor creates a new map - only center and zoom are required.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.609734, lng: -122.282254},
    zoom: 10
  });

  // create markers;
  var largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();
  var markers = [];

  neighborhood.locations.forEach(function(location, i) {
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
       map: map,
       position: location.location,
       title: location.title,
       animation: google.maps.Animation.DROP,
      //  icon: images[location.type],
       id: i
    });
    // Push the marker to our array of markers.
    markers.push(marker);
    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
      toggleBounce(this);
      populateInfoWindow(this, largeInfowindow);
    });
    bounds.extend(marker.position);
  });

  map.fitBounds(bounds);
  var filteredMarkers = markers;

  // pop infowindow with click on list item
  function ListClickHandler() {
    $(".loc-list").click(function() {
      var id = $(this).index();
      map.setCenter(filteredMarkers[id].getPosition());
      map.setZoom(13);
      toggleBounce(filteredMarkers[id]);
      populateInfoWindow(filteredMarkers[id], largeInfowindow);
    });
  }

  ListClickHandler();

  $(".form-control").keyup(function(event) {
    var query = $(".form-control").val().toLowerCase();
    filteredMarkers = [];
    markers.forEach(function(marker, i) {
      if (neighborhood.locations[i].title.toLowerCase().indexOf(query) >= 0) {
        marker.setMap(map);
        filteredMarkers.push(marker);
      } else {
        marker.setMap(null);
      }
    });
    map.fitBounds(bounds);
    ListClickHandler();
  });

  function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
    }
  }

  function toggleBounce(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function () {
      marker.setAnimation(null);
    }, 750);
  }

  placeService = new google.maps.places.PlacesService(map);
  function getPlaceDetails(placeId) {
    var request = {placeId: placeId};
    placeService.getDetails(request, callback);

    function callback(place, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        var photos = place.photos;
        photos.forEach(function(photo) {
          var url = photo.getUrl();
          console.log(url);
        });
      }
    }
  }
  getPlaceDetails('ChIJj61dQgK6j4AR4GeTYWZsKWw');
};

var model = new viewModel();
ko.applyBindings(model);
