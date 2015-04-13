/**
 * Created by alexfaber on 4/11/15.
 */
var mongoose = require('mongoose');
//var Participants = require('./participants.js');

var participantSchema = new mongoose.Schema({
    userName: String,
    _id: String,
    score: Number,
    accepted: Boolean
});

var challengeSchema = new mongoose.Schema({
    owner: String,
    date: Date,
    participants: [participantSchema],
    userName: String
});

//challengeSchema.index({u: 1},{unique: true});

module.exports = mongoose.model('Challenge', challengeSchema);
