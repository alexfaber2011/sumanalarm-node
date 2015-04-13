/**
 * Created by alexfaber on 4/11/15.
 */
var mongoose = require('mongoose');

var participantSchema = new mongoose.Schema({
    userName: String,
    score: Number,
    accepted: Boolean
});

//participantSchema.index({username: 1},{unique: true});

module.exports = mongoose.model('User', participantSchema);
