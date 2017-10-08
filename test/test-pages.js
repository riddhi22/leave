var expect  = require('chai').expect;
var request = require('request');
var express = require('express');

var User = require('../models/user');
var routes = require('../routes/index');


var mongoose = require('mongoose');


let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app')
let should = chai.should();

chai.use(chaiHttp);

describe('Status and content', function() {
    describe ('Main page', function() {
        it('status', function(){
            request('http://localhost:3000/', function(error, response, body) {
                expect(response.statusCode).to.equal(200);
            });
        });
    });
    describe ('Login page', function() {
        it('status', function(){
            request('http://localhost:3000/users/login', function(error, response, body) {
                expect(response.statusCode).to.equal(200);
            });
        });

    });
    describe ('employee page', function() {
        it('status', function(){
            request('http://localhost:3000/users/dashboard1', function(error, response, body) {
                expect(response.statusCode).to.equal(200);
            });
        });

    });
    describe ('supervisor page', function() {
        it('status', function(){
            request('http://localhost:3000/users/dashboard2', function(error, response, body) {
                expect(response.statusCode).to.equal(200);
            });
        });
    });
    describe ('admin page', function() {
        it('status', function(){
            request('http://localhost:3000/users/dashboard3', function(error, response, body) {
                expect(response.statusCode).to.equal(200);
            });
        });

    });
    describe ('random page', function() {
        it('status', function(){
            request('http://localhost:3000/users/asard3', function(error, response, body) {
                expect(response.statusCode).to.equal(404);
            });
        });

    });
    describe ('random page', function() {
        it('status', function(){
            request('http://localhost:3000/users/dashboard3/a
                ', function(error, response, body) {
                expect(response.statusCode).to.equal(404);
            });
        });

    });
});
/*
mongoose.connect('mongodb://test:test@ds157964.mlab.com:57964/harley', {useMongoClient: true});
var db = mongoose.connection    

describe('user', function() {
    before(function(done) {
        mongoose.connect('mongodb://test:test@ds157964.mlab.com:57964/harley', {useMongoClient: true});
        var db = mongoose.connection;
        done();
    });
    it('should login', function(done) {
      var profile = {
        username: 'a',
        password: 'a'
    };
    request.post('http://localhost:3000/users/login/', {json:{ username: 'a', password: 'a' }}, function(error, response, body){
            expect(response.statusCode).to.equal(200);
        });
    });
});

*/
/*
chai.use(chaiHttp);
describe('Users', () => {
/* 
    beforeEach((done) => { 
        User.remove({}, (err) => { 
           done();         
        });     
    });
@any team, donot uncomment this and run DONOT!
*/
// /GET route
/*
  describe('/GET users', () => {
      it('it should GET all the users', (done) => {
        chai.request(server)
            .get('/user')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
              done();
            });
      });
  });

});
*/