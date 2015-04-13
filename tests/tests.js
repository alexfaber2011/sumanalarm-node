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
               userName: 'geoff_gilles',
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
                userName: 'alex_faber',
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
                userName: 'westley_bonack',
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
    it('should update Geoff\'s username to geoff_gilles2', function(done){
       request(app)
           .put('/users/' + geoffId)
           .send({
               userName: 'geoff_gilles2'
           })
           .expect(200)
           .end(function(error, result){
               expect(result.body.userName).to.equal('geoff_gilles2');
               done();
           });
    });
});

/*describe('CHALLENGES', function(){
    var challengeId = {};
    //CREATE
    /!*it('should create challenge [INTERNAL MECHANISM]', function(done){
        request(app)
            .post('/challenges')
            .send({
                owner: geoffId,
                date: new Date(),
                participants: [
                    {
                        userId: alexId,
                        accepted: false,
                        score: 0
                    },
                    {
                        userId: geoffId,
                        accepted: true,
                        score: 50000
                    }
                ]
            })
            .expect(200)
            .end(function(error, result){
                if(error) done(error);
                challengeId = result.body._id;
                done();
            });
    });*!/

    //CREATE
    it('should create challenge [USER MECHANISM]', function(done){
        request(app)
            .post('/challenges')
            .send({
                owner: geoffId,
                participants: ['alex_faber']
            })
            .expect(200)
            .end(function(error, result){
                if(error) done(error);
                challengeId = result.body._id;
                done();
            });
    });

    //READ
    it('should read a challenge', function(done){
        request(app)
            .get('/challenges/' + challengeId)
            .expect(200, done)
    });

    //UPDATE
    it('should add update the time', function(done){
        request(app)
            .put('/challenges/' + challengeId)
            .send({
                date: moment().add(1, 'days').format()
            })
            .expect(200, {owner: 'geoff_gilles2'}, done)
    });

    //UPDATE
    it('should be able to get accepted by Alex', function(done){
       request(app)
           .put('/challenges/' + challengeId + '/accept/' + westleyId)
           .send({
               accept: true
           })
           .expect(200, done)
    });

    //UPDATE
    it('should NOT let Westley accept', function(done){
        requets(app)
            .put('/challenges/' + challengeId + '/accept/' + westleyId)
            .send({
                accept: true
            })
            .expect(404, done)
    });

    //UPDATE
    it('should add another user to the participants array', function(done){
        request(app)
            .put('/challenges/' + challengeId + '/participants')
            .send({
                userName: westleyId
            })
            .expect(200, {owner: 'geoff_gilles2'}, done); //TODO more sophistication
    });

    //UPDATE
    it('should update Westely\'s score', function(done){
       request(app)
           .put('/challenges/' + challengeId + '/score/' + westleyId)
           .send({
               score: 10
           })
           .expect(200, {owner: 'geoff_gilles2'}, done); //TODO more sophistication
    });

    //DELETE
    it('should delete the challenge', function(done){
        request(app)
            .delete('/challenges/' + challengeId)
            .expect(200, {owner: 'geoff_gilles2'}, done);
    });
});*/

describe('USERS again (For deletion purposes)', function(){
    //DELETE
    it('should delete Geoff', function(done){
        request(app)
            .delete('/users/' + geoffId)
            .expect(200)
            .end(function(error, result){
                expect(result.body.userName).to.equal('geoff_gilles2');
                done()
            });
    });

    it('should delete Alex', function(done){
        request(app)
            .delete('/users/' + alexId)
            .expect(200)
            .end(function(error, result){
                expect(result.body.userName).to.equal('alex_faber');
                done()
            });
    });

    it('should delete Westley', function(done){
        request(app)
            .delete('/users/' + westleyId)
            .expect(200)
            .end(function(error, result) {
                expect(result.body.userName).to.equal('westley_bonack');
                done()
            });
    });
});