'use strict';

const Joi = require('joi');

const UserDAO = require('../dao/user');
const TokenDAO = require('../dao/token');
const generateAndSaveToken = require('../auth').generateAndSaveToken;
const authFunc = require('../auth').authorization;


var authRoutes = function(server, options, next) {

  server.auth.strategy('jwt', 'jwt', 'optional', {
    key: 'MySuperSecretKey',
    validateFunc: authFunc,
    verifyOptions: {
      algorithms: ['HS256']
    }
  });

  server.route({
    path: '/logout',
    method: 'POST',

    config: {
      description: 'Logout route',

      auth: {
        mode: 'required'
      },

      validate: {
        headers: Joi.object({ 'authorization': Joi.string().required() }).unknown()
      },

      pre: [
        {
          assign: 'tokenDao',
          method: function(request, reply) {
            reply(new TokenDAO());
          }
        }
      ],

      handler: function(request, reply) {
        request.pre.tokenDao.delete(request.auth.credentials.token.id).then(function(result) {
          if (result === 1) {
            return reply({ message: 'Logged out successfully' });
          }
        }).catch(function(error) {
          reply(error).code(400);
        });
      }
    }
  });

  server.route({
    path: '/login',
    method: 'POST',

    config: {
      description: 'Login route',

      auth: {
        mode: 'optional'
      },

      validate: {
        headers: Joi.object({ 'authorization': Joi.string() }).unknown(),
        payload: { username: Joi.string().required(), password: Joi.string().required() },
        options: { stripUnknown: true }
      },

      pre: [
        {
          assign: 'userDao',
          method: function(request, reply) {
            reply(new UserDAO());
          }
        }
      ],

      handler: function(request, reply) {
        if (request.auth.isAuthenticated) {
          return reply({ message: 'You are already logged in.' });
        }

        request.pre.userDao.validatePassword(request.payload).then(function(userId) {
          generateAndSaveToken(request, userId).then(function(token) {
            reply({ token: token.token });
          })
        }).catch(function(error) {
          reply(error).code(400);
        });
      }
    }
  });

  next();

}


exports.register = authRoutes;

exports.register.attributes = {
  name: 'auth-routes'
};
