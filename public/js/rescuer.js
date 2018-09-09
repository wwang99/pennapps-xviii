function openCard(victimID) {
    $(".victims").css("display", "none");
    $("#e"+victimID).css("display", "block");
}

function dismiss() {
    $(".expanded").css("display", "none");
    $(".victims").css("display", "block");
}
const socket = io();

socket.emit('joinRescueChannel');

socket.on('newVictim', data => {
    console.log(data);
    $(".victims").append(
        `<div class="card" id="c${data.id}" onclick="openCard(${data.id})">
<div class="info-wrapper">
<h4 class="card-header-text">${data.name}</h4>
<div class="details body-text">
<div class="info-block">Distance: ${data.location.coordinates[0]} ${data.location.coordinates[1]}</div> <div class="info-block">Severity: ${data.emergencyLevel}</div>
</div>
</div>
</div>`
    );
    $("body").append(
        `<div class="card expanded" id="e${data.id}">
<button class="btn-dismiss" onclick="dismiss()"><i class="fas fa-times"></i></button>
<div class="info-container">
<div class="expanded-card-header">
<h4 class="card-header-text">${data.name}</h4>
</div>
<div class="info-wrapper">
<p class="body-text">Phone #: ${data.phone}</p>
<p class="body-text">Distance: ${data.location.coordinates[0]} ${data.location.coordinates[1]}</p>
<p class="body-text">Severity: ${data.emergencyLevel}</p>
<p class="body-text">Description: ${data.info}</p>
<p class="body-text">Number of People: ${data.numPeople}</p>
</div>
<div class="button-wrapper">
<button class="btn">Rescue</button>
</div>
</div>
</div>`
    )
})

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

            marker.addListener('click', function() {
                map.setZoom(15);
                map.setCenter(marker.getPosition());
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
    // load victims from the database and add them to map
    $.getJSON('/getVictims', function(data) {
        console.warn(data);
        for (victim of data) {
            console.warn(victim.location.coordinates[1]);
            console.warn(victim.location.coordinates[0]);
            marker = new google.maps.Marker({
                position: {
                    lat: victim.location.coordinates[1],
                    lng: victim.location.coordinates[0]
                },
                map: map,
                animation: google.maps.Animation.DROP,
                title: 'VICTIM_ID'
            });
        }
    });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}
