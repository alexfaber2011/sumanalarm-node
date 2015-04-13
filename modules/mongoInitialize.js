var mongoose = require('mongoose');

exports.init = function() {
    var mongolabUrl = "mongodb://" + process.env.SUMAN_ALARM_DB_USER + ":" + process.env.SUMAN_ALARM_DB_PASSWORD + "@ds061661.mongolab.com:61661/suman-alarm";

    mongoose.connect(mongolabUrl, function(error) {
        if (error) {
            console.error('ERROR CONNECTING TO MONGOLAB');
            console.error(error);
        } else {
            console.info('Successfully connected to MONGOLAB');
        }
    });
};