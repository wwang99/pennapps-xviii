const socket = io();
// const socket = io.connect();

const sosSignal = () => {
    socket.emit('sos', victimInfo);
}

socket.emit('joinChannel', { channelId: 'test' });

let victimInfo = {};

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(location) {
        lat = location.coords.latitude;
        lng = location.coords.longitude;
        victimInfo = {
            name: "Test User",
            phone: "1112223333",
            emergencyLevel: 4,
            info: "my arm is broken please help me",
            numPeople: 1,
            location: {
                latitude: lat,
                longitude: lng
            }
        }
    });
} else {
    alert('geolocation not supported');
}
