const dbOps = require('../controllers/db');

const getVictims = db => (req, res) => {
    const latitude = Number(req.query.lat);
    const longitude = Number(req.query.long);
    dbOps.fetchVictims(db, [longitude, latitude], results => {
        res.json(results);
    })
}

module.exports = {
    getVictims: getVictims
}
