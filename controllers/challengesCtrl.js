/**
 * Created by alexfaber on 4/12/15.
 */

var Challenges = require('../models/challenges.js');
var q = require('q');

var challengesCtrl = {};

//READ
/*
 * Returns an array of all the documents that match the query in an array.  NOTE, if there is only one match, it only
 * returns one document without being in an array
 * */
challengesCtrl.find = function(query){
    var deferred = q.defer();
    Challenges.find(query, function(error, challenges){
        if(error || challenges.length == 0) deferred.reject(error || "No Challenges Found.  Query: " + query);
        else {
            if(query._id && challenges.length == 1) deferred.resolve(challenges[0]);
            else deferred.resolve(challenges);
        }
    });
    return deferred.promise;
};

//CREATE
challengesCtrl.add = function(newChallenge){
    var deferred = q.defer();
    var challenge = new Challenges(newChallenge);
    challenge.save(function(error, addedChallenge){
        if(error) deferred.reject(error);
        else deferred.resolve(addedChallenge);
    });
    return deferred.promise;
};

//UPDATE
challengesCtrl.update = function(id, values){
    var deferred = q.defer();
    Challenges.findOneAndUpdate({_id: id}, values, null, function(error, challenge){
        if(error) deferred.reject(error);
        else deferred.resolve(challenge);
    });
    return deferred.promise;
};

//DESTROY
challengesCtrl.deleteById = function(id){
    var deferred = q.defer();
    Challenges.findOneAndRemove({_id: id}, function(error, challenge){
        if(error) deferred.reject(error);
        else deferred.resolve(challenge);
    });
    return deferred.promise;
};

module.exports = challengesCtrl;
