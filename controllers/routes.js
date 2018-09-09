const dbOps = require('../controllers/db');

const getVictims = db => (req, res) => {
    // const latitude = Number(req.query.lat);
    // const longitude = Number(req.query.lng);
    // dbOps.fetchVictims(db, [longitude, latitude], results => {
    //     res.json(results);
    // })
    dbOps.fetchVictims(db, results => {
        let data = {};
        data.victimList = results;
        res.render('rescuer', data);
    })
}

const recordVictim = (db, victimInfo) => {
    db.collection("victims").insertOne(victimInfo, function(err, result) {
        if (err) {
            console.log(err);
        }
    });
}

module.exports = {
    getVictims: getVictims,
    recordVictim: recordVictim
}
