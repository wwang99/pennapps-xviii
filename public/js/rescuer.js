// Enable pusher logging - don't include this in production
Pusher.logToConsole = true;

var pusher = new Pusher('ddf30894c0c1c2d4353d', {
    cluster: 'us2',
    forceTLS: true
});

var channel = pusher.subscribe('my-channel');
channel.bind('my-event', function(data) {
    alert(JSON.stringify(data));
});
