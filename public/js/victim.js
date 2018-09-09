const socket = io();

const sosSignal = () => {
    socket.emit('sos', victimInfo);
}

let id = Math.floor(Math.random() * 9999999999);
socket.emit('joinChannel', { channelId: id });

let victimInfo = {};

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(location) {
        lat = location.coords.latitude;
        lng = location.coords.longitude;
        // build this info from answers to questions
        victimInfo = {
            id:  id,
            name: "Test User",
            phone: "" + id,
            emergencyLevel: 4,
            info: "my arm is broken please help me",
            numPeople: Math.floor(Math.random() * 5) + 1,
            location: {
                "type": "Point",
                "coordinates": [
                    lat,
                    lng
                ]
            }
        }
    });
} else {
    alert('geolocation not supported');
}
