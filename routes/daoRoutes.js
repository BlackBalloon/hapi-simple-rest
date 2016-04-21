'use strict';

const Joi     = require('joi');

const UserDAO = require('../dao/user');


var daoRoutes = function(server, options, next) {

  var userDao = new UserDAO();

  server.route({
    method: 'GET',
    path: '/dao/users',

    config: {
      description: 'Return all users with DAO',
      handler: function(request, reply) {
        userDao.all().then(function(users) {
          reply(users);
        }).catch(function(error) {
          reply({ message: 'Error during operation' }).code(400);
        })
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/dao/users/{id}',

    config: {
      description: 'Return specified user with DAO',

      validate: {
        params: { id: Joi.number().integer().positive().required() }
      },

      handler: function(request, reply) {
        userDao.get(request.params.id).then(function(user){
          if (user) {
            return reply(user);
          }
          reply({ message: 'Specified user does not exist' }).code(404);
        }).catch(function(error) {
          reply({ message: 'Error during operation' }).code(400);
        })
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/dao/users',

    config: {
      description: 'Create new user with DAO',

      validate: {
        payload: {
          username: Joi.string().required(),
          email: Joi.string().email().required()
        },
        options: { stripUnknown: true }
      },

      handler: function(request, reply) {
        userDao.create(request.payload.username, request.payload.email).then(function(user){
          reply(user).code(201);
        }).catch(function(error) {
          reply({ message: 'Error during create' }).code(400);
        })
      }
    }
  });

  server.route({
    method: 'PUT',
    path: '/dao/users/{id}',

    config: {
      description: 'Update specified user',

      validate: {
        payload: { username: Joi.string(), email: Joi.string().email() },
        params: { id: Joi.number().integer().positive().required() },
        options: { stripUnknown: true }
      },

      handler: function(request, reply) {
        userDao.update(request.params.id, request.payload).then(function(result) {
          reply(result);
        }).catch(function(error) {
          reply({ message: 'Error during update' }).code(400);
        });
      }
    }
  });

  server.route({
    method: 'DELETE',
    path: '/dao/users/{id}',

    config: {
      description: 'Delete specified user',

      validate: {
        params: { id: Joi.number().integer().positive().required() }
      },

      handler: function(request, reply) {
        userDao.delete(request.params.id).then(function(result) {
          reply({ deletedRows: result }).code(200);
        }).catch(function(error){
          reply({ message: 'Error during delete' }).code(400);
        });
      }
    }
  });

  next();

}

exports.register = daoRoutes;

exports.register.attributes = {
  name: 'api-dao-routes'
};
