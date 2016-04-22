'use strict';

const knexConfiguration = require('../knexfile')[process.env.NODE_ENV];
const knex = require('knex')(knexConfiguration);
const bcrypt = require('bcrypt');

const User = require('../models/user');


class UserDAO {

  all() {
    return knex('users').select('*').map(function(row){
      return new User(row.id, row.username, row.email);
    }).then(function(users){
      return users;
    }).catch(function(error){
      throw error;
    });
  }

  get(id) {
    return knex('users').select('*').where({ id: id }).then(function(rows){
      if (rows.length > 0){
        return new User(rows[0].id, rows[0].username, rows[0].email);
      }
      return null;
    }).catch(function(error){
      throw error;
    });
  }

  create(data) {
    if (data.password) {
      data.password = bcrypt.hashSync(data.password, 10);
    }

    return knex('users').insert(data)
      .returning('*')
      .then(function(result){
        return new User(result[0].id, result[0].username, result[0].email);
      }).catch(function(error){
        throw error;
      });
  }

  update(id, data) {
    return knex('users').where({ id: id })
      .update(data)
      .returning('*')
      .then(function(rows){
        return new User(rows[0].id, rows[0].username, rows[0].email);
      }).catch(function(error){
        throw error;
      })
  }

  delete(id) {
    return knex('users').where({ id: id }).del().then(function(deletedRows){
      return deletedRows;
    }).catch(function(error){
      console.log(error);
      throw error;
    })
  }

  validatePassword(data) {
    return knex('users').where({ username: data.username }).select('*').then(function(result) {
      if (result.length === 1) {
        var comparePassword = bcrypt.compareSync(data.password, result[0].password);
        if (comparePassword) {
          return result[0].id;
        } else {
          throw { username: 'Wrong username or password', password: 'Wrong username or password' };
        }
      }
      
      throw { username: 'Wrong username or password', password: 'Wrong username or password' };
    }).catch(function(error) {
      throw error;
    });
  }

}


module.exports = UserDAO;
