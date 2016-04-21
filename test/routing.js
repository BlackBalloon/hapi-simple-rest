'use strict';

const request         = require('supertest');
const chai            = require('chai');

const knexConfiguration = require('../knexfile')[process.env.NODE_ENV];
const knex            = require('knex')(knexConfiguration);

chai.should();
const expect          = chai.expect;

const url             = 'http://localhost:3000';

describe('DAO routing tests of the application', function(){

  before(function(done) {
    knex.migrate.rollback().then(function(){
      knex.migrate.latest().then(function(){
        knex.seed.run().then(function(){
          done();
        });
      });
    });
  });

  it('GET on /dao/users', function(done){

    request(url)
      .get('/dao/users')
      .expect(200)
      .end(function(error, response){
        if (error) {
          return done(error);
        }

        expect(response.body).to.be.an('array');

        done();
      });

  });

  it('GET on /dao/users/1', function(done){

    request(url)
      .get('/dao/users/1')
      .expect(200)
      .end(function(error, response){
        if (error) {
          return done(error);
        }

        expect(response.body).to.have.all.keys(['id', 'username', 'email']);

        done();
      });

  });

  it('GET on /dao/users/100', function(done){

    request(url)
      .get('/dao/users/100')
      .expect(404)
      .end(function(error, response){
        if (error) {
          return done(error);
        }

        expect(response.body).to.have.property('message');

        done();
      });

  });

  it('POST on /dao/users', function(done){

    var data = {
      username: 'pbienias',
      email: 'pbienias@gmail.com'
    };

    request(url)
      .post('/dao/users')
      .send(data)
      .expect(201)
      .end(function(error, response){
        if (error) {
          return done(error);
        }

        expect(response.body).to.have.all.keys(['id', 'username', 'email']);
        expect(response.body.username).to.equal(data.username);
        expect(response.body.email).to.equal(data.email);

        done();
      });

  });

  it('PUT on /dao/users/1', function(done) {

    var data = {
      username: 'marian',
      email: 'marian@gmail.com'
    };

    request(url)
      .put('/dao/users/1')
      .send(data)
      .expect(200)
      .end(function(error, response) {
        if (error) {
          return done(error);
        }

        expect(response.body.id).to.equal(1);
        expect(response.body.username).to.equal(data.username);
        expect(response.body.email).to.equal(data.email);

        done();
      });

  });

  it('DELETE on /dao/users/2', function(done) {

    request(url)
      .delete('/dao/users/2')
      .expect(200)
      .end(function(error, response) {
        if (error) {
          return done(error);
        }

        expect(response.body.deletedRows).to.equal(1);

        done();
      });

  });

});

describe('Routing tests of the application', function(){

  it('GET on / path', function(done){

    request(url)
      .get('/')
      .expect(200)
      .end(function(error, response) {
        if (error) {
          return done(error);
        }

        expect(response.body.message).to.equal('Exemplary string from RESTful web service');

        done();
      });
  });

  it('GET on /users to return all users', function(done){

    request(url)
      .get('/users')
      .expect(200)
      .end(function(error, response) {
        if (error) {
          return done(error);
        }

        expect(response.body.users[0]).to.be.an('object');
        expect(response.body.users[0]).to.have.all.keys(['id', 'username', 'email']);

        done();
      });
  });

  it('GET on /users/2 to return specified user', function(done){

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

  it('POST on /users to add new user', function(done) {

    var data = {
      username: 'frank',
      email: 'frank@example.com'
    }

    request(url)
      .post('/users')
      .send(data)
      .expect(201)
      .end(function(error, response) {
        if (error) {
          return done(error);
        }

        expect(response.body.user).to.be.an('object')
        expect(response.body.user.username).to.equal(data.username);
        expect(response.body.user.email).to.equal(data.email);

        done();
      });
  });

  it('PUT on /users/1 to update user', function(done){

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

  it.skip('DELETE on /users/1 to delete user', function(done){

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
