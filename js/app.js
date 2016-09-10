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

  this.filterLocations = function(locationType) {
    self.filteredLocations.removeAll();
    neighborhood.locations.forEach(function(location) {
      if (location.type === locationType) {
        self.filteredLocations.push(location);
      }
    });
  };
};

var initMap = function() {
  // Constructor creates a new map - only center and zoom are required.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.446062, lng: -122.160155},
    zoom: 15
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
      populateInfoWindow(this, largeInfowindow);
    });
    bounds.extend(marker.position);
  });

  // pop infowindow with click on list item
  $(".loc-list").click(function() {
    var id = $(this).index();
    populateInfoWindow(markers[id], largeInfowindow);
  });

  // set markers upon filtering 
  $(".loc-type").click(function(event) {
    var id = $(this).index();
    var locationType = neighborhood.locationTypes[id];
    markers.forEach(function(marker, i) {
      marker.setMap(map);
      if (neighborhood.locations[i].type != locationType) {
        marker.setMap(null);
      }
    });
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
};

var model = new viewModel();
ko.applyBindings(model);
