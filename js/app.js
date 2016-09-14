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
       icon: 'images/purple-marker-32.png',
       id: location.placeId
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
      var contentString = '<div class="infowindow-scroll"><h3>' + marker.title + '</h3>' +
        '<div id="wikiElem"></div>' +
        '<button class="btn-modal-image">More Pictures</button></div>';
      infowindow.setContent(contentString);
      infowindow.open(map, marker);
      getWikiResults(marker.title);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
      $(".btn-modal-image").click(function() {
        $(".modal-image-container").empty();
        getPlaceDetails(marker.id);
        $(".modal").css('z-index', 3);
        $(".modal").show();
      });
    }
  }

  function getWikiResults(title) {
    // wikipedia
    var $wikiElem = $("#wikiElem");
    var wikiurl = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=" + title;
    var wikiRequestTimeout = setTimeout(function() {
      $wikiElem.append("Failed to get wikipedia resources");
    }, 8000);

    $.ajax({
      url: wikiurl,
      method: "GET",
      dataType: "jsonp",
      success: function(data) {
        var articles = data.query.pages;
        for (var key in articles) {
          $wikiElem.append('<p>' + articles[key].extract.split('\n')[0] + '</p>');
        }
        clearTimeout(wikiRequestTimeout);
      }
    });
    return wikiElem;
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
        place.photos.forEach(function(photo, i) {
          var url = photo.getUrl({'maxWidth': 400, 'maxHeight': 400});
          var contentString;
          if (i === 0) {
            contentString = '<span class="helper"></span><img class="active" src=' + url +'>';
          } else {
            contentString = '<span class="helper"></span><img src=' + url +'>';
          }
          $(".modal-image-container").append(contentString);
        });
      }
    }
  }
};

var model = new viewModel();
ko.applyBindings(model);

$(function () {
  $(".btn-exit-modal").click(function() {
    $(".modal").css('z-index', 0);
    $(".modal").hide();
  });

  $(".arrow-right").click(function() {
    var $next = $(".modal-image-container img.active").removeClass('active').next().next();
    if ($next.length) {
      $next.addClass('active');
    } else {
      $(".modal-image-container img:first").addClass('active');
    }
  });

  $(".arrow-left").click(function() {
    var $next = $(".modal-image-container img.active").removeClass('active').prev().prev();
    if ($next.length) {
      $next.addClass('active');
    } else {
      $(".modal-image-container img:last").addClass('active');
    }
  });

  var menuVisible = true;
  $(".hamburger-menu").click(function() {
    if (menuVisible) {
      $(".search-list").hide();
      menuVisible = false;
    } else {
      $(".search-list").show();
      menuVisible = true;
    }
  });
});
