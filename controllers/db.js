// const fetchVictims = (db, coordinates, callback) => {
const fetchVictims = (db, callback) => {
    let coords = [39.9519688, -75.19055139999999] // levine hall
    let victimsList = [];
    db.collection('victims').createIndex({
        "location": "2dsphere"
    }, () => {
        db.collection("victims").find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: coords
                    },
                }
            }
        }).toArray(function(err, results) {
            if(err) {
                console.log(err)
            } else {
                callback(results);
            }
        });
    });
}

module.exports = {
    fetchVictims: fetchVictims,
}
