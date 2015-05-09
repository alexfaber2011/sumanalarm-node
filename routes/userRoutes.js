/**
 * Created by alexfaber on 4/12/15.
 */
//Node Modules
var express = require('express');
var router = express.Router();
var _ = require('underscore');

//Modules
var queryGenerator = require('../modules/queryGenerator.js');

//Controller
var userCtrl = require('../controllers/userCtrl.js');
var challengesCtrl = require('../controllers/challengesCtrl.js');

router.get('/:id?', function(req, res, next){
    //Check if request is gucci
    req.checkParams('id', 'Invalid GET Param').optional().isMongoId();
    req.checkQuery('firstName', 'Invalid GET Param').optional().isAlphanumeric();
    req.checkQuery('lastName', 'Invalid GET Param').optional().isAlphanumeric();
    req.checkQuery('userName', 'Invalid GET Param').optional();

    var errors = req.validationErrors(true);
    if (errors) {
        res.status(400).send({error: errors});
        return
    }
    var query;
    if(req.params.id){
        query = {_id: req.params.id};
    }else{
        query = queryGenerator.build(['firstName','lastName','userName'], 'query', req);
    }

    userCtrl.find(query).then(function(user){
        res.json(user);
    }).catch(function(error){
        res.status(404).send({error: error});
    });
});

router.post('/', function(req, res, next){
    req.checkBody('firstName', 'Invalid POST Param').isAlpha();
    req.checkBody('lastName', 'Invalid POST Param').isAlpha();
    req.checkBody('userName', 'Invalid POST Param');
    req.checkBody('password', 'Invalid POST Param').isAscii();

    var errors = req.validationErrors(true);
    if (errors) {
        res.status(400).send({error: errors});
        return
    }

    var user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        password: req.body.password
    };
    userCtrl.add(user).then(function(insertedUser){
        res.json(insertedUser);
    }).catch(function(error){
        res.status(500).send({error: error});
    });
});

router.put('/:id', function(req, res, next){
    //Check if request is gucci
    req.checkParams('id', 'Invalid PUT param: must be a valid MongoID').isMongoId();
    req.checkBody('firstName', 'Invalid PUT Param').optional().isAlpha();
    req.checkBody('lastName', 'Invalid PUT Param').optional().isAlpha();
    req.checkBody('userName', 'Invalid PUT Param').optional();
    req.checkBody('password', 'Invalid PUT Param').optional().isAscii();
    req.checkBody('snoozes', 'Invalid PUT Param').optional().isNumeric();

    var errors = req.validationErrors(true);
    if(errors){
        res.status(400).send({error: errors});
        return
    }

    var query = queryGenerator.build(['firstName', 'lastName', 'userName', 'password', 'snoozes'], 'body', req);
    if(!query){
        res.status(400).send({error: 'Must supply at least one PUT paramter'});
        return
    }

    userCtrl.update(req.params.id, query).then(function(updatedUser){
        res.json(updatedUser);
    }).catch(function(error){
        res.status(404).send({error: error});
    });
});

router.put('/:id/score', function(req, res, next){
    //Check if request is gucci
    req.checkParams('id', 'Invalid PUT param: must be a valid MongoID').isMongoId();
    req.checkBody('score', 'Invalid PUT Param');

    var errors = req.validationErrors(true);
    if(errors){
        console.error(errors);
        res.status(400).send({error: errors});
        next();
        return
    }

    challengesCtrl.updateScores(req.params.id, req.body.score).then(function(updatedChallenges){
        console.log('challengesCtrl.updateScores: ' + updatedChallenges);
        res.json({message: 'Updated ' + updatedChallenges + ' Challenges\' scores'});
    }).catch(function(error){
        console.log('challengesCtrl.updateScores: error ' + error);
        res.status(404).send({error: error});
    });
});

router.delete('/:id', function(req, res, next){
    //Check if request is gucci
    req.checkParams('id', 'Invalid GET Param').isMongoId();

    var errors = req.validationErrors(true);
    if (errors) {
        res.status(400).send({error: errors});
        return
    }

    userCtrl.deleteById(req.params.id).then(function(deletedUser){
        res.status(200).send(deletedUser);
    }).catch(function(error){
        res.status(404).send({error: error});
    });
});

module.exports = router;