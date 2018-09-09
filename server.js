const http = require("http");
const express = require("express");
const _ = require("underscore");
const bodyParser = require('body-parser');
const path = require('path')
const fetch = require('node-fetch');
const favicon = require('serve-favicon')

const MongoClient = require("mongodb").MongoClient;
const routes = require('./controllers/routes.js');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// EJS templating engine setup
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//MongoDB admin user pw: dtDs3VgQayKd7JKZ
var uri = "mongodb+srv://admin:dtDs3VgQayKd7JKZ@pennapps-piuu1.gcp.mongodb.net/saveme?retryWrites=true";
MongoClient.connect(uri, function(err, client) {
    console.log("connected to mongodb successfully")

    // views routes
    app.get('/', (req, res) => {
        res.render('index', {});
    })
    app.get('/rescuer', routes.getAllVictims(client.db('saveme')));
    app.get('/rescueme', (req, res) => {
        res.render('victim', {});
    })
    app.get('/about', (req, res) => {
        res.render('about', {});
    })
    app.post('/rescueme', async (req, res) => {
        console.log(req.body);
        let data = {};
        data.name = req.body.name;
        data.phone = req.body.phoneNumber;
        data.id = Number(req.body.phoneNumber);
        data.info = req.body.info;
        data.numPeople = req.body.people;
        // if (req.body.location) {
        //     let coords = [];
        //     fetch('https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyD54tRMyjOB8mJCrMWI2-UYkfC6_MaY1PQ')
        //     .then(function(response) {
        //         return response.json();
        //     })
        //     .then(function(myJson) {
        //         console.log(JSON.stringify(myJson.results[0].geometry.location));
        //         coords[0] = myJson.results[0].geometry.location.lng;
        //         coords[1] = myJson.results[0].geometry.location.lat;
        //         data.location = {
        //             type: "Point",
        //             coordinates: coords
        //         }
        //     });
        //     console.log(data.location);
        // } else {
        //     let coords = req.body.locationAuto.split(',');
        //     console.log(coords);
        //     data.location = {
        //         type: "Point",
        //         coordinates: coords
        //     }
        // }
        let coords = [];
        coords[1] = Number(req.body.locationAuto.split(',')[0]);
        coords[0] = Number(req.body.locationAuto.split(',')[1]);
        data.location = {
            type: "Point",
            coordinates: coords
        }
        if (data.hospital === 'on') {
            data.emergencyLevel = 5;
        } else {
            data.emergencyLevel = Math.floor(Math.random() * 5) + 1;
        }
        io.to('rescuers').emit('newVictim', data);
        routes.recordVictim(client.db('saveme'), data);
        res.redirect('/rescueme?id='+req.body.phoneNumber);
    })

    // api routes
    app.get('/getVictims', routes.APIVictims(client.db('saveme')));

    io.on('connection', socket => {
        socket.on('joinChannel', data => {
            socket.join(data.channelId);
            console.log("new victim joined " + data.channelId + " channel");
        });

        socket.on('joinRescueChannel', () => {
            socket.join('rescuers');
            console.log('new rescuer joined rescuers channel');
        })

        socket.on('rescueComing', data => {
            console.log(data);
            io.to(data.toString()).emit('helpOnTheWay');
            routes.deleteVictim(client.db('saveme'), data);
        })
        // socket.on('sos', data => {
        //     console.log(data);
        //     io.to('rescuers').emit('newVictim', data);
        //     routes.recordVictim(client.db('saveme'), data);
        // })
    });

    // route for handling 404 requests (unavailable routes)
    app.use((req, res) => {
        res.json('404');
    });

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=> {
  console.log('Server running on port ' + PORT);
})
