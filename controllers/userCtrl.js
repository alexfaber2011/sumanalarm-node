/**
 * Created by alexfaber on 4/11/15.
 */

var Users = require('../models/users.js');
var q = require('q');

var userCtrl = {};

//READ
/*
 * Returns an array of all the documents that match the query in an array.  NOTE, if there is only one match, it only
 * returns one document without being in an array
 * */
userCtrl.find = function(query){
    var deferred = q.defer();
    Users.find(query, function(error, users){
        if(error || users.length == 0) deferred.reject(error || "No Users Found.  Query: " + query);
        else {
            if(query._id && users.length == 1) deferred.resolve(users[0]);
            else deferred.resolve(users);
        }
    });
    return deferred.promise;
};

//CREATE
userCtrl.add = function(newUser){
    var deferred = q.defer();
    var user = new Users(newUser);
    user.save(function(error, addedUser){
        if(error) deferred.reject(error);
        else deferred.resolve(addedUser);
    });
    return deferred.promise;
};

//UPDATE
userCtrl.update = function(id, values){
    var deferred = q.defer();
    Users.findOneAndUpdate({_id: id}, values, null, function(error, user){
        if(error) deferred.reject(error);
        else deferred.resolve(user);
    });
    return deferred.promise;
};

//DESTROY
userCtrl.deleteById = function(id){
    var deferred = q.defer();
    Users.findOneAndRemove({_id: id}, function(error, student){
        if(error) deferred.reject(error);
        else deferred.resolve(student);
    });
    return deferred.promise;
};

module.exports = userCtrl;
