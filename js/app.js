var viewModel = function() {
  this.locations = ko.observableArray([
    {lat: 37.446443, lng: -122.160893, name: 'Burma Ruby Burmese Cuisine', address: '326 University Ave, Palo Alto, CA'},
    {lat: 37.445495, lng: -122.161030, name: 'Sharetea Palo Alto', address: '540 Bryant St, Palo Alto, CA'},
    {lat: 37.447904, lng: -122.159577, name: 'Blue Bottle Coffee', address: 'HanaHaus at New Varsity, 456 University Ave, Palo Alto, CA'},
    {lat: 37.445825, lng: -122.162137, name: "Oren's Hummus Shop", address: '261 University Ave, Palo Alto, CA'},
    {lat: 37.445288, lng: -122.161367, name: 'Nola - Palo Alto', address: '535 Ramona St, Palo Alto, CA'}
    ]);
};

var model = new viewModel();
ko.applyBindings(model);

var initMap = function() {
  // Constructor creates a new map - only center and zoom are required.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.446062, lng: -122.160155},
    zoom: 15
  });
  // TODO: create marker arrays;
  var tribeca = {lat: 37.446062, lng: -122.160155};
  var marker = new google.maps.Marker({
    position: tribeca,
    map: map,
    title: 'First Marker!'
  });
};
