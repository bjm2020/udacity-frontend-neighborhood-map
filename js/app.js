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

// viewModel provides data binding using knockout
var map;
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

  var placeService = new google.maps.places.PlacesService(map);

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

  // // hide modal when close-button is clicked
  this.modalVisible = ko.observable(false);
  this.exitModal = function() {
    $(".modal").hide();
    // self.modalVisible(false);
  };

  function populateInfoWindow(marker) {
    self.infoWindow.marker = marker;
    self.infoWindow.setContent(marker.infoWindowContent);
    self.infoWindow.open(map, marker);
    $(".btn-modal-image").click(function() {
      // when the button is clicked, removed images from last click
      self.modalImages.removeAll();
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

  this.modalImages = ko.observableArray();
  this.visibleImageId = ko.observable(0);
  this.currentImage = ko.observable();
  // ko.computed(function() {
  //   var id = self.visibleImageId();
  //   return self.modalImages()[id];
  // });
  // get google places photos
  function getPlaceDetails(placeId) {
    placeService.getDetails({placeId: placeId}, callback);

    function callback(place, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        var url, contentString;
        place.photos.forEach(function(photo, i) {
          url = photo.getUrl({'maxWidth': 400, 'maxHeight': 400});
          self.modalImages.push({imgSrc: url, imgAlt: ""});
        });
      } else {
        // error handling
        self.modalImages.push({imgSrc: "#",
          imgAlt: "Failed to get Google photos. Click arrow for Flickr photos."});
        console.log("Google images can't be loaded.");
      }
      // self.visibleImageId = ko.observable(0);
      self.currentImage(self.modalImages()[self.visibleImageId()]);
    }
  }

  // get flickr picture give lat/lon and title, max 10 photos
  function getFlickrPic(location, title) {
    var flickrSearchUrl = "https://api.flickr.com/services/rest/"
      + "?method=flickr.photos.search&api_key=144866a99011ed200e8ff4d6df0a7033"
      + "&format=json&jsoncallback=?" + "&lat=" + location.lat + "&lon="
      + location.lng + "&tags=" + title + "&radius=1&per_page=10";
    $.getJSON(flickrSearchUrl, function(data) {
      if (data.stat === 'ok') {
        var imageUrl, flickrPhotoInfoUrl, originalImgSrc;
        data.photos.photo.forEach(function(photo) {
          if (photo.ispublic) {
            // get photo info
            flickrPhotoInfoUrl = "https://api.flickr.com/services/rest/"
              + "?method=flickr.photos.getInfo&photo_id=" + photo.id
              + "&api_key=144866a99011ed200e8ff4d6df0a7033&format=json&jsoncallback=?";
            $.getJSON(flickrPhotoInfoUrl, function(data1) {
              if (data1.stat === 'ok') {
                imageUrl = "http://farm" + data1.photo.farm + ".static.flickr.com/" +
                  data1.photo.server + "/" + data1.photo.id + "_" + data1.photo.secret + ".jpg";
                originalImgSrc = data1.photo.urls.url[0]._content;
                self.modalImages.push({imgSrc: imageUrl, imgAlt: data1.photo.title._content,
                  originalImgSrc: originalImgSrc, linktext: "Link to Original Flickr Image"});
              }
            });
          }
        });
      } else {
        // error handling
        self.modalImages.push({imgSrc: "#",
          imgAlt: "Failed to get Flickr photos. Click arrow for Google photos."});
        console.log("Flickr images cant be loaded.");
      }
    })
    // error handling
    .fail(function() {
      self.modalImages.push({imgSrc: "#",
        imgAlt: "Failed to get Flickr photos. Click arrow for Google photos."});
    });
  }

  this.prevImage = function() {
    self.visibleImageId = ko.computed(function() {
      var length = self.modalImages().length;
      var prev = (self.visibleImageId() - 1 + length) % length;
      self.currentImage(self.modalImages()[prev]);
      return prev;
    });
  }

  this.nextImage = function() {
    self.visibleImageId = ko.computed(function() {
      var next = (self.visibleImageId() + 1) % self.modalImages().length;
      self.currentImage(self.modalImages()[next]);
      return next;
    });
  }
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
