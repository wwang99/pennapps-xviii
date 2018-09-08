$(document).ready(function() {
    $(".victims > .card").click(function() {
        const victimID = $(this).attr("id").replace(/\D/g,'');
        $(".victims").css("display", "none");
        $("#e"+victimID).css("display", "block");
    });
    $("button.btn-dismiss").on("click", function() {
        $(".expanded").css("display", "none");
        $(".victims").css("display", "block");
    })
});

const socket = io();

// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
var map, infoWindow;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 13
    });
    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            
            var marker = new google.maps.Marker({
                position: pos,
                map: map,
                icon: 'http://maps.google.com/mapfiles/ms/icons/blue.png',
                animation: google.maps.Animation.DROP,
                title: 'My location.'
            });

            infoWindow.setPosition(pos);
            infoWindow.setContent('Your location is marked in blue.');
            infoWindow.open(map);
            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}