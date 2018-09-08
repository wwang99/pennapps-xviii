const fetchVictims = (db, coordinates, callback) => {
    db.collection('victims').createIndex({
        "location": "2dsphere"
    }, () => {
        db.collection("victims").find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: coordinates
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
    fetchVictims: fetchVictims
}
