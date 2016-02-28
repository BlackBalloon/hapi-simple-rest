'use strict';

const request         = require('supertest');
const chai            = require('chai');

chai.should();
const expect          = chai.expect;

const url             = 'http://localhost:3000';

describe('Routing tests of the application', function(){

  it('should return string from /home path', function(done){

    request(url)
      .get('/home')
      .expect(200)
      .end(function(error, response) {
        if (error) {
          return done(error);
        }

        expect(response.body.message).to.equal('Exemplary string from RESTful web service');

        done();
      });
  });

  it('should return list of users', function(done){

    request(url)
      .get('/users')
      .expect(200)
      .end(function(error, response) {
        if (error) {
          return done(error);
        }

        expect(response.body.users.length).to.equal(3);
        expect(response.body.users[0]).to.be.an('object');
        expect(response.body.users[0]).to.have.all.keys(['id', 'username', 'email']);

        done();
      });
  });

  it('should return user with specified id', function(done){

    request(url)
      .get('/users/2')
      .expect(200)
      .end(function(error, response) {
        if (error) {
          return done(error);
        }

        expect(response.body.user).to.be.an('object');
        expect(response.body.user).to.have.all.keys(['id', 'username', 'email'])
        expect(response.body.user.id).to.equal(2);
        expect(response.body.user.username).to.equal('carrie');

        done();
      });
  });

  it('should add new user', function(done) {

    var data = {
      username: 'frank',
      email: 'frank@example.com'
    }

    request(url)
      .post('/users')
      .send(data)
      .expect(200)
      .end(function(error, response) {
        if (error) {
          return done(error);
        }

        expect(response.body.user).to.be.an('object')
        expect(response.body.user.id).to.equal(4);
        expect(response.body.user.username).to.equal(data.username);
        expect(response.body.user.email).to.equal(data.email);

        done();
      });
  });

  it('should update user with specified id', function(done){

    var data = {
      username: 'alex',
      email: 'alex@example.com'
    }

    request(url)
      .put('/users/1')
      .send(data)
      .expect(200)
      .end(function(error, response) {
        if (error) {
          return done(error);
        }

        expect(response.body.user).to.be.an('object');
        expect(response.body.user.id).to.equal(1);
        expect(response.body.user.username).to.equal(data.username);
        expect(response.body.user.email).to.equal(data.email);

        done()
      });
  });

  it('should delete user with specified id', function(done){

    request(url)
      .delete('/users/1')
      .expect(200)
      .end(function(error, response){
        if (error) return done(error);

        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('Specified user was deleted');

        done()
      });
  });
});
