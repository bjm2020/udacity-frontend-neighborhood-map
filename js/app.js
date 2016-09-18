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
    '<div><button class="btn-modal-image">Pictures from Google and Flickr</button></div></div>';
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

//
// function populateInfoWindow(marker, infowindow) {
//   // Check to make sure the infowindow is not already opened on this marker.
//   if (infowindow.marker != marker) {
//     infowindow.marker = marker;
//     // set infowindow content
//     var contentString = '<div class="infowindow-scroll"><h3>' + marker.title + '</h3>' +
//       '<p>' + marker.description + '</p>' +
//       '<a href="' + marker.descriptionSrc + ' ">' + marker.descriptionSrc + '</a>' +
//       '<div><button class="btn-modal-image">Pictures from Google and Flickr</button></div></div>';
//     infowindow.setContent(contentString);
//     infowindow.open(map, marker);
//     // Make sure the marker property is cleared if the infowindow is closed.
//     infowindow.addListener('closeclick', function() {
//       infowindow.marker = null;
//     });
//     // handle images button
//     $(".btn-modal-image").click(function() {
//       // when the button is clicked, removed images from last click
//       $(".modal-image-container").empty();
//       // get photos from google places api
//       getPlaceDetails(marker.id);
//       // get photos from flickr using lat/lon and title
//       getFlickrPic(marker.location, marker.title);
//       // show the modal
//       $(".modal").show();
//     });
//   }
// }

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
  }

  // function to handle when a list item is clicked
  this.listClick = function(clickedItem) {
    var marker = clickedItem.marker;
    map.setCenter(marker.getPosition());
    map.setZoom(13);
    toggleBounce(marker);
    populateInfoWindow(marker);
  };

  // hide modal when close-button is clicked
  this.modalVisible = ko.observable(false);
  this.exitModal = function() {
    self.modalVisible(false);
  };
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

var map, bounds, placeService;

// var initMap = function() {
//   // create a new map
//   map = new google.maps.Map(document.getElementById('map'), {
//     center: {lat: 37.609734, lng: -122.282254},
//     zoom: 10,
//     mapTypeControl: false,
//     zoomControl: true,
//     zoomControlOptions: {
//         position: google.maps.ControlPosition.RIGHT_BOTTOM
//     },
//     scaleControl: true,
//     streetViewControl: true,
//     streetViewControlOptions: {
//         position: google.maps.ControlPosition.RIGHT_BOTTOM
//     }
//   });
//
//   largeInfowindow = new google.maps.InfoWindow();
//   bounds = new google.maps.LatLngBounds();
//   placeService = new google.maps.places.PlacesService(map);
//
//   // create markers
//   neighborhood.locations.forEach(function(location, i) {
//     // Create a marker per location, and put into markers array.
//     marker = new google.maps.Marker({
//       //  map: map,
//        position: location.location,
//        title: location.title,
//        animation: google.maps.Animation.DROP,
//        icon: 'images/purple-marker-32.png',
//        description: location.description,
//        descriptionSrc: location.link,
//        id: location.placeId,
//        location: location.location
//     });
//     // Push the marker to our array of markers.
//     model.markers.push(marker);
//     // Create an onclick event to open an infowindow at each marker.
//     marker.addListener('click', function() {
//       // bounce the marker upon click
//       toggleBounce(this);
//       // open infowindow
//       populateInfoWindow(this, largeInfowindow);
//     });
//     // extends the map bounds with current marker
//     bounds.extend(marker.position);
//   });
//   // refit map bounds after completing markers
//   map.fitBounds(bounds);
//
// };

// function to handle when a list item is clicked
// function ListClickHandler() {
//   $('.loc-list').click(function() {
//     // check the id of the list clicked
//     var id = $(this).index();
//     // center the map on this marker and zoom the map
//     map.setCenter(filteredMarkers[id].getPosition());
//     map.setZoom(13);
//     //  bounce the marker when the list item is clicked
//     toggleBounce(filteredMarkers[id]);
//     // open infowindow when list item is clicked
//     populateInfoWindow(filteredMarkers[id], largeInfowindow);
//   });
// }

// event handler when a list item is clicked
// ListClickHandler();
//
// function ListClickHandler() {
//   $('.loc-list').click(function() {
//     // check the id of the list clicked
//     var id = $(this).index();
//     // center the map on this marker and zoom the map
//     map.setCenter(filteredMarkers[id].getPosition());
//     map.setZoom(13);
//     //  bounce the marker when the list item is clicked
//     toggleBounce(filteredMarkers[id]);
//     // open infowindow when list item is clicked
//     populateInfoWindow(filteredMarkers[id], largeInfowindow);
//   });
// }

// map.fitBounds(bounds);
// filter markers when a search query is input
// $(".form-control").keyup(function(event) {
//   // get query text
//   var query = $(".form-control").val().toLowerCase();
//   // calculate filteredMarkers
//   filteredMarkers = [];
//   // for each marker, if its title matches query, remain on the map; otherwise remove from map
//   model.markers().forEach(function(marker, i) {
//     if (neighborhood.locations[i].title.toLowerCase().indexOf(query) >= 0) {
//       marker.setMap(map);
//       model.filteredMarkers.push(marker);
//     } else {
//       marker.setMap(null);
//     }
//   });
//   // re-fit map bounds
//   map.fitBounds(bounds);
//   // re-initiate lists and the corresponding click events
//   ListClickHandler();
// });

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
