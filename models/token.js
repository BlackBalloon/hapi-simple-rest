'use strict';

const _id     = Symbol('id');
const _valid  = Symbol('valid');
const _user   = Symbol('user_id');
const _token  = Symbol('token');


class Token {

  constructor(data) {
    this[_id] = data.id;
    this[_valid] = data.valid;
    this[_user] = data.user_id;
    this[_token] = data.token;
  }

  get id() {
    return this[_id];
  }

  set id(id) {
    this[_id] = id;
  }

  get valid() {
    return this[_valid];
  }

  set valid(valid) {
    this[_valid] = valid;
  }

  get user() {
    return this[_user];
  }

  set user(user) {
    this[_user] = user;
  }

  get token() {
    return this[_token];
  }

  set token(token) {
    this[_token] = token;
  }

  toJSON() {
    return {
      id: this[_id],
      valid: this[_valid],
      user: this[_user],
      token: this[_token]
    };
  }

}


module.exports = Token;
