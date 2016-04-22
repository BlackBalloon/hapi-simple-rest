'use strict';

const knexConfiguration = require('../knexfile')[process.env.NODE_ENV];
const knex = require('knex')(knexConfiguration);

const Token = require('../models/token');


class TokenDAO {

  get(id) {
    return knex('tokens').select('*').where({ id: id }).then(function(result) {
      if (result.length > 0) {
        return new Token(result[0]);
      }
      return null;
    }).catch(function(error) {
      throw error;
    });
  }

  create(data) {
    return knex('tokens').insert(data).returning('*').then(function(result) {
      return new Token(result[0]);
    }).catch(function(error) {
      throw error;
    });
  }

  delete(id) {
    return knex('tokens').where({ id: id }).delete().then(function(deletedRows) {
      return deletedRows;
    }).catch(function(error) {
      throw error;
    });
  }

}


module.exports = TokenDAO;
