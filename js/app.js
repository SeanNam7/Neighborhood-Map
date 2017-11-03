//Note for myself = Three main modules(locations, ViewModel, initMap)

//MODEL: application’s stored data.
var locations = [{
        name: 'Tsukiji Fish Market',
        category: 'Food',
        coordinates: {
            lat: 35.665765,
            lng: 139.770688
        },
        value: 1
    },{
        name: 'Ichiran Shibuya Ramen',
        category: 'Food',
        coordinates: {
            lat: 35.661292,
            lng: 139.701097
        },
        value: 2
    },{
        name: 'Sushi Dai',
        category: 'Food',
        coordinates: {
            lat: 35.663868,
            lng: 139.769669
        },
        value: 3
    },{
        name: 'Imperial Palace',
        category: 'History',
        coordinates: {
            lat: 35.685413,
            lng: 139.752851
        },
        value: 4
    },{
        name: 'Tokyo National Museum',
        category: 'History',
        coordinates: {
            lat: 35.719079,
            lng: 139.776521
        },
        value: 5
    },{
        name: 'Akasuka Shrine',
        category: 'History',
        coordinates: {
            lat: 35.715305,
            lng: 139.797514
        },
        value: 6
    },{
        name: 'Rainbow Bridge',
        category: 'Scenery',
        coordinates: {
            lat: 35.636780,
            lng: 139.763691
        },
        value: 7
    },{
        name: 'Shinjuku Gyoen National Garden',
        category: 'Scenery',
        coordinates: {
            lat: 35.683573,
            lng: 139.713227
        },
        value: 8
    },{
        name: 'Roppongi Mori Tower',
        category: 'Scenery',
        coordinates: {
            lat: 35.660494,
            lng: 139.729631
        },
        value: 9
    }
];

//VIEWMODEL = A pure-code representation of the data and operations on a UI
function ViewModel() {
    var self = this;
    this.cities = locations;
    this.selectedCity = ko.observable(); //nothing selected by default
    this.selectedLocation = ko.observableArray(locations);
    this.resetCities = function(){
        this.selectedCity(null)
        showMarkers()
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

    //Connects side listview locations with markers
    showInfo = function(data) {
        for(var i = 0; i < locations.length; i++) {
            if(data.name === locations[i].name) {
                var eye = this;
                //Sets off marker bounce animation
                locations[i].marker.setAnimation(google.maps.Animation.BOUNCE);
                //Stops marker after 2 bounces
                setTimeout(function(){ eye.marker.setAnimation(null); }, 1400);
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
        center: tokyoJapan
    });

    infoWindow = new google.maps.InfoWindow();
    var i;
    for (i = 0; i < locations.length; i++) {
        //Creates a marker on the map for each location
        var marker = new google.maps.Marker({
            map: map,
            name: locations[i].name,
            position: new google.maps.LatLng(locations[i].coordinates.lat, locations[i].coordinates.lng),
            animation: google.maps.Animation.DROP
        });

        //Attach marker to locations array
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

        //Shows the name of location/marker when clicked
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infoWindow.setContent(locations[i].name);
                infoWindow.open(map, marker);
            }
        })(marker, i));
    }
}

//Activates Knockout
ko.applyBindings(new ViewModel());