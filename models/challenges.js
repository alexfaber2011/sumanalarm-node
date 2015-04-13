/**
 * Created by alexfaber on 4/11/15.
 */
var mongoose = require('mongoose');
var Participants = require('./participants.js');

var challengeSchema = new mongoose.Schema({
    owner: String,
    date: Date,
    participants: [Participants],
    userName: String
});

//challengeSchema.index({u: 1},{unique: true});

module.exports = mongoose.model('User', challengeSchema);
