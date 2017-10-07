var expect  = require('chai').expect;
var request = require('request');

describe('Status and content', function() {
    describe ('Main page', function() {
        it('status', function(){
            request('http://localhost:3000/', function(error, response, body) {
                expect(response.statusCode).to.equal(200);
            });
        });
/*
        it('content', function() {
          request('http://localhost:8080/' , function(error, response, body) {
            expect(body).to.equal('Hello World');
            });
        });
*/
    });

    describe ('Login page', function() {
        it('status', function(){
            request('http://localhost:3000/users/login', function(error, response, body) {
                expect(response.statusCode).to.equal(404);
            });
        });

    });
});

/*
it('Main page status', function() {
    request('http://localhost:3000' , function(error, response, body) {
        expect(response.statusCode).to.equal(200);
    });
});
*/
