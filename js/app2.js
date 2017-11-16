//Declaring global variables
var map;
var infoWindow;
var markers = [];

//Google maps function implementation activated through api url callback=initMap
function initMap() {
    var tokyoJapan = {
        lat: 35.691850,
        lng: 139.737046
    };
    //Sets up the map
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: tokyoJapan,
        mapTypeControl: false
    });

    infoWindow = new google.maps.InfoWindow({
        maxWidth: 250
    });

    ko.applyBindings(new ViewModel());
}


//VIEWMODEL = A pure-code representation of the data and operations on a UI
function ViewModel() {

}








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