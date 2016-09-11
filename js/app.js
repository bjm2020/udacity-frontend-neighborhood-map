var viewModel = function() {
  var self = this;
  this.locations = ko.observableArray();
  neighborhood.locations.forEach(function(location) {
    self.locations.push(location);
  });

  this.locationTypes = ko.observableArray();
  neighborhood.locationTypes.forEach(function(type) {
    self.locationTypes.push(type);
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
  var images = {
    Restaurant: {
      url: 'images/purple.png',
      // scaledSize: new google.maps.Size(30, 30)
    },
    Coffee: {url: 'images/blue.png'},
    Shopping: {url: 'images/red.png'},
    Transportation: {url: 'images/green.png'}
  };

  neighborhood.locations.forEach(function(location, i) {
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
       map: map,
       position: location.location,
       title: location.title,
       animation: google.maps.Animation.DROP,
       icon: images[location.type],
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
};

var model = new viewModel();
ko.applyBindings(model);
