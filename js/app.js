
//Declare global variables
var map;
var infoWindow;
var markers = [];

//VIEWMODEL = A pure-code representation of the data and operations on a UI
function ViewModel() {
    var self = this;
    this.cities = locations;
    this.selectedCity = ko.observable(); //nothing selected by default
    this.selectedLocation = ko.observableArray(locations);
    //Resets google maps to original site load state
    this.resetCities = function(){
        tokyoCenter();
        this.selectedCity(null);
        showMarkers();
        //Closes all infoWindows
        infoWindow.close();
    };

    //Filters the map depending on dropdown menu selection
    this.filteredMap = ko.computed(function() {
        for(var i = 0; i < locations.length; i++) {
            if (self.selectedCity() === self.selectedLocation()[i]) {
                clearMarkers();
                markers[i].setMap(map);
                toggleBounce(locations[i].marker);
                populateInfoWindow(locations[i].marker, infoWindow);
            }
        }
    })
    //Three functions below taken from google documentation site
    // Sets the map on all markers in the array.
    function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
            //.setMap adds the marker to the map
            markers[i].setMap(map);
        }
    }
    // Removes the markers from the map, but keeps them in the array.
    function clearMarkers() {
        setMapOnAll(null);
    }
    // Shows any markers currently in the array.
    function showMarkers() {
        setMapOnAll(map);
    }

    //Connects side listview with markers
    showInfo = function(data) {
        for(let i = 0; i < locations.length; i++) {
            if(data.name === locations[i].name) {
                toggleBounce(locations[i].marker);
                populateInfoWindow(locations[i].marker, infoWindow);
            }
        }
    }
};



//Google maps function implementation activated through api url callback=initMap
function initMap() {
    var tokyoJapan = {lat: 35.691850, lng: 139.737046};
    //Sets the center location of the map
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: tokyoJapan,
        styles: stylesArray,
        mapTypeControl: false
    });

    infoWindow = new google.maps.InfoWindow({
        maxWidth: 250
    });
    var i;
    for (i = 0; i < locations.length; i++) {
        //Creates a marker on the map for each location
        var marker = new google.maps.Marker({
            map: map,
            name: locations[i].name,
            position: new google.maps.LatLng(locations[i].coordinates.lat, locations[i].coordinates.lng),
            animation: google.maps.Animation.DROP
        });

        //Add marker as a property of each location
        locations[i].marker = marker;

        //Attach click event handler to all markers
        marker.addListener('click', function() {
            toggleBounce(this);
            populateInfoWindow(this, infoWindow);
        })

        //Stores marker in the markers array
        markers.push(marker)
    }
};

//Fills up infoWindow with name and camera view
function populateInfoWindow(marker, infoWindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infoWindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infoWindow.setContent('');
        infoWindow.marker = marker;

        // make sure infowindow is not open already
        infoWindow.addListener('closeclick', function () {
            infoWindow.marker = null;
        });
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;

        getStreetView = function(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                infoWindow.setContent('<h6>' + marker.name + '</h6>' + '<div id="pano"></div>');
                var panoramaOptions = {
                    position: marker.position,
                    pov: {
                        heading: 34,
                        pitch: 30
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('pano'), panoramaOptions);
                } else {
                    infoWindow.setContent('<div>' + marker.title
                        + '</div><div>No Street View Found</div>');
            };
        };

        // get the closest streetview image within 50 meters of marker
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        // Open infowindow on the selected marker
        infoWindow.open(map, marker);
    }
};

//Makes markers bounce twice
function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
        marker.setAnimation(null);
    }, 1400);
  }
};

//Resets google maps center positioning and zoom
function tokyoCenter() {
    map.setCenter({lat: 35.691850, lng: 139.737046});
    map.setZoom(12);
};

//Activates Knockout
ko.applyBindings(new ViewModel());
