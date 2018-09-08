const http = require("http");
const express = require("express");
const _ = require("underscore");
const bodyParser = require('body-parser');
const path = require('path')

const MongoClient = require("mongodb").MongoClient;

const app = express();

// EJS templating engine setup
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index', {});
})
app.get('/rescuer', (req, res) => {
    res.render('rescuer', {});
})
app.get('/rescueme', (req, res) => {
    res.render('victim', {});
})
//MongoDB admin user pw: dtDs3VgQayKd7JKZ
var uri = "mongodb+srv://admin:dtDs3VgQayKd7JKZ@pennapps-piuu1.gcp.mongodb.net/saveme?retryWrites=true";
MongoClient.connect(uri, function(err, client) {
   const collection = client.db("saveme").collection("victims");
   console.log("connected to mongodb")
   // perform actions on the collection object
   // client.close();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
  console.log('Server running on port ' + PORT);
})
