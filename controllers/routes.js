const dbOps = require('../controllers/db');

const getVictims = db => (req, res) => {
    const latitude = Number(req.query.lat);
    const longitude = Number(req.query.lng);
    dbOps.fetchVictims(db, [longitude, latitude], results => {
        res.json(results);
    })
}

const recordVictim = db => (req, res) => {
    db.collection("victims").insertOne(victimInfo, function(err, result) {
        callback(result);
    });
}

module.exports = {
    getVictims: getVictims
}
