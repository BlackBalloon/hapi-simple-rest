'use strict';

const bcrypt = require('bcrypt');


exports.seed = function(knex, Promise) {
  return Promise.join(
    knex('users').insert({ username: 'pbienias', email: 'pbienias@gmail.com', password: bcrypt.hashSync('password', 10) })
  );
};
