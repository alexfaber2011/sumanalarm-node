/**
 * Created by alexfaber on 4/11/15.
 */
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var mongoLab = require('./modules/mongoInitialize');
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

app.get('/', function(req, res) {
    return res.json({
        message: 'Hello from the SumanAlarm-API'
    });
});

app.use('/users', userRoutes);

var port = process.env.PORT || 5000;
app.listen(port);
console.log("Running on port: " + port);

module.exports = app;