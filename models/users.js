/**
 * Created by alexfaber on 4/11/15.
 */
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    password: String,
    userName: String,
    snoozes: {
        type: Number,
        "default": 3
    }
});

//userSchema.index({username: 1},{unique: true});

module.exports = mongoose.model('User', userSchema);
