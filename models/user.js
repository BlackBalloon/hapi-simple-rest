'use strict';

const bcrypt      = require('bcrypt');

const _id         = Symbol('id');
const _username   = Symbol('username');
const _email      = Symbol('email');
const _password   = Symbol('password');


class User {

  constructor(id, username, email, password) {
    this[_id] = id;
    this[_username] = username;
    this[_email] = email;
    this[_password] = password;
  }

  get id() {
    return this[_id];
  }

  set id(id) {
    this[_id] = id;
  }

  get username() {
    return this[_username];
  }

  set username(username) {
    this[_username] = username;
  }

  get email() {
    return this[_email];
  }

  set email(email) {
    this[_email] = email;
  }

  get password() {
    return this[_password];
  }

  set password(password) {
    this[_password] = bcrypt.hashSync(password, 10);
  }

  toString() {
    return this[_username];
  }

  toJSON() {
    return {
      id: this[_id],
      username: this[_username],
      email: this[_email]
    };
  }

}


module.exports = User;
