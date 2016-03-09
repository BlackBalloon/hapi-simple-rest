'use strict';

const _         = require('underscore');
const Joi       = require('joi');

var users = [
  {
    'id': 1,
    'username': 'john m',
    'email': 'john@example.com'
  },
  {
    'id': 2,
    'username': 'carrie',
    'email': 'carrie@example.com'
  },
  {
    'id': 3,
    'username': 'tom',
    'email': 'tom@example.com'
  }
];

/**
* this is the plugin's function which obtains three parameters
* @param {object} server - server's instance'
* @param {object} options - options passed to the plugin
* @param {function} next - function called at the end of the plugin
*/
var homeRoute = function(server, options, next){

  /**
  * here we define every route object for our REST web service
  * in order to define specific route, we must pass an object to the '.route()'
  * method of server instance. This objet may contain many parameters, but three of them
  * are required and necessary to describe specific route
  * Those attributes are: method, path and handler:
  * - method:     describes the REST verb (method) that can be used on specific root
  * - path:       defines the URL relatively to the host of the application
  * - config:     object with all other route attributes, from which the most important is:
  *   - handler:    is a method used to handle the request and return the response
  * According to below configuration, after sending GET request on
  * 'http://localhost:3000/home' we should obtain response (string)
  */

  /**
  * Basic route which should return a simple string as the response
  **/
  server.route({
    method: 'GET',
    path: '/home',

    config: {
      description: 'Return simple string',
      handler: function(request, reply) {
        reply({ message: 'Exemplary string from RESTful web service' });
      }
    }
  });

  /**
  * Route defining path for retrieving array of all users
  **/
  server.route({
      method: 'GET',
      path: '/users',

      config: {
        description: 'Return all users',
        handler: function(request, reply) {
          reply({
            users: users
          });
        }
      }
  });

  /**
  * Route defining path for retriving user with specified id from list of users
  **/
  server.route({
    method: 'GET',
    path: '/users/{id}',

    config: {
      description: 'Return user with ID specified as path parameter',
      validate: {
        params: {
          // here we make sure that our path parameter {id} is passed
          // for this purpose we use the Joi validation object
          id: Joi.number().integer().positive().required()
        }
      },
      handler: function(request, reply) {
        // find user with id specified in the path with use of underscore.js '.find()' method
        var user = _.find(users, function(user){ return user.id == request.params.id });

        // if there is no user with specified id, return message with code 404
        if (typeof user === 'undefined') {
          return reply({ message: 'Specified user does not exist' }).code(404)
        }

        reply({ user: user })
      }
    }
  });

  /**
  * Route defining path for adding new user to the list of users.
  * With use of Joi package we perform 'payload' validation
  * in order to ensure that proper data is passed to the 'handler'
  * method and new user can be created.
  */
  server.route({
    method: 'POST',
    path: '/users',

    config: {
      validate: {
        payload: {
          // here we make sure that proper values are passed with the request
          // according to below config, we know that 'username' and 'email'
          // fields are required and both of them should be string
          username: Joi.string().required(),
          email: Joi.string().email().required()
        }
      },

      description: 'Add new user',
      handler: function(request, reply) {
        // here we find current user with highest ID value
        // for this purpose we will use underscore.js
        var highestIdUser = _.max(users, function(user){ return user.id });

        // add the 'id' property to newly created user with value 'max + 1'
        var newUser = {
          id: highestIdUser.id + 1,
          username: request.payload.username,
          email: request.payload.email
        }
        users.push(newUser);
        // reply new user with HTTP status code 201
        reply({ user: newUser }).code(201);
      }
    }
  });

  /**
  * Route defining path for updating user with specified ID.
  * As well as in the previous case, the Joi package will be used
  * in order to validate the request payload.
  **/
  server.route({
    method: 'PUT',
    path: '/users/{id}',

    config: {
      description: 'Update user with specified ID',
      validate: {
        params: {
          id: Joi.number().integer().positive().required()
        },
        payload: {
          username: Joi.string().optional(),
          email: Joi.string().email().optional()
        }
      },

      handler: function(request, reply) {
        // here we find user with ID specified by request.params.id
        // for this purpose we will use '.find()' method of underscore.js
        var user = _.find(users, function(user){ return user.id == request.params.id });

        // if there is no user with specified id, return message with code 404
        if (typeof user === 'undefined') {
          return reply({ message: 'Specified user does not exist' }).code(404)
        }

        user.username = request.payload.username
        user.email = request.payload.email

        // reply updated user
        reply({ user: user });
      }
    }
  });

  /**
  * Route defining path for deleting user with specified id.
  **/
  server.route({
    method: 'DELETE',
    path: '/users/{id}',

    config: {
      description: 'Delete user with specified id',
      validate: {
        params: {
          id: Joi.number().integer().positive().required()
        }
      },
      handler: function(request, reply) {
        var deleted = false;

        // here we find user with id matching the request.params.id
        // if the user is found, we splice the array of users at given index
        // and set the 'deleted' variable to true in order to define the result
        for( var i = users.length - 1; i >= 0; i-- ) {
          if ( users[i].id == request.params.id ) {
            deleted = true;
            users.splice(i, 1);
          }
        }

        if (deleted) {
          reply({ message: 'Specified user was deleted' });
        } else {
          reply({ message: 'Specified user does not exist' }).code(404);
        }
      }
    }
  });

  next();
}


/*
* here we define which function should be used as the plugin
*/
exports.register = homeRoute

/*
* this is an alternative of creating the 'package.json' file for every plugin
*/
exports.register.attributes = {
  'name': 'api-routes'
}
