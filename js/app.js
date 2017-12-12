
//Declare global variables
var map;
var infoWindow;
var markers = [];

//VIEWMODEL = A pure-code representation of the data and operations on a UI
function ViewModel() {
    var self = this;
    this.categories = ["All", "Food", "History", "Scenery"];
    this.selectedCategory = ko.observable(this.categories[0]);
    this.selectedLocation = ko.observableArray(locations);
    this.venueStreet = ko.observable("");
    this.venueCity = ko.observable("");

    this.filteredItems = ko.computed(function() {
        for (var i = 0; i < self.selectedLocation().length; i++) {
            //show all markers if All is selected
            if (self.selectedCategory() === "All" || !self.selectedCategory()) {
                self.selectedLocation()[i].show(true);
                if (self.selectedLocation()[i].marker) {
                    self.selectedLocation()[i].marker.setVisible(true);
                }
            //only show markers with selected category
            } else if (self.selectedCategory() === self.selectedLocation()[i].category) {
                self.selectedLocation()[i].show(true);
                if (self.selectedLocation()[i].marker) {
                    self.selectedLocation()[i].marker.setVisible(true);
                }
            //hide markers who's category isn't selected
            } else {
                self.selectedLocation()[i].show(false);
                if (self.selectedLocation()[i].marker) {
                    self.selectedLocation()[i].marker.setVisible(false);
                }
            }
        }
    });

    /*Location and locationList used to filter list according to select menu*/
    // Location data
    var Location = function(data) {
        this.name = data.name;
        this.markerIndex = data.value;
        this.category = ko.observable(data.category);
    };

    // Initialization
    this.locationList = ko.observableArray([]);

    locations.forEach(function(locationsItem) {
        self.locationList.push(new Location(locationsItem));
    });

    //Resets google maps to original site load state
    this.resetCities = function(){
        tokyoCenter();
        resetMap();
        infoWindow.close();
        selectMenuToAll();
    };
    // Shows all the markers on the map
    function resetMap() {
        for (var i = 0; i < self.selectedLocation().length; i++) {
            self.selectedLocation()[i].show(true);
            self.selectedLocation()[i].marker.setVisible(true);
        };
    }
    // Sets google maps center positioning and zoom
    function tokyoCenter() {
        map.setCenter({lat: 35.691850, lng: 139.737046});
        map.setZoom(12);
    }
    // Select menu changed to "All"
    function selectMenuToAll() {
        document.getElementById("select").selectedIndex = 0;
    }

    // Removes the markers from the map, but keeps them in the array.
    function clearMarkers() {
        setMapOnAll(null);
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
        fullscreenControl: false,
        streetViewControl: false,
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
    marker.setVisible(true);
}

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

        var CLIENT_ID = 'WI0STIWK035RH1PKLGJU2SYBLYDU4NVBVSO53RBTFPU5RGRJ';
        var CLIENT_SECRET = 'G44VBZ3F4OZJQ0L0WOHARNVDMKXGCML52RNG1A1XXQ5HXFHM';
        // var venueStreet = "";
        // var venueCity = "";
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;
        getStreetView = function(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {

                $.ajax({

                    url: 'https://api.foursquare.com/v2/venues/search',
                    dataType: 'json',
                    data: 'limit=1' +
                        '&client_id=' + CLIENT_ID +
                        '&client_secret=' + CLIENT_SECRET +
                        '&ll=' + marker.position.lat() + ',' + marker.position.lng() +
                        '&v=20171130' +
                        '&m=foursquare' +
                        '&query=' + marker.name,
                    async: true,
                    success: function(data) {
                                                console.log(data.response);
                                                venueStreet = data.response.venues[0].location.formattedAddress[0];
                                                venueCity = data.response.venues[0].location.formattedAddress[1];
                                                console.log(venueStreet);
                    }
                // .done(function(result) {
                //     console.log(result);

                //     // open and populate infowindow
                //     infowindow.setContent('<div>' + marker.title + '</div><p>' + result.response.venues[0].location.address + '</p><p>' + result.response.venues[0].location.postalCode + '</p>');
                }).fail(function(error) {
                    alert("Error, failed to load data to application");
                });

                infoWindow.setContent('<h6>' + marker.name + '</h6>' +
                                      '<p>' + venueStreet + '<br>' + venueCity + '</p>' +
                                      '<div id="pano"></div>');
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

//Activates Knockout
ko.applyBindings(new ViewModel());