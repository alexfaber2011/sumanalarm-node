/**
 * Created by alexfaber on 4/11/15.
 */
var request = require('supertest');
var expect = require('chai').expect;
var moment = require('moment');
var app = require('../app.js');

var geoffId, alexId, westleyId = {};
describe('USERS', function(){
    //CREATE
    it('should create user Geoff Gilles', function(done){
       request(app)
           .post('/users')
           .send({
               firstName: 'Geoff',
               lastName: 'Gilles',
               userName: 'geoff_gilles_test',
               password: 'password'
           })
           .expect(200)
           .end(function(error, result){
               if(error) done(error);
               else{
                   geoffId = result.body._id;
                   done();
               }
           });
    });

    //CREATE
    it('should create user Alex Faber', function(done){
        request(app)
            .post('/users')
            .send({
                firstName: 'Alex',
                lastName: 'Faber',
                userName: 'alex_faber_test',
                password: 'password'
            })
            .expect(200)
            .end(function(error, result){
                if(error) done(error);
                else{
                    alexId = result.body._id;
                    done();
                }
            });
    });

    //CREATE
    it('should create user Westley Bonack', function(done){
        request(app)
            .post('/users')
            .send({
                firstName: 'Westley',
                lastName: 'Bonack',
                userName: 'westley_bonack_test',
                password: 'password'
            })
            .expect(200)
            .end(function(error, result){
                if(error) done(error);
                else{
                    westleyId = result.body._id;
                    done();
                }
            });
    });

    //READ
    it('should read user', function(done){
       request(app)
           .get('/users/' + geoffId)
           .expect(200, done)
    });

    //UPDATE
    it('should update max number of snoozes to 4', function(done){
        request(app)
            .put('/users/' + geoffId)
            .send({
                snoozes: 4
            })
            .expect(200)
            .end(function(error, result){
                expect(result.body.snoozes).to.equal(4);
                done()
            });
    });

    //UPDATE
    it('should update Geoff\'s username to geoff_gilles_test2', function(done){
       request(app)
           .put('/users/' + geoffId)
           .send({
               userName: 'geoff_gilles_test2'
           })
           .expect(200)
           .end(function(error, result){
               expect(result.body.userName).to.equal('geoff_gilles_test2');
               done();
           });
    });
});

describe('CHALLENGES', function(){
    var challengeId, challengeId2, challengeId3 = {};

    //CREATE
    /*
    * NOTE: the userNames is array is intentionally set this way, as it mimics the way Android is sending an array of
    * userNames across the wire
    *
    * */
    it('should create challenge [USER MECHANISM]', function(done){
        request(app)
            .post('/challenges')
            .send({
                owner: geoffId,
                userNames: '[alex_faber_test]',
                name: 'test_challenge'
            })
            .expect(200)
            .end(function(error, result){
                expect(result.body.userName).to.equal('geoff_gilles_test2');
                challengeId = result.body._id;
                done();
            });
    });

    //CREATE
    it('should create challenge2 [USER MECHANISM]', function(done){
        request(app)
            .post('/challenges')
            .send({
                owner: geoffId,
                userNames: '[alex_faber_test]',
                name: 'test_challenge'
            })
            .expect(200)
            .end(function(error, result){
                expect(result.body.userName).to.equal('geoff_gilles_test2');
                challengeId2 = result.body._id;
                done();
            });
    });

    //CREATE
    it('should create challenge3 [USER MECHANISM]', function(done){
        request(app)
            .post('/challenges')
            .send({
                owner: geoffId,
                userNames: '[alex_faber_test]',
                name: 'test_challenge'
            })
            .expect(200)
            .end(function(error, result){
                expect(result.body.userName).to.equal('geoff_gilles_test2');
                challengeId3 = result.body._id;
                done();
            });
    });


    //READ
    it('should read a challenge', function(done){
        request(app)
            .get('/challenges/' + challengeId)
            .expect(200)
            .end(function(error, result){
                if(error){
                    console.error(error);
                    done(error);
                }else{
                    expect(result.body.name).to.equal('test_challenge');
                    done();
                }
            })
    });

    //UPDATE
    it('should update the time and name', function(done){
        request(app)
            .put('/challenges/' + challengeId)
            .send({
                date: moment().add(1, 'days').format(),
                name: 'new_test_challenge_name'
            })
            .expect(200)
            .end(function(error, result){
                expect(result.body.userName).to.equal('geoff_gilles_test2');
                expect(result.body.name).to.equal('new_test_challenge_name');
                done()
            })
    });

    //UPDATE
    it('should be able to get accepted by Alex', function(done){
       request(app)
           .put('/challenges/' + challengeId + '/accept/' + alexId)
           .send({
               accept: true
           })
           .expect(200)
           .end(function(error, result){
               if(error) console.error(error);
               else {
                   done();
               }
           })
    });

    //UPDATE
    it('challenge2 should be able to get accepted by Alex', function(done){
        request(app)
            .put('/challenges/' + challengeId2 + '/accept/' + alexId)
            .send({
                accept: true
            })
            .expect(200)
            .end(function(error, result){
                if(error) console.error(error);
                else done();
            })
    });

    //UPDATE SCORE
    it('should update Alex\'s score for all challenges', function(done){
        request(app)
            .put('/users/' + alexId + '/score')
            .send({score: 50})
            .expect(200)
            .end(function(error, result){
                if(error){
                    console.error(error);
                    done(error);
                }else{
                    expect(result.body.message).to.equal('Updated 2 Challenges\' scores');
                    done();
                }
            })
    });

    //UPDATE
    it('should NOT let Westley accept', function(done){
        request(app)
            .put('/challenges/' + challengeId + '/accept/' + westleyId)
            .send({
                accept: true
            })
            .expect(404, done);
    });

    //UPDATE
    it('should add another user to the participants array', function(done){
        request(app)
            .put('/challenges/' + challengeId + '/participants')
            .send({
                userNames: ['westley_bonack_test']
            })
            .expect(200)
            .end(function(error, result){
                expect(result.body.participants).to.contain(
                    {
                        _id: westleyId,
                        score: 0,
                        userName: 'westley_bonack_test',
                        accepted: false
                    });
                done()
            })
    });

    //UPDATE
    it('should update Westley\'s score', function(done){
       request(app)
           .put('/challenges/' + challengeId + '/score/' + westleyId)
           .send({
               score: 10
           })
           .expect(200)
           .end(function(error, result){
               expect(result.body.participants).to.contain({
                   _id: westleyId,
                   score: 10,
                   userName: 'westley_bonack_test',
                   accepted: false
               });
               done()
           })
    });

    //UPDATE - ENDED
    it('should end challenge3', function(done){
        request(app)
            .put('/challenges/' + challengeId)
            .send({
                ended: true
            })
            .expect(200)
            .end(function(error, result){
                if(error){
                    console.log(result.body);
                    done(error);
                }else{
                    expect(result.body.ended).to.equal(true);
                    done();
                }
            })
    });

    it('should not let Westley accept the ended challenge3', function(done){
        //UPDATE
        request(app)
            .put('/challenges/' + challengeId3 + '/accept/' + westleyId)
            .send({accept: true})
            .expect(404, done);
    });

    //READ
    it('should be able to list all challenges Westley participants in', function(done){
        request(app)
            .get('/challenges/participant')
            .query({participantId: westleyId})
            .expect(200)
            .end(function(error, result){
                if(error){
                    console.error(error);
                    done(error);
                }else{
                    expect(result.body[0]._id).to.equal(challengeId);
                    done();
                }
            });
    });

    //DELETE
    it('should delete the challenge', function(done){
        request(app)
            .delete('/challenges/' + challengeId)
            .expect(200)
            .end(function(error, result){
                expect(result.body.userName).to.equal('geoff_gilles_test2');
                done();
            });
    });

    //DELETE
    it('should delete the challenge2', function(done){
        request(app)
            .delete('/challenges/' + challengeId2)
            .expect(200)
            .end(function(error, result){
                expect(result.body.userName).to.equal('geoff_gilles_test2');
                done();
            });
    });

    //DELETE
    it('should delete the challenge3', function(done){
        request(app)
            .delete('/challenges/' + challengeId3)
            .expect(200)
            .end(function(error, result){
                expect(result.body.userName).to.equal('geoff_gilles_test2');
                done();
            });
    });
});

describe('USERS again (For deletion purposes)', function(){
    //DELETE
    it('should delete Geoff', function(done){
        request(app)
            .delete('/users/' + geoffId)
            .expect(200)
            .end(function(error, result){
                expect(result.body.userName).to.equal('geoff_gilles_test2');
                done()
            });
    });

    it('should delete Alex', function(done){
        request(app)
            .delete('/users/' + alexId)
            .expect(200)
            .end(function(error, result){
                expect(result.body.userName).to.equal('alex_faber_test');
                done()
            });
    });

    it('should delete Westley', function(done){
        request(app)
            .delete('/users/' + westleyId)
            .expect(200)
            .end(function(error, result) {
                expect(result.body.userName).to.equal('westley_bonack_test');
                done()
            });
    });
});