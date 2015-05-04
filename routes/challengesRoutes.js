/**
 * Created by alexfaber on 4/12/15.
 */
//Node Modules
var express = require('express');
var router = express.Router();
var _ = require('underscore');
var q = require('q');

//Modules
var queryGenerator = require('../modules/queryGenerator.js');

//Controller
var challengesCtrl = require('../controllers/challengesCtrl.js');
var userCtrl = require('../controllers/userCtrl.js');

buildArray = function(arrayString){
    var builtArray = []
    //remove brackets and spaces
    arrayString = arrayString.replace('[', '');
    arrayString = arrayString.replace(']', '');
    arrayString = arrayString.replace(/\s/g, '');
    //split elements up
    var elements = arrayString.split(',');
    _.each(elements, function(element){
        builtArray.push(element);
    });
    return builtArray
};

buildParticipants = function(userNames){
    var deferred = q.defer();
    var result = {
        participants: [],
        unFoundUserNames: []
    };
    for(var i in userNames){
        userCtrl.find({userName: userNames[i]}).then(function(user){
            var newParticipant = {
                userName: user[0].userName,
                _id: user[0]._id,
                accepted: false,
                score: 0
            };
            result.participants.push(newParticipant);
            if((i + 1) == userNames.length){
                deferred.resolve(result);
            }
        }).catch(function(error){
            result.unFoundUserNames.push(userNames[i]);
            if((i + 1) >= userNames.length){
                deferred.resolve(result)
            }
        });
    }
    return deferred.promise;
};

//READ
router.get('/participant', function(req, res, next){
    //Check if request is gucci
    req.checkQuery('participantId', 'Invalid GET Param: must be a valid Mongo Id').isMongoId();

    var errors = req.validationErrors(true);
    if (errors) {
        console.error('errors: ' + JSON.stringify(errors));
        res.status(400).send({error: errors});
        next();
        return
    }

    challengesCtrl.findByParticipantId(req.query.participantId).then(function(challenges){
        res.status(200).json(challenges);
    }).catch(function(error){
        res.status(404).send({error: error});
    });
});


//READ
router.get('/:id?', function(req, res, next){
    //Check if request is gucci
    req.checkParams('id', 'Invalid GET Param: must be a valid Mongo Id').optional().isMongoId();
    req.checkQuery('owner', 'Invalid GET Param: must be a valid Mongo Id').optional().isMongoId();
    req.checkQuery('date', 'Invalid GET Param').optional();
    req.checkQuery('userName', 'Invalid GET Param').optional();
    req.checkQuery('name', 'Invalid GET Param').optional();

    var errors = req.validationErrors(true);
    if (errors) {
        console.error('errors: ' + JSON.stringify(errors));
        res.status(400).send({error: errors});
        next();
        return
    }
    var query = {};
    if(req.params.id){
        query = {_id: req.params.id};
    }else{
        query = queryGenerator.build(['owner','date','userName', 'name'], 'query', req);
    }

    if(_.isEmpty(query)){
        res.status(400).send({error: "Must supply at least one GET param"});
        next();
        return
    }

    challengesCtrl.find(query).then(function(challenges){
        res.status(200).json(challenges);
    }).catch(function(error){
        res.status(404).send({error: error});
    });
});

router.post('/', function(req, res, next){
    req.checkBody('userNames', 'Invalid POST Param: must be an array of userNames').notEmpty();
    req.checkBody('owner', 'Invalid POST Param: must be a valid Mongo Id').notEmpty().isMongoId();
    req.checkBody('name', 'Invalid POST Param').notEmpty()

    var errors = req.validationErrors(true);
    if (errors) {
        console.log(errors);
        res.status(400).send({error: errors});
        return
    }

    //Build array of participant user names, because Android sucks
    var participants = buildArray(req.body.userNames);

    //Build participants data structure
    participants = _.uniq(participants);  //remove any duplicate user ids

    buildParticipants(participants).then(function(result){
        //If no participants are found, send the array back of un found participants
        if(result.participants.length == 0){
            res.status(404).send({error: 'Unable to find userNames: ' + result.unFoundUserNames.toString()});
            next();
        }

        //Find details about the owner
        userCtrl.find({_id: req.body.owner}).then(function(owner){
            var challenge = {
                owner: owner._id,
                participants: result.participants,
                userName: owner.userName,
                name: req.body.name,
                date: new Date()
            };

            challengesCtrl.add(challenge).then(function(insertedChallenge){
                res.json(insertedChallenge);
            }).catch(function(error){
                res.status(500).send({error: error});
            });
        }).catch(function(error){
            res.status(404).send({error: error});
        });
    });
});

//UPDATE
router.put('/:id', function(req, res, next){
    //Check if request is gucci
    req.checkParams('id', 'Invalid PUT param: must be a valid MongoID').isMongoId();
    req.checkBody('owner', 'Invalid PUT Param').optional();
    req.checkBody('date', 'Invalid PUT Param').optional();
    req.checkBody('userName', 'Invalid PUT Param').optional();
    req.checkBody('name', 'Invalid PUT Param').optional();

    var errors = req.validationErrors(true);
    if(errors){
        res.status(400).send({error: errors});
        return
    }

    var query = queryGenerator.build(['owner', 'date', 'userName', 'name'], 'body', req);
    if(!query){
        res.status(400).send({error: 'Must supply at least one PUT parameter'});
        return
    }

    challengesCtrl.update(req.params.id, query).then(function(updateChallenge){
        res.json(updateChallenge);
    }).catch(function(error){
        res.status(404).send({error: error});
    });
});

//UPDATE - ACCEPT
router.put('/:challengeId/accept/:userId', function(req, res, next){
    req.checkParams('challengeId', 'Invalid PUT param: must be a valid Mongo Id').isMongoId();
    req.checkParams('userId', 'Invalid PUT param: must be a valid Mongo Id').isMongoId();
    req.checkBody('accept', 'Invalid Put Param: must have an acceptance flag');

    var errors = req.validationErrors(true);
    if(errors){
        res.status(400).send({error: errors});
        return
    }

    challengesCtrl.accept(req.params.challengeId, req.params.userId, req.body.accept).then(function(updatedChallenge){
        res.json(updatedChallenge);
    }).catch(function(error){
        res.status(404).send({error: error});
    });
});

//UPDATE - PARTICIPANTS
router.put('/:challengeId/participants', function(req, res, next){
    req.checkParams('challengeId', 'Invalid PUT param: must be a valid Mongo Id').isMongoId();
    req.checkBody('userNames', 'Invalid PUT param: must be an array of Mongo Ids').isArray();

    var errors = req.validationErrors(true);
    if(errors){
        res.status(400).send({error: errors});
        return
    }

    var participantsToAdd = _.uniq(req.body.userNames);

    //Check to see if the participants are already in the challange, and omit them if they are.
    challengesCtrl.find({_id: req.params.challengeId}).then(function(challenge){
        var existentParticipants = _.map(challenge.participants, function(existentParticipant){
            return existentParticipant.userName;
        });

        participantsToAdd = _.difference(participantsToAdd, existentParticipants);

        buildParticipants(participantsToAdd).then(function(result){
            challengesCtrl.addParticipants(req.params.challengeId, result.participants).then(function(updatedChallenge){
                res.json(updatedChallenge);
            }).catch(function(error){
                res.status(500).send({error: error});
            })
        })
    }).catch(function(error){
        res.status(404).send({error: error})
    })


});

//UPDATE - SCORE
router.put('/:challengeId/score/:userId', function(req, res, next){
    req.checkParams('challengeId', 'Invalid PUT param: must be a valid Mongo Id').isMongoId();
    req.checkParams('userId', 'Invalid PUT param: must be a valid Mongo Id').isMongoId();
    req.checkBody('score', 'Invalid Put Param: must be a number').isNumeric();

    var errors = req.validationErrors(true);
    if (errors) {
        res.status(400).send({error: errors});
        return
    }

    challengesCtrl.updateParticipantScore(req.params.challengeId, req.params.userId, req.body.score).then(function(updatedChallenge){
        res.json(updatedChallenge);
    }).catch(function(error){
        res.status(404).send({error: error});
    })

});

//DELETE
router.delete('/:id', function(req, res, next){
    //Check if request is gucci
    req.checkParams('id', 'Invalid GET Param').isMongoId();

    var errors = req.validationErrors(true);
    if (errors) {
        res.status(400).send({error: errors});
        return
    }

    challengesCtrl.deleteById(req.params.id).then(function(deletedChallenge){
        res.json(deletedChallenge);
    }).catch(function(error){
        res.status(404).send({error: error});
    });
});

module.exports = router;