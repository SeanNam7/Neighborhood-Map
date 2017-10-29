

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
function CitiesViewModel() {
    this.cities = locations;
    this.chosenCities = ko.observable();
    this.selectedLocation = ko.observable(locations);
    this.resetCities = function() { this.chosenCities(null) }
}
//Activates Knockout
ko.applyBindings(new CitiesViewModel());


//Google maps function implementation activated through api url callback=initMap
function initMap() {
    var tokyoJapan = {lat: 35.708703, lng: 139.741370};
    //Sets the center location of the map
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: tokyoJapan
    });

    var infoWindow = new google.maps.InfoWindow();
    var marker, i;
    for (i = 0; i < locations.length; i++) {
        //Creates a marker for each location
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i].coordinates.lat, locations[i].coordinates.lng),
            map: map
        });
        //Shows the name of location/marker when clicked
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infoWindow.setContent(locations[i].name);
                infoWindow.open(map, marker);
            }
        })(marker, i));
    }
    ko.applyBindings(new ViewModel());
}

    // ViewModel function
function ViewModel() {
    var map;
    var marker;
    var self = this;
    self.categories = ko.observableArray(["All", "Tokyo", "Kyoto", "Osaka", "Hakone", "Sapporo"]);
    self.selectedCategory = ko.observable('');
    self.selectLocation = ko.observableArray(locations);
    self.locations = ko.observableArray([]);
    // Filter function
    self.filteredItems = ko.computed(function () {
        for (var i = 0; i < self.selectLocation().length; i++) {
            if (self.selectedCategory() === "All" || !self.selectedCategory()) {
                self.selectLocation()[i].show(true);
                self.selectLocation()[i].marker.setVisible(true);
            } else if (self.selectedCategory() === self.selectLocation()[i].category) {
                self.selectLocation()[i].show(true);
                self.selectLocation()[i].marker.setVisible(true);
            } else {
                self.selectLocation()[i].show(false);
                self.selectLocation()[i].marker.setVisible(false);
            }
        }
    });
};


