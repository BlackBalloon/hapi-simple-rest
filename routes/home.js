'use strict';

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
        /*
        * return all users
        */
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
      handler: function(request, reply) {
        /*
        * in this example we return user with specified ID
        */
        if (typeof request.params.id !== 'undefined') {
          var user = users.filter(function(currentUser){
            return currentUser.id == request.params.id;
          });
          reply({ user: user[0] })
        } else {
          reply('You need to specify the user ID!');
        }
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
          username: Joi.string().required(),
          email: Joi.string().email().required()
        }
      },

      description: 'Add new user',
      handler: function(request, reply) {
        var newUser = {
          username: request.payload.username,
          email: request.payload.email
        }

        /* here we find current user with highest ID value */
        var highestIdUser = users[0];
        users.forEach(function(user) {
          if (user.id > highestIdUser.id) {
            highestIdUser = user;
          }
        });

        /* add the 'id' property to newly created user with value 'max + 1' */
        newUser.id = highestIdUser.id + 1;
        users.push(newUser);

        reply({ user: newUser });
      }
    }
  })

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
