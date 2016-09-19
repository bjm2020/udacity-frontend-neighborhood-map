// viewModel provides data binding using knockout
var locationModel = function(loc) {
  var self = this;

  this.location = loc.location;
  this.title = loc.title;
  this.placeId  = loc.placeId;
  this.description = loc.description;
  this.descriptionUrl = loc.link;

  this.visible = ko.observable(true);
  var infoWindowContent = '<div class="infowindow-scroll"><h3>' +
    this.title + '</h3>' + '<p>' + this.description + '</p>' +
    '<a href="' + this.descriptionUrl + ' ">' + this.descriptionUrl + '</a>' +
    '<div><button class="btn-modal-image">'+
    ' Pictures from Google and Flickr</button></div></div>';
  this.marker = new google.maps.Marker({
     map: map,
     position: self.location,
     title: self.title,
     animation: google.maps.Animation.DROP,
     icon: 'images/purple-marker-32.png',
     id: self.placeId,
     location: self.location,
     infoWindowContent: infoWindowContent
  });
  this.showMarker = ko.computed(function() {
    if (self.visible() === true) {
      self.marker.setMap(map);
    } else {
      self.marker.setMap(null);
    }
  });
};

var map, placeService;
var viewModel = function() {
  var self = this;
  var bounds = new google.maps.LatLngBounds();

  // new google map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.609734, lng: -122.282254},
    zoom: 10,
    mapTypeControl: false,
    zoomControl: true,
    zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
    },
    scaleControl: true,
    streetViewControl: true,
    streetViewControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
    }
  });

  placeService = new google.maps.places.PlacesService(map);

  // whether search-list is visible through menu clickings
  this.menuVisible = ko.observable(true);
  this.toggleSearchList = function() {
    self.menuVisible(!self.menuVisible());
  };

  // read locations
  this.locations = ko.observableArray();
  neighborhood.locations.forEach(function(location) {
    self.locations.push(new locationModel(location));
  });

  // create only one infowindow for all markers
  this.infoWindow = new google.maps.InfoWindow();
  this.locations().forEach(function(location) {
    var marker = location.marker;
    if (self.infoWindow.marker != marker) {
      self.infoWindow.marker = marker;
      marker.addListener('click', function() {
          // bounce the marker upon click
          toggleBounce(this);
          // open infowindow
          populateInfoWindow(this)
      });
    }
    bounds.extend(marker.position);
  });

  map.fitBounds(bounds);

  // filteredLocations is locatins without filtering
  this.filteredLocations = this.locations;
  // compute filteredLocations upon search query input
  this.Query = ko.observable('');
  this.filteredLocations = ko.computed(function() {
    var q = self.Query().toLowerCase();
    // re-fit bounds when query is applied
    map.fitBounds(bounds);
    return self.locations().filter(function(loc) {
      var result = loc.title.toLowerCase().indexOf(q) >= 0;
      loc.visible(result);
      return result;
    });
  });

  // animation for marker when clicked, bounce only once (750ms)
  function toggleBounce(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function () {
      marker.setAnimation(null);
    }, 750);
  }

  function populateInfoWindow(marker) {
    self.infoWindow.marker = marker;
    self.infoWindow.setContent(marker.infoWindowContent);
    self.infoWindow.open(map, marker);
    $(".btn-modal-image").click(function() {
      // when the button is clicked, removed images from last click
      $(".modal-image-container").empty();
      // get photos from google places api
      getPlaceDetails(marker.id);
      // get photos from flickr using lat/lon and title
      getFlickrPic(marker.location, marker.title);
      // show the modal
      // self.modalVisible(true);
      $(".modal").show();
    });
  }

  // function to handle when a list item is clicked
  this.listClick = function(clickedItem) {
    var marker = clickedItem.marker;
    map.setCenter(marker.getPosition());
    map.setZoom(13);
    toggleBounce(marker);
    populateInfoWindow(marker);
  };

  // // hide modal when close-button is clicked
  // this.modalVisible = ko.observable(false);
  this.exitModal = function() {
    $(".modal").hide();
  };

  // this.loadModal = function() {
  //   self.modalVisible(true);
  //   // self.modalImages.push('#');
  // };
};

var initApp = function() {
  // apply data bindings to viewModel
  var model = new viewModel();
  ko.applyBindings(model);
};

// maps loading error handling
var mapsErrorHandler = function() {
  $("#map").append("<div class='google-error'>Google Maps can't be loaded</div>");
};

// get google places photos
function getPlaceDetails(placeId) {
  placeService.getDetails({placeId: placeId}, callback);

  function callback(place, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      var url, contentString;
      place.photos.forEach(function(photo, i) {
        url = photo.getUrl({'maxWidth': 400, 'maxHeight': 400});
        if (i === 0) {
          contentString = '<span class="helper"></span><img class="active" src=' + url +'>';
        } else {
          contentString = '<span class="helper"></span><img src=' + url +'>';
        }
        $(".modal-image-container").append(contentString);
      });
    } else {
      // error handling
      $(".modal-image-container").append('<span class="helper"></span><img class="active" src="#" alt="Failed to get Google photos. Click arrow for Flickr photos.">');
      console.log("Google images can't be loaded.");
    }
  }
}

// get flickr picture give lat/lon and title, max 10 photos
function getFlickrPic(location, title) {
  var flickrSearchUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=144866a99011ed200e8ff4d6df0a7033&format=json&jsoncallback=?"
    + "&lat=" + location.lat + "&lon=" + location.lng + "&tags=" + title + "&radius=1&per_page=10";
  $.getJSON(flickrSearchUrl, function(data) {
    if (data.stat === 'ok') {
      var imageUrl, contentString;
      data.photos.photo.forEach(function(photo) {
        if (photo.ispublic) {
          imageUrl = "http://farm" + photo.farm + ".static.flickr.com/" +
            photo.server + "/" + photo.id + "_" + photo.secret + ".jpg";
          contentString = '<span class="helper"></span><img src=' + imageUrl +' alt=' + photo.title + '>';
          $(".modal-image-container").append(contentString);
        }
      });
    } else {
      // error handling
      $(".modal-image-container").append('<span class="helper"></span><img src="#" alt="Failed to get Flickr photos. Click arrow for Google photos.">');
      console.log("Flickr images cant be loaded.");
    }
  })
  // error handling
  .fail(function() {
    $(".modal-image-container").append('<span class="helper"></span><img src="#" alt="Failed to get Flickr photos. Click arrow for Google photos.">');
  });
}

$(function () {
  // move to the next image when arrow-right is clicked
  var $next;
  $(".arrow-right").click(function() {
    $next = $(".modal-image-container img.active").removeClass('active').next().next();
    if ($next.length) {
      $next.addClass('active');
    } else {
      // if last image, jump to the first image
      $(".modal-image-container img:first").addClass('active');
    }
  });

  // move to the previous image when left-arrow is clicked
  $(".arrow-left").click(function() {
    $next = $(".modal-image-container img.active").removeClass('active').prev().prev();
    if ($next.length) {
      $next.addClass('active');
    } else {
      // if first image, then jump to the last image
      $(".modal-image-container img:last").addClass('active');
    }
  });
});
