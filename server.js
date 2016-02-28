'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();

var routes = require('./routes/home');

/**
* here we define the connection attributes of our server
* we need to pass an object to '.connection()' method of server instance
* this object must contain at least two attributes:
* @attribute {string} host - host of our application, 'localhost' in this case
* @attribute {integer} port - number of port of the application e.g. 3000
*/
server.connection({
  host: 'localhost',
  port: 3000
});

/**
* here we register our routes plugin which describes the application's routing
* we need to pass an object to the '.register()' method of server instance
* this object must containt two attributes:
* @attribute {function} register - defines the function as plugin
* @attribute {object} options - object passed to the plugin function's constructor
*/
server.register({
  register: routes,
  options: {},
}, (error) => {

  if (error) {
    console.log('Routes plugin registration failed!');
  }

});

/**
* now we can start the server and check whether it is running on localhost:3000
*/
server.start((error) => {

  if (error){
    throw error;
  }

  /**
  * log the information that server has started successfully
  * together with information concerning the host and port
  */
  console.log('Server instance running at: ', server.info.uri);
});
