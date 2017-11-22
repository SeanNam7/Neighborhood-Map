
//Declare global variables
var map;
var infoWindow;
var markers = [];

//VIEWMODEL = A pure-code representation of the data and operations on a UI
function ViewModel() {
    var self = this;
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
    });

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
        for(var i = 0; i < locations.length; i++) {
            if(data.name === locations[i].name) {
                toggleBounce(locations[i].marker);
                populateInfoWindow(locations[i].marker, infoWindow);
            }
        }
    };
}

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
    //Function to handle marker.addListener
    var handleMarkerClick = function() {
        var marker = this;
        toggleBounce(this);
        populateInfoWindow(this, infoWindow);
    };
    for (var i = 0; i < locations.length; i++) {
        //Creates a marker on the map for each location
        var marker = new google.maps.Marker({
            map: map,
            name: locations[i].name,
            position: new google.maps.LatLng(locations[i].coordinates.lat, locations[i].coordinates.lng),
            animation: google.maps.Animation.DROP
        });
        //Attach click event handler to all markers
        marker.addListener('click', handleMarkerClick);


        //Add marker as a property of each location
        locations[i].marker = marker;
        //Stores marker in the markers array
        markers.push(marker);
    }
        //function to handle the addListener
}

//Fills up infoWindow with name and camera view
function populateInfoWindow(marker, infoWindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infoWindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infoWindow.setContent('');
        infoWindow.marker = marker;

        // // Foursquare API Client
        // clientID = "WI0STIWK035RH1PKLGJU2SYBLYDU4NVBVSO53RBTFPU5RGRJ";
        // clientSecret ="G44VBZ3F4OZJQ0L0WOHARNVDMKXGCML52RNG1A1XXQ5HXFHM";
        // // URL for Foursquare API
        // var apiUrl = 'https://api.foursquare.com/v2/venues/search?ll=' +
        //     marker.lat + ',' + marker.lng + '&client_id=' + clientID +
        //     '&client_secret=' + clientSecret + '&query=' + marker.title +
        //     '&v=20170708' + '&m=foursquare';
        // // Foursquare API
        // $.getJSON(apiUrl).done(function(marker) {
        //     var response = marker.response.venues[0];
        //     self.street = response.location.formattedAddress[0];
        //     self.city = response.location.formattedAddress[1];
        //     self.zip = response.location.formattedAddress[3];
        //     self.country = response.location.formattedAddress[4];
        //     self.category = response.categories[0].shortName;
        //     self.htmlContentFoursquare =
        //         '<h5 class="iw_subtitle">(' + self.category +
        //         ')</h5>' + '<div>' +
        //         '<h6 class="iw_address_title"> Address: </h6>' +
        //         '<p class="iw_address">' + self.street + '</p>' +
        //         '<p class="iw_address">' + self.city + '</p>' +
        //         '<p class="iw_address">' + self.zip + '</p>' +
        //         '<p class="iw_address">' + self.country +
        //         '</p>' + '</div>' + '</div>';

        //         infowindow.setContent(self.htmlContent + self.htmlContentFoursquare);
        //     }).fail(function() {
        //         // Send alert
        //         alert(
        //             "There was an issue loading the Foursquare API. Please refresh your page to try again."
        //         );
        //     });



        /*
        Filter Markers by Category
        */
        // this.categories = ["All", "Food", "History", "Scenery"];
        // this.selectedCategory = ko.observable(this.categories[0]);
        // this.selectedLocation = ko.observableArray(locations);

        // this.filteredItems = ko.computed(function() {
        //     for (var i = 0; i < self.selectedLocation().length; i++) {
        //         //show all markers if All is selected
        //         if (self.selectedCategory() === "All" || !self.selectedCategory()) {
        //             self.selectedLocation()[i].show(true);
        //             if (self.selectedLocation()[i].marker) {
        //                 self.selectedLocation()[i].marker.setVisible(true);
        //             }
        //         //only show markers with selected category
        //         } else if (self.selectedCategory() === self.selectedLocation()[i].category) {
        //             self.selectedLocation()[i].show(true);
        //             if (self.selectedLocation()[i].marker) {
        //                 self.selectedLocation()[i].marker.setVisible(true);
        //             }
        //         //hide markers who's category isn't selected
        //         } else {
        //             self.selectedLocation()[i].show(false);
        //             if (self.selectedLocation()[i].marker) {
        //                 self.selectedLocation()[i].marker.setVisible(false);
        //             }
        //         }
        //     }
        // });




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
                    infoWindow.setContent('<div>' + marker.title +
                                          '</div><div>No Street View Found</div>');
            }
        };
        // get the closest streetview image within 50 meters of marker
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        // Open infowindow on the selected marker
        infoWindow.open(map, marker);
    }
}

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
}

//Resets google maps center positioning and zoom
function tokyoCenter() {
    map.setCenter({lat: 35.691850, lng: 139.737046});
    map.setZoom(12);
}

//Activates Knockout
ko.applyBindings(new ViewModel());