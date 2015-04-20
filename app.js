/**
 * Created by alexfaber on 4/11/15.
 */
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var mongoLab = require('./modules/mongoInitialize');
var pt = require('./modules/logger.js');
var expressValidator = require('express-validator');

//pass in false if not running tests
mongoLab.init();

var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(expressValidator());

var userRoutes = require('./routes/userRoutes.js');
var challengesRoutes = require('./routes/challengesRoutes.js');

//Enable pt
pt.log(app);

app.get('/', function(req, res) {
    return res.json({
        message: 'Hello from the SumanAlarm-API'
    });
});

//Define some custom validations (may move into module at a later time)
app.use(expressValidator({
    customValidators: {
        areMongoIds: function(arrayOfMongoIds) {
            var reGex = new RegExp("^[0-9a-fA-F]{24}$");
            for(var id in arrayOfMongoIds){
                if(!reGex.test(id)) return false;
            }
            return true;
        },
        isArray: function(value) {
            return Array.isArray(value);
        }
    }
}));

app.use('/users', userRoutes);
app.use('/challenges', challengesRoutes);

var port = process.env.PORT || 5000;
app.listen(port);
console.log("Running on port: " + port);

module.exports = app;