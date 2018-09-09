const http = require("http");
const express = require("express");
const _ = require("underscore");
const bodyParser = require('body-parser');
const path = require('path')

const MongoClient = require("mongodb").MongoClient;
const routes = require('./controllers/routes.js');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// EJS templating engine setup
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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
    app.get('/rescuer', routes.getVictims(client.db('saveme')));
    app.get('/rescueme', (req, res) => {
        res.render('victim', {});
    })

    io.on('connection', socket => {
        socket.on('joinChannel', data => {
            socket.join(data.channelId);
            console.log("victim joined " + data.channelId + " channel");
        });

        socket.on('joinRescueChannel', () => {
            socket.join('rescuers');
            console.log('rescuer joined rescuers channel');
        })

        socket.on('sos', data => {
            console.log(data);
            io.to('rescuers').emit('newVictim', data);
            routes.recordVictim(client.db('saveme'), data);
        })
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
