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
    //Sets the center location of the map
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





// In case the status is OK, which means the pano was found, compute the
// position of the streetview image, then calculate the heading, then get a
// panorama from that and set the options
var getStreetView = function (data, status) {
    if (status == google.maps.StreetViewStatus.OK) {
        var nearStreetViewLocation = data.location.latLng;
        var heading = google.maps.geometry.spherical.computeHeading(
            nearStreetViewLocation, marker.position);
        infowindow.setContent(windowContent + '<div id="pano"></div>');
        var panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
                heading: heading,
                pitch: 20
            }
        };
        var panorama = new google.maps.StreetViewPanorama(
            document.getElementById('pano'), panoramaOptions);
    } else {
        infowindow.setContent(windowContent + '<div style="color: red">No Street View Found</div>');
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