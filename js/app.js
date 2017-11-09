//Note for myself = Three main modules(locations, ViewModel, initMap)


//VIEWMODEL = A pure-code representation of the data and operations on a UI
function ViewModel() {
    var self = this;
    this.cities = locations;
    this.selectedCity = ko.observable(); //nothing selected by default
    this.selectedLocation = ko.observableArray(locations);
    //Resets google maps to original site load state
    this.resetCities = function(){
        this.selectedCity(null)
        showMarkers()
        //Closes all infoWindows
        infoWindow.close();
    };

    //Filters the map depending on dropdown menu selection
    this.filteredMap = ko.computed(function() {
        for(var i = 0; i < locations.length; i++) {
            if (self.selectedCity() === self.selectedLocation()[i]) {
                clearMarkers();
                markers[i].setMap(map);
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
        for(var i = 0; i < locations.length; i++) {
            if(data.name === locations[i].name) {
                var eye = this;
                //Sets off marker bounce animation
                locations[i].marker.setAnimation(google.maps.Animation.BOUNCE);
                //Stops marker after 2 bounces
                setTimeout(function(){ eye.marker.setAnimation(null); }, 1400);



                //Inputs name of location within infowindow
                infoWindow.setContent('<h3>' + locations[i].name + '</h3>' +
                                      '<div id="pano"></div>');

                //Test up to this comment-----------------------
                var panoramaOptions = {
                    position: eye.coordinates,
                    pov: {
                        heading: 120,
                        pitch: 30
                    }
                };

                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('pano'), panoramaOptions);



                //Opens infoWindow of clicked listing
                infoWindow.open(map, locations[i].marker);
            }
        }
    }

    //Will toggle the animation between a BOUNCE animation and no animation.
    function toggleBounce() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }
}


var map;
var infoWindow;
var markers = [];

//Google maps function implementation activated through api url callback=initMap
function initMap() {
    var tokyoJapan = {lat: 35.691850, lng: 139.737046};
    //Sets the center location of the map
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: tokyoJapan,
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

        //Attach click event handler to marker with toggleBounce function
        marker.addListener('click', function() {
            var me = this;
            this.setAnimation(google.maps.Animation.BOUNCE);
            //Stops marker after 2 bounces
            setTimeout(function(){ me.setAnimation(null); }, 1400);
        })

        //Stores marker in the markers array
        markers.push(marker)

        //Shows the name of location when marker is clicked
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infoWindow.setContent('<h3>' + locations[i].name + '</h3>' +
                                      '<div id="pano"></div');
                infoWindow.open(map, marker);
            }
        })(marker, i));
    }
}

//Activates Knockout
ko.applyBindings(new ViewModel());