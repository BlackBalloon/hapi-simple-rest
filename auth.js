'use strict';

const uuid = require('uuid');
const jwt  = require('jsonwebtoken');
const Boom = require('boom');

const TokenDAO = require('./dao/token');
const UserDAO  = require('./dao/user');


function getDefaultExpirationDate() {
  return Math.floor(new Date().getTime() / 1000) + 24 * 60 * 60;
}


function generateToken(request, guid) {

  var token = jwt.sign({
    auth: guid,
    agent: request.headers['user-agent'],
    exp: getDefaultExpirationDate()
  }, 'MySuperSecretKey');

  return token;
}


function verifyToken(token) {
  var decodedToken;

  try {
    decodedToken = jwt.verifyToken(token, 'MySuperSecretKey');
  } catch (error) {
    decodedToken = false;
  }

  return decodedToken;
}


function generateAndSaveToken(request, user) {

  var tokenDao = new TokenDAO();

  var guid = uuid.v1();
  var token = generateToken(request, guid);

  var data = {
    id: guid,
    valid: true,
    user_id: user,
    token: token
  };

  return tokenDao.create(data).then(function(result) {
    return result;
  }).catch(function(error) {
    throw error;
  });
}


function authorization(decodedToken, request, callback) {

  if (!decodedToken || !decodedToken.auth) {
    return callback(Boom.unauthorized('You are not logged in'), false);
  }

  var tokenDao = new TokenDAO();
  var userDao = new UserDAO();

  tokenDao.get(decodedToken.auth).then(function(token) {
    if (!token || !token.valid) {
      return callback(Boom.unauthorized('Invalid token'), false);
    }

    userDao.get(token.user).then(function(user) {
      if (!user) {
        return callback(Boom.unauthorized('You are not authorized'), false);
      }

      var authCredentials = {
        user: user.toJSON(),
        token: token.toJSON()
      }

      return callback(null, true, authCredentials);
    }).catch(function(error) {
      throw error;
    });
  }).catch(function(error) {
    throw error;
  });
}


module.exports = {
  authorization: authorization,
  generateAndSaveToken: generateAndSaveToken
};
