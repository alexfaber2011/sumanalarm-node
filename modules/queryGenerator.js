/**
 * Created by alexfaber on 3/21/15.
 */
var _ = require('underscore');

/*
* parameters: the keys to grab
 * type: body (POST) vs. query (GET)
 * req: express
* */
exports.build = function(parameters, type, req){
    var query = {};
    parameters.forEach(function(parameter){
        if(parameter == 'id' && req[type][parameter]) query._id = req.params.id;
        else if(req[type][parameter]) query[parameter] = req[type][parameter];
    });
    if(_.isEmpty(query)) query = false;
    return query
};